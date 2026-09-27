const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const {
    canonicalAnswers, authorCommitment, panelCommitment, guessCommitment,
} = require("../scripts/game/riddleAnswers");

// Plays a full Stump the Machine round against copies of the RDLN and RON sources that are
// live on Amoy (contracts/mocks/deployed/), so the Amoy deployment holds no surprises.
describe("StumpTheMachine against the deployed RDLN and RONAdvanced", function () {
    const DURATION = 3600;
    const REVEAL_WINDOW = 2 * 24 * 3600;
    const E = ethers.parseEther;

    async function fixture() {
        const [admin, treasury, liquidity, airdrop, grand, devops, gm, author, alice, bob] =
            await ethers.getSigners();
        const rdln = await upgrades.deployProxy(
            await ethers.getContractFactory("RDLNDeployed"),
            [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]
        );
        const ron = await upgrades.deployProxy(
            await ethers.getContractFactory("RONAdvanced"), [admin.address, 7200, 80, 30]
        );
        const game = await upgrades.deployProxy(await ethers.getContractFactory("StumpTheMachine"), [
            admin.address, await rdln.getAddress(), await ron.getAddress(),
        ]);
        const contract = await game.getAddress();
        await rdln.grantRole(await rdln.GAME_ROLE(), contract);
        await ron.grantRole(await ron.GAME_ROLE(), contract);
        await game.grantRole(await game.GAME_MASTER_ROLE(), gm.address);
        await rdln.mintPrizePool(contract, E("500000"));
        for (const p of [author, alice, bob]) await rdln.mintPrizePool(p.address, E("1000"));
        return { rdln, ron, game, contract, gm, author, alice, bob };
    }

    it("plays a stumped round end to end, including RON awards and withdrawals", async function () {
        const { rdln, ron, game, contract, gm, author, alice, bob } = await loadFixture(fixture);

        const answers = canonicalAnswers(["Silence"]);
        const salt = ethers.id("author salt");
        await game.connect(author).submit("What breaks the moment you say its name?", 1,
            authorCommitment({ contract, author: author.address, answers, salt }));
        const id = 1n;

        const panel = canonicalAnswers(["a secret", "Silence?", "a promise"]);
        const panelSalt = ethers.id("panel salt");
        await game.connect(gm).open(id, panelCommitment({ contract, id, answers: panel, salt: panelSalt }), DURATION);

        const seal = async (solver, text) => {
            await game.connect(solver).enter(id);
            await time.increase(31);
            const nonce = ethers.id(`${solver.address} nonce`);
            const a = canonicalAnswers([text]);
            await game.connect(solver).sealGuess(id, guessCommitment({ contract, solver: solver.address, id, answers: a, nonce }));
            return { a, nonce };
        };
        const aliceSeal = await seal(alice, "silence");
        const bobSeal = await seal(bob, "a promise");
        expect(await rdln.balanceOf(alice.address)).to.equal(E("975"));

        await time.increase(DURATION);
        await game.connect(author).revealAnswer(id, answers, salt);
        await game.connect(gm).revealPanel(id, panel, panelSalt);
        await game.connect(alice).revealGuess(id, aliceSeal.a, aliceSeal.nonce);
        await game.connect(bob).revealGuess(id, bobSeal.a, bobSeal.nonce);

        await time.increase(REVEAL_WINDOW + 1);
        // The panel's "silence?" normalizes to "silence": the machines solved it
        await expect(game.finalize(id)).to.emit(game, "ChallengeFinalized").withArgs(id, 2, 1, 0n, E("6250"));
        expect(await ron.balanceOf(alice.address)).to.be.gt(0n);
        expect(await ron.balanceOf(author.address)).to.equal(0n);

        const before = await rdln.balanceOf(alice.address);
        await game.connect(alice).withdraw();
        expect(await rdln.balanceOf(alice.address) - before).to.be.within(E("6187.5"), E("6250"));
        expect(await game.reserved()).to.equal(0n);
    });

    it("passes OpenZeppelin's upgrade-safety validation", async function () {
        const { game } = await loadFixture(fixture);
        await upgrades.validateUpgrade(await game.getAddress(), await ethers.getContractFactory("StumpTheMachine"));
    });
});
