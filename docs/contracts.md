---
layout: default
title: "Contracts and addresses"
description: "Every Riddlen contract on Polygon Amoy, what it does, and how to verify what is deployed."
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
Explorer: [amoy.polygonscan.com](https://amoy.polygonscan.com).

## The first game (retired from the site)

| Contract | Address | Notes |
|---|---|---|
| StumpTheMachine (proxy) | [`0x660cEF782AEc87b0667De610B2077A9A4B81dB14`](https://amoy.polygonscan.com/address/0x660cEF782AEc87b0667De610B2077A9A4B81dB14) | Stump the Machine, retired September 2026. Still holds its pots; anything owed can be withdrawn from the dashboard. |
| Implementation | `0x963707Fc16F0c3E3f660654dD906cfA41bf567d3` | Upgraded 2026-09-27 to accept alternative answers |
| RDLNFaucet | [`0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E`](https://amoy.polygonscan.com/address/0xb6860Af03bb0FbD9b63322a7EbDaC29fd9aB7f7E) | Testnet only. 500 RDLN once per wallet. |

Roles on the game: `ADMIN_ROLE`, `UPGRADER_ROLE` and `GAME_MASTER_ROLE` are held by the deployer
`0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`.

## The hunt

| Contract | Address | Notes |
|---|---|---|
| RiddlenHunt (proxy) | [`0x6A2387CA21d43b1747731Cc506130de3CB73988C`](https://amoy.polygonscan.com/address/0x6A2387CA21d43b1747731Cc506130de3CB73988C) | The hunt. UUPS upgradeable. Holds the pots. Implementation `0x2Ac2E64530287B4F6C9fD461A30aF675ABc373f9`. |
| HuntNFT (proxy) | [`0x7eDa9C826497cD6a2193A405061327a7f884E16f`](https://amoy.polygonscan.com/address/0x7eDa9C826497cD6a2193A405061327a7f884E16f) | ERC-721 "HUNT". The hunt is its minter. |
| HuntCommitments | [`0x5d78AC1Db893F783AE2431EAb0A837b67BD02FF6`](https://amoy.polygonscan.com/address/0x5d78AC1Db893F783AE2431EAb0A837b67BD02FF6) | Immutable: map root, prize commitment, launch, price, halving, total. Placeholder map on testnet. |

Deployed 2026-09-27 (redeployed twice the same day, for rank-based shares and then pot-based pricing; the earlier deployments at `0x18aD…1902` and `0xDc51…544f` are abandoned and swept). Roles held by the deployer as above. See [Playing the hunt](/hunt/).

## Tokens

| Contract | Address | Notes |
|---|---|---|
| RDLN (proxy) | [`0x133029184EC460F661d05b0dC57BFC916b4AB0eB`](https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB) | ERC-20 with the game split (25% burn / 25% grand prize / 25% treasury / 25% liquidity since 2026-09-27; implementation `0xe5A4e3EbaE1878b860cC440744442D5718Beb014`). Both games hold `GAME_ROLE`. |
| RON (proxy) | [`0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`](https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635) | Non-transferable reputation. The game holds `GAME_ROLE`. |

## Earlier contracts

These were deployed for the 2025 design. They are live but not part of the current game.

| Contract | Address |
|---|---|
| RiddleNFTAdvanced (proxy) | `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3` |
| RiddlenAirdrop | `0x330275259AfCeC8822A861ecbbdfD026dB1B0A13` |
| RiddlenOracleNetwork (proxy) | `0xBd005201294984eFf3c353c32c9E5a96Fd640493` |
| RiddleGroupManager | `0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899` |
| GroupCompositionValidator | `0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6` |
| RiddlenDevlog | `0x71b1544C4E0F8a07eeAEbBe72E2368d32bAaA11d` |

## Verifying what is deployed

The proxies follow ERC-1967. To read the implementation behind one:

```bash
cast storage <proxy> 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc \
  --rpc-url https://polygon-amoy-bor-rpc.publicnode.com
```

To check the game's state without the site:

```bash
cd contracts && npx hardhat run scripts/stump/status.js --network amoy
cd contracts && npx hardhat run scripts/hunt/status.js --network amoy
```

Source for everything is in the [repository](https://github.com/RiddlenBaba/Riddlen) under
`contracts/contracts/nft/StumpTheMachine.sol`, `contracts/contracts/hunt/` and `contracts/contracts/mocks/RDLNFaucet.sol`.
The deployed RDLN and RON sources are kept verbatim under `contracts/contracts/mocks/deployed/`
and the test suite plays a full round against them.
