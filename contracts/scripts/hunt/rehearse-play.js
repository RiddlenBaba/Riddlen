const { ethers, network } = require("hardhat");
const H = require("./lib/huntCrypto");
const { house, loadSecret } = require("./lib");

/**
 * Local rehearsal steps for the hunt, driven by STEP, using the real house scripts' output:
 *   mint     -> alice (signer 8) and bob (signer 9) each buy an NFT on the latest riddle
 *   attempt  -> alice guesses wrong twice (1 + 2 RDLN), then right (3 RDLN); bob right first time;
 *               alice transfers her unlocked token to carol (signer 7); location decrypts
 *   claim    -> carol (first) and bob (finisher) sign with the cache key from the secret file
 *   settle   -> time jumps past the window; anyone settles; everyone collects; fragment decrypts
 *   check    -> withdraws for everyone owed and asserts reserved == 0
 */
async function main() {
    if (network.name !== "localhost") throw new Error("Run against --network localhost");
    const { hunt, nft, chainId, address } = await house();
    const signers = await ethers.getSigners();
    const carol = signers[7], alice = signers[8], bob = signers[9];
    const id = Number(await hunt.riddleCount());
    const secret = loadSecret(id);
    const jump = (s) => network.provider.send("evm_increaseTime", [s]).then(() => network.provider.send("evm_mine"));
    const step = process.env.STEP;
    const tokensOf = async (who) => (await nft.tokensOf(who.address)).map(Number);
    const guessFor = async (tokenId, answer, alt = 0) => {
        const t = await hunt.getToken(tokenId);
        const Hh = await H.answerHash({ chainId, hunt: address, riddleId: Number(t.riddleId), answer });
        const a = H.attemptFor(Number(t.riddleId), Number(t.index), Hh, alt);
        return { ...a, leaf: H.hex(a.leaf), proof: a.proof.map(H.hex), H: Hh };
    };
    const rdln = await ethers.getContractAt("IRDLN", await hunt.rdln());

    if (step === "mint") {
        for (const s of [alice, bob]) { await (await hunt.connect(s).mint(id)).wait(); console.log(`${s.address} minted token ${(await tokensOf(s)).at(-1)} on #${id}`); }
    } else if (step === "attempt") {
        const [a] = await tokensOf(alice); const [b] = await tokensOf(bob);
        for (const wrong of ["a piano", "typewriter"]) {
            const g = await guessFor(a, wrong);
            const before = await rdln.balanceOf(alice.address);
            await (await hunt.connect(alice).attempt(a, g.alt, g.leaf, g.proof)).wait();
            console.log(`alice guessed "${wrong}" on ${a}: cost ${ethers.formatEther(before - await rdln.balanceOf(alice.address))} RDLN, unlocked ${(await hunt.getToken(a)).unlockedAt > 0n}`);
        }
        const right = secret.answers[0];
        for (const [who, tok] of [[alice, a], [bob, b]]) {
            const g = await guessFor(tok, right);
            const before = await rdln.balanceOf(who.address);
            await (await hunt.connect(who).attempt(tok, g.alt, g.leaf, g.proof)).wait();
            const t = await hunt.getToken(tok);
            const loc = await H.decryptLocation({ riddleId: id, H: g.H, cipher: H.unhex((await hunt.getRiddle(id)).locationCipher) });
            console.log(`${who === alice ? "alice" : "bob"} guessed right on ${tok}: cost ${ethers.formatEther(before - await rdln.balanceOf(who.address))} RDLN, unlocked ${t.unlockedAt > 0n}, location "${loc}"`);
            if (loc !== secret.location) throw new Error("location did not decrypt");
        }
        await (await nft.connect(alice).transferFrom(alice.address, carol.address, a)).wait();
        console.log(`alice sold token ${a} to carol (attempts ${(await hunt.getToken(a)).attempts}, still unlocked)`);
    } else if (step === "claim") {
        const cache = new ethers.Wallet(secret.cachePrivateKey);
        const qr = H.parseCachePayload(secret.qrPayload);
        if (qr.riddleId !== id) throw new Error("QR payload mismatch");
        for (const who of [carol, bob]) {
            const [tok] = await tokensOf(who);
            const td = H.claimTypedData({ chainId, hunt: address, riddleId: id, tokenId: tok, owner: who.address });
            const sig = await cache.signTypedData(td.domain, td.types, td.message);
            await (await hunt.connect(who).claim(tok, sig)).wait();
            const r = await hunt.getRiddle(id);
            console.log(`${who === carol ? "carol" : "bob"} claimed token ${tok}: first ${Number(r.firstTokenId) === tok}, claims ${r.claimCount}`);
        }
    } else if (step === "settle") {
        await jump(Number((await hunt.getRiddle(id)).finisherWindow) + 1);
        await (await hunt.connect(signers[5]).settle(id)).wait();
        const r = await hunt.getRiddle(id);
        console.log(`settled: first share ${ethers.formatEther(r.firstShare)}, finisher share ${ethers.formatEther(r.finisherShare)} × ${r.finisherCount}`);
        for (const who of [carol, bob]) {
            const [tok] = await tokensOf(who);
            await (await hunt.collect(tok)).wait();
            console.log(`${who === carol ? "carol" : "bob"} collected: owed ${ethers.formatEther(await hunt.owed(who.address))} RDLN`);
        }
        const qr = H.parseCachePayload(secret.qrPayload);
        const frag = await H.decryptFragment({ riddleId: id, fragmentSecret: qr.fragmentSecret, cipher: H.unhex(secret.fragmentCipher) });
        console.log(`fragment decrypts: ${frag ? `${frag.length} bytes` : "NO"}`);
        if (!frag) throw new Error("fragment did not decrypt");
    } else if (step === "check") {
        for (const s of [carol, alice, bob]) {
            const owed = await hunt.owed(s.address);
            if (owed > 0n) { await (await hunt.connect(s).withdraw()).wait(); console.log(`${s.address} withdrew ${ethers.formatEther(owed)} RDLN`); }
        }
        const reserved = await hunt.reserved();
        console.log(`reserved after withdrawals: ${ethers.formatEther(reserved)} (other unsolved riddles keep their pots)`);
        const r = await hunt.getRiddle(id);
        if (!r.settled) throw new Error("not settled");
    } else throw new Error("Set STEP=mint|attempt|claim|settle|check");
}
main().catch((e) => { console.error(e); process.exit(1); });
