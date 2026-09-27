const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Humanity gate: one verified human, one entry per session", function () {
    async function deployFixture() {
        const [admin, grand, treasury, devops, contrib, valid, attester, rogue, alice, aliceAlt, bob] =
            await ethers.getSigners();

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
        const gate = await (await ethers.getContractFactory("AttestedHumanityGate"))
            .deploy(admin.address, attester.address);

        await rdln.grantRole(await rdln.GAME_ROLE(), await nft.getAddress());
        await nft.grantRole(await nft.GAME_MASTER_ROLE(), admin.address);
        for (const p of [alice, aliceAlt, bob]) await rdln.mintPrizePool(p.address, ethers.parseEther("10000"));

        const openSession = async () => {
            await nft.createRiddleSession("t", "d", "c", 0, [], 3600);
            const id = (await nft.currentSessionId()) - 1n;
            await nft.commitSolution(id, ethers.id(`solution-${id}`));
            await nft.startRiddleSession(id);
            return id;
        };

        const { chainId } = await ethers.provider.getNetwork();
        const domain = { name: "RiddlenHumanityGate", version: "1", chainId, verifyingContract: await gate.getAddress() };
        const types = {
            HumanEntry: [
                { name: "player", type: "address" },
                { name: "humanId", type: "bytes32" },
                { name: "sessionId", type: "uint256" },
                { name: "deadline", type: "uint256" },
            ],
        };
        const attest = async ({ signer = attester, player, humanId, sessionId, ttl = 600 }) => {
            const deadline = BigInt(await time.latest()) + BigInt(ttl);
            const sig = await signer.signTypedData(domain, types, { player, humanId, sessionId, deadline });
            return ethers.AbiCoder.defaultAbiCoder().encode(["bytes32", "uint256", "bytes"], [humanId, deadline, sig]);
        };

        const ALICE = ethers.id("human:alice");
        const BOB = ethers.id("human:bob");
        return { nft, gate, admin, rogue, alice, aliceAlt, bob, openSession, attest, ALICE, BOB };
    }

    async function gatedFixture() {
        const fx = await deployFixture();
        await fx.nft.setHumanityGate(await fx.gate.getAddress());
        return fx;
    }

    describe("without a gate (current behaviour)", function () {
        it("keeps plain entry working", async function () {
            const { nft, alice, openSession } = await loadFixture(deployFixture);
            const id = await openSession();
            await time.increase(31);
            await nft.connect(alice).mintRiddleAccess(id);
        });

        it("rejects enterAsHuman until a gate is configured", async function () {
            const { nft, alice, openSession } = await loadFixture(deployFixture);
            const id = await openSession();
            await time.increase(31);
            await expect(nft.connect(alice).enterAsHuman(id, "0x"))
                .to.be.revertedWithCustomError(nft, "HumanProofRequired");
        });
    });

    describe("with a gate", function () {
        it("closes the plain entry side door", async function () {
            const { nft, alice, openSession } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            await expect(nft.connect(alice).mintRiddleAccess(id))
                .to.be.revertedWithCustomError(nft, "HumanProofRequired");
        });

        it("admits a verified human", async function () {
            const { nft, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            const proof = await attest({ player: alice.address, humanId: ALICE, sessionId: id });
            await expect(nft.connect(alice).enterAsHuman(id, proof))
                .to.emit(nft, "HumanEntered").withArgs(id, ALICE, alice.address);
            expect(await nft.humanEntered(id, ALICE)).to.equal(true);
        });

        it("stops the same human entering twice from a second wallet", async function () {
            const { nft, alice, aliceAlt, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            await nft.connect(alice).enterAsHuman(id, await attest({ player: alice.address, humanId: ALICE, sessionId: id }));
            await time.increase(31);
            const second = await attest({ player: aliceAlt.address, humanId: ALICE, sessionId: id });
            await expect(nft.connect(aliceAlt).enterAsHuman(id, second))
                .to.be.revertedWithCustomError(nft, "HumanAlreadyEntered").withArgs(ALICE);
        });

        it("lets the same human play the next session", async function () {
            const { nft, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const first = await openSession();
            const second = await openSession();
            await time.increase(31);
            await nft.connect(alice).enterAsHuman(first, await attest({ player: alice.address, humanId: ALICE, sessionId: first }));
            await time.increase(31);
            await nft.connect(alice).enterAsHuman(second, await attest({ player: alice.address, humanId: ALICE, sessionId: second }));
        });

        it("rejects an attestation used by a different wallet", async function () {
            const { nft, gate, alice, bob, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            const alicesProof = await attest({ player: alice.address, humanId: ALICE, sessionId: id });
            await expect(nft.connect(bob).enterAsHuman(id, alicesProof))
                .to.be.revertedWithCustomError(gate, "UnknownAttester");
        });

        it("rejects an attestation for a different session", async function () {
            const { nft, gate, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const first = await openSession();
            const second = await openSession();
            await time.increase(31);
            const proof = await attest({ player: alice.address, humanId: ALICE, sessionId: first });
            await expect(nft.connect(alice).enterAsHuman(second, proof))
                .to.be.revertedWithCustomError(gate, "UnknownAttester");
        });

        it("rejects attestations from unknown signers", async function () {
            const { nft, gate, rogue, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            const forged = await attest({ signer: rogue, player: alice.address, humanId: ALICE, sessionId: id });
            await expect(nft.connect(alice).enterAsHuman(id, forged))
                .to.be.revertedWithCustomError(gate, "UnknownAttester");
        });

        it("rejects expired and over-long attestations", async function () {
            const { nft, gate, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            const stale = await attest({ player: alice.address, humanId: ALICE, sessionId: id, ttl: 10 });
            await time.increase(31);
            await expect(nft.connect(alice).enterAsHuman(id, stale))
                .to.be.revertedWithCustomError(gate, "AttestationExpired");
            const stockpiled = await attest({ player: alice.address, humanId: ALICE, sessionId: id, ttl: 7200 });
            await expect(nft.connect(alice).enterAsHuman(id, stockpiled))
                .to.be.revertedWithCustomError(gate, "AttestationTooLong");
        });

        it("rejects an empty human id", async function () {
            const { nft, gate, alice, openSession, attest } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            const proof = await attest({ player: alice.address, humanId: ethers.ZeroHash, sessionId: id });
            await expect(nft.connect(alice).enterAsHuman(id, proof))
                .to.be.revertedWithCustomError(gate, "InvalidHumanId");
        });

        it("only lets admins change the gate or attesters", async function () {
            const { nft, gate, rogue } = await loadFixture(gatedFixture);
            await expect(nft.connect(rogue).setHumanityGate(ethers.ZeroAddress)).to.be.reverted;
            await expect(gate.connect(rogue).grantRole(await gate.ATTESTER_ROLE(), rogue.address)).to.be.reverted;
        });

        it("keeps the rest of the game unchanged for gated entrants", async function () {
            const { nft, alice, openSession, attest, ALICE } = await loadFixture(gatedFixture);
            const id = await openSession();
            await time.increase(31);
            await nft.connect(alice).enterAsHuman(id, await attest({ player: alice.address, humanId: ALICE, sessionId: id }));
            await time.increase(31);
            await expect(nft.connect(alice).commitAnswer(id, ethers.id("sealed"))).to.emit(nft, "AnswerCommitted");
        });
    });
});
