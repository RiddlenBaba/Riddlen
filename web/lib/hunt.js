// Riddlen Hunt: everything the house, the tests and the site must agree on.
// ESM copy of contracts/scripts/hunt/lib/huntCrypto.js. Must stay identical in logic; contracts/test/hunt.crosscheck.test.js
// checks both against test/fixtures/hunt-vectors.json and against the contract.
//
// Only WebCrypto (PBKDF2, HKDF, AES-GCM) and @noble/hashes keccak are used, so the same code
// runs in Node 20+ and in browsers. No ethers, no viem.

import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes, concatBytes, utf8ToBytes, randomBytes } from "@noble/hashes/utils";

const subtle = globalThis.crypto.subtle;

const TREE_DEPTH = 10;
const MAX_NFTS = 1 << TREE_DEPTH;      // 1024
const MAX_ALTERNATIVES = 8;
const PBKDF2_ITERATIONS = 600_000;     // deliberately slow: a guess costs real compute offline
const WRAP_BYTES = 12 + 32 + 16;       // iv + wrapped key + GCM tag
const IV_BYTES = 12;

// ---------------------------------------------------------------- answers

/**
 * Canonical answer form: Unicode NFKC, lowercase, trimmed, internal whitespace collapsed,
 * surrounding quotes, trailing sentence punctuation and a leading article (a/an/the) removed.
 * Identical to scripts/game/riddleAnswers.js.
 */
function normalizeAnswer(raw) {
    return String(raw)
        .normalize("NFKC")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
        .replace(/[.!?]+$/g, "")
        .replace(/^(a|an|the) (?=\S)/, "")
        .trim();
}

function answerSalt({ chainId, hunt, riddleId }) {
    return utf8ToBytes(`riddlen-hunt:${Number(chainId)}:${String(hunt).toLowerCase()}:${Number(riddleId)}`);
}

/** H = PBKDF2-SHA256(canonical answer, salt(chain, hunt, riddle), 600k). Returns 32 bytes. */
async function answerHash({ chainId, hunt, riddleId, answer, iterations = PBKDF2_ITERATIONS }) {
    const key = await subtle.importKey("raw", utf8ToBytes(normalizeAnswer(answer)), "PBKDF2", false, ["deriveBits"]);
    const bits = await subtle.deriveBits(
        { name: "PBKDF2", hash: "SHA-256", salt: answerSalt({ chainId, hunt, riddleId }), iterations }, key, 256);
    return new Uint8Array(bits);
}

// ---------------------------------------------------------------- answer trees

function word(n) {
    const out = new Uint8Array(32);
    let v = BigInt(n);
    for (let i = 31; i >= 0 && v > 0n; i--) { out[i] = Number(v & 0xffn); v >>= 8n; }
    return out;
}

/** keccak256(abi.encode(uint256 riddleId, uint256 index, bytes32 H)) */
function leafFor(riddleId, index, H) {
    return keccak_256(concatBytes(word(riddleId), word(index), H));
}

function node2(a, b) { return keccak_256(concatBytes(a, b)); }

/** Full 1024-leaf positional tree for one accepted answer. Nodes are keccak(leaf). */
function buildAnswerTree(riddleId, H) {
    let layer = [];
    for (let i = 0; i < MAX_NFTS; i++) layer.push(keccak_256(leafFor(riddleId, i, H)));
    const layers = [layer];
    while (layer.length > 1) {
        const next = [];
        for (let i = 0; i < layer.length; i += 2) next.push(node2(layer[i], layer[i + 1]));
        layers.push(next);
        layer = next;
    }
    return { layers, root: layer[0] };
}

/** The 10 siblings from position `index` up to the root. */
function answerProof(tree, index) {
    const proof = [];
    let pos = index;
    for (let d = 0; d < TREE_DEPTH; d++) {
        proof.push(tree.layers[d][pos ^ 1]);
        pos >>= 1;
    }
    return proof;
}

/** 8 roots for the contract: one per accepted answer, random roots in the unused slots. */
function altRoots(riddleId, hashes) {
    if (hashes.length === 0 || hashes.length > MAX_ALTERNATIVES) throw new Error("1 to 8 answers");
    const roots = hashes.map((H) => buildAnswerTree(riddleId, H).root);
    while (roots.length < MAX_ALTERNATIVES) roots.push(randomBytes(32));
    return roots;
}

/** What a player submits for token `index` if their guess hashes to H: { alt, leaf, proof }. */
function attemptFor(riddleId, index, H, alt) {
    const tree = buildAnswerTree(riddleId, H);
    return { alt, leaf: leafFor(riddleId, index, H), proof: answerProof(tree, index), root: tree.root };
}

// ---------------------------------------------------------------- symmetric crypto

async function hkdf(secret, info, riddleId) {
    const key = await subtle.importKey("raw", secret, "HKDF", false, ["deriveKey"]);
    return subtle.deriveKey(
        { name: "HKDF", hash: "SHA-256", salt: word(riddleId), info: utf8ToBytes(info) },
        key, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

async function seal(key, plaintext) {
    const iv = randomBytes(IV_BYTES);
    const ct = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext));
    return concatBytes(iv, ct);
}

async function openSealed(key, blob) {
    try {
        const pt = await subtle.decrypt({ name: "AES-GCM", iv: blob.slice(0, IV_BYTES) }, key, blob.slice(IV_BYTES));
        return new Uint8Array(pt);
    } catch { return null; }
}

/**
 * Location cipher: 8 wraps of a random key (one per accepted answer, random bytes in unused
 * slots) followed by the location clue sealed under that key. Any accepted answer opens it.
 */
async function encryptLocation({ riddleId, hashes, location }) {
    const K = randomBytes(32);
    const kLoc = await subtle.importKey("raw", K, "AES-GCM", false, ["encrypt"]);
    const wraps = [];
    for (let i = 0; i < MAX_ALTERNATIVES; i++) {
        if (i < hashes.length) wraps.push(await seal(await hkdf(hashes[i], "riddlen-hunt/wrap", riddleId), K));
        else wraps.push(randomBytes(WRAP_BYTES));
    }
    return concatBytes(...wraps, await seal(kLoc, utf8ToBytes(location)));
}

/** Try every wrap with one answer hash. Returns the clue text, or null if H is not an answer. */
async function decryptLocation({ riddleId, H, cipher }) {
    const wrapKey = await hkdf(H, "riddlen-hunt/wrap", riddleId);
    const body = cipher.slice(MAX_ALTERNATIVES * WRAP_BYTES);
    for (let i = 0; i < MAX_ALTERNATIVES; i++) {
        const K = await openSealed(wrapKey, cipher.slice(i * WRAP_BYTES, (i + 1) * WRAP_BYTES));
        if (!K) continue;
        const kLoc = await subtle.importKey("raw", K, "AES-GCM", false, ["decrypt"]);
        const pt = await openSealed(kLoc, body);
        if (pt) return new TextDecoder().decode(pt);
    }
    return null;
}

/** Map fragment, sealed under a secret that only exists at the place (in the cache QR). */
async function encryptFragment({ riddleId, fragmentSecret, fragment }) {
    return seal(await hkdf(fragmentSecret, "riddlen-hunt/fragment", riddleId), fragment);
}

async function decryptFragment({ riddleId, fragmentSecret, cipher }) {
    return openSealed(await hkdf(fragmentSecret, "riddlen-hunt/fragment", riddleId), cipher);
}

// ---------------------------------------------------------------- the cache QR

/** What is printed and hidden at the place. `signingKey` signs claims; `fragmentSecret` opens the fragment. */
function formatCachePayload({ riddleId, signingKey, fragmentSecret }) {
    return `riddlen://cache?v=1&r=${Number(riddleId)}&k=${bytesToHex(signingKey)}&s=${bytesToHex(fragmentSecret)}`;
}

function parseCachePayload(text) {
    const m = /^riddlen:\/\/cache\?v=1&r=(\d+)&k=([0-9a-f]{64})&s=([0-9a-f]{64})$/i.exec(String(text).trim());
    if (!m) return null;
    return { riddleId: Number(m[1]), signingKey: hexToBytes(m[2]), fragmentSecret: hexToBytes(m[3]) };
}

/** EIP-712 typed data the cache key signs. Bound to chain, contract, riddle, token and owner. */
function claimTypedData({ chainId, hunt, riddleId, tokenId, owner }) {
    return {
        domain: { name: "Riddlen Hunt", version: "1", chainId: Number(chainId), verifyingContract: hunt },
        types: { Claim: [
            { name: "riddleId", type: "uint256" },
            { name: "tokenId", type: "uint256" },
            { name: "owner", type: "address" },
        ] },
        primaryType: "Claim",
        message: { riddleId: BigInt(riddleId), tokenId: BigInt(tokenId), owner },
    };
}

// ---------------------------------------------------------------- the map

/** Sorted-pair Merkle tree over keccak(fragmentHash), matching RiddlenHunt.verifyFragment. */
function buildMapTree(fragmentHashes) {
    let layer = fragmentHashes.map((h) => keccak_256(h));
    const layers = [layer];
    while (layer.length > 1) {
        const next = [];
        for (let i = 0; i < layer.length; i += 2) {
            const a = layer[i], b = layer[i + 1] ?? layer[i];
            next.push(compareBytes(a, b) < 0 ? node2(a, b) : node2(b, a));
        }
        layers.push(next);
        layer = next;
    }
    return { layers, root: layer[0] };
}

function mapProof(tree, index) {
    const proof = [];
    let pos = index;
    for (let d = 0; d < tree.layers.length - 1; d++) {
        const layer = tree.layers[d];
        proof.push(layer[pos ^ 1] ?? layer[pos]);
        pos >>= 1;
    }
    return proof;
}

function compareBytes(a, b) {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
}

const hex = (b) => "0x" + bytesToHex(b);
const unhex = (h) => hexToBytes(String(h).replace(/^0x/, ""));

export {
    TREE_DEPTH, MAX_NFTS, MAX_ALTERNATIVES, PBKDF2_ITERATIONS, WRAP_BYTES, normalizeAnswer, answerSalt, answerHash, leafFor, buildAnswerTree, answerProof, altRoots, attemptFor, encryptLocation, decryptLocation, encryptFragment, decryptFragment, formatCachePayload, parseCachePayload, claimTypedData, buildMapTree, mapProof, hex, unhex, randomBytes, keccak_256,
};
