const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RDLNFaucet (Amoy only)", function () {
    const E = ethers.parseEther;
    async function fixture() {
        const [admin, treasury, liquidity, airdrop, grand, devops, alice, bob] = await ethers.getSigners();
        const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNDeployed"),
            [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]);
        const faucet = await (await ethers.getContractFactory("RDLNFaucet")).deploy(await rdln.getAddress(), E("500"));
        await rdln.mintAirdrop(await faucet.getAddress(), E("1200"));
        return { rdln, faucet, admin, alice, bob };
    }

    it("pays each wallet once", async function () {
        const { rdln, faucet, alice } = await loadFixture(fixture);
        expect(await faucet.canClaim(alice.address)).to.equal(true);
        await expect(faucet.connect(alice).claim()).to.emit(faucet, "Claimed").withArgs(alice.address, E("500"));
        expect(await rdln.balanceOf(alice.address)).to.be.within(E("495"), E("500"));
        expect(await faucet.canClaim(alice.address)).to.equal(false);
        await expect(faucet.connect(alice).claim()).to.be.revertedWithCustomError(faucet, "AlreadyClaimed");
    });

    it("reports empty instead of paying partial amounts", async function () {
        const { faucet, admin, alice, bob } = await loadFixture(fixture);
        await faucet.connect(alice).claim();
        await faucet.connect(bob).claim();
        expect(await faucet.canClaim(admin.address)).to.equal(false);
        await expect(faucet.connect(admin).claim()).to.be.revertedWithCustomError(faucet, "FaucetEmpty");
        expect(await faucet.totalClaims()).to.equal(2n);
    });

    it("only the owner can retune or sweep", async function () {
        const { rdln, faucet, admin, alice } = await loadFixture(fixture);
        await expect(faucet.connect(alice).setClaimAmount(1)).to.be.reverted;
        await expect(faucet.connect(alice).sweep(alice.address)).to.be.reverted;
        await faucet.connect(admin).sweep(admin.address);
        expect(await rdln.balanceOf(await faucet.getAddress())).to.equal(0n);
    });
});
