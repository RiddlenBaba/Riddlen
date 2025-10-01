# Riddlen Smart Contract API Reference

## Overview

This document provides a comprehensive reference for all public functions, events, and data structures in the Riddlen smart contract ecosystem. The API is organized by contract and functionality.

## Contract Addresses

| Contract | Interface | Description |
|----------|-----------|-------------|
| **RDLN** | `IRDLN` | Main utility token with burn mechanics |
| **RON** | `IRON` | Soul-bound reputation system |
| **RiddleNFT** | `IRiddleNFT` | Weekly riddle NFT system |
| **TreasuryDrip** | N/A | Automated treasury distribution |

---

# RDLN Token API

The RDLN token implements ERC-20 with custom game mechanics and burn functionality.

## Core ERC-20 Functions

### `balanceOf(address account) → uint256`
Returns the RDLN token balance of an account.

### `transfer(address to, uint256 amount) → bool`
Transfers RDLN tokens with optional burn mechanism.

### `transferFrom(address from, address to, uint256 amount) → bool`
Transfers RDLN tokens on behalf of another account.

### `approve(address spender, uint256 amount) → bool`
Approves spending allowance for another account.

### `allowance(address owner, address spender) → uint256`
Returns the remaining allowance for a spender.

## Allocation Management

### `mintPrizePool(address to, uint256 amount)`
**Access**: `MINTER_ROLE`
Mints RDLN tokens from the prize pool allocation (700M max).

### `mintTreasury(address to, uint256 amount)`
**Access**: `MINTER_ROLE`
Mints RDLN tokens from the treasury allocation (100M max).

### `mintAirdrop(address to, uint256 amount)`
**Access**: `MINTER_ROLE`
Mints RDLN tokens from the airdrop allocation (100M max).

### `mintLiquidity(address to, uint256 amount)`
**Access**: `MINTER_ROLE`
Mints RDLN tokens from the liquidity allocation (100M max).

### `getRemainingAllocations() → (uint256, uint256, uint256, uint256)`
Returns remaining amounts for each allocation:
- `prizePoolRemaining`: Unminted prize pool tokens (700M allocation)
- `treasuryRemaining`: Unminted treasury tokens (100M allocation)
- `airdropRemaining`: Unminted airdrop tokens (100M allocation)
- `liquidityRemaining`: Unminted liquidity tokens (100M allocation)

**Note**: Grand Prize Pool accumulates separately from these allocations through burn protocol (25% of all burns)

## Game Mechanics

### `burnFailedAttempt(address user) → uint256`
**Access**: `GAME_ROLE`
Burns RDLN tokens for a failed riddle attempt with progressive cost.

**Returns**: Amount of RDLN burned

**Progressive Cost Formula**: `burnAmount = user.failedAttempts + 1`

### `burnQuestionSubmission(address user) → uint256`
**Access**: `GAME_ROLE`
Burns RDLN tokens for submitting a new riddle question.

**Returns**: Amount of RDLN burned

**Progressive Cost Formula**: `burnAmount = user.questionsSubmitted + 1`

### `burnNFTMint(address user, uint256 cost)`
**Access**: `GAME_ROLE`
Burns RDLN tokens for NFT minting following biennial halving schedule and burn protocol.

**Cost Schedule**: 1,000 RDLN (2025-26) → 500 RDLN (2027-28) → 250 RDLN (2029-30) → etc.
**Distribution**: 50% burned, 25% Grand Prize accumulation, 25% dev/ops funding

## Grand Prize Pool System

### Core Concept
The Grand Prize Pool represents accumulated RDLN from the burn protocol's 25% allocation, creating massive prize opportunities for legendary community events.

### Accumulation Sources
- **Failed Attempt Burns**: 25% of progressive burn costs
- **NFT Minting**: 25% of biennial halving costs
- **Question Submissions**: 25% of progressive submission costs
- **Future Burns**: 25% of any additional burn mechanisms

### Security Framework
- **Multi-signature vault**: 4-of-5 signature requirement (highest security level)
- **Transparent tracking**: Community visibility into accumulation
- **Scheduled distributions**: Prevents indefinite accumulation
- **Governance control**: Community voting on distribution events

### Distribution Events
- **Quarterly Grand Prize riddles**: Regular legendary events
- **Annual mega-events**: Massive community celebrations
- **Special occasions**: Milestone and achievement rewards
- **Community governance**: Voted distribution timing and amounts

## Analytics and Statistics

### `getBurnStats() → (uint256, uint256, uint256, uint256)`
Returns comprehensive burn statistics:
- `totalBurned`: All-time total burned tokens
- `gameplayBurned`: Tokens burned through game mechanics
- `transferBurned`: Tokens burned through transfers
- `currentSupply`: Current circulating supply

### `getUserStats(address user) → (uint256, uint256, uint256)`
Returns user-specific statistics:
- `failedAttempts`: Number of failed riddle attempts
- `questionsSubmitted`: Number of questions submitted
- `balance`: Current RDLN balance

### `getNextFailedAttemptCost(address user) → uint256`
Returns the RDLN cost for the user's next failed attempt.

### `getNextQuestionCost(address user) → uint256`
Returns the RDLN cost for the user's next question submission.

## Constants

### `TOTAL_SUPPLY() → uint256`
Returns the maximum total supply (1,000,000,000 RDLN).

### `PRIZE_POOL_ALLOCATION() → uint256`
Returns the prize pool allocation (700,000,000 RDLN).

### `TREASURY_ALLOCATION() → uint256`
Returns the treasury allocation (100,000,000 RDLN).

### `AIRDROP_ALLOCATION() → uint256`
Returns the airdrop allocation (100,000,000 RDLN).

### `LIQUIDITY_ALLOCATION() → uint256`
Returns the liquidity allocation (100,000,000 RDLN).

## Events

### `AllocationMinted(string indexed allocationType, address indexed to, uint256 amount)`
Emitted when tokens are minted from an allocation.

### `GameplayBurn(address indexed user, uint256 amount, string indexed reason)`
Emitted when tokens are burned through game mechanics.

### `FailedAttemptBurn(address indexed user, uint256 attemptNumber, uint256 burnAmount)`
Emitted when tokens are burned for failed riddle attempts.

### `QuestionSubmissionBurn(address indexed user, uint256 questionNumber, uint256 burnAmount)`
Emitted when tokens are burned for question submissions.

---

# RON Reputation API

The RON system implements soul-bound tokens for access control and reputation tracking.

## Data Types

### `AccessTier` Enum
```solidity
enum AccessTier {
    NOVICE,     // 0-999 RON
    SOLVER,     // 1,000-9,999 RON
    EXPERT,     // 10,000-99,999 RON
    ORACLE      // 100,000+ RON
}
```

### `RiddleDifficulty` Enum
```solidity
enum RiddleDifficulty {
    EASY,       // 10-25 RON reward
    MEDIUM,     // 50-100 RON reward
    HARD,       // 200-500 RON reward
    LEGENDARY   // 1,000-10,000 RON reward
}
```

## Core Functions

### `awardRON(address user, RiddleDifficulty difficulty, bool isFirstSolver, bool isSpeedSolver, string reason) → uint256`
**Access**: `GAME_ROLE`
Awards RON reputation tokens for solving riddles.

**Parameters**:
- `user`: Recipient address
- `difficulty`: Riddle difficulty level
- `isFirstSolver`: Whether user was first to solve
- `isSpeedSolver`: Whether user solved quickly (top 10%)
- `reason`: Description of achievement

**Returns**: Total RON awarded (including bonuses)

### `updateAccuracy(address user, bool correct)`
**Access**: `GAME_ROLE`
Updates user's accuracy statistics for attempt tracking.

### `awardValidationRON(address user, uint256 baseAmount, string validationType)`
**Access**: `ORACLE_ROLE`
Awards RON for oracle validation work.

## Query Functions

### `balanceOf(address user) → uint256`
Returns the total RON balance for a user.

### `getUserTier(address user) → AccessTier`
Returns the current access tier based on RON balance.

### `getUserStats(address user) → (uint256, AccessTier, uint256, uint256, uint256, uint256, uint256)`
Returns comprehensive user statistics:
- `totalRON`: Total RON earned
- `currentTier`: Current access tier
- `correctAnswers`: Number of correct solutions
- `totalAttempts`: Total riddle attempts
- `accuracyPercentage`: Success rate (0-10000, basis points)
- `currentStreak`: Current consecutive correct answers
- `maxStreak`: Historical best streak

### `getRiddleAccess(address user) → (bool, bool, bool, bool)`
Returns riddle difficulty access permissions:
- `canAccessEasy`: Can attempt easy riddles
- `canAccessMedium`: Can attempt medium riddles
- `canAccessHard`: Can attempt hard riddles
- `canAccessLegendary`: Can attempt legendary riddles

### `getOracleAccess(address user) → (bool, bool, bool, bool)`
Returns oracle network access permissions:
- `canValidateBasic`: Can perform basic validation
- `canValidateComplex`: Can perform complex validation
- `canValidateElite`: Can perform elite validation
- `canParticipateGovernance`: Can participate in governance

### `getTierThresholds() → (uint256, uint256, uint256)`
Returns RON requirements for each tier:
- `solverThreshold`: RON needed for SOLVER tier (1,000)
- `expertThreshold`: RON needed for EXPERT tier (10,000)
- `oracleThreshold`: RON needed for ORACLE tier (100,000)

### `calculateRONReward(RiddleDifficulty difficulty, bool isFirstSolver, bool isSpeedSolver, uint256 currentStreak) → (uint256, uint256)`
Calculates RON rewards before awarding:
- `baseReward`: Base RON for difficulty level
- `bonusReward`: Additional RON from multipliers

### `getNextTierRequirement(address user) → (AccessTier, uint256, uint256)`
Returns progression information:
- `nextTier`: Next achievable tier
- `ronRequired`: Total RON needed for next tier
- `ronRemaining`: Additional RON needed

## Events

### `RONEarned(address indexed user, uint256 amount, RiddleDifficulty indexed difficulty, string indexed reason)`
Emitted when RON is awarded for riddle solving.

### `TierAchieved(address indexed user, AccessTier indexed newTier, uint256 totalRON)`
Emitted when a user reaches a new access tier.

### `BonusApplied(address indexed user, uint256 baseRON, uint256 bonusRON, string indexed bonusType)`
Emitted when performance bonuses are applied.

### `AccuracyUpdated(address indexed user, uint256 correctAnswers, uint256 totalAttempts, uint256 accuracyPercentage)`
Emitted when user accuracy statistics are updated.

### `StreakUpdated(address indexed user, uint256 currentStreak, uint256 maxStreak)`
Emitted when user streak statistics change.

---

# RiddleNFT API

The RiddleNFT system implements weekly riddle releases with NFT-based solving.

## Data Types

### `RiddleStatus` Enum
```solidity
enum RiddleStatus {
    ACTIVE,     // Currently solvable
    SOLVED,     // All winner slots filled
    EXPIRED     // Admin expired (rare)
}
```

### `RiddleParameters` Struct
```solidity
struct RiddleParameters {
    uint256 maxMintRate;    // 10-1,000 NFT copies available
    uint256 prizePool;      // 100K-10M RDLN prize pool
    uint256 winnerSlots;    // 1-100 potential winners
    uint256 mintCost;       // Current biennial halving cost
}
```

### `RiddleData` Struct
```solidity
struct RiddleData {
    uint256 riddleId;       // Unique riddle ID
    uint256 weekNumber;     // Week 1-1000
    string category;        // Riddle category
    Difficulty difficulty;
    bytes32 answerHash;     // Keccak256 hash of answer
    string ipfsHash;        // Off-chain content
    address creator;        // Riddle creator
    uint256 releaseTime;    // Release timestamp
    RiddleStatus status;
    RiddleParameters params;
    uint256 totalMinted;    // NFTs minted
    uint256 solverCount;    // Successful solvers
}
```

### `NFTSolveData` Struct
```solidity
struct NFTSolveData {
    uint256 tokenId;
    uint256 riddleId;
    address currentOwner;
    address originalMinter;
    uint256 mintedAt;
    uint256 failedAttempts;
    bool solved;
    address solver;
    uint256 solveTime;
    uint256 prizeAmount;
    bool prizeClaimed;
    bool wasFirstSolver;
    bool wasSpeedSolver;
    uint256 ronEarned;
}
```

## Weekly Riddle System

### `releaseWeeklyRiddle(string category, Difficulty difficulty, bytes32 answerHash, string ipfsHash) → uint256`
**Access**: `CREATOR_ROLE`
Releases a new weekly riddle with randomized parameters.

**Returns**: Generated riddle ID

### `getCurrentWeek() → uint256`
Returns the current week number (1-1000) based on genesis time.

### `getWeeklyRiddle(uint256 weekNumber) → uint256`
Returns the riddle ID for a specific week number.

## NFT Minting and Solving

### `mintRiddleNFT(uint256 riddleId) → uint256`
Mints an NFT for attempting a specific riddle.

**Requirements**:
- Sufficient RON tier for riddle difficulty
- RDLN payment for mint cost
- Riddle still has available mint slots

**Returns**: Newly minted token ID

### `attemptSolution(uint256 tokenId, string answer)`
Attempts to solve a riddle using an NFT.

**Mechanics**:
- Failed attempts burn progressive RDLN amounts
- Correct answers award RDLN prizes and RON reputation
- Performance bonuses for first/speed solvers

### `claimPrize(uint256 tokenId)`
Claims RDLN prize for a solved NFT.

**Requirements**:
- NFT must be solved
- Prize not already claimed
- Caller must own the NFT

## Resale System

### `setResalePrice(uint256 tokenId, uint256 price)`
Lists an NFT for sale at a specified price.

### `buyNFT(uint256 tokenId) payable`
Purchases an NFT at the listed price with commission distribution following burn protocol.

**Commission Distribution**: 50% burned, 25% Grand Prize accumulation, 25% dev/ops funding

### `getResaleInfo(uint256 tokenId) → (bool, uint256, address)`
Returns resale information:
- `forSale`: Whether NFT is listed
- `price`: Sale price in RDLN
- `seller`: Current owner address

## View Functions

### `getRiddle(uint256 riddleId) → RiddleData`
Returns complete riddle information and parameters.

### `getNFTSolveData(uint256 tokenId) → NFTSolveData`
Returns comprehensive NFT solving data and history.

### `getCurrentMintCost() → uint256`
Returns current NFT minting cost based on biennial halving.

### `getBiennialPeriod() → (uint256, uint256)`
Returns current biennial period and associated mint cost.

### `getRemainingNFTs(uint256 riddleId) → uint256`
Returns available NFT mint slots for a riddle.

### `getRiddleWinners(uint256 riddleId) → address[]`
Returns list of addresses that solved the riddle.

### `canAttemptRiddle(address user, uint256 riddleId) → (bool, string)`
Checks if user can attempt a riddle:
- `canAttempt`: Permission boolean
- `reason`: Explanation if blocked

### `getNextAttemptCost(uint256 tokenId) → uint256`
Returns RDLN cost for the next failed attempt on an NFT.

## Statistics

### `getGlobalStats() → (uint256, uint256, uint256, uint256, uint256)`
Returns ecosystem-wide statistics:
- `totalRiddles`: Total riddles released
- `totalNFTsMinted`: Total NFTs created
- `totalSolved`: Total successful solutions
- `totalRDLNBurned`: Total RDLN burned
- `totalPrizesDistributed`: Total RDLN prizes paid

### `getRiddleStats(uint256 riddleId) → (uint256, uint256, uint256, uint256, uint256)`
Returns riddle-specific statistics:
- `nftsMinted`: NFTs minted for this riddle
- `solved`: Number of successful solutions
- `averageSolveTime`: Mean time to solve
- `totalBurned`: RDLN burned on this riddle
- `prizePoolRemaining`: Unclaimed prizes

## Events

### `WeeklyRiddleReleased(uint256 indexed riddleId, uint256 indexed weekNumber, Difficulty indexed difficulty, RiddleParameters params)`
Emitted when a new weekly riddle is released.

### `RiddleNFTMinted(uint256 indexed tokenId, uint256 indexed riddleId, address indexed minter, uint256 mintCost)`
Emitted when an NFT is minted for riddle attempts.

### `AttemptMade(uint256 indexed tokenId, uint256 indexed riddleId, address indexed solver, uint256 attemptNumber, uint256 burnAmount, bool successful)`
Emitted when a riddle solution is attempted.

### `RiddleSolved(uint256 indexed tokenId, uint256 indexed riddleId, address indexed solver, uint256 prizeAmount, uint256 ronEarned, bool wasFirstSolver, bool wasSpeedSolver)`
Emitted when a riddle is successfully solved.

### `NFTResold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 salePrice, uint256 commission)`
Emitted when an NFT is sold on the resale market with burn protocol distribution.

### `PrizeClaimed(uint256 indexed tokenId, address indexed claimer, uint256 amount)`
Emitted when RDLN prizes are claimed.

---

# Error Codes

## Common Errors

### `InsufficientBalance()`
User doesn't have enough RDLN tokens for the operation.

### `InvalidRiddle()`
Riddle ID doesn't exist or is invalid.

### `RiddleNotActive()`
Riddle is solved, expired, or not yet released.

### `InsufficientRON()`
User doesn't have required RON tier for riddle difficulty.

### `MaxMintReached()`
All available NFT slots for riddle have been minted.

### `NonTransferableToken()`
Attempted to transfer soul-bound RON tokens.

### `NotTokenOwner()`
Caller doesn't own the specified NFT.

### `PrizeAlreadyClaimed()`
NFT prize has already been claimed.

### `UnauthorizedAccess()`
Caller lacks required role permissions.

---

# Integration Examples

## Minting and Solving Flow

```solidity
// 1. Check user eligibility
(bool canAttempt, string memory reason) = riddleNFT.canAttemptRiddle(user, riddleId);
require(canAttempt, reason);

// 2. Get current costs
uint256 mintCost = riddleNFT.getCurrentMintCost();
require(rdln.balanceOf(user) >= mintCost, "Insufficient RDLN");

// 3. Approve and mint NFT
rdln.approve(address(riddleNFT), mintCost);
uint256 tokenId = riddleNFT.mintRiddleNFT(riddleId);

// 4. Attempt solution
riddleNFT.attemptSolution(tokenId, "my answer");

// 5. Claim prize if solved
if (riddleNFT.getNFTSolveData(tokenId).solved) {
    riddleNFT.claimPrize(tokenId);
}
```

## Querying User Progress

```solidity
// Get user's RON tier and stats
AccessTier tier = ron.getUserTier(user);
(uint256 totalRON, , uint256 correct, uint256 total, uint256 accuracy, uint256 streak, uint256 maxStreak) = ron.getUserStats(user);

// Get RDLN burn history
(uint256 failedAttempts, uint256 questionsSubmitted, uint256 balance) = rdln.getUserStats(user);

// Check next costs
uint256 nextAttemptCost = rdln.getNextFailedAttemptCost(user);
uint256 nextQuestionCost = rdln.getNextQuestionCost(user);
```

---

**API Version**: 1.0.0
**Last Updated**: September 28, 2025
**Solidity Version**: ^0.8.0
**License**: MIT