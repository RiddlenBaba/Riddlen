# Deployed Contracts Documentation

## Current Testnet Deployment (v5.2+)

### Network: Polygon Amoy Testnet
**Chain ID**: 80002
**Deployer**: `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`
**Status**: ✅ Live and operational
**Last Updated**: 2025-10-02

---

## Active Contracts (7 Total)

### 1. RDLN Token (Utility Token)
- **Address**: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **Contract**: `RDLNUpgradeable.sol`
- **Type**: ERC-20 Upgradeable (UUPS)
- **PolygonScan**: https://amoy.polygonscan.com/address/0x133029184EC460F661d05b0dC57BFC916b4AB0eB

**Features**:
- ✅ Rug-proof treasury (1M RDLN monthly, max 5M emergency)
- ✅ Progressive burn mechanics for riddle failures
- ✅ Biennial halving economics (730 days)
- ✅ Game contract integration (RiddleNFT, Airdrop, Oracle)
- ✅ RON reputation system integration
- ✅ UUPS upgradeable architecture

### 2. RON Token (Reputation System)
- **Address**: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **Contract**: `RONUpgradeable.sol`
- **Type**: Soul-bound Token (Non-transferable, UUPS)
- **PolygonScan**: https://amoy.polygonscan.com/address/0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635

**Features**:
- ✅ Soul-bound (non-transferable) reputation
- ✅ Tier-based access (Novice → Solver → Expert → Oracle)
- ✅ Adjustable rewards system
- ✅ Group mechanics integration
- ⏳ **Pending**: ERC20Votes for DAO governance

**Access Tiers**:
- Novice: 0-999 RON
- Solver: 1,000-9,999 RON
- Expert: 10,000-99,999 RON
- Oracle: 100,000+ RON

### 3. RiddleNFT (Core Game System)
- **Address**: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`
- **Contract**: `RiddleNFTAdvanced.sol`
- **Type**: ERC-721 Upgradeable (UUPS)
- **Version**: V1 (ready for V2 upgrade)
- **PolygonScan**: https://amoy.polygonscan.com/address/0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3

**Features**:
- ✅ NFT-as-game sessions (revolutionary approach)
- ✅ Tiered reward system (2x/1x/0.5x multipliers)
- ✅ Progressive difficulty levels (EASY → LEGENDARY)
- ✅ Anti-cheat mechanisms (30s minimum solve time)
- ✅ RON reputation integration
- ⏳ **V2 Ready**: Era costs, progressive pricing, user submissions, group conversion

### 4. RiddlenAirdrop (Token Distribution)
- **Address**: `0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b`
- **Contract**: `RiddlenAirdrop.sol`
- **Type**: Upgradeable (UUPS)
- **PolygonScan**: https://amoy.polygonscan.com/address/0x8345ba8DA61F0192BF421B8A039BC972F3f74d4b

**Features**:
- ✅ Social proof verification (Twitter, Telegram, GitHub)
- ✅ Anti-Sybil protection with cooldowns
- ✅ Tiered allocation system
- ✅ Security audit complete (v6)
- ✅ Merkle tree distribution

### 5. Group Composition Validator
- **Address**: `0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6`
- **Contract**: `GroupCompositionValidator.sol`
- **Type**: Non-upgradeable
- **Deployed**: 2025-09-29
- **PolygonScan**: https://amoy.polygonscan.com/address/0xC058fdB7b4B5062EC844bF97c45bdD28bdcf6CE6

**Features**:
- ✅ Validates group member balance and composition
- ✅ Ensures fair group dynamics
- ✅ Tier-based validation rules
- ✅ Prevents gaming through composition manipulation

### 6. Riddle Group Manager
- **Address**: `0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899`
- **Contract**: `RiddleGroupManager.sol`
- **Type**: Non-upgradeable
- **Deployed**: 2025-09-29
- **PolygonScan**: https://amoy.polygonscan.com/address/0xEBcEf4745A2514FE61f5847a1e66a9Ced0331899

**Features**:
- ✅ Group creation and management
- ✅ Era-locked cost inheritance from NFTs
- ✅ RON dilution mechanics (voting power split across active groups)
- ✅ Group lifecycle (FORMING → RESERVED → ACTIVE → COMPLETED)
- ✅ Integration with NFT V2 (when upgraded)
- ✅ GAME_ROLE granted on RON contract

**Group Mechanics**:
- Min size: 3 members
- Max size: 11 members
- Formation timeout: 7 days
- Disband fee: 10 RDLN

### 7. Riddlen Oracle Network
- **Proxy Address**: `0xBd005201294984eFf3c353c32c9E5a96Fd640493`
- **Implementation**: `0xDD7431210ff102b0ff335ddd674C0938AE814BDf`
- **Contract**: `RiddlenOracleNetwork.sol`
- **Type**: UUPS Upgradeable
- **Deployed**: 2025-10-01
- **PolygonScan**: https://amoy.polygonscan.com/address/0xBd005201294984eFf3c353c32c9E5a96Fd640493

**Features**:
- ✅ Professional validation services
- ✅ Multi-tier request system (BASIC, STANDARD, PREMIUM, ENTERPRISE)
- ✅ RON-based access control
- ✅ Request/response lifecycle management
- ✅ Treasury and buyback wallets configured
- ✅ Daily request limits (1,000 per day)
- ✅ Protocol fee system (10%)

---

## Ready to Deploy (Not Yet on Amoy)

### RiddleNFT V2 Upgrade
- **Contract**: `RiddleNFTAdvancedV2_Comprehensive.sol`
- **Status**: ✅ Audited, ready for upgrade
- **Features**:
  - Era-locked cost system (costs locked at mint time)
  - Progressive attempt/submission pricing
  - User question submissions
  - Group NFT conversion
  - Full backward compatibility with V1
- **Audit**: See `AUDIT_REPORT_V2_COMPREHENSIVE.md`

### RiddlenDAO (Governance)
- **Contract**: `RiddlenDAO.sol`
- **Status**: ✅ Built, waiting for RON upgrade
- **Blocker**: Requires RON to implement ERC20Votes
- **Features**:
  - Founder role system (transferable/dissolvable)
  - Biennial proposal threshold halving (10K → 5K → 2.5K RON)
  - Progressive quorum (5% → 15%)
  - Three-phase governance transition
- **Docs**: See `archive/docs/DAO_SYSTEM_COMPLETE.md`

---

## Contract Relationships

```
┌─────────────────────────────────────────────────────┐
│                   RDLN Token (1)                     │
│              Utility Token System                    │
└──────┬────────────┬─────────────┬───────────────────┘
       │            │             │
       ▼            ▼             ▼
┌──────────┐ ┌──────────┐  ┌──────────┐
│ RiddleNFT│ │ Airdrop  │  │  Oracle  │
│    (3)   │ │   (4)    │  │   (7)    │
└────┬─────┘ └──────────┘  └──────────┘
     │
     │ V2 Upgrade
     ▼
┌──────────────┐
│ GroupManager │
│     (6)      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Validator   │
│     (5)      │
└──────────────┘

┌─────────────────────┐
│    RON Token (2)    │
│  Reputation System  │
└─────────────────────┘
       │
       │ (GAME_ROLE granted to GroupManager)
       │ (Pending: ERC20Votes for DAO)
       │
       ▼
┌──────────────┐
│ RiddlenDAO   │
│ (Not deployed)│
└──────────────┘
```

---

## Deployment History

### v5.2+ Oracle (2025-10-01)
- Deployed RiddlenOracleNetwork with UUPS proxy
- Configured treasury and buyback wallets
- Set daily limits and protocol fees

### v5.2 Groups (2025-09-29)
- Deployed GroupManager + Validator
- Granted GAME_ROLE to GroupManager on RON
- Verified integration with existing contracts

### v5.1 Core System
- RDLN, RON, Airdrop, NFT V1
- Initial ecosystem deployment

---

## Admin/Deployer

**Address**: `0x73a7f88ccdF7E172EcAb321500cb7C77C81fD040`

**Roles Granted**:
- DEFAULT_ADMIN_ROLE on all contracts
- UPGRADER_ROLE on upgradeable contracts
- GAME_ROLE (RON) granted to GroupManager
- NFT_CONTRACT_ROLE (GroupManager) to be granted to NFT after V2 upgrade

---

## Upgrade Path & Next Steps

### High Priority
1. ✅ **Complete** - Oracle deployed
2. ⏳ **Pending** - Upgrade RiddleNFT to V2 (RiddleNFTAdvancedV2_Comprehensive)
3. ⏳ **Pending** - Grant NFT_CONTRACT_ROLE to NFT on GroupManager
4. ⏳ **Pending** - Add ERC20Votes to RONUpgradeable
5. ⏳ **Pending** - Deploy RiddlenDAO + Timelock

### Medium Priority
- Test group mechanics end-to-end
- Deploy RiddleSubmissionManager (community submissions)
- Integrate frontend with all 7 contracts

### Low Priority
- Mainnet preparation
- Professional security audit
- Bug bounty program

---

## Notes

- All upgradeable contracts use UUPS pattern (not Transparent Proxy)
- Storage gaps preserved for future upgrades
- GroupManager and Validator are non-upgradeable by design (simpler, cheaper)
- RON is soul-bound (non-transferable)
- RDLN has progressive burn mechanisms
- Oracle uses multi-tier access control based on RON reputation

---

**For deployment scripts, see**: `/scripts/deployments/`
**For upgrade instructions, see**: `DEPLOYMENT-INSTRUCTIONS.md`
**For architecture docs, see**: `COMPLETE_ECOSYSTEM_STATUS.md`
