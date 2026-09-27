const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const H = require("./lib/huntCrypto");
const { mapDir } = require("./lib");

/**
 * Split the map into fragments and commit to it. Run ONCE per hunt, before deploy.js.
 *
 *   MAP=path/to/map.png PRIZE_LOCATION="..." TOTAL_RIDDLES=1000 node scripts/hunt/mapmaker.js
 *   PLACEHOLDER=yes node scripts/hunt/mapmaker.js          # testnet: a random map and prize
 *
 * The map file is any bytes (an image, a PDF, a text). It is cut into TOTAL_RIDDLES pieces of
 * equal size; fragment i is what riddle i+1 reveals. Nothing about the split is clever: with a
 * PNG, one piece alone is noise and many pieces together reassemble. If you want fragments that
 * are individually meaningless in a stronger sense (e.g. shares), produce them yourself and
 * point MAP_DIR at a folder of files named 0000..0999.
 *
 * Output (gitignored, back it up): game-master/hunt/map/fragments/NNNN.bin, manifest.json with
 * mapRoot, prizeCommitment, prizeSalt. The salt and location are what proves the prize later.
 */
async function main() {
    const total = Number(process.env.TOTAL_RIDDLES || 1000);
    const dir = mapDir();
    const fragDir = path.join(dir, "fragments");
    fs.mkdirSync(fragDir, { recursive: true, mode: 0o700 });

    let fragments = [];
    if (process.env.MAP_DIR) {
        for (let i = 0; i < total; i++) fragments.push(fs.readFileSync(path.join(process.env.MAP_DIR, String(i).padStart(4, "0"))));
    } else if (process.env.MAP) {
        const bytes = fs.readFileSync(process.env.MAP);
        const size = Math.ceil(bytes.length / total);
        for (let i = 0; i < total; i++) fragments.push(bytes.subarray(i * size, (i + 1) * size));
    } else if (process.env.PLACEHOLDER === "yes") {
        for (let i = 0; i < total; i++) fragments.push(Buffer.from(`placeholder fragment ${i + 1} of ${total}: ${H.hex(H.randomBytes(16))}`));
    } else throw new Error("Set MAP=<file>, MAP_DIR=<folder>, or PLACEHOLDER=yes");

    const hashes = fragments.map((f) => H.keccak_256(new Uint8Array(f)));
    const tree = H.buildMapTree(hashes);
    const prizeLocation = process.env.PRIZE_LOCATION || (process.env.PLACEHOLDER === "yes" ? "placeholder prize location" : null);
    if (!prizeLocation) throw new Error("Set PRIZE_LOCATION (kept off chain; only its hash is committed)");
    const prizeSalt = H.hex(H.randomBytes(32));
    const prizeCommitment = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["string", "bytes32"], [prizeLocation, prizeSalt]));

    fragments.forEach((f, i) => fs.writeFileSync(path.join(fragDir, `${String(i).padStart(4, "0")}.bin`), f, { mode: 0o600 }));
    const manifest = {
        total, mapRoot: H.hex(tree.root), prizeCommitment, prizeSalt, prizeLocation,
        fragmentHashes: hashes.map(H.hex), createdAt: new Date().toISOString(),
        note: "prizeCommitment = keccak256(abi.encode(prizeLocation, prizeSalt)). Keep this file and the fragments; publish nothing.",
    };
    fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2), { mode: 0o600 });
    console.log(`${total} fragments written to ${fragDir}`);
    console.log(`mapRoot          ${manifest.mapRoot}`);
    console.log(`prizeCommitment  ${prizeCommitment}`);
    console.log(`Manifest: ${path.join(dir, "manifest.json")} (secret; back it up)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
