const { ethers, network } = require("hardhat");
const { house } = require("./lib");

/**
 * One unattended pass. Safe to run every few minutes (GitHub Actions, cron, PM2). No AI, no
 * secrets beyond the key: it only does what anyone may do.
 *   1. opens every released riddle whose delay has passed (rolls the NFT count)
 *   2. settles every riddle whose finisher window has passed
 *
 *   CONFIRM=yes npx hardhat run scripts/hunt/cron.js --network amoy
 */
async function main() {
    const { signer, hunt } = await house();
    const confirm = process.env.CONFIRM === "yes";
    const count = Number(await hunt.riddleCount());
    const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);
    const block = BigInt(await ethers.provider.getBlockNumber());
    const delay = BigInt(await hunt.revealDelay());
    console.log(`${network.name} ${await hunt.getAddress()}  signer ${signer.address}  ${count} riddles  ${confirm ? "LIVE" : "dry run"}`);

    for (let id = 1; id <= count; id++) {
        const r = await hunt.getRiddle(id);
        if (!r.opened) {
            if (block > r.commitBlock + delay) {
                console.log(`#${id}: ${confirm ? "opening" : "would open"}`);
                if (confirm) await (await hunt.open(id)).wait();
            } else console.log(`#${id}: waiting for block ${r.commitBlock + delay + 1n} to open`);
            continue;
        }
        if (r.firstClaimAt !== 0n && !r.settled && now > r.firstClaimAt + BigInt(r.finisherWindow)) {
            console.log(`#${id}: ${confirm ? "settling" : "would settle"}`);
            if (confirm) {
                try { await (await hunt.settle(id)).wait(); }
                catch (e) { console.log(`#${id}: settle failed (${e.shortMessage || e.message})`); }
            }
        }
    }
    console.log("pass complete");
}

main().catch((e) => { console.error(e); process.exit(1); });
