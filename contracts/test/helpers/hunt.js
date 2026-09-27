const { ethers, upgrades } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
const H = require("../../scripts/hunt/lib/huntCrypto");

// Shared fixture and helpers for the RiddlenHunt tests. Runs against the copies of the RDLN and
// RON sources live on Amoy (contracts/mocks/deployed/), so the Amoy deployment holds no surprises.

const E = ethers.parseEther;
const FAST = 1000; // PBKDF2 iterations in tests (600k in production; the contract never sees it)

async function deployHunt({ totalRiddles = 1000, minReleaseSpacing = 0, basePrice = E("100"), mapRoot, prizeCommitment } = {}) {
    const [admin, treasury, liquidity, airdrop, grand, devops, gm, alice, bob, carol] = await ethers.getSigners();
    const rdln = await upgrades.deployProxy(await ethers.getContractFactory("RDLNDeployed"),
        [admin.address, treasury.address, liquidity.address, airdrop.address, grand.address, devops.address]);
    const ron = await upgrades.deployProxy(await ethers.getContractFactory("RONAdvanced"), [admin.address, 7200, 80, 30]);

    const map = mapRoot ? null : H.buildMapTree(Array.from({ length: 16 }, (_, i) => H.keccak_256(new Uint8Array([i]))));
    const launchAt = (await ethers.provider.getBlock("latest")).timestamp;
    const commitments = await (await ethers.getContractFactory("HuntCommitments")).deploy(
        mapRoot || H.hex(map.root), prizeCommitment || ethers.id("prize"), launchAt, basePrice,
        730 * 86400, totalRiddles, minReleaseSpacing);

    const nft = await upgrades.deployProxy(await ethers.getContractFactory("HuntNFT"), [admin.address, "https://riddlen.com/api/token/"]);
    const hunt = await upgrades.deployProxy(await ethers.getContractFactory("RiddlenHunt"), [
        admin.address, await rdln.getAddress(), await ron.getAddress(), await nft.getAddress(), await commitments.getAddress(),
    ]);
    const huntAddress = await hunt.getAddress();
    await nft.grantRole(await nft.MINTER_ROLE(), huntAddress);
    await rdln.grantRole(await rdln.GAME_ROLE(), huntAddress);
    await ron.grantRole(await ron.GAME_ROLE(), huntAddress);
    await hunt.grantRole(await hunt.GAME_MASTER_ROLE(), gm.address);
    await rdln.mintPrizePool(huntAddress, E("500000"));
    for (const p of [alice, bob, carol]) await rdln.mintPrizePool(p.address, E("5000"));
    const chainId = Number((await ethers.provider.getNetwork()).chainId);
    return { rdln, ron, nft, hunt, huntAddress, commitments, chainId, map, admin, treasury, grand, gm, alice, bob, carol };
}

/** Everything the house prepares for one riddle. */
async function prepareRiddle({ chainId, huntAddress, riddleId, answers = ["keyboard"], location = "Under the third bench, Elk store", fragment }) {
    const hashes = [];
    for (const a of answers) hashes.push(await H.answerHash({ chainId, hunt: huntAddress, riddleId, answer: a, iterations: FAST }));
    const roots = H.altRoots(riddleId, hashes);
    const cache = ethers.Wallet.createRandom();
    const fragmentSecret = H.randomBytes(32);
    const fragmentBytes = fragment || new TextEncoder().encode(`fragment ${riddleId}`);
    const locationCipher = await H.encryptLocation({ riddleId, hashes, location });
    const fragmentCipher = await H.encryptFragment({ riddleId, fragmentSecret, fragment: fragmentBytes });
    return { hashes, roots: roots.map(H.hex), cache, fragmentSecret, locationCipher, fragmentCipher, location, fragmentBytes, answers };
}

async function release(f, spec = {}) {
    const riddleId = Number(await f.hunt.riddleCount()) + 1;
    const r = await prepareRiddle({ chainId: f.chainId, huntAddress: f.huntAddress, riddleId, ...spec });
    const tx = await f.hunt.connect(f.gm).release(spec.text || `Riddle ${riddleId}`, spec.difficulty ?? 0,
        r.roots, r.cache.address, H.hex(r.locationCipher), H.hex(r.fragmentCipher));
    await tx.wait();
    return { id: riddleId, ...r };
}

async function releaseAndOpen(f, spec = {}) {
    const r = await release(f, spec);
    await mine(Number(await f.hunt.revealDelay()) + 1);
    await (await f.hunt.open(r.id)).wait();
    return r;
}

async function mintTo(f, signer, id) {
    await (await f.hunt.connect(signer).mint(id)).wait();
    return (await f.nft.nextId()) - 1n;
}

/** Build a guess for a token the way the site would: slow hash, own subtree, positional proof. */
async function guess(f, tokenId, answer, alt = 0) {
    const t = await f.hunt.getToken(tokenId);
    const Hh = await H.answerHash({ chainId: f.chainId, hunt: f.huntAddress, riddleId: Number(t.riddleId), answer, iterations: FAST });
    const a = H.attemptFor(Number(t.riddleId), Number(t.index), Hh, alt);
    return { alt: a.alt, leaf: H.hex(a.leaf), proof: a.proof.map(H.hex), H: Hh };
}

async function attempt(f, signer, tokenId, answer, alt = 0) {
    const g = await guess(f, tokenId, answer, alt);
    return f.hunt.connect(signer).attempt(tokenId, g.alt, g.leaf, g.proof);
}

async function signClaim(f, cache, tokenId, owner, overrides = {}) {
    const t = await f.hunt.getToken(tokenId);
    const td = H.claimTypedData({ chainId: f.chainId, hunt: f.huntAddress, riddleId: Number(t.riddleId), tokenId, owner, ...overrides });
    if (overrides.domain) Object.assign(td.domain, overrides.domain);
    return cache.signTypedData(td.domain, td.types, td.message);
}

async function claim(f, signer, tokenId, cache) {
    return f.hunt.connect(signer).claim(tokenId, await signClaim(f, cache, tokenId, signer.address));
}

module.exports = { E, FAST, H, deployHunt, prepareRiddle, release, releaseAndOpen, mintTo, guess, attempt, signClaim, claim };
