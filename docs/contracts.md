---
layout: default
title: "Contracts and addresses"
description: "Every Riddlen contract on Polygon Amoy, what it does, who holds which role, and how to verify what is deployed."
permalink: /contracts/
redirect_from:
  - /testnet/
  - /archive/2025/testnet/
  - /archive/2025/contracts/
  - /archive/2025/deployment/
  - /deployed-contracts.html
---

# Contracts and addresses

Network: **Polygon Amoy** (chain id 80002). RPC: `https://polygon-amoy-bor-rpc.publicnode.com`.
Explorer: [amoy.polygonscan.com](https://amoy.polygonscan.com). All roles below are held by the
deployer, `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`, until there is a multisig.

## The hunt

| Contract | Address | Notes |
|---|---|---|
| RiddlenHunt (UUPS proxy) | [`0x6A2387CA21d43b1747731Cc506130de3CB73988C`](https://amoy.polygonscan.com/address/0x6A2387CA21d43b1747731Cc506130de3CB73988C) | The game. Holds the pots. Implementation `0x2Ac2E64530287B4F6C9fD461A30aF675ABc373f9`. |
| HuntNFT (UUPS proxy) | [`0x7eDa9C826497cD6a2193A405061327a7f884E16f`](https://amoy.polygonscan.com/address/0x7eDa9C826497cD6a2193A405061327a7f884E16f) | ERC-721 "HUNT". The hunt is its only minter. Metadata served by riddlen.com. |
| HuntCommitments | [`0x5d78AC1Db893F783AE2431EAb0A837b67BD02FF6`](https://amoy.polygonscan.com/address/0x5d78AC1Db893F783AE2431EAb0A837b67BD02FF6) | Immutable, no owner: map root, prize commitment, launch, price floor, halving, total riddles. Placeholder map and prize on testnet. |

Deployed 2026-09-27. Two earlier deployments the same day (`0x18aD…1902` and `0xDc51…544f`) are
abandoned and swept; they predate the rank-based shares and the pot-based price.

## Tokens

| Contract | Address | Notes |
|---|---|---|
| RDLN (UUPS proxy) | [`0x133029184EC460F661d05b0dC57BFC916b4AB0eB`](https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB) | The game token. Implementation `0xe5A4e3EbaE1878b860cC440744442D5718Beb014` since 2026-09-27: every game payment splits 25% burn / 25% grand prize / 25% treasury / 25% liquidity. The hunt and the retired first game hold `GAME_ROLE`. |
| RON (UUPS proxy) | [`0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`](https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635) | Soulbound reputation. The hunt holds `GAME_ROLE`. |
| RDLNFaucet | [`0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E`](https://amoy.polygonscan.com/address/0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E) | Testnet only. 500 RDLN once per wallet. |

Wallets the split pays into on Amoy: grand prize and treasury are the deployer; the liquidity
reserve is `0xa9Cd5a6b1726436d144dF0FF583Ff72a7CF05abD`.

## Retired and earlier contracts

Live on Amoy, not part of the hunt.

| Contract | Address | Notes |
|---|---|---|
| StumpTheMachine (proxy) | [`0x660cEF782AEc87b0667De610B2077A9A4B81dB14`](https://amoy.polygonscan.com/address/0x660cEF782AEc87b0667De610B2077A9A4B81dB14) | The first game, retired September 2026. Anything it owes can be withdrawn from the dashboard at riddlen.com. See the [Stump archive](/archive/stump/). |
| RiddleNFTAdvanced (proxy) | `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3` | 2025 design, never played |
| RiddlenAirdrop | `0x330275259AfCeC8822A861ecbbdfD026dB1B0A13` | 2025 design |
| RiddlenOracleNetwork (proxy) | `0xBd005201294984eFf3c353c32c9E5a96Fd640493` | 2025 design |
| RiddleGroupManager | `0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899` | 2025 design |
| GroupCompositionValidator | `0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6` | 2025 design |
| RiddlenDevlog | `0x71b1544C4E0F8a07eeAEbBe72E2368d32bAaA11d` | On-chain blog |

## Verifying what is deployed

The proxies follow ERC-1967. To read the implementation behind one:

```bash
cast storage <proxy> 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc \
  --rpc-url https://polygon-amoy-bor-rpc.publicnode.com
```

To check the hunt's state without the site:

```bash
cd contracts && npx hardhat run scripts/hunt/status.js --network amoy
```

Source is in the [repository](https://github.com/RiddlenBaba/Riddlen): the hunt under
`contracts/contracts/hunt/`, the token as deployed under `contracts/contracts/token/RDLNSplit.sol`,
and the RON source as deployed under `contracts/contracts/mocks/deployed/RONAdvanced.sol`. The
test suite plays the whole hunt against those copies.
