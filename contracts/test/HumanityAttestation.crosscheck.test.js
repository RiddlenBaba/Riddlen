const path = require("path");
const { pathToFileURL } = require("url");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// Loads the frontend's attester module (the code the Vercel API route runs) and proves the
// on-chain AttestedHumanityGate accepts the entry passes it signs.
const FRONTEND = path.join(__dirname, "..", "..", "frontend-staging");

describe("Attester service <-> AttestedHumanityGate", function () {
    let attestation, privateKeyToAccount;

    before(async function () {
        attestation = await import(pathToFileURL(path.join(FRONTEND, "lib/humanity/attestation.js")).href);
        ({ privateKeyToAccount } = await import(
            pathToFileURL(path.join(FRONTEND, "node_modules/viem/_esm/accounts/index.js")).href));
    });

    it("signs entry passes the gate accepts, one per human per session", async function () {
        const [admin, grand, treasury, devops, contrib, valid, player, secondWallet] = await ethers.getSigners();
        const attesterKey = ethers.Wallet.createRandom();
        const account = privateKeyToAccount(attesterKey.privateKey);

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
        const gate = await (await ethers.getContractFactory("AttestedHumanityGate")).deploy(admin.address, account.address);
        await rdln.grantRole(await rdln.GAME_ROLE(), await nft.getAddress());
        await nft.grantRole(await nft.GAME_MASTER_ROLE(), admin.address);
        await nft.setHumanityGate(await gate.getAddress());
        for (const p of [player, secondWallet]) await rdln.mintPrizePool(p.address, ethers.parseEther("5000"));

        await nft.createRiddleSession("t", "d", "c", 0, [], 3600);
        const sessionId = (await nft.currentSessionId()) - 1n;
        await nft.commitSolution(sessionId, ethers.id("solution"));
        await nft.startRiddleSession(sessionId);

        const { chainId } = await ethers.provider.getNetwork();
        const action = attestation.sessionAction({
            chainId: Number(chainId), gameContract: await nft.getAddress(), sessionId,
        });
        expect(action).to.match(/^riddlen:31337:0x[0-9a-f]{40}:\d+$/);

        // A World ID nullifier, as the verify step would return it
        const humanId = attestation.nullifierToHumanId("0x04e5f6a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d");
        const sign = async (who) => (await attestation.signHumanEntry({
            account, chainId: Number(chainId), gate: await gate.getAddress(),
            player: who.address, humanId, sessionId, now: await time.latest(),
        })).proof;

        await time.increase(31);
        await expect(nft.connect(player).enterAsHuman(sessionId, await sign(player)))
            .to.emit(nft, "HumanEntered").withArgs(sessionId, humanId, player.address);

        await time.increase(31);
        await expect(nft.connect(secondWallet).enterAsHuman(sessionId, await sign(secondWallet)))
            .to.be.revertedWithCustomError(nft, "HumanAlreadyEntered");
    });

    it("rejects malformed nullifiers", function () {
        expect(() => attestation.nullifierToHumanId("0x0")).to.throw();
        expect(() => attestation.nullifierToHumanId("0x1" + "0".repeat(64))).to.throw();
        expect(attestation.nullifierToHumanId("0x1")).to.equal("0x" + "0".repeat(63) + "1");
    });
});
