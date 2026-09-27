const { expect } = require("chai");
const fs = require("fs");
const path = require("path");
const node = require("../scripts/hunt/lib/huntCrypto");

// The site (web/lib/hunt.js, ESM) and the house (scripts/hunt/lib/huntCrypto.js, CJS) must build
// the same leaves, roots, proofs and typed data, or attempts and claims fail on chain. Both are
// checked against test/fixtures/hunt-vectors.json so neither can drift alone.
describe("Hunt crypto: web/lib/hunt.js vs scripts/hunt/lib/huntCrypto.js", function () {
    this.timeout(60000);
    let web, vectors;
    before(async function () {
        web = await import("../../web/lib/hunt.js");
        vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "hunt-vectors.json"), "utf8"));
    });

    it("normalizes answers identically", function () {
        for (const [raw, canon] of vectors.normalize) {
            expect(node.normalizeAnswer(raw)).to.equal(canon);
            expect(web.normalizeAnswer(raw)).to.equal(canon);
        }
    });

    it("derives the same slow answer hash", async function () {
        for (const v of vectors.answerHash) {
            const a = node.hex(await node.answerHash({ ...v, iterations: v.iterations }));
            const b = web.hex(await web.answerHash({ ...v, iterations: v.iterations }));
            expect(a).to.equal(v.H);
            expect(b).to.equal(v.H);
        }
    });

    it("builds the same leaves, roots and proofs", function () {
        for (const v of vectors.trees) {
            const Hh = node.unhex(v.H);
            for (const lib of [node, web]) {
                const tree = lib.buildAnswerTree(v.riddleId, Hh);
                expect(lib.hex(tree.root)).to.equal(v.root);
                expect(lib.hex(lib.leafFor(v.riddleId, v.index, Hh))).to.equal(v.leaf);
                expect(lib.answerProof(tree, v.index).map(lib.hex)).to.deep.equal(v.proof);
            }
        }
    });

    it("agrees on the map tree and the claim typed data", function () {
        const hashes = vectors.map.fragmentHashes.map(node.unhex);
        for (const lib of [node, web]) {
            const tree = lib.buildMapTree(hashes);
            expect(lib.hex(tree.root)).to.equal(vectors.map.root);
            expect(lib.mapProof(tree, vectors.map.index).map(lib.hex)).to.deep.equal(vectors.map.proof);
            const td = lib.claimTypedData(vectors.claim.input);
            expect(JSON.parse(JSON.stringify(td, (k, x) => typeof x === "bigint" ? x.toString() : x))).to.deep.equal(vectors.claim.typedData);
            expect(lib.formatCachePayload({ riddleId: 3, signingKey: lib.unhex(vectors.qr.k), fragmentSecret: lib.unhex(vectors.qr.s) })).to.equal(vectors.qr.text);
        }
    });

    it("location and fragment ciphers are interoperable between the two copies", async function () {
        const riddleId = 9;
        const Hh = await node.answerHash({ chainId: 31337, hunt: vectors.claim.input.hunt, riddleId, answer: "Keyboard", iterations: 1000 });
        const cipher = await node.encryptLocation({ riddleId, hashes: [Hh], location: "north of the bay" });
        expect(await web.decryptLocation({ riddleId, H: Hh, cipher })).to.equal("north of the bay");
        const secret = node.randomBytes(32);
        const frag = await web.encryptFragment({ riddleId, fragmentSecret: secret, fragment: new TextEncoder().encode("piece") });
        expect(new TextDecoder().decode(await node.decryptFragment({ riddleId, fragmentSecret: secret, cipher: frag }))).to.equal("piece");
    });
});
