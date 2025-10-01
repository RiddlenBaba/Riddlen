# Claude Code Configuration

This file helps Claude Code understand your project structure and preferences.

## Project Info
- **Type**: Smart Contract Development (Solidity)
- **Framework**: Hardhat
- **Language**: Solidity ^0.8.0
- **Testing**: Hardhat Test (Mocha/Chai)

## Commands
- **Test**: `npm test`
- **Compile**: `npx hardhat compile`
- **Deploy**: `npx hardhat run scripts/deploy.js`
- **Coverage**: `npm run coverage`

## Security Priorities
- All functions should have proper access controls
- Use OpenZeppelin contracts where appropriate
- Implement reentrancy guards for state-changing functions
- Add comprehensive input validation
- Follow CEI (Checks-Effects-Interactions) pattern

## Code Style
- Use NatSpec documentation for all public functions
- Follow Solidity style guide
- Use meaningful variable names
- Add security considerations to comments
- Maximum line length: 100 characters