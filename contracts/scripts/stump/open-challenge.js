const { ethers, network } = require("hardhat");
const { panelCommitment } = require("../game/riddleAnswers");
const { gameMaster, runPanel, saveSecret, STATUS, DIFFICULTY, panelModels } = require("./lib");

/**
 * Run the AI panel on submitted challenges and open them with the panel's sealed answers.
 *
 *   npx hardhat run scripts/stump/open-challenge.js --network amoy          # dry run: lists pending
 *   ID=3 npx hardhat run scripts/stump/open-challenge.js --network amoy     # panel + dry run for one
 *   CONFIRM=yes ID=3 npx hardhat run scripts/stump/open-challenge.js --network amoy
 *   CONFIRM=yes ALL=yes npx hardhat run ...                                 # every pending challenge
 *
 * Options: DURATION seconds (default 86400), PANEL_MODELS, PANEL_SAMPLES, REJECT="reason" with ID
 * to decline a submission instead. Needs AI_GATEWAY_API_KEY (or ANTHROPIC_API_KEY as a Claude-only fallback).
 * Panel answers and transcripts are saved to contracts/game-master/ and must be kept until reveal.
 */

async function main() {
    const { signer, game, isGm } = await gameMaster();
    const count = await game.challengeCount();
    console.log(`Network: ${network.name}   Game master: ${signer.address} (role: ${isGm})   Challenges: ${count}`);
    if (!isGm) throw new Error("Signer lacks GAME_MASTER_ROLE");

    const pending = [];
    for (let id = 1n; id <= count; id++) {
        const c = await game.getChallenge(id);
        if (Number(c.status) === 1) {
            pending.push({ id, author: c.author, difficulty: Number(c.difficulty), riddle: c.riddle });
        }
    }
    if (pending.length === 0) { console.log("No pending submissions."); return; }
    console.log(`Pending: ${pending.map((p) => `#${p.id}`).join(", ")}`);

    const targets = process.env.ALL === "yes" ? pending
        : process.env.ID ? pending.filter((p) => p.id === BigInt(process.env.ID)) : [];
    if (targets.length === 0) {
        for (const p of pending) console.log(`\n#${p.id} [${DIFFICULTY[p.difficulty]}] by ${p.author}\n${p.riddle}`);
        console.log("\nSet ID=<n> (or ALL=yes) to run the panel.");
        return;
    }

    const duration = Number(process.env.DURATION ?? 86400);
    const confirm = process.env.CONFIRM === "yes";
    const contract = await game.getAddress();

    for (const p of targets) {
        console.log(`\n#${p.id} [${DIFFICULTY[p.difficulty]}] by ${p.author}\n${p.riddle}\n`);
        if (process.env.REJECT) {
            if (!confirm) { console.log(`Would reject: ${process.env.REJECT}`); continue; }
            await (await game.reject(p.id, process.env.REJECT)).wait();
            console.log("Rejected.");
            continue;
        }
        console.log(`Panel (${panelModels().join(", ")}):`);
        const { panelAnswers, transcript } = await runPanel(p.riddle);
        console.log(`Sealed panel answers (${panelAnswers.length}): ${panelAnswers.join(" | ")}`);
        const salt = ethers.hexlify(ethers.randomBytes(32));
        const commitment = panelCommitment({ contract, id: p.id, answers: panelAnswers, salt });
        const file = saveSecret(p.id, {
            network: network.name, contract, id: p.id.toString(), riddle: p.riddle,
            panelAnswers, salt, commitment, transcript, ranAt: new Date().toISOString(),
        });
        console.log(`Secret saved to ${file}`);
        if (!confirm) { console.log("Dry run: not opened. Set CONFIRM=yes to open."); continue; }
        const tx = await game.open(p.id, commitment, duration);
        await tx.wait();
        const c = await game.getChallenge(p.id);
        console.log(`Opened (${tx.hash}). Status ${STATUS[Number(c.status)]}, closes ${new Date(Number(c.endTime) * 1000).toISOString()}`);
    }
}

main().catch((err) => { console.error(err); process.exit(1); });
