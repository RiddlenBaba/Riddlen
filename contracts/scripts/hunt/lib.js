const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");

// Shared helpers for the hunt's house tooling.
// Secrets (cache keys, fragment secrets, answers, the map) live in contracts/game-master/hunt/
// (gitignored). Lose a riddle's secret file and its cache cannot be re-printed; back the
// directory up somewhere that outlives this machine.

const SECRETS_DIR = process.env.HUNT_SECRETS_DIR
    ? path.resolve(__dirname, "..", "..", process.env.HUNT_SECRETS_DIR)
    : path.join(__dirname, "..", "..", "game-master", "hunt");
const ADDRESS_FILE = path.join(__dirname, "..", "..", "deployments", "hunt.json");

function addresses() {
    if (fs.existsSync(ADDRESS_FILE)) {
        const all = JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf8"));
        if (all[network.name]) return all[network.name];
    }
    return {};
}

function huntAddress() {
    if (process.env.HUNT_ADDRESS) return process.env.HUNT_ADDRESS;
    const a = addresses();
    if (a.hunt) return a.hunt;
    throw new Error(`No RiddlenHunt address for ${network.name}: set HUNT_ADDRESS or run scripts/hunt/deploy.js`);
}

function saveAddress(record) {
    fs.mkdirSync(path.dirname(ADDRESS_FILE), { recursive: true });
    const all = fs.existsSync(ADDRESS_FILE) ? JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf8")) : {};
    all[network.name] = { ...(all[network.name] || {}), ...record };
    fs.writeFileSync(ADDRESS_FILE, JSON.stringify(all, null, 2) + "\n");
    return ADDRESS_FILE;
}

function secretFile(id, suffix = ".json") {
    return path.join(SECRETS_DIR, `${network.name}-hunt-${id}${suffix}`);
}

function saveSecret(id, data) {
    fs.mkdirSync(SECRETS_DIR, { recursive: true, mode: 0o700 });
    fs.writeFileSync(secretFile(id), JSON.stringify(data, null, 2), { mode: 0o600 });
    return secretFile(id);
}

function loadSecret(id) {
    const file = secretFile(id);
    if (!fs.existsSync(file)) throw new Error(`No saved secret at ${file}`);
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

// One map per hunt. HUNT_MAP_DIR points at another (e.g. the real one for mainnet).
function mapDir() {
    return process.env.HUNT_MAP_DIR ? path.resolve(__dirname, "..", "..", process.env.HUNT_MAP_DIR) : path.join(SECRETS_DIR, "map");
}

async function house() {
    const [signer] = await ethers.getSigners();
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const hunt = await ethers.getContractAt("RiddlenHunt", huntAddress(), signer);
    const isGm = await hunt.hasRole(await hunt.GAME_MASTER_ROLE(), signer.address);
    const nft = await ethers.getContractAt("HuntNFT", await hunt.nft(), signer);
    const commitments = await ethers.getContractAt("HuntCommitments", await hunt.commitments(), signer);
    const chainId = Number((await ethers.provider.getNetwork()).chainId);
    return { signer, hunt, nft, commitments, isGm, chainId, address: await hunt.getAddress() };
}

const DIFFICULTY = ["Easy", "Medium", "Hard", "Legendary"];

module.exports = { SECRETS_DIR, ADDRESS_FILE, addresses, huntAddress, saveAddress, secretFile, saveSecret, loadSecret, mapDir, house, DIFFICULTY };
