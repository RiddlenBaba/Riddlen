# Changelog

All notable changes to the Riddlen Smart Contracts project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.3.0] - 2024-12-27

### Added
- **RiddleNFT v2 System**: Complete redesign following whitepaper specifications exactly
  - Weekly riddle releases (1 riddle per week for 1000 weeks / 20 years)
  - Randomized parameters per riddle: mint rates (10-1000), prize pools (100K-10M RDLN), winner slots (1-100)
  - Progressive burn protocol per NFT: 1st attempt = 1 RDLN, 2nd = 2 RDLN, nth = n RDLN
  - NFT resale system with commission distribution (50% burn, 25% liquidity, 25% dev/ops)
  - Biennial halving mechanism for mint costs (halves every 2 years)
  - Unlimited attempts per NFT (attempts follow NFT on resale)
  - Prize pool distribution from 700M RDLN allocation
  - RON reputation integration for solving bonuses

- **New Contracts**:
  - `contracts/nft/RiddleNFT_v2.sol`: Main weekly riddle NFT system
  - `contracts/interfaces/IRiddleNFT_v2.sol`: Interface for v2 system
  - `scripts/deploy-riddlenfts.js`: Deployment script for NFT system
  - `test/RiddleNFT_v2.test.js`: Comprehensive test suite (13 passing tests)

### Changed
- **Breaking**: RiddleNFT system completely redesigned to match whitepaper
- Renamed old RiddleNFT contract to `RiddleNFT_v1.sol` for version clarity
- Updated interfaces to support new weekly riddle paradigm

### Technical Implementation
- **Genesis Time**: January 1, 2025 00:00:00 UTC for weekly countdown
- **Commission Structure**: Configurable rates with 50/25/25 default split
- **Access Control**: Role-based permissions for creators and admins
- **Integration**: Full RDLN burn mechanics and RON reputation rewards
- **Security**: Reentrancy guards, pausable functionality, comprehensive input validation

### Testing
- 13 comprehensive test scenarios covering all major functionality
- Deployment verification and role management
- Progressive burn mechanics testing
- NFT resale and commission distribution
- Prize claiming and RON integration

## [v0.2.0] - 2024-12-27

### Added
- **RDLN Token Contract**: ERC20 token with Riddlen-specific mechanics
  - 1 billion total supply with allocated distributions
  - Progressive burn protocol for failed attempts
  - Game integration via role-based access control
  - Biennial cost halving mechanism

- **RON Reputation System**: Soul-bound token implementation
  - Four-tier reputation system (Novice, Solver, Expert, Oracle)
  - Non-transferable tokens earned through puzzle solving
  - Performance bonuses for first solvers and speed solving
  - Accuracy tracking and streak bonuses

- **Initial RiddleNFT System**: Attempt-based riddle solving (deprecated in v0.3.0)

### Infrastructure
- Complete Hardhat project setup
- OpenZeppelin v5 integration
- Comprehensive testing framework
- Multi-network deployment configuration (Polygon, Mumbai, Sepolia)

### Documentation
- Contract interfaces with full NatSpec documentation
- Deployment scripts with verification instructions
- README with project overview and setup instructions

## [v0.1.0] - 2025-09-25

### Added
- Initial TreasuryDrip.sol contract implementation
- Comprehensive security audit documentation
- Automated treasury distribution system

### Security Fixes
- [MEDIUM-001] Fixed potential underflow in `_handleReleaseFailed()` function
- [MEDIUM-002] Reduced emergency release percentage from 10% to 5% for safety
- [LOW-001] Added unauthorized access attempt logging

### Documentation
- Added detailed security audit report
- Enhanced NatSpec documentation for complex functions
- Created comprehensive changelog

### Contract: TreasuryDrip.sol
**Location:** `contracts/governance/TreasuryDrip.sol`
**Audit Status:** ✅ PASSED with fixes applied
**Deployment Status:** 🚧 Pre-deployment

#### Changes Made:
1. **Underflow Protection** (Line 223-227)
   - Added safety check before subtracting MONTH_IN_SECONDS
   - Prevents state corruption in edge cases

2. **Emergency Release Safety** (Line 186)
   - Reduced emergency release from 10% to 5%
   - Added minimum threshold check

3. **Security Event Logging** (Line 143-145)
   - Added UnauthorizedAutomationAttempt event
   - Enhanced monitoring capabilities

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version when making incompatible API changes
- **MINOR** version when adding functionality in a backwards compatible manner
- **PATCH** version when making backwards compatible bug fixes

## Release Notes

### v0.3.0 - Weekly Riddle NFT System
This release introduces the core Riddlen gaming mechanism with NFT-based weekly riddles. Key highlights:

🎯 **Whitepaper Compliance**: Exactly matches Riddlen whitepaper v5.1 specifications
⏰ **20-Year Timeline**: 1000 weekly riddles starting January 1, 2025
🔥 **Progressive Burns**: Failed attempts cost increasing RDLN amounts per NFT
💰 **Prize Distribution**: 700M RDLN allocated across randomized prize pools
🏆 **Reputation System**: RON tokens awarded for successful solving
🔄 **Resale Market**: NFTs tradeable with built-in commission system

This version establishes the foundation for the complete Riddlen ecosystem.

## Contract Deployment History

### TreasuryDrip.sol
- **v1.0.0-pre** - Initial implementation with security fixes applied
- **Audit Date:** 2025-09-25
- **Status:** Ready for testnet deployment

### RiddleNFT v2 System
- **v0.3.0** - Weekly riddle NFT implementation
- **Release Date:** 2024-12-27
- **Status:** Ready for integration testing