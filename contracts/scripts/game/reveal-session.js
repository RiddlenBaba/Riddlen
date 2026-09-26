const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");

/**
 * Reveal a closed session's solution using the secret saved by create-session.js.
 *   SESSION_ID=1 npx hardhat run scripts/game/reveal-session.js --network amoy
 * After the 2-day reveal window anyone can finalize, including from the game UI.
 */

async function main() {
    const sessionId = process.env.SESSION_ID;
    if (!sessionId) throw new Error("Set SESSION_ID");
    const file = path.join(__dirname, "..", "..", "game-master", `${network.name}-session-${sessionId}.json`);
    if (!fs.existsSync(file)) throw new Error(`No saved secret at ${file}`);
    const secret = JSON.parse(fs.readFileSync(file, "utf8"));

    const [signer] = await ethers.getSigners();
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const nft = await ethers.getContractAt("RiddleNFTAdvanced", secret.contract, signer);

    const session = await nft.riddleSessions(sessionId);
    const [commitment, revealedAt] = await nft.getCommitRevealState(sessionId);
    const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);

    if (commitment !== secret.commitment) throw new Error("Saved commitment doesn't match the chain — wrong file?");
    if (revealedAt !== 0n) {
        console.log(`Already revealed at ${new Date(Number(revealedAt) * 1000).toISOString()}`);
        return;
    }
    if (now < session.endTime) {
        throw new Error(`Session closes in ${Number(session.endTime - now)}s — revealing early would leak the answer`);
    }

    const tx = await nft.revealSolution(sessionId, secret.answers, secret.salt);
    await tx.wait();
    console.log(`Solution revealed (${tx.hash}). Players have 2 days to reveal their answers.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
