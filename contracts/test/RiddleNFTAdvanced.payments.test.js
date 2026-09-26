const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RiddleNFTAdvanced - payments and anti-cheat", function () {
    const E = (n) => ethers.parseEther(String(n));

    async function deployFixture() {
        const [admin, grand, treasury, devops, contrib, valid, player, v1, v2, v3] = await ethers.getSigners();

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

        await rdln.mintPrizePool(player.address, E(100_000));
        await rdln.mintPrizePool(admin.address, E(100_000));
        await rdln.connect(player).approve(nftAddress, ethers.MaxUint256);
        await rdln.connect(admin).approve(nftAddress, ethers.MaxUint256);

        return { rdln, nft, nftAddress, admin, player, v1, v2, v3 };
    }

    async function openSession(nft, questionIds = []) {
        await nft.createRiddleSession("t", "d", "c", 0, questionIds, 3600);
        const id = (await nft.currentSessionId()) - 1n;
        await nft.commitSolution(id, ethers.id(`solution-${id}`));
        await nft.startRiddleSession(id);
        return id;
    }

    it("charges the mint cost exactly once", async function () {
        const { rdln, nft, nftAddress, player } = await loadFixture(deployFixture);
        const session = await openSession(nft);
        const cost = await nft.getCurrentMintCost();
        await time.increase(60);

        const before = await rdln.balanceOf(player.address);
        await nft.connect(player).mintRiddleAccess(session);

        expect(before - (await rdln.balanceOf(player.address))).to.equal(cost);
        expect(await rdln.balanceOf(nftAddress)).to.equal(0);
    });

    it("routes the mint cost through the RDLN reward distribution", async function () {
        const { rdln, nft, player } = await loadFixture(deployFixture);
        const session = await openSession(nft);
        const cost = await nft.getCurrentMintCost();
        await time.increase(60);

        await expect(nft.connect(player).mintRiddleAccess(session))
            .to.emit(rdln, "RewardDistributionExecuted");
        expect(await rdln.totalDistributedRewards()).to.equal(cost);
    });

    it("does not lock out an honest player who plays several times a day", async function () {
        const { nft, player } = await loadFixture(deployFixture);
        const sessions = [];
        for (let i = 0; i < 8; i++) sessions.push(await openSession(nft));

        for (const id of sessions) {
            await time.increase(31);
            await nft.connect(player).mintRiddleAccess(id);
        }
    });

    it("still enforces the 30-second minimum between actions", async function () {
        const { nft, player } = await loadFixture(deployFixture);
        const a = await openSession(nft);
        const b = await openSession(nft);
        await time.increase(31);
        await nft.connect(player).mintRiddleAccess(a);
        await expect(nft.connect(player).mintRiddleAccess(b)).to.be.revertedWith("Action too fast");
    });

    // Solving and wrong-answer penalties are covered in RiddleNFTAdvanced.commitReveal.test.js
});
