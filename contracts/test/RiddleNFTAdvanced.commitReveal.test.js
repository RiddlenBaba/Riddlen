const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

const coder = ethers.AbiCoder.defaultAbiCoder();
const LEGENDARY = 3; // max 5 winner slots, so 6+ correct players always exercises the cutoff
const DURATION = 3600;
const REVEAL_WINDOW = 2 * 24 * 3600;

function solutionCommitment(nft, sessionId, answers, salt) {
    return ethers.keccak256(coder.encode(
        ["address", "uint256", "string[]", "bytes32"], [nft, sessionId, answers, salt]
    ));
}

function playerCommitment(nft, player, sessionId, answers, nonce) {
    return ethers.keccak256(coder.encode(
        ["address", "address", "uint256", "string[]", "bytes32"], [nft, player, sessionId, answers, nonce]
    ));
}

describe("RiddleNFTAdvanced - commit-reveal answers", function () {
    const ANSWERS = ["echo", "map"];
    const WRONG = ["echo", "globe"];
    const SALT = ethers.id("game-master-secret-salt");

    async function deployFixture() {
        const signers = await ethers.getSigners();
        const [admin, grand, treasury, devops, contrib, valid, v1, v2, v3] = signers;
        const players = signers.slice(9, 18);

        const RDLN = await ethers.getContractFactory("RDLNUpgradeable");
        const rdln = await upgrades.deployProxy(RDLN, [
            admin.address, treasury.address, admin.address, admin.address,
            grand.address, devops.address, ethers.Wallet.createRandom().address
        ]);
        await rdln.initializeCreatorEconomy(contrib.address, valid.address);

        const RON = await ethers.getContractFactory(
            "contracts/reputation/RONUpgradeable.sol:RONUpgradeable"
        );
        const ron = await upgrades.deployProxy(RON, [admin.address, 0]);

        const NFT = await ethers.getContractFactory("RiddleNFTAdvanced");
        const nft = await upgrades.deployProxy(NFT, [
            admin.address, await rdln.getAddress(), await ron.getAddress(),
            treasury.address, devops.address, grand.address
        ]);
        const nftAddress = await nft.getAddress();

        await rdln.grantRole(await rdln.GAME_ROLE(), nftAddress);
        await ron.grantRole(await ron.GAME_ROLE(), nftAddress);
        await nft.grantRole(await nft.GAME_MASTER_ROLE(), admin.address);
        const QV = await nft.QUESTION_VALIDATOR_ROLE();
        for (const v of [v1, v2, v3]) await nft.grantRole(QV, v.address);

        const questionIds = [];
        await rdln.mintPrizePool(nftAddress, ethers.parseEther("50000000"));
        for (const p of players) {
            await rdln.mintPrizePool(p.address, ethers.parseEther("10000"));
        }

        await nft.createRiddleSession("t", "d", "c", LEGENDARY, questionIds, DURATION);
        const sessionId = (await nft.currentSessionId()) - 1n;
        await nft.commitSolution(sessionId, solutionCommitment(nftAddress, sessionId, ANSWERS, SALT));
        await nft.startRiddleSession(sessionId);

        const nonces = new Map();
        const join = async (p) => {
            await time.increase(31);
            await nft.connect(p).mintRiddleAccess(sessionId);
        };
        const commit = async (p, answers) => {
            await time.increase(31);
            const nonce = ethers.hexlify(ethers.randomBytes(32));
            nonces.set(p.address, { answers, nonce });
            await nft.connect(p).commitAnswer(
                sessionId, playerCommitment(nftAddress, p.address, sessionId, answers, nonce)
            );
            return nonce;
        };
        const reveal = (p) => {
            const { answers, nonce } = nonces.get(p.address);
            return nft.connect(p).revealAnswer(sessionId, answers, nonce);
        };
        const closeAndRevealSolution = async () => {
            await time.increase(DURATION);
            await nft.revealSolution(sessionId, ANSWERS, SALT);
        };
        const tokenOf = async (p) => {
            const n = await nft.balanceOf(p.address);
            return nft.tokenOfOwnerByIndex(p.address, n - 1n);
        };

        return {
            rdln, ron, nft, nftAddress, admin, players, questionIds, sessionId,
            join, commit, reveal, closeAndRevealSolution, tokenOf
        };
    }

    describe("session setup", function () {
        it("refuses to start a session without a solution commitment", async function () {
            const { nft, questionIds } = await loadFixture(deployFixture);
            await nft.createRiddleSession("t", "d", "c", LEGENDARY, questionIds, DURATION);
            const id = (await nft.currentSessionId()) - 1n;
            await expect(nft.startRiddleSession(id)).to.be.revertedWithCustomError(nft, "SolutionNotCommitted");
        });

        it("does not let the solution commitment change once set", async function () {
            const { nft, sessionId } = await loadFixture(deployFixture);
            await expect(nft.commitSolution(sessionId, ethers.id("x")))
                .to.be.revertedWithCustomError(nft, "SolutionAlreadyCommitted");
        });

        it("only lets the game master commit a solution", async function () {
            const { nft, players, questionIds } = await loadFixture(deployFixture);
            await nft.createRiddleSession("t", "d", "c", LEGENDARY, questionIds, DURATION);
            const id = (await nft.currentSessionId()) - 1n;
            await expect(nft.connect(players[0]).commitSolution(id, ethers.id("x"))).to.be.reverted;
        });

        it("sets an end time when the session starts", async function () {
            const { nft, sessionId } = await loadFixture(deployFixture);
            const s = await nft.riddleSessions(sessionId);
            expect(s.endTime - s.startTime).to.equal(DURATION);
        });
    });

    describe("timing rules", function () {
        it("enforces the minimum solve time after minting", async function () {
            const { nft, nftAddress, players, sessionId, join } = await loadFixture(deployFixture);
            const [p] = players;
            await join(p);
            await time.increase(5);
            const c = playerCommitment(nftAddress, p.address, sessionId, ANSWERS, ethers.ZeroHash);
            await expect(nft.connect(p).commitAnswer(sessionId, c)).to.be.reverted;
        });

        it("rejects mints and commits after the session ends", async function () {
            const { nft, players, sessionId, join } = await loadFixture(deployFixture);
            const [p, late] = players;
            await join(p);
            await time.increase(DURATION);
            await expect(nft.connect(late).mintRiddleAccess(sessionId))
                .to.be.revertedWithCustomError(nft, "SessionClosed");
            await expect(nft.connect(p).commitAnswer(sessionId, ethers.id("x")))
                .to.be.revertedWithCustomError(nft, "SessionClosed");
        });

        it("keeps the solution secret until the session ends", async function () {
            const { nft, sessionId } = await loadFixture(deployFixture);
            await expect(nft.revealSolution(sessionId, ANSWERS, SALT))
                .to.be.revertedWithCustomError(nft, "SessionStillOpen");
        });

        it("rejects a solution reveal that doesn't match the commitment", async function () {
            const { nft, sessionId } = await loadFixture(deployFixture);
            await time.increase(DURATION);
            await expect(nft.revealSolution(sessionId, WRONG, SALT))
                .to.be.revertedWithCustomError(nft, "SolutionMismatch");
            await expect(nft.revealSolution(sessionId, ANSWERS, ethers.id("wrong salt")))
                .to.be.revertedWithCustomError(nft, "SolutionMismatch");
        });

        it("closes player reveals after the reveal window", async function () {
            const { nft, players, join, commit, reveal, closeAndRevealSolution } = await loadFixture(deployFixture);
            const [p] = players;
            await join(p);
            await commit(p, ANSWERS);
            await closeAndRevealSolution();
            await time.increase(REVEAL_WINDOW + 1);
            await expect(reveal(p)).to.be.revertedWithCustomError(nft, "RevealWindowClosed");
        });

        it("cannot finalize while players can still reveal", async function () {
            const { nft, sessionId, players, join, commit, closeAndRevealSolution } = await loadFixture(deployFixture);
            await join(players[0]);
            await commit(players[0], ANSWERS);
            await closeAndRevealSolution();
            await expect(nft.finalizeSession(sessionId, 100))
                .to.be.revertedWithCustomError(nft, "RevealWindowOpen");
        });
    });

    describe("attacks", function () {
        it("makes a copied commitment worthless", async function () {
            const { nft, nftAddress, players, sessionId, join, commit, closeAndRevealSolution } =
                await loadFixture(deployFixture);
            const [victim, copier] = players;
            await join(victim);
            await join(copier);
            const victimNonce = await commit(victim, ANSWERS);

            const [victimCommitment] = await nft.getPlayerCommit(sessionId, victim.address);
            await time.increase(31);
            await nft.connect(copier).commitAnswer(sessionId, victimCommitment);
            await closeAndRevealSolution();

            // Even knowing the victim's answers and nonce, the copier can't open the victim's hash
            await expect(nft.connect(copier).revealAnswer(sessionId, ANSWERS, victimNonce))
                .to.be.revertedWithCustomError(nft, "CommitmentMismatch");
        });

        it("doesn't store anything that reveals the answer before the session ends", async function () {
            const { nft, nftAddress, sessionId } = await loadFixture(deployFixture);
            const [commitment] = await nft.getCommitRevealState(sessionId);
            const unsalted = solutionCommitment(nftAddress, sessionId, ANSWERS, ethers.ZeroHash);
            expect(commitment).to.not.equal(unsalted);
            expect(commitment).to.not.equal(ethers.keccak256(coder.encode(["string[]"], [ANSWERS])));
        });

        it("rejects revealing someone else's commitment", async function () {
            const { nft, players, sessionId, join, commit, closeAndRevealSolution } = await loadFixture(deployFixture);
            const [p, other] = players;
            await join(p);
            await commit(p, ANSWERS);
            await closeAndRevealSolution();
            await expect(nft.connect(other).revealAnswer(sessionId, ANSWERS, ethers.ZeroHash))
                .to.be.revertedWithCustomError(nft, "NoCommitment");
        });
    });

    describe("settlement", function () {
        async function playRound(fx, { correct = 7, wrong = 1, silent = 1 } = {}) {
            const { players, join, commit, reveal, closeAndRevealSolution } = fx;
            const correctP = players.slice(0, correct);
            const wrongP = players.slice(correct, correct + wrong);
            const silentP = players.slice(correct + wrong, correct + wrong + silent);
            const all = [...correctP, ...wrongP, ...silentP];

            for (const p of all) await join(p);
            for (const p of correctP) await commit(p, ANSWERS);
            for (const p of wrongP) await commit(p, WRONG);
            for (const p of silentP) await commit(p, ANSWERS);

            await closeAndRevealSolution();
            // Reveal in reverse commit order: ranking must still follow commit order
            for (const p of [...correctP].reverse()) await reveal(p);
            for (const p of wrongP) await reveal(p);
            await time.increase(REVEAL_WINDOW + 1);
            return { correctP, wrongP, silentP };
        }

        it("ranks winners by commit time, not reveal time", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, sessionId } = fx;
            const { correctP } = await playRound(fx);
            await nft.finalizeSession(sessionId, 100);

            const slots = (await nft.riddleSessions(sessionId)).winnerSlots;
            for (let i = 0; i < correctP.length; i++) {
                const [, , , , prize] = await nft.getParticipantData(await fx.tokenOf(correctP[i]));
                if (BigInt(i) < slots) expect(prize).to.be.gt(0);
                else expect(prize).to.equal(0);
            }
        });

        it("gives the first correct committer the 1.5x bonus", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, sessionId } = fx;
            const { correctP } = await playRound(fx);
            await nft.finalizeSession(sessionId, 100);

            const s = await nft.riddleSessions(sessionId);
            const share = (s.prizePool * 2n) / (s.winnerSlots * 2n + 1n);
            const [, , , , first] = await nft.getParticipantData(await fx.tokenOf(correctP[0]));
            expect(first).to.equal((share * 3n) / 2n);
        });

        it("penalizes wrong and unrevealed commitments but not correct ones", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, rdln, sessionId } = fx;
            const { correctP, wrongP, silentP } = await playRound(fx);

            const before = async (ps) => Promise.all(ps.map((p) => rdln.balanceOf(p.address)));
            const [c0, w0, s0] = await Promise.all([before(correctP), before(wrongP), before(silentP)]);
            await nft.finalizeSession(sessionId, 100);
            const [c1, w1, s1] = await Promise.all([before(correctP), before(wrongP), before(silentP)]);

            // First failure costs exactly 1 RDLN, charged once (not also pulled into the NFT contract)
            const penalty = ethers.parseEther("1");
            c0.forEach((b, i) => expect(c1[i]).to.equal(b));
            w0.forEach((b, i) => expect(w1[i]).to.equal(b - penalty));
            s0.forEach((b, i) => expect(s1[i]).to.equal(b - penalty));
        });

        it("uses the latest commitment when a player re-commits", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, sessionId, players, join, commit, reveal, closeAndRevealSolution } = fx;
            const [flipper, steady] = players;
            await join(flipper);
            await join(steady);
            await commit(flipper, WRONG);
            await commit(steady, ANSWERS);
            await commit(flipper, ANSWERS);
            await closeAndRevealSolution();
            await reveal(flipper);
            await reveal(steady);
            await time.increase(REVEAL_WINDOW + 1);
            await nft.finalizeSession(sessionId, 100);

            // steady committed the correct answer first, so steady is the first solver
            const s = await nft.riddleSessions(sessionId);
            const share = (s.prizePool * 2n) / (s.winnerSlots * 2n + 1n);
            const [, , , ok1, steadyPrize] = await nft.getParticipantData(await fx.tokenOf(steady));
            const [, , , ok2] = await nft.getParticipantData(await fx.tokenOf(flipper));
            expect(ok1).to.equal(true);
            expect(ok2).to.equal(true);
            expect(steadyPrize).to.equal((share * 3n) / 2n);
        });

        it("gives the same result when finalized in small pages", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, sessionId } = fx;
            const { correctP } = await playRound(fx);

            let finalized = false;
            let calls = 0;
            while (!finalized) {
                await nft.finalizeSession(sessionId, 2);
                finalized = (await nft.getCommitRevealState(sessionId)).finalized;
                calls++;
            }
            expect(calls).to.be.gt(1);

            const slots = (await nft.riddleSessions(sessionId)).winnerSlots;
            const [, , , , winners] = await nft.getCommitRevealState(sessionId);
            expect(winners).to.equal(slots < BigInt(correctP.length) ? slots : BigInt(correctP.length));
            expect((await nft.riddleSessions(sessionId)).state).to.equal(3); // COMPLETED
            await expect(nft.finalizeSession(sessionId, 1)).to.be.revertedWithCustomError(nft, "AlreadyFinalized");
        });

        it("lets winners claim prizes and earn RON", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, rdln, ron, sessionId } = fx;
            const { correctP } = await playRound(fx);
            await nft.finalizeSession(sessionId, 100);

            const winner = correctP[0];
            const tokenId = await fx.tokenOf(winner);
            const [, , , , prize] = await nft.getParticipantData(tokenId);
            const before = await rdln.balanceOf(winner.address);
            await nft.connect(winner).claimPrize(tokenId);
            expect(await rdln.balanceOf(winner.address)).to.equal(before + prize);
            expect(await ron.balanceOf(winner.address)).to.be.gt(0);
        });

        it("lets a correct solver solve the riddle end to end", async function () {
            const fx = await loadFixture(deployFixture);
            const { nft, sessionId, players, join, commit, reveal, closeAndRevealSolution } = fx;
            const [p] = players;
            await join(p);
            await commit(p, ANSWERS);
            await closeAndRevealSolution();
            await expect(reveal(p)).to.emit(nft, "AnswerRevealed").withArgs(sessionId, p.address, true);
            await time.increase(REVEAL_WINDOW + 1);
            await expect(nft.finalizeSession(sessionId, 10)).to.emit(nft, "RiddleCompleted");
        });
    });
});
