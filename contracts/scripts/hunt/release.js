const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");
const QRCode = require("qrcode");
const H = require("./lib/huntCrypto");
const { house, saveSecret, secretFile, mapDir, DIFFICULTY } = require("./lib");

/**
 * Release a riddle. The house prepares everything off chain, then posts it.
 *
 *   RIDDLE=riddles/001.json npx hardhat run scripts/hunt/release.js --network amoy            # dry run
 *   CONFIRM=yes RIDDLE=riddles/001.json npx hardhat run scripts/hunt/release.js --network amoy
 *
 * The riddle file:
 *   {
 *     "text": "the clue people buy",
 *     "answers": ["keyboard", "a keyboard"],     // up to 8 accepted answers
 *     "difficulty": 0,                            // 0 Easy, 1 Medium, 2 Hard, 3 Legendary
 *     "location": "what a solver sees once they have the answer: where to go",
 *     "fragment": 0                               // optional; default riddleId - 1
 *   }
 *
 * Writes game-master/hunt/<network>-hunt-<id>.json (answers, cache key, fragment secret, ciphers)
 * and <network>-hunt-<id>-qr.png: the QR to print and hide at the place. The QR carries the
 * signing key and the fragment secret. Nothing else on earth has them; back the directory up.
 */
async function main() {
    const { signer, hunt, commitments, isGm, chainId, address } = await house();
    if (!isGm) throw new Error("Signer lacks GAME_MASTER_ROLE");
    const file = process.env.RIDDLE;
    if (!file) throw new Error("Set RIDDLE=<path to riddle json>");
    const spec = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!spec.text || !spec.answers?.length || !spec.location) throw new Error("riddle file needs text, answers[], location");

    const riddleId = Number(await hunt.riddleCount()) + 1;
    const total = Number(await commitments.totalRiddles());
    if (riddleId > total) throw new Error("All riddles released");
    const fragmentIndex = spec.fragment ?? riddleId - 1;
    const fragmentPath = path.join(mapDir(), "fragments", `${String(fragmentIndex).padStart(4, "0")}.bin`);
    if (!fs.existsSync(fragmentPath)) throw new Error(`No map fragment at ${fragmentPath}; run mapmaker.js`);
    const fragment = new Uint8Array(fs.readFileSync(fragmentPath));
    if (fs.existsSync(secretFile(riddleId))) throw new Error(`${secretFile(riddleId)} exists; refusing to overwrite a riddle's secrets`);

    console.log(`${network.name} hunt ${address}  house ${signer.address}  riddle #${riddleId} of ${total}  [${DIFFICULTY[spec.difficulty ?? 0]}]`);
    console.log(`Text: ${spec.text.slice(0, 120)}${spec.text.length > 120 ? "…" : ""}`);
    console.log(`Answers: ${spec.answers.map(H.normalizeAnswer).join(" | ")}   fragment #${fragmentIndex}`);

    process.stdout.write("Hashing answers (slow on purpose)… ");
    const hashes = [];
    for (const a of spec.answers) hashes.push(await H.answerHash({ chainId, hunt: address, riddleId, answer: a }));
    console.log("done");
    const roots = H.altRoots(riddleId, hashes).map(H.hex);
    const cache = ethers.Wallet.createRandom();
    const fragmentSecret = H.randomBytes(32);
    const locationCipher = await H.encryptLocation({ riddleId, hashes, location: spec.location });
    const fragmentCipher = await H.encryptFragment({ riddleId, fragmentSecret, fragment });
    const payload = H.formatCachePayload({ riddleId, signingKey: H.unhex(cache.privateKey), fragmentSecret });

    const secret = {
        network: network.name, chainId, hunt: address, riddleId, difficulty: spec.difficulty ?? 0,
        text: spec.text, answers: spec.answers, canonical: spec.answers.map(H.normalizeAnswer), location: spec.location,
        fragmentIndex, cacheAddress: cache.address, cachePrivateKey: cache.privateKey, fragmentSecret: H.hex(fragmentSecret),
        qrPayload: payload, altRoots: roots, locationCipher: H.hex(locationCipher), fragmentCipher: H.hex(fragmentCipher),
        preparedAt: new Date().toISOString(),
    };

    if (process.env.CONFIRM !== "yes") {
        console.log(`Cache key ${cache.address}. Dry run: nothing saved, nothing sent. Set CONFIRM=yes.`);
        return;
    }
    const saved = saveSecret(riddleId, secret);
    const qrPath = secretFile(riddleId, "-qr.png");
    await QRCode.toFile(qrPath, payload, { errorCorrectionLevel: "H", width: 600, margin: 2 });
    console.log(`Secrets ${saved}\nQR      ${qrPath}`);

    const tx = await hunt.release(spec.text, spec.difficulty ?? 0, roots, cache.address, H.hex(locationCipher), H.hex(fragmentCipher));
    const receipt = await tx.wait();
    console.log(`Released #${riddleId} in ${receipt.hash}. Open it after ${await hunt.revealDelay()} blocks (cron.js does this).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
