# RDLN Token Contract Specification

## Overview

The RDLN (Riddlen) token is the core economic engine of the Riddlen ecosystem, featuring integrated deflationary mechanics, gaming integration, and precise allocation management according to the whitepaper specifications.

## Key Features

### 🪙 Token Economics
- **Total Supply**: 1,000,000,000 RDLN (1 billion)
- **Standard**: ERC-20 with burn mechanisms
- **Decimals**: 18

### 📊 Allocation Structure
| Allocation | Amount | Percentage | Purpose |
|------------|--------|------------|---------|
| **Prize Pool** | 700,000,000 RDLN | 70% | Riddle winner rewards |
| **Treasury** | 100,000,000 RDLN | 10% | Development & operations |
| **Airdrop** | 100,000,000 RDLN | 10% | Community distribution |
| **Liquidity** | 100,000,000 RDLN | 10% | DEX liquidity |

### 🔥 Deflationary Mechanisms

#### Progressive Burn Costs
```
Failed Riddle Attempts:
- 1st attempt: 1 RDLN burned
- 2nd attempt: 2 RDLN burned
- 3rd attempt: 3 RDLN burned
- Nth attempt: N RDLN burned

Question Submissions:
- 1st question: 1 RDLN burned
- 2nd question: 2 RDLN burned
- Nth question: N RDLN burned
```

#### NFT Minting Burns
- Configurable burn amount for riddle NFT minting
- Implements biennial halving as per whitepaper
- Burns tokens permanently from circulation

### 🎮 Game Integration

#### Roles
- **GAME_ROLE**: Can trigger gameplay burns
- **MINTER_ROLE**: Can mint allocation tokens
- **BURNER_ROLE**: Emergency burn capabilities
- **PAUSER_ROLE**: Can pause/unpause contract

#### Burn Functions
- `burnFailedAttempt(address user)`: Progressive cost burns
- `burnQuestionSubmission(address user)`: Progressive cost burns
- `burnNFTMint(address user, uint256 cost)`: Fixed cost burns

### 📈 Tracking & Analytics

#### Burn Statistics
- Total tokens burned across all mechanisms
- Gameplay-specific burns vs transfer burns
- Per-user attempt and submission tracking

#### Allocation Tracking
- Real-time remaining allocations per category
- Prevents over-minting beyond caps
- Transparent allocation usage

## Smart Contract Architecture

### Core Contract: `RDLN.sol`
```solidity
contract RDLN is ERC20, ERC20Burnable, AccessControl, ReentrancyGuard, Pausable, IRDLN
```

### Key State Variables
```solidity
// Allocation tracking
uint256 public prizePoolMinted;
uint256 public treasuryMinted;
uint256 public airdropMinted;
uint256 public liquidityMinted;

// Burn tracking
uint256 public totalBurned;
uint256 public gameplayBurned;
uint256 public transferBurned;

// User gameplay tracking
mapping(address => uint256) public failedAttempts;
mapping(address => uint256) public questionsSubmitted;
```

### Security Features

#### Access Control
- Role-based permissions using OpenZeppelin AccessControl
- Multi-signature wallet support for admin functions
- Granular role assignment for different contract functions

#### Safety Mechanisms
- Reentrancy protection on all state-changing functions
- Pausable functionality for emergency situations
- Input validation and bounds checking
- Custom errors for gas-efficient reverts

#### Allocation Protection
- Hard caps prevent over-minting
- Allocation tracking ensures transparency
- Role-based minting prevents unauthorized token creation

## Integration Points

### With RON Reputation System
- Burns trigger reputation updates
- Failed attempts affect reputation scores
- Question quality impacts reputation

### With Riddle NFT Contracts
- NFT minting burns RDLN tokens
- Progressive cost structure implementation
- Winner verification and prize distribution

### With Prize Pool Management
- Automated prize distribution
- Burn verification for eligibility
- Winner payout automation

## Deployment Configuration

### Constructor Parameters
```solidity
constructor(
    address _admin,          // Multi-sig admin wallet
    address _treasuryWallet, // Treasury fund recipient
    address _liquidityWallet,// DEX liquidity wallet
    address _airdropWallet   // Airdrop distribution wallet
)
```

### Post-Deployment Setup
1. **Role Assignment**: Grant GAME_ROLE to game contracts
2. **Allocation Minting**: Mint initial allocations as needed
3. **Integration**: Connect to riddle and reputation systems
4. **Monitoring**: Set up event monitoring and analytics

## View Functions

### Allocation Queries
- `getRemainingAllocations()`: Check remaining mintable amounts
- `prizePoolMinted`, `treasuryMinted`, etc.: Current minted amounts

### User Statistics
- `getUserStats(address user)`: Failed attempts, questions, balance
- `getNextFailedAttemptCost(address user)`: Next burn cost
- `getNextQuestionCost(address user)`: Next submission cost

### Burn Analytics
- `getBurnStats()`: Total burned, gameplay vs transfer burns
- `totalBurned`: All-time burn amount
- Current supply tracking

## Testing

### Test Coverage
- ✅ Deployment and initialization
- ✅ Allocation minting with limits
- ✅ Progressive burn mechanics
- ✅ Access control and permissions
- ✅ View functions and statistics
- ✅ Emergency functions

### Test File: `test/RDLN.test.js`
Comprehensive test suite covering all contract functionality.

## Upgrade Path from Current Contract

### Migration Strategy
1. **Deploy New Contract**: Deploy RDLN with Riddlen features
2. **Parallel Operation**: Run both contracts during transition
3. **User Migration**: Tools for users to migrate from old to new
4. **Ecosystem Integration**: Update all dApps to use new contract
5. **Sunset Old Contract**: Gradually phase out Thirdweb contract

### Migration Tools (Future Development)
- Token swap contract for seamless migration
- Snapshot tools for airdrop to new contract
- Bridge functionality if needed

---

**Contract Version**: 1.0.0
**Specification Date**: September 27, 2025
**Whitepaper Compliance**: ✅ Full compliance with v5.1
**Audit Status**: 🔄 Pending (recommend before mainnet deployment)