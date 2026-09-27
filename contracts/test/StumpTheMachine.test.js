const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const {
    canonicalAnswers, authorCommitment, panelCommitment, guessCommitment,
} = require("../scripts/game/riddleAnswers");

// Stump the Machine: a riddle pays only if the AI panel missed it and a human solved it.
describe("StumpTheMachine", function () {
    const DURATION = 3600;
    const REVEAL_WINDOW = 2 * 24 * 3600;
    const HARD = 2;
    const E = ethers.parseEther;

    async function deployFixture() {
        const signers = await ethers.getSigners();
        const [admin, grand, treasury, devops, contrib, valid, gm, author] = signers;
        const solvers = signers.slice(8, 14);

        const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNUpgradeable"), [
            admin.address, treasury.address, admin.address, admin.address,
            grand.address, devops.address, ethers.Wallet.createRandom().address,
        ]);
        await rdln.initializeCreatorEconomy(contrib.address, valid.address);
        const ron = await upgrades.deployProxy(
            await ethers.getContractFactory("contracts/reputation/RONUpgradeable.sol:RONUpgradeable"),
            [admin.address, 0]
        );
        const game = await upgrades.deployProxy(await ethers.getContractFactory("StumpTheMachine"), [
            admin.address, await rdln.getAddress(), await ron.getAddress(),
        ]);
        const contract = await game.getAddress();
        await rdln.grantRole(await rdln.GAME_ROLE(), contract);
        await ron.grantRole(await ron.GAME_ROLE(), contract);
        await game.grantRole(await game.GAME_MASTER_ROLE(), gm.address);
        await rdln.mintPrizePool(contract, E("1000000"));
        for (const p of [author, ...solvers]) await rdln.mintPrizePool(p.address, E("10000"));

        const secrets = {};
        const submit = async (riddle, answer, difficulty = HARD) => {
            const salt = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers([answer]);
            const commitment = authorCommitment({ contract, author: author.address, answers, salt });
            await game.connect(author).submit(riddle, difficulty, commitment);
            const id = await game.challengeCount();
            secrets[id] = { answers, salt };
            return id;
        };
        const openWithPanel = async (id, panel) => {
            const salt = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers(panel);
            secrets[`panel${id}`] = { answers, salt };
            await game.connect(gm).open(id, panelCommitment({ contract, id, answers, salt }), DURATION);
        };
        const play = async (id, solver, answer) => {
            await game.connect(solver).enter(id);
            await time.increase(31);
            const nonce = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers([answer]);
            secrets[`${id}:${solver.address}`] = { answers, nonce };
            await game.connect(solver).sealGuess(id,
                guessCommitment({ contract, solver: solver.address, id, answers, nonce }));
        };
        const close = () => time.increase(DURATION);
        const revealAuthor = (id) => game.connect(author).revealAnswer(id, secrets[id].answers, secrets[id].salt);
        const revealPanel = (id) => game.connect(gm).revealPanel(id, secrets[`panel${id}`].answers, secrets[`panel${id}`].salt);
        const revealGuess = (id, solver) => {
            const { answers, nonce } = secrets[`${id}:${solver.address}`];
            return game.connect(solver).revealGuess(id, answers, nonce);
        };
        const settle = async (id) => {
            await time.increase(REVEAL_WINDOW + 1);
            return game.finalize(id);
        };

        return {
            rdln, ron, game, contract, admin, gm, author, solvers, secrets,
            submit, openWithPanel, play, close, revealAuthor, revealPanel, revealGuess, settle,
        };
    }

    async function stumpedRound(f) {
        const [a, b, c] = f.solvers;
        const id = await f.submit("What has keys but opens no locks, and my aunt Marge keeps hers in the fridge?", "piano");
        await f.openWithPanel(id, ["keyboard", "a map", "piano tuner"]);
        await f.play(id, a, "Piano");
        await f.play(id, b, "the piano.");
        await f.play(id, c, "keyboard");
        await f.close();
        await f.revealAuthor(id);
        await f.revealPanel(id);
        await f.revealGuess(id, a);
        await f.revealGuess(id, b);
        await f.revealGuess(id, c);
        return id;
    }

    describe("submission", function () {
        it("burns the progressive submission stake and records the riddle", async function () {
            const f = await loadFixture(deployFixture);
            const before = await f.rdln.balanceOf(f.author.address);
            const id = await f.submit("riddle one", "x");
            expect(id).to.equal(1n);
            expect(before - await f.rdln.balanceOf(f.author.address)).to.equal(E("1"));
            await f.submit("riddle two", "y");
            expect(before - await f.rdln.balanceOf(f.author.address)).to.equal(E("3"));
            const c = await f.game.getChallenge(1n);
            expect(c.status).to.equal(1); // SUBMITTED
            expect(c.riddle).to.equal("riddle one");
        });

        it("rejects empty or oversized riddles", async function () {
            const f = await loadFixture(deployFixture);
            await expect(f.game.connect(f.author).submit("", HARD, ethers.id("c")))
                .to.be.revertedWithCustomError(f.game, "BadRiddle");
            await expect(f.game.connect(f.author).submit("x".repeat(2001), HARD, ethers.id("c")))
                .to.be.revertedWithCustomError(f.game, "BadRiddle");
        });

        it("lets the game master reject spam without opening it", async function () {
            const f = await loadFixture(deployFixture);
            const id = await f.submit("buy my coin", "x");
            await expect(f.game.connect(f.gm).reject(id, "not a riddle")).to.emit(f.game, "ChallengeRejected");
            await expect(f.openWithPanel(id, ["x"])).to.be.revertedWithCustomError(f.game, "NotSubmitted");
        });
    });

    describe("opening", function () {
        it("reserves the pool and refuses to open when underfunded", async function () {
            const f = await loadFixture(deployFixture);
            const id = await f.submit("r", "x", 3); // LEGENDARY 150k
            await f.openWithPanel(id, ["x"]);
            expect(await f.game.reserved()).to.equal(E("150000"));
            expect(await f.game.available()).to.equal(E("850000"));
            for (let i = 0; i < 5; i++) {
                const n = await f.submit("r", "x", 3);
                await f.openWithPanel(n, ["x"]);
            }
            const last = await f.submit("r", "x", 3);
            await expect(f.openWithPanel(last, ["x"])).to.be.revertedWithCustomError(f.game, "PoolUnderfunded");
        });

        it("only the game master can open, and only submitted challenges", async function () {
            const f = await loadFixture(deployFixture);
            const id = await f.submit("r", "x");
            await expect(f.game.connect(f.author).open(id, ethers.id("p"), DURATION)).to.be.reverted;
            await expect(f.game.connect(f.gm).open(id, ethers.id("p"), 60))
                .to.be.revertedWithCustomError(f.game, "BadDuration");
            await f.openWithPanel(id, ["x"]);
            await expect(f.openWithPanel(id, ["x"])).to.be.revertedWithCustomError(f.game, "NotSubmitted");
        });
    });

    describe("entering and sealing", function () {
        it("burns the entry cost once per solver and blocks the author", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            const before = await f.rdln.balanceOf(a.address);
            await f.game.connect(a).enter(id);
            expect(before - await f.rdln.balanceOf(a.address)).to.equal(E("50"));
            await expect(f.game.connect(a).enter(id)).to.be.revertedWithCustomError(f.game, "AlreadyEntered");
            await expect(f.game.connect(f.author).enter(id)).to.be.revertedWithCustomError(f.game, "AuthorCannotPlay");
        });

        it("enforces the minimum solve time and the entry deadline", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.game.connect(a).enter(id);
            await expect(f.game.connect(a).sealGuess(id, ethers.id("c"))).to.be.revertedWithCustomError(f.game, "TooSoon");
            await expect(f.game.connect(b).sealGuess(id, ethers.id("c"))).to.be.revertedWithCustomError(f.game, "NotEntered");
            await f.close();
            await expect(f.game.connect(a).sealGuess(id, ethers.id("c"))).to.be.revertedWithCustomError(f.game, "EntriesClosed");
            await expect(f.game.connect(b).enter(id)).to.be.revertedWithCustomError(f.game, "EntriesClosed");
        });
    });

    describe("reveals", function () {
        it("keeps every answer sealed until entries close", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await expect(f.revealAuthor(id)).to.be.revertedWithCustomError(f.game, "EntriesOpen");
            await expect(f.revealPanel(id)).to.be.revertedWithCustomError(f.game, "EntriesOpen");
            await expect(f.revealGuess(id, a)).to.be.revertedWithCustomError(f.game, "NotRevealable");
        });

        it("verifies author and panel reveals against their commitments", async function () {
            const f = await loadFixture(deployFixture);
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.close();
            await expect(f.game.connect(f.author).revealAnswer(id, ["z"], f.secrets[id].salt))
                .to.be.revertedWithCustomError(f.game, "CommitmentMismatch");
            await expect(f.game.connect(f.gm).revealPanel(id, ["z"], f.secrets[`panel${id}`].salt))
                .to.be.revertedWithCustomError(f.game, "CommitmentMismatch");
            await expect(f.game.connect(f.gm).revealAnswer(id, ["x"], f.secrets[id].salt))
                .to.be.revertedWithCustomError(f.game, "NotAuthor");
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await expect(f.revealAuthor(id)).to.be.revertedWithCustomError(f.game, "AlreadyRevealed");
            await expect(f.revealPanel(id)).to.be.revertedWithCustomError(f.game, "AlreadyRevealed");
            const r = await f.game.getReveals(id);
            expect(r.answers).to.deep.equal(["x"]);
            expect(r.panelAnswers).to.deep.equal(["y"]);
        });

        it("rejects a guess reveal that doesn't match the seal, and double reveals", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await f.close();
            await f.revealAuthor(id);
            await expect(f.game.connect(a).revealGuess(id, ["x"], ethers.id("wrong nonce")))
                .to.be.revertedWithCustomError(f.game, "CommitmentMismatch");
            await f.revealGuess(id, a);
            await expect(f.revealGuess(id, a)).to.be.revertedWithCustomError(f.game, "AlreadyRevealed");
            expect((await f.game.getEntry(id, a.address)).correct).to.equal(true);
        });

        it("closes the guess window REVEAL_WINDOW after the author reveals", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await f.close();
            await f.revealAuthor(id);
            await time.increase(REVEAL_WINDOW + 1);
            await expect(f.revealGuess(id, a)).to.be.revertedWithCustomError(f.game, "RevealWindowClosed");
        });
    });

    describe("outcomes", function () {
        it("STUMPED: machines missed, humans solved; author 40%, solvers split 60%", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b, c] = f.solvers;
            const id = await stumpedRound(f);
            await expect(f.settle(id)).to.emit(f.game, "ChallengeFinalized")
                .withArgs(id, 1, 2, E("24000"), E("18000"));
            expect(await f.game.owed(f.author.address)).to.equal(E("24000"));
            expect(await f.game.owed(a.address)).to.equal(E("18000"));
            expect(await f.game.owed(b.address)).to.equal(E("18000"));
            expect(await f.game.owed(c.address)).to.equal(0n);
            expect(await f.game.reserved()).to.equal(E("60000"));
            expect(await f.ron.balanceOf(f.author.address)).to.be.gt(0n);
            expect(await f.ron.balanceOf(a.address)).to.be.gt(0n);
            expect(await f.ron.balanceOf(c.address)).to.equal(0n);
        });

        it("MACHINE_SOLVED: any panel answer matching pays the author nothing", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b] = f.solvers;
            const id = await f.submit("I speak without a mouth", "echo");
            await f.openWithPanel(id, ["wind", "An Echo!", "silence"]);
            await f.play(id, a, "echo");
            await f.play(id, b, "wind");
            await f.close();
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await f.revealGuess(id, a);
            await f.revealGuess(id, b);
            await expect(f.settle(id)).to.emit(f.game, "ChallengeFinalized")
                .withArgs(id, 2, 1, 0n, E("15000")); // 25% of 60k to the one correct solver
            expect(await f.game.owed(f.author.address)).to.equal(0n);
            expect(await f.game.owed(a.address)).to.equal(E("15000"));
            expect(await f.game.reserved()).to.equal(E("15000"));
            expect((await f.game.getChallenge(id)).panelSolved).to.equal(true);
        });

        it("UNSOLVED: machines missed but so did every human; nothing is paid", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "z");
            await f.close();
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await f.revealGuess(id, a);
            await expect(f.settle(id)).to.emit(f.game, "ChallengeFinalized").withArgs(id, 3, 0, 0n, 0n);
            expect(await f.game.reserved()).to.equal(0n);
            expect(await f.game.owed(f.author.address)).to.equal(0n);
        });

        it("VOIDED: author never reveals; entrants get their entry cost back, the rest is released", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await f.game.connect(b).enter(id);
            await f.close();
            await expect(f.game.finalize(id)).to.be.revertedWithCustomError(f.game, "RevealWindowOpen");
            await time.increase(REVEAL_WINDOW + 1);
            await expect(f.game.finalize(id)).to.emit(f.game, "ChallengeFinalized").withArgs(id, 4, 0, 0n, 0n);
            expect(await f.game.reserved()).to.equal(E("100"));
            await f.game.connect(a).claimRefund(id);
            await f.game.connect(b).claimRefund(id);
            await expect(f.game.connect(b).claimRefund(id)).to.be.revertedWithCustomError(f.game, "AlreadyRevealed");
            await expect(f.game.connect(f.solvers[2]).claimRefund(id)).to.be.revertedWithCustomError(f.game, "NotEntered");
            expect(await f.game.owed(a.address)).to.equal(E("50"));
            await f.game.connect(a).withdraw();
            expect(await f.game.reserved()).to.equal(E("50"));
        });

        it("an unrevealed guess counts as wrong", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await f.play(id, b, "x");
            await f.close();
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await f.revealGuess(id, a);
            await f.settle(id);
            expect(await f.game.owed(a.address)).to.equal(E("36000"));
            expect(await f.game.owed(b.address)).to.equal(0n);
        });

        it("refuses to finalize before the panel is revealed or during the reveal window", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.play(id, a, "x");
            await expect(f.game.finalize(id)).to.be.revertedWithCustomError(f.game, "EntriesOpen");
            await f.close();
            await f.revealAuthor(id);
            await expect(f.game.finalize(id)).to.be.revertedWithCustomError(f.game, "RevealWindowOpen");
            await time.increase(REVEAL_WINDOW + 1);
            await expect(f.game.finalize(id)).to.be.revertedWithCustomError(f.game, "PanelRevealMissing");
        });

        it("cannot be finalized twice", async function () {
            const f = await loadFixture(deployFixture);
            const id = await stumpedRound(f);
            await f.settle(id);
            await expect(f.game.finalize(id)).to.be.revertedWithCustomError(f.game, "NotOpen");
        });
    });

    describe("alternative answers", function () {
        it("accepts any listed author answer from solvers and from the panel", async function () {
            const f = await loadFixture(deployFixture);
            const [a, b] = f.solvers;
            const salt = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers(["keyboard", "Computer Keyboard"]);
            await f.game.connect(f.author).submit("beige, keys, no locks", HARD,
                authorCommitment({ contract: f.contract, author: f.author.address, answers, salt }));
            const id = await f.game.challengeCount();
            f.secrets[id] = { answers, salt };
            await f.openWithPanel(id, ["piano", "typewriter"]);
            await f.play(id, a, "computer keyboard");
            await f.play(id, b, "keyboard");
            await f.close();
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await f.revealGuess(id, a);
            await f.revealGuess(id, b);
            expect(await f.game.isAccepted(id, "computer keyboard")).to.equal(true);
            expect(await f.game.isAccepted(id, "piano")).to.equal(false);
            await expect(f.settle(id)).to.emit(f.game, "ChallengeFinalized").withArgs(id, 1, 2, E("24000"), E("18000"));
        });

        it("counts a panel hit on an alternative as machine-solved", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const salt = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers(["keyboard", "computer keyboard"]);
            await f.game.connect(f.author).submit("r", HARD,
                authorCommitment({ contract: f.contract, author: f.author.address, answers, salt }));
            const id = await f.game.challengeCount();
            f.secrets[id] = { answers, salt };
            await f.openWithPanel(id, ["a computer keyboard"]);
            await f.play(id, a, "keyboard");
            await f.close();
            await f.revealAuthor(id);
            await f.revealPanel(id);
            await f.revealGuess(id, a);
            await expect(f.settle(id)).to.emit(f.game, "ChallengeFinalized").withArgs(id, 2, 1, 0n, E("15000"));
        });

        it("rejects a solver reveal with several answers, and too many author answers", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await f.submit("r", "x");
            await f.openWithPanel(id, ["y"]);
            await f.game.connect(a).enter(id);
            await time.increase(31);
            const nonce = ethers.id("n");
            await f.game.connect(a).sealGuess(id, guessCommitment({ contract: f.contract, solver: a.address, id, answers: ["x", "y"], nonce }));
            await f.close();
            await f.revealAuthor(id);
            await f.game.connect(a).revealGuess(id, ["x", "y"], nonce);
            expect((await f.game.getEntry(id, a.address)).correct).to.equal(false);
            const many = Array.from({ length: 9 }, (_, i) => `a${i}`);
            const salt = ethers.id("s");
            await f.game.connect(f.author).submit("r2", HARD, authorCommitment({ contract: f.contract, author: f.author.address, answers: many, salt }));
            const id2 = await f.game.challengeCount();
            await f.openWithPanel(id2, ["y"]);
            await f.close();
            await expect(f.game.connect(f.author).revealAnswer(id2, many, salt)).to.be.revertedWithCustomError(f.game, "BadRiddle");
        });
    });

    describe("money", function () {
        it("pays out through withdraw and never spends reserved funds", async function () {
            const f = await loadFixture(deployFixture);
            const [a] = f.solvers;
            const id = await stumpedRound(f);
            await f.settle(id);
            await expect(f.game.connect(f.solvers[5]).withdraw()).to.be.revertedWithCustomError(f.game, "NothingOwed");
            const before = await f.rdln.balanceOf(a.address);
            await expect(f.game.connect(a).withdraw()).to.emit(f.game, "Withdrawn").withArgs(a.address, E("18000"));
            // RDLN may take a 1% transfer burn on the way out
            const received = await f.rdln.balanceOf(a.address) - before;
            expect(received).to.be.within(E("17820"), E("18000"));
            expect(await f.game.owed(a.address)).to.equal(0n);
            await expect(f.game.connect(a).withdraw()).to.be.revertedWithCustomError(f.game, "NothingOwed");
            await expect(f.game.connect(f.admin).sweep(f.admin.address, E("1000000"))).to.be.revertedWith("reserved");
            await f.game.connect(f.admin).sweep(f.admin.address, await f.game.available());
            expect(await f.game.available()).to.equal(0n);
        });

        it("lets the admin retune pools and entry costs", async function () {
            const f = await loadFixture(deployFixture);
            await f.game.connect(f.admin).setEconomics([E("1"), E("2"), E("3"), E("4")], [E("1"), E("1"), E("1"), E("1")], 5000);
            const id = await f.submit("r", "x", 0);
            await f.openWithPanel(id, ["y"]);
            expect((await f.game.getChallenge(id)).pool).to.equal(E("1"));
            expect((await f.game.getChallenge(id)).entryCost).to.equal(E("1"));
            await expect(f.game.connect(f.gm).setEconomics([0, 0, 0, 0], [0, 0, 0, 0], 0)).to.be.reverted;
        });
    });
});
