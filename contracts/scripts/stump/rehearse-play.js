const { ethers, network } = require("hardhat");
const { canonicalAnswers, authorCommitment, guessCommitment } = require("../game/riddleAnswers");
const { gameAddress, OUTCOME } = require("./lib");

/**
 * Local rehearsal steps, driven by STEP:
 *   submit  -> author (signer 7) submits a riddle
 *   play    -> two solvers enter and seal (one right, one wrong), then time jumps past close
 *   reveal  -> author reveals, time jumps past the reveal window... but solvers reveal first
 *   check   -> prints outcome and withdraws for everyone owed
 */
const RIDDLE = "I have keys but no locks, space but no room, and you can enter but not go in. My aunt calls me the beige one.";
const ANSWER = "keyboard";

async function main() {
    if (network.name !== "localhost") throw new Error("Run against --network localhost");
    const signers = await ethers.getSigners();
    const author = signers[7], alice = signers[8], bob = signers[9];
    const contract = gameAddress();
    const game = await ethers.getContractAt("StumpTheMachine", contract);
    const jump = (s) => network.provider.send("evm_increaseTime", [s]).then(() => network.provider.send("evm_mine"));
    const salt = ethers.id("rehearsal author salt");
    const answers = canonicalAnswers([ANSWER]);
    const step = process.env.STEP;

    if (step === "submit") {
        await (await game.connect(author).submit(RIDDLE, 1, authorCommitment({ contract, author: author.address, answers, salt }))).wait();
        console.log(`Submitted #${await game.challengeCount()} by ${author.address}`);
    } else if (step === "play") {
        const id = await game.challengeCount();
        for (const [s, text] of [[alice, "Keyboard!"], [bob, "a piano"]]) {
            await (await game.connect(s).enter(id)).wait();
            await jump(31);
            const a = canonicalAnswers([text]);
            const nonce = ethers.id(`${s.address}:${id}`);
            await (await game.connect(s).sealGuess(id, guessCommitment({ contract, solver: s.address, id, answers: a, nonce }))).wait();
            console.log(`${s.address} sealed "${a[0]}"`);
        }
        await jump(Number(process.env.DURATION ?? 86400) + 1);
        console.log("Entries closed");
    } else if (step === "reveal") {
        const id = await game.challengeCount();
        await (await game.connect(author).revealAnswer(id, answers, salt)).wait();
        for (const [s, text] of [[alice, "Keyboard!"], [bob, "a piano"]]) {
            await (await game.connect(s).revealGuess(id, canonicalAnswers([text]), ethers.id(`${s.address}:${id}`))).wait();
        }
        await jump(2 * 86400 + 1);
        console.log("Author and solvers revealed; reveal window passed");
    } else if (step === "check") {
        const id = await game.challengeCount();
        const c = await game.getChallenge(id);
        const r = await game.getReveals(id);
        console.log(`#${id} outcome ${OUTCOME[Number(c.outcome)]}  answer "${r.answers}"  panel [${r.panelAnswers.join(" | ")}]  solvers ${r.solvers.length}`);
        for (const s of [author, alice, bob]) {
            const owed = await game.owed(s.address);
            if (owed > 0n) {
                await (await game.connect(s).withdraw()).wait();
                console.log(`${s.address} withdrew ${ethers.formatEther(owed)} RDLN`);
            }
        }
        if (await game.reserved() !== 0n) throw new Error("reserved should be 0 after withdrawals");
        console.log("reserved = 0. Rehearsal passed.");
    } else throw new Error("Set STEP=submit|play|reveal|check");
}
main().catch((e) => { console.error(e); process.exit(1); });
