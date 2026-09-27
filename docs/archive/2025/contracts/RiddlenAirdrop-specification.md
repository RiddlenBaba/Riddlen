# RiddlenAirdrop Contract Specification

## Overview

The RiddlenAirdrop contract implements the two-phase airdrop system defined in Riddlen Protocol v5.2. It distributes 100M RDLN tokens across two distinct phases targeting different user segments and objectives.

## Architecture

**Contract Type**: UUPS Upgradeable Proxy
**Security Features**: Access Control, Pausable, Reentrancy Guard
**Total Allocation**: 100,000,000 RDLN (10% of total supply)

## Phase 1: Early Adoption Incentive

### Allocation
- **Total**: 50,000,000 RDLN
- **Per Wallet**: 10,000 RDLN
- **Participants**: First 5,000 wallets

### Requirements
1. **Social Proof Verification**:
   - Follow @RiddlenToken on Twitter/X
   - Share announcement post with hashtag
   - Join Telegram community group
   - Wallet verification through platform

2. **Sybil Resistance**:
   - One claim per wallet address
   - Manual operator verification of social proof
   - First-come, first-served basis

### Process Flow
```
User Submits Social Proof → Operator Verification → Claim Eligibility → Token Distribution
```

## Phase 2: Merit-Based RON Airdrop

### Allocation
- **Total**: 50,000,000 RDLN
- **Distribution**: Tiered based on RON reputation

### RON Tier Structure
| RON Range | Tier | RDLN Reward |
|-----------|------|-------------|
| 1,000-4,999 | 1 | 5,000 RDLN |
| 5,000-9,999 | 2 | 10,000 RDLN |
| 10,000-24,999 | 3 | 15,000 RDLN |
| 25,000+ | 4 | 20,000 RDLN |

### Requirements
- **Minimum RON**: 1,000 reputation tokens
- **Active Participation**: Demonstrated platform engagement
- **Single Claim**: One claim per qualified wallet
- **Ongoing Eligibility**: No deadline for claiming

## Smart Contract Interface

### Core Functions

#### Phase 1 Functions
```solidity
function submitSocialProof(string twitterHandle, string telegramHandle) external
function verifySocialProof(address user, bool twitter, bool telegram, bool share) external
function claimPhase1() external
```

#### Phase 2 Functions
```solidity
function calculatePhase2Reward(uint256 ronBalance) external view returns (uint256, uint8)
function claimPhase2() external
```

#### Admin Functions
```solidity
function setPhaseActive(uint8 phase, bool active) external
function emergencyWithdraw(address to, uint256 amount) external
function pause() external
function unpause() external
```

#### View Functions
```solidity
function getPhase1Status(address user) external view returns (bool, bool, bool)
function getPhase2Status(address user) external view returns (bool, bool, uint256, uint256, uint8)
function getAirdropStats() external view returns (uint256, uint256, uint256)
```

## Security Features

### Access Control
- **ADMIN_ROLE**: Phase management, emergency functions, upgrades
- **OPERATOR_ROLE**: Social proof verification
- **Multi-signature**: Recommended for admin operations

### Anti-Gaming Mechanisms
- **Double-claim Prevention**: Permanent tracking per wallet
- **Social Proof Verification**: Manual operator validation
- **RON Balance Checks**: Real-time reputation verification
- **Pause Functionality**: Emergency stop capability

### Upgrade Safety
- **UUPS Pattern**: Secure upgrade mechanism
- **State Preservation**: Maintains all user data across upgrades
- **Authorization**: Only ADMIN_ROLE can authorize upgrades

## Integration Requirements

### Prerequisites
1. **RDLN Token**: ERC-20 contract for token distribution
2. **RON Token**: Reputation contract for Phase 2 eligibility
3. **Social Verification**: Off-chain systems for Twitter/Telegram validation

### Deployment Steps
1. Deploy airdrop contract with token addresses
2. Fund contract with 100M RDLN tokens
3. Grant OPERATOR_ROLE to verification addresses
4. Activate phases when ready

### Operational Workflow

#### Phase 1 Operations
```bash
# User submits social proof
submitSocialProof("username", "telegram_username")

# Operator verifies after checking social media
verifySocialProof(userAddress, true, true, true)

# User claims tokens
claimPhase1()
```

#### Phase 2 Operations
```bash
# Check user eligibility (automatic)
getPhase2Status(userAddress)

# User claims based on RON tier (automatic calculation)
claimPhase2()
```

## Gas Optimization

### Efficient Storage
- Packed structs for social proof data
- Mapping-based tracking for O(1) lookups
- Minimal state changes per transaction

### Batch Operations
- Social proof verification can be batched
- Emergency operations support bulk actions
- View functions optimized for off-chain queries

## Deployment Configuration

### Environment Variables
```bash
RDLN_TOKEN_ADDRESS=0x...  # Deployed RDLN contract
RON_TOKEN_ADDRESS=0x...   # Deployed RON contract
ADMIN_ADDRESS=0x...       # Multi-sig admin address
```

### Network Support
- **Primary**: Polygon Mainnet
- **Testing**: Amoy Testnet
- **Backup**: Mumbai Testnet

## Economic Impact

### Phase 1 Economics
- **Goal**: Rapid user acquisition and social proof
- **Cost**: 50M RDLN distributed to 5,000 early users
- **Benefits**: Viral marketing, community building, early engagement

### Phase 2 Economics
- **Goal**: Reward merit and platform engagement
- **Cost**: 50M RDLN distributed to RON holders
- **Benefits**: RON value demonstration, long-term retention, quality users

### Sustainability
- **10% Total Supply**: Reasonable allocation for growth
- **Merit-Based Distribution**: Ensures tokens go to engaged users
- **One-time Claims**: Prevents ongoing inflation pressure

## Monitoring & Analytics

### Key Metrics
- Phase 1 participation rate and timeline
- Social proof verification success rate
- Phase 2 RON tier distribution
- Geographic and demographic analysis

### Dashboard Requirements
- Real-time claim tracking
- RON tier analytics
- Social verification metrics
- Token distribution visualization

## Risk Assessment

### Technical Risks
- **Smart Contract Bugs**: Mitigated by comprehensive testing
- **Upgrade Failures**: Protected by UUPS safety mechanisms
- **Social Engineering**: Reduced by manual verification

### Economic Risks
- **Sybil Attacks**: Prevented by social proof requirements
- **Market Manipulation**: Limited by one-claim-per-wallet
- **Liquidity Impact**: Managed through phased distribution

### Operational Risks
- **Verification Bottlenecks**: Addressed by multiple operators
- **User Experience**: Simplified through clear documentation
- **Scalability**: Designed for 5,000+ concurrent users

## Future Enhancements

### Potential Upgrades
- **Automated Social Verification**: API integration for social platforms
- **Cross-chain Distribution**: Multi-network airdrop support
- **Dynamic Tier Adjustments**: Algorithmic reward optimization
- **Governance Integration**: Community-controlled parameters

### Integration Opportunities
- **DeFi Protocols**: Airdrop token staking/farming
- **NFT Platforms**: Exclusive access for airdrop recipients
- **Oracle Network**: Early access for Phase 2 participants
- **Gaming Features**: Airdrop tokens as in-game currency

---

**Contract Version**: 1.0.0
**Specification Version**: 5.2
**Last Updated**: September 29, 2025
**Audit Status**: Internal review completed, professional audit pending