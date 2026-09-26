const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const vectors = require("./fixtures/answer-vectors.json");
const answers = require("../scripts/game/riddleAnswers");

// The frontend copy (frontend-staging/lib/riddleAnswers.js) is checked against the same
// vectors by `npm run test:answers` in frontend-staging.

describe("Answer normalization and commitments", function () {
    describe("game-master module matches the shared vectors", function () {
        for (const v of vectors.vectors) {
            it(`normalizes ${JSON.stringify(v.input)}`, function () {
                expect(answers.normalizeAnswer(v.input)).to.equal(v.normalized);
                expect(answers.playerCommitment({
                    contract: vectors.contract, player: vectors.player, sessionId: v.sessionId,
                    answers: [v.input], nonce: vectors.nonce,
                })).to.equal(v.playerCommitment);
                expect(answers.solutionCommitment({
                    contract: vectors.contract, sessionId: v.sessionId, answers: [v.input], salt: vectors.salt,
                })).to.equal(v.solutionCommitment);
            });
        }
    });

    it("lets differently-typed forms of the same answer win on-chain", async function () {
        const [admin, grand, treasury, devops, contrib, valid, player] = await ethers.getSigners();
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
        await rdln.mintPrizePool(player.address, ethers.parseEther("5000"));

        await nft.createRiddleSession("Liberty", "riddle text", "classic", 0, [], 3600);
        const sessionId = (await nft.currentSessionId()) - 1n;
        const salt = ethers.hexlify(ethers.randomBytes(32));
        const gmAnswer = ["The Statue of LIBERTY!"];
        await nft.commitSolution(sessionId, answers.solutionCommitment({ contract, sessionId, answers: gmAnswer, salt }));
        await nft.startRiddleSession(sessionId);

        await time.increase(31);
        await nft.connect(player).mintRiddleAccess(sessionId);
        await time.increase(31);
        const playerAnswer = ["  the   statue of liberty "];
        const nonce = ethers.hexlify(ethers.randomBytes(32));
        await nft.connect(player).commitAnswer(sessionId, answers.playerCommitment({
            contract, player: player.address, sessionId, answers: playerAnswer, nonce,
        }));

        await time.increase(3600);
        await nft.revealSolution(sessionId, answers.canonicalAnswers(gmAnswer), salt);
        await expect(nft.connect(player).revealAnswer(sessionId, answers.canonicalAnswers(playerAnswer), nonce))
            .to.emit(nft, "AnswerRevealed").withArgs(sessionId, player.address, true);
    });
});
