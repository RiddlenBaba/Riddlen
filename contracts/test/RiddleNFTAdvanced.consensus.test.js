const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const { canonicalAnswers, playerCommitment } = require("../scripts/game/riddleAnswers");

// "Read the Room": no hidden solution; the most common revealed answers win.
describe("RiddleNFTAdvanced - consensus sessions", function () {
    const DURATION = 3600;
    const REVEAL_WINDOW = 2 * 24 * 3600;
    const LEGENDARY = 3;

    async function deployFixture() {
        const signers = await ethers.getSigners();
        const [admin, grand, treasury, devops, contrib, valid] = signers;
        const players = signers.slice(6, 14);

        const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNUpgradeable"), [
            admin.address, treasury.address, admin.address, admin.address,
            grand.address, devops.address, ethers.Wallet.createRandom().address,
        ]);
        await rdln.initializeCreatorEconomy(contrib.address, valid.address);
        const ron = await upgrades.deployProxy(
            await ethers.getContractFactory("contracts/reputation/RONUpgradeable.sol:RONUpgradeable"),
            [admin.address, 0]
        );
        const nft = await upgrades.deployProxy(await ethers.getContractFactory("RiddleNFTAdvanced"), [
            admin.address, await rdln.getAddress(), await ron.getAddress(),
            treasury.address, devops.address, grand.address,
        ]);
        const contract = await nft.getAddress();
        await rdln.grantRole(await rdln.GAME_ROLE(), contract);
        await ron.grantRole(await ron.GAME_ROLE(), contract);
        await nft.grantRole(await nft.GAME_MASTER_ROLE(), admin.address);
        await rdln.mintPrizePool(contract, ethers.parseEther("50000000"));
        for (const p of players) await rdln.mintPrizePool(p.address, ethers.parseEther("10000"));

        await nft.createRiddleSession("Read the Room", "Name a fruit most people would say first.", "consensus",
            LEGENDARY, [], DURATION);
        const sessionId = (await nft.currentSessionId()) - 1n;
        await nft.enableConsensusMode(sessionId);
        await nft.startRiddleSession(sessionId);

        const secrets = new Map();
        const play = async (p, answer) => {
            await time.increase(31);
            await nft.connect(p).mintRiddleAccess(sessionId);
            await time.increase(31);
            const nonce = ethers.hexlify(ethers.randomBytes(32));
            const answers = canonicalAnswers([answer]);
            secrets.set(p.address, { answers, nonce });
            await nft.connect(p).commitAnswer(sessionId,
                playerCommitment({ contract, player: p.address, sessionId, answers, nonce }));
        };
        const reveal = (p) => {
            const { answers, nonce } = secrets.get(p.address);
            return nft.connect(p).revealAnswer(sessionId, answers, nonce);
        };
        const close = () => time.increase(DURATION);
        const settle = async () => {
            await time.increase(REVEAL_WINDOW + 1);
            await nft.finalizeSession(sessionId, 50);
        };
        const outcome = async (p) => {
            const tokenId = await nft.tokenOfOwnerByIndex(p.address, 0);
            const [, , , successful, prize] = await nft.getParticipantData(tokenId);
            return { successful, prize };
        };
        return { rdln, nft, contract, players, sessionId, play, reveal, close, settle, outcome };
    }

    describe("setup", function () {
        it("starts without a solution commitment", async function () {
            const { nft, sessionId } = await loadFixture(deployFixture);
            expect(await nft.isConsensusSession(sessionId)).to.equal(true);
            expect((await nft.riddleSessions(sessionId)).state).to.equal(1); // ACTIVE
        });

        it("refuses solution commits and reveals", async function () {
            const { nft, sessionId, close } = await loadFixture(deployFixture);
            await expect(nft.commitSolution(sessionId, ethers.id("x"))).to.be.revertedWithCustomError(nft, "ConsensusSession");
            await close();
            await expect(nft.revealSolution(sessionId, ["x"], ethers.ZeroHash)).to.be.revertedWithCustomError(nft, "ConsensusSession");
        });

        it("can't be enabled once a solution is committed", async function () {
            const { nft } = await loadFixture(deployFixture);
            await nft.createRiddleSession("exact", "d", "c", 0, [], DURATION);
            const id = (await nft.currentSessionId()) - 1n;
            await nft.commitSolution(id, ethers.id("solution"));
            await expect(nft.enableConsensusMode(id)).to.be.revertedWithCustomError(nft, "SolutionAlreadyCommitted");
        });
    });

    describe("fairness", function () {
        it("blocks reveals until entries close, so nobody sees running counts", async function () {
            const { nft, players, play, reveal } = await loadFixture(deployFixture);
            await play(players[0], "apple");
            await expect(reveal(players[0])).to.be.revertedWithCustomError(nft, "SolutionNotRevealed");
        });

        it("rewards the most common answer and penalizes the rest", async function () {
            const { rdln, players, play, reveal, close, settle, outcome } = await loadFixture(deployFixture);
            const [a, b, c, d, e] = players;
            const answers = [[a, "Apple"], [b, "apple."], [c, "an apple"], [d, "banana"], [e, "Banana!"]];
            for (const [p, ans] of answers) await play(p, ans);
            await close();
            for (const [p] of answers) await reveal(p);

            const before = await rdln.balanceOf(d.address);
            await settle();
            for (const p of [a, b, c]) expect((await outcome(p)).successful).to.equal(true);
            for (const p of [d, e]) expect((await outcome(p)).successful).to.equal(false);
            expect(await rdln.balanceOf(d.address)).to.equal(before - ethers.parseEther("1"));
            expect((await outcome(a)).prize).to.be.gt(0);
        });

        it("lets tied top answers share the win", async function () {
            const { players, play, reveal, close, settle, outcome } = await loadFixture(deployFixture);
            const [a, b, c, d] = players;
            for (const [p, ans] of [[a, "apple"], [b, "apple"], [c, "banana"], [d, "banana"]]) await play(p, ans);
            await close();
            for (const p of [a, b, c, d]) await reveal(p);
            await settle();
            for (const p of [a, b, c, d]) expect((await outcome(p)).successful).to.equal(true);
        });

        it("gives no win to an answer nobody else shared", async function () {
            const { nft, sessionId, players, play, reveal, close, settle, outcome } = await loadFixture(deployFixture);
            const [a, b, c] = players;
            for (const [p, ans] of [[a, "apple"], [b, "banana"], [c, "cherry"]]) await play(p, ans);
            await close();
            for (const p of [a, b, c]) await reveal(p);
            await settle();
            for (const p of [a, b, c]) expect((await outcome(p)).successful).to.equal(false);
            expect((await nft.getCommitRevealState(sessionId)).winnersAssigned).to.equal(0);
        });

        it("doesn't count or reward an unrevealed answer", async function () {
            const { players, play, reveal, close, settle, outcome } = await loadFixture(deployFixture);
            const [a, b, c] = players;
            for (const [p, ans] of [[a, "apple"], [b, "apple"], [c, "apple"]]) await play(p, ans);
            await close();
            await reveal(a);
            await reveal(b);
            await settle();
            expect((await outcome(a)).successful).to.equal(true);
            expect((await outcome(c)).successful).to.equal(false);
        });

        it("rejects revealing twice", async function () {
            const { nft, players, play, reveal, close } = await loadFixture(deployFixture);
            await play(players[0], "apple");
            await close();
            await reveal(players[0]);
            await expect(reveal(players[0])).to.be.revertedWithCustomError(nft, "AlreadyRevealed");
        });

        it("ranks consensus winners by commit time within the winner slots", async function () {
            const { nft, sessionId, players, play, reveal, close, settle, outcome } = await loadFixture(deployFixture);
            for (const p of players) await play(p, "apple");
            await close();
            for (const p of [...players].reverse()) await reveal(p);
            await settle();
            const slots = (await nft.riddleSessions(sessionId)).winnerSlots;
            for (let i = 0; i < players.length; i++) {
                const { prize } = await outcome(players[i]);
                if (BigInt(i) < slots) expect(prize).to.be.gt(0);
                else expect(prize).to.equal(0);
            }
        });
    });
});
