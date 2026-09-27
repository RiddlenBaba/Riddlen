const { ethers, network } = require("hardhat");
const { gameMaster, loadSecret, STATUS } = require("./lib");

/**
 * Reveal the panel's answers for closed challenges using the saved secrets.
 *   npx hardhat run scripts/stump/reveal-panel.js --network amoy         # every closed, unrevealed one
 *   ID=3 npx hardhat run scripts/stump/reveal-panel.js --network amoy
 * Finalizing is permissionless and happens from the game page (or FINALIZE=yes here) once the
 * author's reveal window has passed.
 */

async function main() {
    const { signer, game, isGm } = await gameMaster();
    if (!isGm) throw new Error("Signer lacks GAME_MASTER_ROLE");
    const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);
    const count = await game.challengeCount();
    const ids = process.env.ID ? [BigInt(process.env.ID)] : Array.from({ length: Number(count) }, (_, i) => BigInt(i + 1));

    for (const id of ids) {
        const c = await game.getChallenge(id);
        if (Number(c.status) !== 2) continue;
        if (now < c.endTime) { console.log(`#${id}: entries close in ${c.endTime - now}s`); continue; }
        if (!c.panelRevealed) {
            const secret = loadSecret(id);
            if (secret.network !== network.name) throw new Error(`Secret for #${id} is from ${secret.network}`);
            const tx = await game.revealPanel(id, secret.panelAnswers, secret.salt);
            await tx.wait();
            console.log(`#${id}: panel revealed (${tx.hash}): ${secret.panelAnswers.join(" | ")}`);
        } else console.log(`#${id}: panel already revealed`);

        if (process.env.FINALIZE === "yes") {
            try {
                const tx = await game.finalize(id);
                await tx.wait();
                console.log(`#${id}: finalized (${tx.hash})`);
            } catch (err) {
                console.log(`#${id}: not finalizable yet (${err.shortMessage || err.message})`);
            }
        }
    }
    console.log(`Game master ${signer.address} done.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
