# NFT Mechanics - Riddlen Weekly Riddle System

## Overview

The Riddlen NFT system implements a unique **weekly riddle protocol** where players mint NFTs to attempt solving intellectual challenges. Each NFT represents a solve attempt with progressive burn costs and substantial RDLN prize pools.

## Weekly Riddle Release System

### 20-Year Schedule (2025-2045)

- **Total Riddles**: 1,000 riddles over 1,000 weeks
- **Genesis Date**: January 1, 2025 00:00:00 UTC
- **Release Frequency**: Exactly 1 riddle per week
- **Final Riddle**: December 26, 2044

### Riddle Creation Process

Each weekly riddle is released with randomized parameters:

```solidity
struct RiddleParameters {
    uint256 maxMintRate;    // 10-1,000 NFT copies available
    uint256 prizePool;      // 100K-10M RDLN from 700M allocation
    uint256 winnerSlots;    // 1-100 potential winners
    uint256 mintCost;       // Current biennial halving cost
}
```

### Difficulty-Based Access Control

| Difficulty | RON Requirement | Prize Range | Winner Slots | Typical Minting |
|------------|----------------|-------------|--------------|-----------------|
| **Easy** | 0-999 RON | 100K-300K RDLN | 50-100 | 500-1,000 NFTs |
| **Medium** | 1,000+ RON | 300K-700K RDLN | 20-50 | 200-500 NFTs |
| **Hard** | 10,000+ RON | 700K-1.5M RDLN | 5-20 | 50-200 NFTs |
| **Legendary** | 100,000+ RON | 1.5M-2M RDLN | 1-5 | 10-50 NFTs |

## NFT Minting Mechanics

### Cost Structure with Biennial Halving

The minting cost follows the **biennial halving schedule** as specified in the whitepaper:

| Period | Mint Cost | Burn Distribution |
|--------|-----------|-------------------|
| 2025-2026 | 1,000 RDLN | 500 burned, 250 Grand Prize, 250 dev/ops |
| 2027-2028 | 500 RDLN | 250 burned, 125 Grand Prize, 125 dev/ops |
| 2029-2030 | 250 RDLN | 125 burned, 62.5 Grand Prize, 62.5 dev/ops |
| 2031-2032 | 125 RDLN | 62.5 burned, 31.25 Grand Prize, 31.25 dev/ops |
| 2033-2034 | 62 RDLN | 31 burned, 15.5 Grand Prize, 15.5 dev/ops |
| 2035-2036 | 31 RDLN | 15.5 burned, 7.75 Grand Prize, 7.75 dev/ops |
| 2037-2038 | 15 RDLN | 7.5 burned, 3.75 Grand Prize, 3.75 dev/ops |
| 2039-2040 | 7 RDLN | 3.5 burned, 1.75 Grand Prize, 1.75 dev/ops |
| 2041-2042 | 3 RDLN | 1.5 burned, 0.75 Grand Prize, 0.75 dev/ops |
| 2043-2044 | 1.5 RDLN | 0.75 burned, 0.375 Grand Prize, 0.375 dev/ops |

**All minting costs follow burn protocol:** 50% burned, 25% Grand Prize accumulation, 25% dev/ops funding

### Minting Process

1. **Eligibility Check**: User must have sufficient RON for riddle difficulty
2. **Cost Payment**: Pay current biennial halving cost in RDLN
3. **NFT Creation**: Receive unique ERC-721 token for this riddle
4. **Attempt Tracking**: NFT tracks all attempts and failed burns

```solidity
function mintRiddleNFT(uint256 riddleId) external returns (uint256 tokenId)
```

### Supply Limits

Each riddle has randomized supply limits:
- **Minimum**: 10 NFTs per riddle
- **Maximum**: 1,000 NFTs per riddle
- **Dynamic**: Parameters set randomly at riddle creation

## Progressive Burn Solving System

### Attempt Cost Structure

Each NFT tracks failed attempts independently, with costs increasing progressively:

```
1st attempt: 1 RDLN burned
2nd attempt: 2 RDLN burned
3rd attempt: 3 RDLN burned
...
Nth attempt: N RDLN burned
```

### Solving Process

1. **Submit Answer**: Call `attemptSolution(tokenId, answer)`
2. **Hash Verification**: Answer is hashed and compared to stored hash
3. **Burn Processing**: Failed attempts burn RDLN and increment counter
4. **Success Handling**: Correct answers trigger reward distribution

### Winner Selection

When a riddle is solved:
- **Multiple Winners**: Prize pool divided among winner slots
- **First Solver Bonus**: 5x RON reputation multiplier
- **Speed Solver Bonus**: 1.5x RON for top 10% solve times
- **Prize Distribution**: Proportional RDLN allocation

## NFT Data Structure

Each NFT contains comprehensive solve and ownership data:

```solidity
struct NFTSolveData {
    uint256 tokenId;
    uint256 riddleId;
    address currentOwner;
    address originalMinter;
    uint256 mintedAt;

    // Attempt tracking (follows NFT on resale)
    uint256 failedAttempts;

    // Solution tracking
    bool solved;
    address solver;
    uint256 solveTime;
    uint256 prizeAmount;
    bool prizeClaimed;

    // Performance bonuses
    bool wasFirstSolver;
    bool wasSpeedSolver;
    uint256 ronEarned;
}
```

## Resale Market Mechanics

### Secondary Market Features

NFTs can be traded on a built-in resale market with automatic commission distribution:

- **Seller Control**: Token owners set their own resale prices
- **Commission Structure**: 50% burn / 25% Grand Prize / 25% dev/ops (follows burn protocol)
- **Attempt Preservation**: Failed attempts and solve data transfer with NFT
- **Grand Prize Contribution**: Every resale builds towards legendary events

### Commission Distribution

When an NFT is resold, commissions are automatically distributed according to the burn protocol:

```
Sale Price: 100 RDLN
├── 50 RDLN → Permanently Burned (deflationary pressure)
├── 25 RDLN → Grand Prize Pool (legendary event accumulation)
└── 25 RDLN → Dev/Ops Wallet (development funding)
```

**Grand Prize Accumulation:** Every NFT trade contributes to the growing Grand Prize pool for epic community events

### Resale Process

1. **List for Sale**: `setResalePrice(tokenId, price)`
2. **Purchase**: `buyNFT(tokenId)` with exact price
3. **Commission Processing**: Automatic distribution
4. **Ownership Transfer**: Standard ERC-721 transfer

## Prize Pool Economics

### Global Prize Allocation

- **Total Available**: 700,000,000 RDLN (70% of total supply)
- **Distribution Period**: 1,000 weeks (20 years)
- **Average per Week**: 700,000 RDLN
- **Prize Randomization**: 100K - 2M RDLN per riddle

### Prize Distribution Formula

```
Individual Prize = (Prize Pool ÷ Winner Slots) × Performance Multiplier
```

**Performance Multipliers:**
- Standard solver: 1.0x
- First solver: 1.5x (additional RON bonus)
- Speed solver: 1.2x (additional RON bonus)

### Claiming Mechanism

Winners must manually claim their prizes:

```solidity
function claimPrize(uint256 tokenId) external
```

- **Eligibility**: Only solved NFT owners can claim
- **One-time Claim**: Prevents double-spending
- **Direct Transfer**: RDLN sent directly to claimant

## RON Reputation Integration

### Earning Mechanics

Solving riddles awards soul-bound RON reputation tokens:

| Difficulty | Base RON Reward | First Solver | Speed Solver |
|------------|----------------|--------------|--------------|
| Easy | 10-25 RON | 50-125 RON | 15-37 RON |
| Medium | 50-100 RON | 250-500 RON | 75-150 RON |
| Hard | 200-500 RON | 1K-2.5K RON | 300-750 RON |
| Legendary | 1K-10K RON | 5K-50K RON | 1.5K-15K RON |

### Access Gating

RON tokens gate access to higher difficulty riddles:
- **Tier Progression**: Users earn access through demonstrated ability
- **Merit-Based**: Cannot buy RON, must earn through solving
- **Permanent**: RON tokens are soul-bound and non-transferable

## Technical Implementation

### Smart Contract Architecture

```solidity
contract RiddleNFT is
    ERC721,
    ERC721Enumerable,
    AccessControl,
    ReentrancyGuard,
    Pausable,
    IRiddleNFT
```

### Key Components

- **RDLN Integration**: Burns RDLN for attempts and minting
- **RON Integration**: Awards reputation for successful solves
- **Randomization**: Secure on-chain parameter generation
- **State Management**: Comprehensive riddle and NFT state tracking

### Security Features

- **Reentrancy Protection**: All state-changing functions protected
- **Access Control**: Role-based permissions for administrative functions
- **Pausable**: Emergency stop capability
- **Input Validation**: Comprehensive parameter checking

## Events and Monitoring

### Critical Events

```solidity
event WeeklyRiddleReleased(uint256 riddleId, uint256 weekNumber, Difficulty difficulty);
event RiddleNFTMinted(uint256 tokenId, uint256 riddleId, address minter);
event AttemptMade(uint256 tokenId, address solver, bool successful);
event RiddleSolved(uint256 tokenId, address solver, uint256 prizeAmount);
event NFTResold(uint256 tokenId, address from, address to, uint256 price);
```

### Analytics and Statistics

The contract provides comprehensive statistics:
- **Global Metrics**: Total riddles, NFTs minted, prizes distributed
- **Riddle-Specific**: Solve rates, average solve times, burn amounts
- **User Performance**: Individual solving history and earnings

## Game Theory and Economics

### Incentive Alignment

The system creates multiple incentive layers:

1. **Intellectual Challenge**: Intrinsic motivation to solve puzzles
2. **Economic Rewards**: Substantial RDLN prize pools
3. **Reputation Building**: RON tokens for long-term access
4. **Collectibility**: Unique NFTs with solve history
5. **Investment Opportunity**: Resale market for trading

### Anti-Gaming Mechanisms

- **Progressive Costs**: Discourage brute force attempts
- **RON Gating**: Prevent low-effort participation in hard riddles
- **Soul-Bound Reputation**: Cannot buy way to higher tiers
- **Limited Supply**: Scarcity drives value and engagement

### Economic Sustainability

- **Finite Prize Pool**: 700M RDLN allocated over 20 years
- **Deflationary Pressure**: Burns from failed attempts and resales
- **Biennial Halving**: Maintains accessibility as ecosystem matures

---

**Contract**: RiddleNFT_v2.sol
**Interface**: IRiddleNFT_v2.sol
**Token Standard**: ERC-721 with custom mechanics
**Version**: 2.0.0
**Last Updated**: September 28, 2025