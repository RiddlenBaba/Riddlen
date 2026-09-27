const { ethers, network } = require("hardhat");
const { panelCommitment } = require("../game/riddleAnswers");
const { gameMaster, runPanel, screenRiddle, saveSecret, loadSecret, secretFile, STATUS } = require("./lib");
const fs = require("fs");

/**
 * One unattended game-master pass. Safe to run every few minutes (GitHub Actions, cron, PM2):
 *   1. screens each new submission (is it a genuine riddle a person could attempt?) and rejects junk
 *   2. runs the AI panel and opens accepted submissions, up to MAX_OPEN open at once
 *   3. reveals the panel for every closed riddle that has a saved secret
 *   4. settles every riddle whose reveal window has passed
 *
 *   CONFIRM=yes npx hardhat run scripts/stump/cron.js --network amoy
 * Options: MAX_OPEN (default 6), DURATION (default 86400), MAX_PENDING_PER_AUTHOR (default 2),
 * SCREEN=no to skip the screening call. Needs AI_GATEWAY_API_KEY (or ANTHROPIC_API_KEY) unless PANEL_STUB is set.
 * Secrets live in contracts/game-master/; on CI, persist that directory between runs (see
 * .github/workflows/stump-game-master.yml).
 */

const MAX_OPEN = Number(process.env.MAX_OPEN ?? 6);
const DURATION = Number(process.env.DURATION ?? 86400);
const MAX_PENDING_PER_AUTHOR = Number(process.env.MAX_PENDING_PER_AUTHOR ?? 2);

async function screen(riddle) {
    if (process.env.SCREEN === "no" || process.env.PANEL_STUB) return { ok: true };
    return screenRiddle(riddle);
}

async function main() {
    const { signer, game, isGm } = await gameMaster();
    if (!isGm) throw new Error("Signer lacks GAME_MASTER_ROLE");
    const confirm = process.env.CONFIRM === "yes";
    const contract = await game.getAddress();
    const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);
    const count = Number(await game.challengeCount());
    console.log(`${network.name} ${contract}  game master ${signer.address}  ${count} challenges  ${confirm ? "LIVE" : "dry run"}`);

    const all = [];
    for (let id = 1; id <= count; id++) {
        const r = await game.getChallenge(BigInt(id));
        all.push({ id: BigInt(id), author: r.author, status: Number(r.status), endTime: r.endTime,
            authorRevealedAt: r.authorRevealedAt, panelRevealed: r.panelRevealed, riddle: r.riddle });
    }
    let openCount = all.filter((c) => c.status === STATUS.indexOf("OPEN")).length;
    const pendingByAuthor = {};

    for (const c of all) {
        const id = c.id;
        const status = c.status;

        if (status === 1) { // SUBMITTED
            pendingByAuthor[c.author] = (pendingByAuthor[c.author] || 0) + 1;
            if (pendingByAuthor[c.author] > MAX_PENDING_PER_AUTHOR) { console.log(`#${id}: author has too many pending, skipped`); continue; }
            if (openCount >= MAX_OPEN) { console.log(`#${id}: ${MAX_OPEN} already open, skipped`); continue; }
            const verdict = await screen(c.riddle);
            if (!verdict.ok) {
                console.log(`#${id}: rejected (${verdict.reason})`);
                if (confirm) await (await game.reject(id, "Not a riddle")).wait();
                continue;
            }
            const { panelAnswers, transcript } = await runPanel(c.riddle, { log: () => {} });
            const salt = ethers.hexlify(ethers.randomBytes(32));
            const commitment = panelCommitment({ contract, id, answers: panelAnswers, salt });
            saveSecret(id, { network: network.name, contract, id: id.toString(), riddle: c.riddle, panelAnswers, salt, commitment, transcript, ranAt: new Date().toISOString() });
            console.log(`#${id}: panel ${panelAnswers.length} answers -> ${confirm ? "opening" : "would open"}`);
            if (confirm) { await (await game.open(id, commitment, DURATION)).wait(); openCount++; }
            continue;
        }

        if (status === 2) { // OPEN
            if (now < c.endTime) continue;
            if (!c.panelRevealed) {
                if (!fs.existsSync(secretFile(id))) { console.log(`#${id}: closed but no panel secret on this machine`); continue; }
                const s = loadSecret(id);
                console.log(`#${id}: ${confirm ? "revealing" : "would reveal"} panel`);
                if (confirm) await (await game.revealPanel(id, s.panelAnswers, s.salt)).wait();
            }
            const authorDue = c.authorRevealedAt === 0n ? c.endTime : c.authorRevealedAt;
            const revealWindow = await game.REVEAL_WINDOW();
            if (now > authorDue + revealWindow && (c.panelRevealed || fs.existsSync(secretFile(id)))) {
                console.log(`#${id}: ${confirm ? "settling" : "would settle"}`);
                if (confirm) {
                    try { await (await game.finalize(id)).wait(); }
                    catch (e) { console.log(`#${id}: settle failed (${e.shortMessage || e.message})`); }
                }
            }
        }
    }
    console.log("pass complete");
}

main().catch((e) => { console.error(e); process.exit(1); });
