# Riddlen Tokenomics

## Overview

The Riddlen ecosystem is powered by two complementary tokens that work together to create a merit-based economy for human intelligence validation:

- **RDLN**: The primary utility token with deflationary mechanics
- **RON**: Soul-bound reputation tokens for access control

## RDLN Token Economics

### Total Supply & Distribution

- **Total Supply**: 1,000,000,000 RDLN (1 billion tokens)
- **Token Standard**: ERC-20 with custom burn mechanics
- **Decimals**: 18

### Allocation Structure

| Allocation | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| **Riddle Prize Pool** | 700,000,000 RDLN | 70% | Weekly riddle winner rewards |
| **Treasury Reserve** | 100,000,000 RDLN | 10% | Development & operations (1M/month) |
| **Community Airdrop** | 100,000,000 RDLN | 10% | Early adoption incentives |
| **Liquidity Pool** | 100,000,000 RDLN | 10% | DEX liquidity and market stability |

### Grand Prize Pool System

In addition to the core allocations, Riddlen implements a **Grand Prize accumulation system** funded by transaction burns:

- **25% of all transaction burns** → Grand Prize wallet accumulation
- **Quarterly/Annual events** → Massive prize pool distributions
- **Multi-signature security** → 4-of-5 signature requirement for Grand Prize vault
- **Community excitement** → Legendary riddles with unprecedented rewards

### Deflationary Mechanisms

#### 1. Progressive Burn Protocol

The Riddlen protocol implements a unique progressive burn system where costs increase with usage:

**Failed Riddle Attempts:**
- 1st attempt: 1 RDLN burned
- 2nd attempt: 2 RDLN burned
- 3rd attempt: 3 RDLN burned
- Nth attempt: N RDLN burned

**Question Submissions:**
- 1st question: 1 RDLN burned
- 2nd question: 2 RDLN burned
- Nth question: N RDLN burned

#### 2. NFT Minting Burns

NFT minting follows the **biennial halving schedule** as specified in the whitepaper:

**Biennial Halving Schedule:**
```
Years 1-2:   1,000 RDLN per riddle attempt
Years 3-4:     500 RDLN per riddle attempt
Years 5-6:     250 RDLN per riddle attempt
Years 7-8:     125 RDLN per riddle attempt
Years 9-10:     62 RDLN per riddle attempt
Years 11-12:    31 RDLN per riddle attempt
Years 13-14:    15 RDLN per riddle attempt
Years 15-16:     7 RDLN per riddle attempt
Years 17-18:     3 RDLN per riddle attempt
Years 19-20:   1.5 RDLN per riddle attempt (final minimum)
```

**Burn Distribution:** All NFT minting costs follow the standard burn protocol (50% burned, 25% Grand Prize, 25% dev/ops)

#### 3. Transaction Burn Distribution

All transaction burns follow a three-way split supporting ecosystem sustainability:

**Burn Allocation (Per Transaction):**
- **50% Permanently Burned** → Removed from circulation (deflationary pressure)
- **25% Grand Prize Pool** → Accumulates for legendary events
- **25% Dev/Ops Wallet** → Long-term development and operations funding

**Gasless Experience Design:**
The burn mechanism supports a gasless user experience by:
- Reducing total supply through permanent burns
- Building massive Grand Prize pools for community excitement
- Securing sustainable funding for platform development
- Creating economic value that offsets gas subsidization costs

### Prize Pool Economics

#### Weekly Distribution Model

The 700M RDLN prize pool is distributed across 1000 weekly riddles over 20 years:

- **Average Prize per Week**: 700,000 RDLN
- **Prize Range**: Randomized between 100K - 2M RDLN per riddle
- **Winner Slots**: Variable (1-100 winners per riddle)

#### Difficulty-Based Rewards

| Difficulty | Typical Prize Range | Winner Slots |
|------------|-------------------|--------------|
| **Easy** | 100,000 - 300,000 RDLN | 50-100 winners |
| **Medium** | 300,000 - 700,000 RDLN | 20-50 winners |
| **Hard** | 700,000 - 1,500,000 RDLN | 5-20 winners |
| **Legendary** | 1,500,000 - 2,000,000 RDLN | 1-5 winners |

## RON Reputation Economics

### Soul-Bound Token Model

RON tokens are **non-transferable** and can only be earned through demonstrated intelligence:

- Cannot be bought, sold, or traded
- Permanently tied to earning wallet
- Represents proven problem-solving ability
- Anti-Sybil protection against wealth-based gaming

### Access Tier System

| Tier | RON Range | Benefits | Earning Rate |
|------|-----------|----------|--------------|
| **Novice** | 0-999 | Easy riddles only | 10-25 RON per riddle |
| **Solver** | 1,000-9,999 | Easy + Medium riddles | 50-100 RON per riddle |
| **Expert** | 10,000-99,999 | Easy + Medium + Hard | 200-500 RON per riddle |
| **Oracle** | 100,000+ | All riddles + Governance | 1,000+ RON per riddle |

### RON Earning Mechanisms

#### Riddle Solving Rewards

**Base Rewards by Difficulty:**
- Easy: 10-25 RON (average: 17 RON)
- Medium: 50-100 RON (average: 75 RON)
- Hard: 200-500 RON (average: 350 RON)
- Legendary: 1,000-10,000 RON (average: 5,500 RON)

**Performance Multipliers:**
- **First Solver**: 5x base reward
- **Speed Solver**: 1.5x base reward
- **Streak Bonus**: +10% per consecutive correct answer (max 100%)

#### Oracle Validation Rewards

Higher tier users earn RDLN for validation services:
- **Basic Validation**: Base RDLN amount (Solver tier)
- **Complex Validation**: Base + 20% bonus (Expert tier)
- **Elite Validation**: Base + 50% bonus (Oracle tier)

## Economic Sustainability Model

### Burn Rate vs Prize Distribution

The progressive burn model creates natural economic pressure:

1. **Early Adopters**: Low burn costs, high prize pools
2. **Mass Adoption**: Increasing burn rates offset prize payouts
3. **Mature Economy**: Burns exceed new token creation

### Biennial Halving Events

Every 2 years, all burn costs are reduced by 50%:
- Maintains accessibility for new users
- Prevents excessive deflationary pressure
- Aligns with prize pool depletion schedule

### Treasury Sustainability

The 100M RDLN treasury supports long-term development:
- **Monthly Releases**: Automated via TreasuryDrip contract
- **Base Amount**: 1M RDLN per month
- **Dynamic Scaling**: 1.0x to 5.0x multiplier based on needs
- **Duration**: ~8+ years of guaranteed funding

## Token Velocity & Utility

### RDLN Utility Matrix

| Use Case | Burn Amount | Frequency | Economic Impact |
|----------|-------------|-----------|-----------------|
| Riddle Attempts | Progressive (1-N) | High | Deflationary pressure |
| NFT Minting | Variable | Medium | Direct burn |
| Question Submission | Progressive (1-N) | Low | Quality control |
| Prize Payouts | Large pools | Weekly | Inflationary pressure |

### RON Utility Matrix

| Use Case | RON Requirement | Benefit | Economic Value |
|----------|----------------|---------|----------------|
| Hard Riddles | 10,000+ | Higher prizes | RDLN earning access |
| Oracle Work | 1,000+ | RDLN income | Direct monetization |
| Governance | 100,000+ | Protocol control | Indirect value |
| Legendary Access | 100,000+ | Massive prizes | Exclusive opportunity |

## Long-Term Economic Projections

### 20-Year Model (2025-2045)

**Phase 1 (Years 1-5): Growth**
- Prize pools attract participants
- Moderate burn rates
- Treasury funds development

**Phase 2 (Years 6-10): Maturity**
- Increasing burn pressure
- Established user tiers
- Self-sustaining ecosystem

**Phase 3 (Years 11-15): Optimization**
- Advanced difficulty algorithms
- Cross-chain expansion
- Mature governance

**Phase 4 (Years 16-20): Sustainability**
- Burns balance emissions
- Pure merit-based allocation
- Decentralized operations

### Supply Curve Projection

| Year | Circulating Supply | Prize Pool Remaining | Avg Weekly Burns |
|------|-------------------|---------------------|------------------|
| 2025 | ~900M RDLN | 700M RDLN | 50K RDLN |
| 2030 | ~750M RDLN | 525M RDLN | 200K RDLN |
| 2035 | ~600M RDLN | 350M RDLN | 500K RDLN |
| 2040 | ~450M RDLN | 175M RDLN | 750K RDLN |
| 2045 | ~300M RDLN | 0 RDLN | 1M+ RDLN |

## Risk Mitigation

### Inflation Control
- Progressive burns increase with usage
- Prize pools are pre-allocated and finite
- Treasury releases are capped and automated

### Deflation Control
- Biennial halving prevents excessive burn pressure
- New user incentives maintain participation
- Emergency treasury reserves available

### Economic Attacks
- Soul-bound RON prevents Sybil attacks
- Progressive costs discourage spam
- Multi-signature controls protect treasury

---

**Last Updated**: September 28, 2025
**Version**: 1.0.0
**Related Contracts**: RDLN.sol, RON.sol, RiddleNFT_v2.sol