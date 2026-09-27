const { expect } = require("chai");
const { ethers } = require("hardhat");
const contractSide = require("../scripts/game/riddleAnswers");

// The frontend (viem) and the game master (ethers) must seal identically or reveals fail.
describe("Stump commitments: frontend-staging/lib/stumpAnswers.js vs scripts/game/riddleAnswers.js", function () {
    let web;
    before(async function () {
        web = await import("../../frontend-staging/lib/stumpAnswers.js");
    });

    const contract = "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3";
    const who = "0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040";
    const salt = ethers.id("salt");
    const cases = [["Piano"], ["  The Statue of LIBERTY! "], ["An echo.", "ECHO"]];

    it("author commitments match", function () {
        for (const answers of cases) {
            expect(web.authorCommitment({ contract, author: who, answers, salt }))
                .to.equal(contractSide.authorCommitment({ contract, author: who, answers, salt }));
        }
    });

    it("guess commitments match", function () {
        for (const answers of cases) {
            expect(web.guessCommitment({ contract, solver: who, id: 7, answers, nonce: salt }))
                .to.equal(contractSide.guessCommitment({ contract, solver: who, id: 7n, answers, nonce: salt }));
        }
    });
});
