const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");
const { canonicalAnswers, solutionCommitment } = require("./riddleAnswers");

/**
 * Create, commit and start a riddle session (game master).
 *
 * Dry run (default):
 *   TITLE="Echo" RIDDLE="I speak without a mouth..." ANSWER="echo" \
 *     npx hardhat run scripts/game/create-session.js --network amoy
 * Execute:
 *   CONFIRM=yes TITLE=... RIDDLE=... ANSWER=... npx hardhat run scripts/game/create-session.js --network amoy
 *
 * Optional: DIFFICULTY=0..3 (Easy..Legendary, default 0), DURATION seconds (default 86400),
 * CATEGORY (default "classic").
 *
 * The salt and answer are written to contracts/game-master/ (gitignored). Keep that file private
 * and backed up: without it the solution can't be revealed and the session can't settle.
 * The game-master wallet must never play.
 */

const NFT_PROXY = process.env.NFT_PROXY_ADDRESS || "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
const SECRETS_DIR = path.join(__dirname, "..", "..", "game-master");

async function waitFor(check, label) {
    for (let i = 0; i < 30; i++) {
        if (await check()) return;
        await new Promise((r) => setTimeout(r, 3000));
    }
    throw new Error(`${label} not visible after 90s — check a block explorer before retrying`);
}

async function main() {
    const { TITLE, RIDDLE, ANSWER } = process.env;
    if (!TITLE || !RIDDLE || !ANSWER) throw new Error("Set TITLE, RIDDLE and ANSWER");
    const difficulty = Number(process.env.DIFFICULTY ?? 0);
    const duration = Number(process.env.DURATION ?? 86400);
    const category = process.env.CATEGORY ?? "classic";
    if (![0, 1, 2, 3].includes(difficulty)) throw new Error("DIFFICULTY must be 0-3");
    if (duration < 600) throw new Error("DURATION should be at least 600 seconds");

    const [signer] = await ethers.getSigners();
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const nft = await ethers.getContractAt("RiddleNFTAdvanced", NFT_PROXY, signer);
    const isGameMaster = await nft.hasRole(await nft.GAME_MASTER_ROLE(), signer.address);

    const answers = canonicalAnswers([ANSWER]);
    if (!answers[0]) throw new Error("ANSWER is empty after normalization");

    console.log(`Network: ${network.name}   Game master: ${signer.address} (role: ${isGameMaster})`);
    console.log(`Title:      ${TITLE}`);
    console.log(`Riddle:     ${RIDDLE}`);
    console.log(`Answer:     "${ANSWER}" -> canonical "${answers[0]}"`);
    console.log(`Difficulty: ${["Easy", "Medium", "Hard", "Legendary"][difficulty]}   Duration: ${duration}s   Category: ${category}`);

    if (!isGameMaster) throw new Error("Signer lacks GAME_MASTER_ROLE");
    if (process.env.CONFIRM !== "yes") {
        console.log("\nDry run complete. Set CONFIRM=yes to create the session.");
        return;
    }

    const salt = ethers.hexlify(ethers.randomBytes(32));
    const createTx = await nft.createRiddleSession(TITLE, RIDDLE, category, difficulty, [], duration);
    const receipt = await createTx.wait();
    const created = receipt.logs
        .map((l) => { try { return nft.interface.parseLog(l); } catch { return null; } })
        .find((e) => e?.name === "RiddleSessionCreated");
    if (!created) throw new Error(`No RiddleSessionCreated event in ${createTx.hash}`);
    const sessionId = created.args.sessionId;

    const commitment = solutionCommitment({ contract: NFT_PROXY, sessionId, answers, salt });
    fs.mkdirSync(SECRETS_DIR, { recursive: true, mode: 0o700 });
    const file = path.join(SECRETS_DIR, `${network.name}-session-${sessionId}.json`);
    fs.writeFileSync(file, JSON.stringify({
        network: network.name, contract: NFT_PROXY, sessionId: sessionId.toString(),
        title: TITLE, answers, salt, commitment, createTx: createTx.hash,
    }, null, 2), { mode: 0o600 });
    console.log(`\nSession ${sessionId} created (${createTx.hash}). Secret saved to ${file}`);

    const commitTx = await nft.commitSolution(sessionId, commitment);
    await commitTx.wait();
    await waitFor(async () => (await nft.getCommitRevealState(sessionId))[0] === commitment, "Solution commitment");
    console.log(`Solution committed (${commitTx.hash})`);

    const startTx = await nft.startRiddleSession(sessionId);
    await startTx.wait();
    await waitFor(async () => (await nft.riddleSessions(sessionId)).endTime > 0n, "Session start");
    const endTime = (await nft.riddleSessions(sessionId)).endTime;
    console.log(`Session started (${startTx.hash}). Closes ${new Date(Number(endTime) * 1000).toISOString()}`);
    console.log(`\nAfter it closes: SESSION_ID=${sessionId} npx hardhat run scripts/game/reveal-session.js --network ${network.name}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
