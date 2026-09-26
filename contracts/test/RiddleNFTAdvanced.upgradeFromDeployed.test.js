const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

// Upgrades a proxy running the source believed deployed on Amoy (RiddleNFTAdvanced at HEAD,
// wired to RDLN at HEAD and RONAdvanced) to the commit-reveal implementation, then plays
// a full game on the upgraded proxy. See research/README.md for the deployment evidence.

const coder = ethers.AbiCoder.defaultAbiCoder();
const EASY = 0;
const DURATION = 3600;
const REVEAL_WINDOW = 2 * 24 * 3600;
const ANSWERS = ["echo"];
const SALT = ethers.id("game-master-salt");

describe("RiddleNFTAdvanced - upgrade from deployed version", function () {
    async function deployedStackFixture() {
        const [admin, treasury, liquidity, airdrop, grand, devops, v1, v2, v3, alice, bob, carol] =
            await ethers.getSigners();

        const rdln = await upgrades.deployProxy(
            await ethers.getContractFactory("RDLNDeployed"),
            [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]
        );
        const ron = await upgrades.deployProxy(
            await ethers.getContractFactory("RONAdvanced"),
            [admin.address, 7200, 80, 30]
        );
        const nft = await upgrades.deployProxy(
            await ethers.getContractFactory("RiddleNFTAdvancedDeployed"),
            [admin.address, await rdln.getAddress(), await ron.getAddress(),
             treasury.address, devops.address, grand.address]
        );
        const nftAddress = await nft.getAddress();

        await rdln.grantRole(await rdln.GAME_ROLE(), nftAddress);
        await ron.grantRole(await ron.GAME_ROLE(), nftAddress);
        await nft.grantRole(await nft.GAME_MASTER_ROLE(), admin.address);
        const QV = await nft.QUESTION_VALIDATOR_ROLE();
        for (const v of [v1, v2, v3]) await nft.grantRole(QV, v.address);

        // Pre-upgrade activity that must survive the upgrade
        await rdln.mintPrizePool(admin.address, ethers.parseEther("1000"));
        await rdln.approve(nftAddress, ethers.MaxUint256);
        await nft.submitQuestion("what am I?", 1, ethers.id("salted"), [], EASY);
        for (const v of [v1, v2, v3]) await nft.connect(v).validateQuestion(1, true);
        await nft.createRiddleSession("legacy", "d", "c", EASY, [1], DURATION);

        for (const p of [alice, bob, carol]) await rdln.mintPrizePool(p.address, ethers.parseEther("5000"));
        await rdln.mintPrizePool(nftAddress, ethers.parseEther("20000000"));

        return { rdln, ron, nft, nftAddress, admin, alice, bob, carol };
    }

    async function upgraded() {
        const fx = await loadFixture(deployedStackFixture);
        const nft = await upgrades.upgradeProxy(
            fx.nftAddress, await ethers.getContractFactory("RiddleNFTAdvanced")
        );
        return { ...fx, nft };
    }

    it("passes OpenZeppelin's storage-layout validation", async function () {
        const { nftAddress } = await loadFixture(deployedStackFixture);
        await upgrades.validateUpgrade(nftAddress, await ethers.getContractFactory("RiddleNFTAdvanced"));
    });

    it("preserves existing state and roles", async function () {
        const { nft, admin } = await upgraded();
        expect(await nft.currentSessionId()).to.equal(2);
        expect(await nft.currentQuestionId()).to.equal(2);
        const [creator, content, , , validated] = await nft.getQuestionData(1);
        expect(creator).to.equal(admin.address);
        expect(content).to.equal("what am I?");
        expect(validated).to.equal(true);
        expect(await nft.hasRole(await nft.GAME_MASTER_ROLE(), admin.address)).to.equal(true);
        expect((await nft.riddleSessions(1)).title).to.equal("legacy");
    });

    it("plays a full commit-reveal game against deployed RDLN and RONAdvanced", async function () {
        const { rdln, ron, nft, nftAddress, alice, bob, carol } = await upgraded();

        await nft.createRiddleSession("live", "d", "c", EASY, [1], DURATION);
        const sessionId = (await nft.currentSessionId()) - 1n;
        await nft.commitSolution(sessionId, ethers.keccak256(coder.encode(
            ["address", "uint256", "string[]", "bytes32"], [nftAddress, sessionId, ANSWERS, SALT]
        )));
        await nft.startRiddleSession(sessionId);

        const cost = (await nft.riddleSessions(sessionId)).currentMintCost;
        const aliceBefore = await rdln.balanceOf(alice.address);
        const plays = [[alice, ANSWERS], [bob, ["wrong"]], [carol, ANSWERS]];
        const nonces = {};
        for (const [p] of plays) {
            await time.increase(31);
            await nft.connect(p).mintRiddleAccess(sessionId);
        }
        expect(aliceBefore - (await rdln.balanceOf(alice.address))).to.equal(cost);

        for (const [p, answers] of plays) {
            await time.increase(31);
            nonces[p.address] = ethers.hexlify(ethers.randomBytes(32));
            await nft.connect(p).commitAnswer(sessionId, ethers.keccak256(coder.encode(
                ["address", "address", "uint256", "string[]", "bytes32"],
                [nftAddress, p.address, sessionId, answers, nonces[p.address]]
            )));
        }

        await time.increase(DURATION);
        await nft.revealSolution(sessionId, ANSWERS, SALT);
        for (const [p, answers] of plays) {
            await nft.connect(p).revealAnswer(sessionId, answers, nonces[p.address]);
        }
        await time.increase(REVEAL_WINDOW + 1);

        const bobBefore = await rdln.balanceOf(bob.address);
        await expect(nft.finalizeSession(sessionId, 10)).to.not.emit(nft, "RONAwardFailed");
        expect(await rdln.balanceOf(bob.address)).to.equal(bobBefore - ethers.parseEther("1"));

        const aliceToken = await nft.tokenOfOwnerByIndex(alice.address, 0);
        const [, , , ok, prize] = await nft.getParticipantData(aliceToken);
        expect(ok).to.equal(true);
        expect(prize).to.be.gt(0);

        const before = await rdln.balanceOf(alice.address);
        await nft.connect(alice).claimPrize(aliceToken);
        expect(await rdln.balanceOf(alice.address)).to.equal(before + prize);
        expect(await ron.balanceOf(alice.address)).to.be.gt(0);
    });

    it("leaves pre-upgrade sessions closed rather than half-working", async function () {
        const { nft, alice } = await upgraded();
        await expect(nft.startRiddleSession(1)).to.be.revertedWithCustomError(nft, "SolutionNotCommitted");
        await expect(nft.connect(alice).mintRiddleAccess(1)).to.be.revertedWith("Session not active");
    });
});
