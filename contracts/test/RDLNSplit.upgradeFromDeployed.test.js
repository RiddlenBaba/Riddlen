const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
const H = require("../scripts/hunt/lib/huntCrypto");

// Upgrades a proxy running the source deployed on Amoy (RDLNDeployed) to RDLNSplit and checks:
// state survives, the split becomes 25/25/25/25 on every game payment, and the hunt still works.
describe("RDLNSplit: upgrade from the deployed RDLN", function () {
    this.timeout(120000);
    const E = ethers.parseEther;

    async function fixture() {
        const [admin, treasury, liquidity, airdrop, grand, devops, gm, alice] = await ethers.getSigners();
        const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNDeployed"),
            [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]);
        await rdln.grantRole(await rdln.GAME_ROLE(), gm.address);
        await rdln.mintPrizePool(alice.address, E("1000"));
        return { rdln, admin, treasury, liquidity, grand, gm, alice };
    }

    it("keeps state and roles, then splits four ways", async function () {
        const { rdln, admin, treasury, liquidity, grand, gm, alice } = await loadFixture(fixture);
        const proxy = await rdln.getAddress();

        // the old split first
        await rdln.connect(gm).burnNFTMint(alice.address, E("100"));
        expect(await rdln.balanceOf(alice.address)).to.equal(E("900"));
        expect(await rdln.balanceOf(grand.address)).to.equal(E("25"));
        expect(await rdln.balanceOf(treasury.address)).to.equal(E("25"));
        expect(await rdln.balanceOf(liquidity.address)).to.equal(0);
        const before = {
            supply: await rdln.totalSupply(), burned: await rdln.totalBurned(), gameplay: await rdln.gameplayBurned(),
            treasury: await rdln.treasuryWallet(), liquidity: await rdln.liquidityWallet(), grand: await rdln.grandPrizeWallet(),
            prizeMinted: await rdln.prizePoolMinted(), gmRole: await rdln.hasRole(await rdln.GAME_ROLE(), gm.address),
        };

        const Split = await ethers.getContractFactory("RDLNSplit");
        await upgrades.validateUpgrade(proxy, Split, { kind: "uups" });
        const up = await upgrades.upgradeProxy(proxy, Split, { kind: "uups" });
        expect(await up.protocolVersion()).to.equal(2);
        expect(await up.totalSupply()).to.equal(before.supply);
        expect(await up.totalBurned()).to.equal(before.burned);
        expect(await up.gameplayBurned()).to.equal(before.gameplay);
        expect(await up.treasuryWallet()).to.equal(before.treasury);
        expect(await up.liquidityWallet()).to.equal(before.liquidity);
        expect(await up.grandPrizeWallet()).to.equal(before.grand);
        expect(await up.prizePoolMinted()).to.equal(before.prizeMinted);
        expect(await up.hasRole(await up.GAME_ROLE(), gm.address)).to.equal(true);
        expect(await up.balanceOf(alice.address)).to.equal(E("900"));

        // the new split
        await expect(up.connect(gm).burnNFTMint(alice.address, E("100")))
            .to.emit(up, "LiquidityReserved").withArgs(alice.address, E("25"))
            .and.to.emit(up, "BurnExecuted");
        expect(await up.balanceOf(alice.address)).to.equal(E("800"));
        expect(await up.balanceOf(grand.address)).to.equal(E("50"));
        expect(await up.balanceOf(treasury.address)).to.equal(E("50"));
        expect(await up.balanceOf(liquidity.address)).to.equal(E("25"));
        expect(before.supply - await up.totalSupply()).to.equal(E("25"));
        expect(await up.totalBurned() - before.burned).to.equal(E("25"));

        // escalating paths take the same route
        await up.connect(gm).burnFailedAttempt(alice.address); // 1 RDLN
        expect(await up.balanceOf(liquidity.address)).to.equal(E("25.25"));

        // liquidity wallet can be repointed by admin only
        await expect(up.connect(alice).setLiquidityWallet(alice.address)).to.be.revertedWithCustomError(up, "AccessControlUnauthorizedAccount");
        await up.connect(admin).setLiquidityWallet(alice.address);
        expect(await up.liquidityWallet()).to.equal(alice.address);
    });

    it("the hunt mints, attempts and claims through the upgraded token in quarters", async function () {
        const [admin, treasury, liquidity, airdrop, grand, devops, gm, alice] = await ethers.getSigners();
        const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNDeployed"),
            [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]);
        const up = await upgrades.upgradeProxy(await rdln.getAddress(), await ethers.getContractFactory("RDLNSplit"), { kind: "uups" });
        const ron = await upgrades.deployProxy(await ethers.getContractFactory("RONAdvanced"), [admin.address, 7200, 80, 30]);
        const map = H.buildMapTree([H.keccak_256(new Uint8Array([1])), H.keccak_256(new Uint8Array([2]))]);
        const launchAt = (await ethers.provider.getBlock("latest")).timestamp;
        const commitments = await (await ethers.getContractFactory("HuntCommitments")).deploy(H.hex(map.root), ethers.id("prize"), launchAt, E("100"), 730 * 86400, 1000, 0);
        const nft = await upgrades.deployProxy(await ethers.getContractFactory("HuntNFT"), [admin.address, "https://x/"]);
        const hunt = await upgrades.deployProxy(await ethers.getContractFactory("RiddlenHunt"),
            [admin.address, await up.getAddress(), await ron.getAddress(), await nft.getAddress(), await commitments.getAddress()]);
        const huntAddress = await hunt.getAddress();
        await nft.grantRole(await nft.MINTER_ROLE(), huntAddress);
        await up.grantRole(await up.GAME_ROLE(), huntAddress);
        await ron.grantRole(await ron.GAME_ROLE(), huntAddress);
        await hunt.grantRole(await hunt.GAME_MASTER_ROLE(), gm.address);
        await up.mintPrizePool(huntAddress, E("100000"));
        await up.mintPrizePool(alice.address, E("1000"));
        const chainId = Number((await ethers.provider.getNetwork()).chainId);

        const Hh = await H.answerHash({ chainId, hunt: huntAddress, riddleId: 1, answer: "keyboard", iterations: 1000 });
        const roots = H.altRoots(1, [Hh]).map(H.hex);
        const cache = ethers.Wallet.createRandom();
        await hunt.connect(gm).release("r", 0, roots, cache.address, H.hex(await H.encryptLocation({ riddleId: 1, hashes: [Hh], location: "here" })), "0x01");
        await mine(11);
        await hunt.open(1);
        const supply = await up.totalSupply();
        const price = await hunt.mintPriceFor(1);
        await hunt.connect(alice).mint(1);
        const a = H.attemptFor(1, 0, Hh, 0);
        await hunt.connect(alice).attempt(1, 0, H.hex(a.leaf), a.proof.map(H.hex)); // 1
        const td = H.claimTypedData({ chainId, hunt: huntAddress, riddleId: 1, tokenId: 1, owner: alice.address });
        await hunt.connect(alice).claim(1, await cache.signTypedData(td.domain, td.types, td.message)); // 5
        const total = price + E("6");
        expect(await up.balanceOf(alice.address)).to.equal(E("1000") - total);
        expect(supply - await up.totalSupply()).to.equal(total / 4n);
        expect(await up.balanceOf(grand.address)).to.equal(total / 4n);
        expect(await up.balanceOf(liquidity.address)).to.equal(total / 4n);
        expect(await up.balanceOf(treasury.address)).to.equal(total / 4n);
    });
});
