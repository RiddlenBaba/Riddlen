const { AbiCoder, keccak256 } = require("ethers");

// Must stay identical to frontend-staging/lib/riddleAnswers.js — players commit with that
// copy, the game master commits the solution with this one. Both are checked against
// test/fixtures/answer-vectors.json.

/**
 * Canonical answer form: Unicode NFKC, lowercase, trimmed, internal whitespace collapsed,
 * surrounding quotes, trailing sentence punctuation and a leading article (a/an/the) removed.
 * "  The Statue of LIBERTY! " -> "statue of liberty";  "An echo." -> "echo"
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

function canonicalAnswers(answers) {
    return answers.map(normalizeAnswer);
}

const coder = AbiCoder.defaultAbiCoder();

/** keccak256(abi.encode(address(this), msg.sender, sessionId, answers, nonce)) */
function playerCommitment({ contract, player, sessionId, answers, nonce }) {
    return keccak256(coder.encode(
        ["address", "address", "uint256", "string[]", "bytes32"],
        [contract, player, BigInt(sessionId), canonicalAnswers(answers), nonce]
    ));
}

/** keccak256(abi.encode(address(this), sessionId, answers, salt)) */
function solutionCommitment({ contract, sessionId, answers, salt }) {
    return keccak256(coder.encode(
        ["address", "uint256", "string[]", "bytes32"],
        [contract, BigInt(sessionId), canonicalAnswers(answers), salt]
    ));
}

// Stump the Machine ---------------------------------------------------------------

/** keccak256(abi.encode(address(this), author, answers, salt)) — author's sealed answer */
function authorCommitment({ contract, author, answers, salt }) {
    return keccak256(coder.encode(
        ["address", "address", "string[]", "bytes32"],
        [contract, author, canonicalAnswers(answers), salt],
    ));
}

/** keccak256(abi.encode(address(this), id, panelAnswers, salt)) — game master's sealed panel */
function panelCommitment({ contract, id, answers, salt }) {
    return keccak256(coder.encode(
        ["address", "uint256", "string[]", "bytes32"],
        [contract, BigInt(id), canonicalAnswers(answers), salt],
    ));
}

/** keccak256(abi.encode(address(this), solver, id, answers, nonce)) — same layout as playerCommitment */
function guessCommitment({ contract, solver, id, answers, nonce }) {
    return playerCommitment({ contract, player: solver, sessionId: id, answers, nonce });
}

module.exports = {
    normalizeAnswer, canonicalAnswers, playerCommitment, solutionCommitment,
    authorCommitment, panelCommitment, guessCommitment,
};
