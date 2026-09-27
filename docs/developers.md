---
layout: default
title: "For developers"
description: "Reading and writing the RiddlenHunt contract from your own code: functions, events, the answer trees, the claim signature and the ciphers."
permalink: /developers/
redirect_from:
  - /FRONTEND_INTEGRATION.html
  - /archive/2025/FRONTEND_INTEGRATION.html
  - /archive/2025/api/
  - /api/
---

# For developers

The hunt is three contracts with a small surface: `RiddlenHunt` (the game), `HuntNFT` (a plain
ERC-721) and `HuntCommitments` (immutables). Anything the site does, you can do from a script or
your own front end. Addresses are on [Contracts](/contracts/). Source is under
`contracts/contracts/hunt/` in the [repository](https://github.com/RiddlenBaba/Riddlen).

## Reading

```solidity
function riddleCount() external view returns (uint256);
function getRiddle(uint256 id) external view returns (Riddle memory);   // text, pot, nftCount, minted,
    // claimCount, opened, complete, booked, claimFee, attemptStep, priceBps, harmonic, cacheSigner,
    // altRoots[8], locationCipher, firstTokenId, lastClaimTokenId, commitBlock, releasedAt, firstClaimAt
function getToken(uint256 tokenId) external view returns (TokenState memory); // riddleId, index, attempts,
    // unlockedAt, claimedAt, rank, released, share
function mintPriceFor(uint256 id) external view returns (uint256);      // 0 until opened
function priceFloor() external view returns (uint256);
function shareFor(uint256 id, uint256 rank) external view returns (uint256);
function tokenAtRank(uint256 id, uint256 rank) external view returns (uint256);
function owed(address who) external view returns (uint256);
function verifyFragment(bytes32 fragmentHash, bytes32[] proof) external view returns (bool);
// HuntNFT
function tokensOf(address owner) external view returns (uint256[]);
function tokenURI(uint256 id) external view returns (string);
```

## Writing

```solidity
function open(uint256 id) external;                                  // anyone, after revealDelay blocks
function mint(uint256 id) external returns (uint256 tokenId);
function attempt(uint256 tokenId, uint8 alt, bytes32 leaf, bytes32[10] proof) external returns (bool unlocked);
function claim(uint256 tokenId, bytes signature) external;
function withdraw() external;
```

Every payment goes through `RDLN.burnNFTMint(msg.sender, amount)`, which the game calls; you
never approve anything. The wallet needs the RDLN and a little POL.

## Events

`RiddleReleased(id, difficulty, pot, cacheSigner, commitBlock, fragmentCipher)`,
`RiddleOpened(id, nftCount, seed, fallbackSeed)`, `Minted(id, tokenId, to, index, price)`,
`Attempted(id, tokenId, by, attempts, cost, unlocked)`, `Claimed(id, tokenId, by, rank, share)`,
`Released(id, tokenId, to, amount)`, `RiddleComplete(id)`, `Rekeyed(id, cacheSigner, fragmentCipher)`,
`Withdrawn(to, amount)`.

The fragment ciphertext is only in `RiddleReleased` and `Rekeyed`; the contract stores its hash.

## Building a guess

The reference implementation is `contracts/scripts/hunt/lib/huntCrypto.js`, kept identical to
`web/lib/hunt.js` by a cross-check test. To submit a guess for token `t` on riddle `id`:

1. Canonical form: NFKC, lowercase, whitespace collapsed, surrounding quotes and trailing
   `.!?` stripped, a leading a/an/the dropped.
2. `H = PBKDF2-SHA256(canonical, salt = "riddlen-hunt:<chainId>:<hunt address lowercase>:<id>", 600000 rounds, 32 bytes)`.
3. Leaf at position `i` (the token's `index`): `keccak256(abi.encode(uint256 id, uint256 i, bytes32 H))`.
   Build all 1,024 leaves for the same `H`, hash each once (`keccak256(leaf)`), and build the tree
   pairwise; the root is one of the riddle's `altRoots`. Which slot tells you `alt`.
4. Submit `attempt(t, alt, leaf_i, siblings)` with the ten siblings from position `i` upward.
   The contract recomputes the root positionally, so nobody can replay your calldata on another
   token.

If `unlocked` is true, decrypt the location: the first 8 × 60 bytes of `locationCipher` are wraps
of a random key, one per accepted answer, each `AES-256-GCM(HKDF-SHA256(H, salt = id, info =
"riddlen-hunt/wrap"), key)` as `iv(12) ‖ ciphertext(32) ‖ tag(16)`; the rest is `iv ‖ AES-GCM(key,
clue)`. Try every wrap with your `H`.

## Claiming

The code at the place is `riddlen://cache?v=1&r=<id>&k=<32-byte signing key hex>&s=<32-byte fragment secret hex>`.
Sign EIP-712 typed data with the signing key and send only the signature:

```
domain: { name: "Riddlen Hunt", version: "1", chainId, verifyingContract: <hunt> }
Claim(uint256 riddleId, uint256 tokenId, address owner)   // owner = msg.sender of claim()
```

Then decrypt the fragment: `AES-GCM(HKDF-SHA256(fragmentSecret, salt = id, info = "riddlen-hunt/fragment"), …)`
over the ciphertext from the release event. `verifyFragment(keccak256(fragment), proof)` checks it
against the committed map, given the proof from the house's manifest.

## Shares

`share(k) = pot × 1e18 ÷ (k × harmonic)` where `harmonic = Σ_{i=1..N} floor(1e18 / i)`, and the
last rank takes `pot − booked` so rounding never strands anything. A share is booked at `claim`
and released to the token's holder at the next `claim` on that riddle, or at completion.

## Running it yourself

```bash
cd contracts && npm install --package-lock=false
npx hardhat test test/RiddlenHunt.test.js test/hunt.crosscheck.test.js
./scripts/hunt/rehearse-local.sh        # the whole loop on a local node
```
