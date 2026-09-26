const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("RONUpgradeable - square root voting", function () {
    const ONE = 10n ** 18n;

    async function deployFixture() {
        const [admin, game, alice, bob] = await ethers.getSigners();
        const RON = await ethers.getContractFactory(
            "contracts/reputation/RONUpgradeable.sol:RONUpgradeable"
        );
        const ron = await upgrades.deployProxy(RON, [admin.address, 0], { initializer: "initialize" });
        await ron.grantRole(await ron.GAME_ROLE(), game.address);
        const award = (who, amount) => ron.connect(game).awardRONFixed(who.address, amount, 0, false);
        return { ron, award, alice, bob };
    }

    async function pastBlock() {
        await mine(1);
        return (await ethers.provider.getBlockNumber()) - 1;
    }

    it("gives √RON votes in 18-decimal units", async function () {
        const { ron, award, alice } = await loadFixture(deployFixture);
        await award(alice, 10_000);
        expect(await ron.getVotes(alice.address)).to.equal(100n * ONE);
    });

    it("auto self-delegates and checkpoints votes on first award", async function () {
        const { ron, award, alice } = await loadFixture(deployFixture);
        await award(alice, 10_000);
        const blk = await pastBlock();
        expect(await ron.delegates(alice.address)).to.equal(alice.address);
        expect(await ron.getPastVotes(alice.address, blk)).to.equal(100n * ONE);
    });

    it("keeps checkpoints current across later awards", async function () {
        const { ron, award, alice } = await loadFixture(deployFixture);
        await award(alice, 10_000);
        await award(alice, 30_000);
        const blk = await pastBlock();
        const expected = await ron.getVotes(alice.address);
        expect(await ron.getPastVotes(alice.address, blk)).to.equal(expected);
        expect(expected).to.be.closeTo(200n * ONE, ONE / 1_000_000n);
    });

    it("tracks past total supply as the sum of all holders' votes", async function () {
        const { ron, award, alice, bob } = await loadFixture(deployFixture);
        await award(alice, 10_000);
        await award(bob, 40_000);
        const blk = await pastBlock();
        expect(await ron.getPastTotalSupply(blk)).to.equal(300n * ONE);
    });

    it("routes new votes to an explicit delegate", async function () {
        const { ron, award, alice, bob } = await loadFixture(deployFixture);
        await ron.connect(alice).delegate(bob.address);
        await award(alice, 10_000);
        expect(await ron.getVotes(bob.address)).to.equal(100n * ONE);
        expect(await ron.getVotes(alice.address)).to.equal(0);
    });

    it("allows re-delegation after earning more RON", async function () {
        const { ron, award, alice, bob } = await loadFixture(deployFixture);
        await award(alice, 10_000);
        await award(alice, 30_000);
        const votes = await ron.getVotes(alice.address);
        await ron.connect(alice).delegate(bob.address);
        expect(await ron.getVotes(bob.address)).to.equal(votes);
        expect(await ron.getVotes(alice.address)).to.equal(0);
    });

    it("denies basic validation below the SEEKER threshold", async function () {
        const { ron, award, alice, bob } = await loadFixture(deployFixture);
        await award(alice, 999);
        await award(bob, 1_000);
        expect((await ron.getOracleAccess(alice.address))[0]).to.equal(false);
        expect((await ron.getOracleAccess(bob.address))[0]).to.equal(true);
        expect((await ron.getOracleAccess(ethers.ZeroAddress))[0]).to.equal(false);
    });
});
