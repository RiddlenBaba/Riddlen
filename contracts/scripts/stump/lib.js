const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");
const { canonicalAnswers } = require("../game/riddleAnswers");

// Shared helpers for the Stump the Machine game master.
// Secrets (panel salts + transcripts) live in contracts/game-master/ (gitignored).

const SECRETS_DIR = path.join(__dirname, "..", "..", "game-master");
const ADDRESS_FILE = path.join(__dirname, "..", "..", "deployments", "stump-the-machine.json");

function gameAddress() {
    if (process.env.STUMP_ADDRESS) return process.env.STUMP_ADDRESS;
    if (fs.existsSync(ADDRESS_FILE)) {
        const all = JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf8"));
        if (all[network.name]?.proxy) return all[network.name].proxy;
    }
    throw new Error(`No StumpTheMachine address for ${network.name}: set STUMP_ADDRESS or run scripts/stump/deploy.js`);
}

function saveAddress(record) {
    fs.mkdirSync(path.dirname(ADDRESS_FILE), { recursive: true });
    const all = fs.existsSync(ADDRESS_FILE) ? JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf8")) : {};
    all[network.name] = { ...(all[network.name] || {}), ...record };
    fs.writeFileSync(ADDRESS_FILE, JSON.stringify(all, null, 2) + "\n");
    return ADDRESS_FILE;
}

function secretFile(id) {
    return path.join(SECRETS_DIR, `${network.name}-stump-${id}.json`);
}

function saveSecret(id, data) {
    fs.mkdirSync(SECRETS_DIR, { recursive: true, mode: 0o700 });
    fs.writeFileSync(secretFile(id), JSON.stringify(data, null, 2), { mode: 0o600 });
    return secretFile(id);
}

function loadSecret(id) {
    const file = secretFile(id);
    if (!fs.existsSync(file)) throw new Error(`No saved panel secret at ${file}`);
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function gameMaster() {
    const [signer] = await ethers.getSigners();
    if (!signer) throw new Error("No signer configured (set PRIVATE_KEY)");
    const game = await ethers.getContractAt("StumpTheMachine", gameAddress(), signer);
    const isGm = await game.hasRole(await game.GAME_MASTER_ROLE(), signer.address);
    return { signer, game, isGm };
}

const STATUS = ["NONE", "SUBMITTED", "OPEN", "VOID", "REJECTED", "FINALIZED"];
const OUTCOME = ["PENDING", "STUMPED", "MACHINE_SOLVED", "UNSOLVED", "VOIDED"];
const DIFFICULTY = ["Easy", "Medium", "Hard", "Legendary"];

// ---------------------------------------------------------------------------------------
// The panel: frontier models get the riddle cold, before any human sees it. Every distinct
// guess they produce is sealed on-chain. If any one of them matches the author's answer, the
// riddle counts as machine-solved. The panel is deliberately strong: several models, several
// samples each, and several guesses per sample.

const DEFAULT_MODELS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"];
const SAMPLES_PER_MODEL = Number(process.env.PANEL_SAMPLES ?? 2);
const GUESSES_PER_SAMPLE = 3;
const MAX_PANEL_ANSWERS = 32;

const PANEL_SYSTEM = [
    "You are one of several AI models on a panel trying to solve riddles written by humans.",
    "Think carefully: puns, lateral thinking, wordplay, cultural references and misdirection are all fair game.",
    `Reply with your ${GUESSES_PER_SAMPLE} best guesses, most likely first, one per line, each just the answer`,
    "in a few words. No numbering, no punctuation, no explanation.",
].join(" ");

async function runPanel(riddle, { models = panelModels(), log = console.log } = {}) {
    // PANEL_STUB="guess one|guess two" skips the API for local rehearsals
    if (process.env.PANEL_STUB) {
        const panelAnswers = [...new Set(canonicalAnswers(process.env.PANEL_STUB.split("|")).filter(Boolean))];
        log(`  (stub panel) ${panelAnswers.join(" | ")}`);
        return { panelAnswers, transcript: [{ model: "stub", text: process.env.PANEL_STUB, answers: panelAnswers }] };
    }
    const Anthropic = require("@anthropic-ai/sdk").default;
    const client = new Anthropic();
    const transcript = [];
    const guesses = new Set();

    for (const model of models) {
        for (let sample = 0; sample < SAMPLES_PER_MODEL; sample++) {
            const response = await client.beta.messages.create({
                model,
                max_tokens: 4000,
                betas: ["server-side-fallback-2026-07-01"],
                fallbacks: "default",
                system: PANEL_SYSTEM,
                messages: [{ role: "user", content: riddle }],
            });
            const text = response.content
                .filter((b) => b.type === "text")
                .map((b) => b.text)
                .join("\n");
            const lines = text.split("\n").map((l) => l.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim()).filter(Boolean);
            const answers = canonicalAnswers(lines.slice(0, GUESSES_PER_SAMPLE)).filter(Boolean);
            transcript.push({ model: response.model, stopReason: response.stop_reason, text, answers });
            for (const a of answers) guesses.add(a);
            log(`  ${response.model} #${sample + 1}: ${answers.join(" | ") || "(no answer)"}`);
        }
    }

    const panelAnswers = [...guesses].slice(0, MAX_PANEL_ANSWERS);
    if (panelAnswers.length === 0) throw new Error("The panel produced no answers; refusing to open");
    return { panelAnswers, transcript };
}

function panelModels() {
    return (process.env.PANEL_MODELS || DEFAULT_MODELS.join(",")).split(",").map((m) => m.trim()).filter(Boolean);
}

module.exports = {
    gameAddress, saveAddress, saveSecret, loadSecret, secretFile, gameMaster,
    runPanel, panelModels, STATUS, OUTCOME, DIFFICULTY,
};
