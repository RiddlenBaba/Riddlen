const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { loadFixture, time, mine } = require("@nomicfoundation/hardhat-network-helpers");
const { E, H, deployHunt, release, releaseAndOpen, mintTo, guess, attempt, signClaim, claim } = require("./helpers/hunt");

describe("RiddlenHunt", function () {
    this.timeout(120000);
    const fixture = () => deployHunt();

    // ------------------------------------------------------------ release / open

    describe("release and open", function () {
        it("reserves the pot, snapshots economics, stores the fragment hash and emits the fragment", async function () {
            const f = await loadFixture(fixture);
            const before = await f.hunt.reserved();
            const r = await release(f, { difficulty: 1 });
            const R = await f.hunt.getRiddle(r.id);
            expect(await f.hunt.reserved()).to.equal(before + E("25000"));
            expect(R.pot).to.equal(E("25000"));
            expect(R.claimFee).to.equal(E("5"));
            expect(R.attemptStep).to.equal(E("1"));
            expect(R.firstFinderBps).to.equal(5000);
            expect(R.cacheSigner).to.equal(r.cache.address);
            expect(R.fragmentCipherHash).to.equal(ethers.keccak256(H.hex(r.fragmentCipher)));
            expect(R.opened).to.equal(false);
            const logs = await f.hunt.queryFilter(f.hunt.filters.RiddleReleased(r.id));
            expect(logs[0].args.fragmentCipher).to.equal(H.hex(r.fragmentCipher));
            // later economics changes do not touch a released riddle
            await f.hunt.connect(f.admin).setEconomics([E("1"), E("1"), E("1"), E("1")], E("9"), E("2"), 1000, 60, 5);
            expect((await f.hunt.getRiddle(r.id)).claimFee).to.equal(E("5"));
        });

        it("reverts when underfunded, on a reused cache key, and past the riddle total", async function () {
            const f = await loadFixture(fixture);
            await f.hunt.connect(f.admin).setEconomics([E("600000"), E("1"), E("1"), E("1")], E("5"), E("1"), 5000, 60, 5);
            await expect(release(f)).to.be.revertedWithCustomError(f.hunt, "PoolUnderfunded");
            await f.hunt.connect(f.admin).setEconomics([E("10000"), E("1"), E("1"), E("1")], E("5"), E("1"), 5000, 60, 5);
            const r = await release(f);
            await expect(f.hunt.connect(f.gm).release("again", 0, r.roots, r.cache.address, "0x", "0x"))
                .to.be.revertedWithCustomError(f.hunt, "BadSigner");

            const g = await deployHunt({ totalRiddles: 1 });
            await expect((await release(g)) && f.hunt.queryFilter(f.hunt.filters.GrandPrizeOpen())).to.eventually.have.length(0);
            const opened = await g.hunt.queryFilter(g.hunt.filters.GrandPrizeOpen());
            expect(opened).to.have.length(1);
            await expect(release(g)).to.be.revertedWithCustomError(g.hunt, "TooManyRiddles");
        });

        it("enforces the release spacing", async function () {
            const f = await deployHunt({ minReleaseSpacing: 3600 });
            await release(f);
            await expect(release(f)).to.be.revertedWithCustomError(f.hunt, "TooSoon");
            await time.increase(3600);
            await release(f);
        });

        it("opens only after the delay, by anyone, with a count inside the table; falls back after 256 blocks", async function () {
            const f = await loadFixture(fixture);
            const r = await release(f);
            await expect(f.hunt.open(r.id)).to.be.revertedWithCustomError(f.hunt, "TooSoon");
            await mine(11);
            await expect(f.hunt.connect(f.alice).open(r.id)).to.emit(f.hunt, "RiddleOpened");
            const R = await f.hunt.getRiddle(r.id);
            expect(R.nftCount).to.be.within(10, 1000);
            await expect(f.hunt.open(r.id)).to.be.revertedWithCustomError(f.hunt, "AlreadyOpened");

            const r2 = await release(f);
            await mine(300);
            const tx = await f.hunt.open(r2.id);
            const ev = (await tx.wait()).logs.map((l) => { try { return f.hunt.interface.parseLog(l); } catch { return null; } }).find((e) => e && e.name === "RiddleOpened");
            expect(ev.args.fallbackSeed).to.equal(true);
        });

        it("rolls counts with the published weights", async function () {
            const f = await loadFixture(fixture);
            const buckets = [0, 0, 0, 0];
            const N = 2000;
            for (let i = 0; i < N; i++) {
                const n = Number(await f.hunt.rollCount(ethers.id(`seed ${i}`)));
                expect(n).to.be.within(10, 1000);
                buckets[n <= 50 ? 0 : n <= 200 ? 1 : n <= 600 ? 2 : 3]++;
            }
            expect(buckets[0] / N).to.be.within(0.44, 0.56);
            expect(buckets[1] / N).to.be.within(0.20, 0.30);
            expect(buckets[2] / N).to.be.within(0.15, 0.25);
            expect(buckets[3] / N).to.be.within(0.02, 0.08);
        });
    });

    // ------------------------------------------------------------ mint

    describe("mint", function () {
        it("charges the price through the 50/25/25 protocol and stops at the count", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            const R = await f.hunt.getRiddle(r.id);
            const supply = await f.rdln.totalSupply();
            const grand = await f.rdln.balanceOf(f.grand.address);
            const treasury = await f.rdln.balanceOf(f.treasury.address);
            const tokenId = await mintTo(f, f.alice, r.id);
            expect(await f.nft.ownerOf(tokenId)).to.equal(f.alice.address);
            expect(await f.rdln.balanceOf(f.alice.address)).to.equal(E("4900"));
            expect(supply - await f.rdln.totalSupply()).to.equal(E("50"));
            expect(await f.rdln.balanceOf(f.grand.address) - grand).to.equal(E("25"));
            expect(await f.rdln.balanceOf(f.treasury.address) - treasury).to.equal(E("25"));
            const t = await f.hunt.getToken(tokenId);
            expect(t.riddleId).to.equal(r.id);
            expect(t.index).to.equal(0);

            await f.rdln.mintPrizePool(f.bob.address, E("200000"));
            for (let i = 1; i < Number(R.nftCount); i++) await f.hunt.connect(f.bob).mint(r.id);
            await expect(f.hunt.connect(f.bob).mint(r.id)).to.be.revertedWithCustomError(f.hunt, "SoldOut");
        });

        it("prices at mint time and halves every two years", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            expect(await f.hunt.mintPrice()).to.equal(E("100"));
            await time.increase(730 * 86400);
            expect(await f.hunt.mintPrice()).to.equal(E("50"));
            await mintTo(f, f.alice, r.id);
            expect(await f.rdln.balanceOf(f.alice.address)).to.equal(E("4950"));
            await time.increase(3 * 730 * 86400);
            expect(await f.hunt.mintPrice()).to.equal(E("6.25"));
        });

        it("cannot mint before open", async function () {
            const f = await loadFixture(fixture);
            const r = await release(f);
            await expect(f.hunt.connect(f.alice).mint(r.id)).to.be.revertedWithCustomError(f.hunt, "NotOpened");
        });
    });

    // ------------------------------------------------------------ attempt

    describe("attempt", function () {
        it("escalates per token, not per wallet, and the counter travels on transfer", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            const a = await mintTo(f, f.alice, r.id);
            const b = await mintTo(f, f.alice, r.id);
            const start = await f.rdln.balanceOf(f.alice.address);
            await attempt(f, f.alice, a, "piano");
            await attempt(f, f.alice, a, "typewriter");
            expect(start - await f.rdln.balanceOf(f.alice.address)).to.equal(E("3")); // 1 + 2
            await expect(attempt(f, f.alice, b, "piano")).to.emit(f.hunt, "Attempted").withArgs(r.id, b, f.alice.address, 1, E("1"), false);

            await f.nft.connect(f.alice).transferFrom(f.alice.address, f.bob.address, a);
            const bobStart = await f.rdln.balanceOf(f.bob.address);
            await expect(attempt(f, f.bob, a, "keyboard")).to.emit(f.hunt, "Attempted").withArgs(r.id, a, f.bob.address, 3, E("3"), true);
            expect(bobStart - await f.rdln.balanceOf(f.bob.address)).to.equal(E("3"));
            expect((await f.hunt.getToken(a)).unlockedAt).to.be.gt(0);
            await expect(attempt(f, f.bob, a, "keyboard")).to.be.revertedWithCustomError(f.hunt, "AlreadyUnlocked");
            await expect(attempt(f, f.alice, a, "keyboard")).to.be.revertedWithCustomError(f.hunt, "NotOwner");
        });

        it("a solved token's leaf and proof cannot be replayed by another token", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            const a = await mintTo(f, f.alice, r.id);
            const b = await mintTo(f, f.bob, r.id);
            const g = await guess(f, a, "keyboard");
            await f.hunt.connect(f.alice).attempt(a, g.alt, g.leaf, g.proof);
            expect((await f.hunt.getToken(a)).unlockedAt).to.be.gt(0);
            // bob copies alice's calldata from the chain
            await f.hunt.connect(f.bob).attempt(b, g.alt, g.leaf, g.proof);
            expect((await f.hunt.getToken(b)).unlockedAt).to.equal(0);
            // bob builds his own proof from the answer and gets in
            await attempt(f, f.bob, b, "keyboard");
            expect((await f.hunt.getToken(b)).unlockedAt).to.be.gt(0);
        });

        it("any accepted alternative unlocks and decrypts the location; a wrong answer decrypts nothing", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f, { answers: ["keyboard", "Piano"], location: "Behind the red door" });
            const a = await mintTo(f, f.alice, r.id);
            const wrong = await guess(f, a, "typewriter");
            expect(await H.decryptLocation({ riddleId: r.id, H: wrong.H, cipher: r.locationCipher })).to.equal(null);
            await expect(attempt(f, f.alice, a, "a piano!", 0)).to.emit(f.hunt, "Attempted").withArgs(r.id, a, f.alice.address, 1, E("1"), false);
            const g = await guess(f, a, "a piano!", 1);
            await expect(f.hunt.connect(f.alice).attempt(a, 1, g.leaf, g.proof)).to.emit(f.hunt, "Attempted").withArgs(r.id, a, f.alice.address, 2, E("2"), true);
            expect(await H.decryptLocation({ riddleId: r.id, H: g.H, cipher: H.unhex((await f.hunt.getRiddle(r.id)).locationCipher) })).to.equal("Behind the red door");
        });
    });

    // ------------------------------------------------------------ claim

    describe("claim", function () {
        async function unlocked() {
            const f = await deployHunt();
            const r = await releaseAndOpen(f);
            const a = await mintTo(f, f.alice, r.id);
            const b = await mintTo(f, f.bob, r.id);
            await attempt(f, f.alice, a, "keyboard");
            await attempt(f, f.bob, b, "keyboard");
            return { f, r, a, b };
        }

        it("needs the owner, an unlock, and the cache key's signature over this token and owner", async function () {
            const { f, r, a, b } = await unlocked();
            const c = await mintTo(f, f.carol, r.id);
            await expect(claim(f, f.carol, c, r.cache)).to.be.revertedWithCustomError(f.hunt, "NotUnlocked");
            await expect(f.hunt.connect(f.bob).claim(a, await signClaim(f, r.cache, a, f.bob.address))).to.be.revertedWithCustomError(f.hunt, "NotOwner");
            await expect(claim(f, f.alice, a, ethers.Wallet.createRandom())).to.be.revertedWithCustomError(f.hunt, "BadSigner");
            // signature for bob's token used on alice's
            await expect(f.hunt.connect(f.alice).claim(a, await signClaim(f, r.cache, b, f.alice.address))).to.be.revertedWithCustomError(f.hunt, "BadSigner");
            // signature for a different owner
            await expect(f.hunt.connect(f.alice).claim(a, await signClaim(f, r.cache, a, f.bob.address))).to.be.revertedWithCustomError(f.hunt, "BadSigner");
            // signature under another chain's domain
            await expect(f.hunt.connect(f.alice).claim(a, await signClaim(f, r.cache, a, f.alice.address, { domain: { chainId: 80002 } }))).to.be.revertedWithCustomError(f.hunt, "BadSigner");

            const before = await f.rdln.balanceOf(f.alice.address);
            await expect(claim(f, f.alice, a, r.cache)).to.emit(f.hunt, "Claimed").withArgs(r.id, a, f.alice.address, true, true);
            expect(before - await f.rdln.balanceOf(f.alice.address)).to.equal(E("5"));
            await expect(claim(f, f.alice, a, r.cache)).to.be.revertedWithCustomError(f.hunt, "AlreadyClaimed");
            const R = await f.hunt.getRiddle(r.id);
            expect(R.firstTokenId).to.equal(a);
            expect(R.claimCount).to.equal(1);
        });

        it("unlocked state travels: the buyer of an unlocked token can claim", async function () {
            const { f, r, a } = await unlocked();
            await f.nft.connect(f.alice).transferFrom(f.alice.address, f.carol.address, a);
            await expect(claim(f, f.carol, a, r.cache)).to.emit(f.hunt, "Claimed").withArgs(r.id, a, f.carol.address, true, true);
        });

        it("rekey replaces the signer and ciphers; old signatures stop working; the fragment still opens", async function () {
            const { f, r, a } = await unlocked();
            const newCache = ethers.Wallet.createRandom();
            const newSecret = H.randomBytes(32);
            const frag = await H.encryptFragment({ riddleId: r.id, fragmentSecret: newSecret, fragment: r.fragmentBytes });
            await f.hunt.connect(f.gm).rekey(r.id, newCache.address, H.hex(r.locationCipher), H.hex(frag));
            await expect(claim(f, f.alice, a, r.cache)).to.be.revertedWithCustomError(f.hunt, "BadSigner");
            await claim(f, f.alice, a, newCache);
            expect(new TextDecoder().decode(await H.decryptFragment({ riddleId: r.id, fragmentSecret: newSecret, cipher: frag }))).to.equal(`fragment ${r.id}`);
            expect(await H.decryptFragment({ riddleId: r.id, fragmentSecret: r.fragmentSecret, cipher: frag })).to.equal(null);
        });
    });

    // ------------------------------------------------------------ settle / collect

    describe("settle and collect", function () {
        it("first finder, a finisher in the window, a late finder; pull payouts; reserved returns to zero", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f); // pot 10,000
            const tokens = {};
            for (const [who, name] of [[f.alice, "alice"], [f.bob, "bob"], [f.carol, "carol"]]) {
                tokens[name] = await mintTo(f, who, r.id);
                await attempt(f, who, tokens[name], "keyboard");
            }
            await expect(f.hunt.settle(r.id)).to.be.revertedWithCustomError(f.hunt, "NothingToSettle");
            await claim(f, f.alice, tokens.alice, r.cache);
            await time.increase(7 * 86400);
            await expect(claim(f, f.bob, tokens.bob, r.cache)).to.emit(f.hunt, "Claimed").withArgs(r.id, tokens.bob, f.bob.address, false, true);
            await expect(f.hunt.settle(r.id)).to.be.revertedWithCustomError(f.hunt, "WindowOpen");
            await time.increase(8 * 86400);
            await expect(claim(f, f.carol, tokens.carol, r.cache)).to.emit(f.hunt, "Claimed").withArgs(r.id, tokens.carol, f.carol.address, false, false);
            await expect(f.hunt.collect(tokens.alice)).to.be.revertedWithCustomError(f.hunt, "NotSettled");

            await expect(f.hunt.connect(f.carol).settle(r.id)).to.emit(f.hunt, "Settled").withArgs(r.id, E("5000"), E("5000"), 1);
            await expect(f.hunt.settle(r.id)).to.be.revertedWithCustomError(f.hunt, "AlreadySettled");
            expect(await f.hunt.reserved()).to.equal(E("10000"));

            await expect(f.hunt.collect(tokens.alice)).to.emit(f.hunt, "Collected").withArgs(r.id, tokens.alice, f.alice.address, E("5000"));
            await expect(f.hunt.collect(tokens.bob)).to.emit(f.hunt, "Collected").withArgs(r.id, tokens.bob, f.bob.address, E("5000"));
            await expect(f.hunt.collect(tokens.carol)).to.emit(f.hunt, "Collected").withArgs(r.id, tokens.carol, f.carol.address, 0);
            await expect(f.hunt.collect(tokens.alice)).to.be.revertedWithCustomError(f.hunt, "AlreadyCollected");
            for (const who of [f.alice, f.bob, f.carol]) expect(await f.ron.balanceOf(who.address)).to.be.gt(0); // three finders: RON for all

            for (const who of [f.alice, f.bob]) {
                const before = await f.rdln.balanceOf(who.address);
                await f.hunt.connect(who).withdraw();
                expect(await f.rdln.balanceOf(who.address) - before).to.be.within(E("4950"), E("5000")); // transfer burn may be on
            }
            await expect(f.hunt.connect(f.carol).withdraw()).to.be.revertedWithCustomError(f.hunt, "NothingOwed");
            expect(await f.hunt.reserved()).to.equal(0);
        });

        it("a lone first finder takes the whole pot but earns no RON; the share goes to whoever holds the token", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            const a = await mintTo(f, f.alice, r.id);
            await attempt(f, f.alice, a, "keyboard");
            await claim(f, f.alice, a, r.cache);
            await time.increase(15 * 86400);
            await expect(f.hunt.settle(r.id)).to.emit(f.hunt, "Settled").withArgs(r.id, E("10000"), 0, 0);
            await f.nft.connect(f.alice).transferFrom(f.alice.address, f.bob.address, a);
            await expect(f.hunt.collect(a)).to.emit(f.hunt, "Collected").withArgs(r.id, a, f.bob.address, E("10000"));
            expect(await f.hunt.owed(f.bob.address)).to.equal(E("10000"));
            expect(await f.ron.balanceOf(f.bob.address)).to.equal(0);
        });

        it("an unsolved riddle keeps its pot; sweep cannot touch it; RON failure does not block collect", async function () {
            const f = await loadFixture(fixture);
            const r = await releaseAndOpen(f);
            const free = await f.hunt.available();
            await expect(f.hunt.connect(f.admin).sweep(f.admin.address, free + 1n)).to.be.revertedWith("reserved");
            await f.hunt.connect(f.admin).sweep(f.admin.address, free);
            expect(await f.hunt.reserved()).to.equal(E("10000"));

            const a = await mintTo(f, f.alice, r.id);
            const b = await mintTo(f, f.bob, r.id);
            await attempt(f, f.alice, a, "keyboard");
            await attempt(f, f.bob, b, "keyboard");
            await claim(f, f.alice, a, r.cache);
            await claim(f, f.bob, b, r.cache);
            await time.increase(15 * 86400);
            await f.hunt.settle(r.id);
            await f.ron.revokeRole(await f.ron.GAME_ROLE(), f.huntAddress);
            await expect(f.hunt.collect(a)).to.emit(f.hunt, "RONAwardFailed").withArgs(r.id, f.alice.address);
            expect(await f.hunt.owed(f.alice.address)).to.equal(E("5000"));
        });
    });

    // ------------------------------------------------------------ map, upgrades, misc

    describe("map and upgrades", function () {
        it("verifies fragments against the committed map", async function () {
            const f = await loadFixture(fixture);
            const leaves = Array.from({ length: 16 }, (_, i) => H.keccak_256(new Uint8Array([i])));
            const proof = H.mapProof(f.map, 5).map(H.hex);
            expect(await f.hunt.verifyFragment(H.hex(leaves[5]), proof)).to.equal(true);
            expect(await f.hunt.verifyFragment(H.hex(leaves[6]), proof)).to.equal(false);
            expect(await f.commitments.mapRoot()).to.equal(H.hex(f.map.root));
        });

        it("passes OpenZeppelin's upgrade-safety validation", async function () {
            const f = await loadFixture(fixture);
            await upgrades.validateUpgrade(f.huntAddress, await ethers.getContractFactory("RiddlenHunt"));
            await upgrades.validateUpgrade(await f.nft.getAddress(), await ethers.getContractFactory("HuntNFT"));
        });

        it("cache QR payload round-trips", function () {
            const p = { riddleId: 12, signingKey: H.randomBytes(32), fragmentSecret: H.randomBytes(32) };
            const parsed = H.parseCachePayload(H.formatCachePayload(p));
            expect(parsed.riddleId).to.equal(12);
            expect(H.hex(parsed.signingKey)).to.equal(H.hex(p.signingKey));
            expect(H.parseCachePayload("riddlen://cache?v=1&r=1&k=00")).to.equal(null);
        });

        it("only the game master releases, only admin sets economics", async function () {
            const f = await loadFixture(fixture);
            await expect(f.hunt.connect(f.alice).release("x", 0, Array(8).fill(ethers.id("r")), f.alice.address, "0x", "0x"))
                .to.be.revertedWithCustomError(f.hunt, "AccessControlUnauthorizedAccount");
            await expect(f.hunt.connect(f.alice).setEconomics([0, 0, 0, 0], 0, 0, 0, 0, 1))
                .to.be.revertedWithCustomError(f.hunt, "AccessControlUnauthorizedAccount");
        });
    });
});
