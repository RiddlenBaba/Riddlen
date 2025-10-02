# Archive Directory

This directory contains deprecated and historical contracts, documentation, and scripts that are no longer actively used but preserved for reference.

**Date Archived**: 2025-10-02

---

## Directory Structure

### `/contracts/`
Deprecated contract versions that have been superseded by upgradeable or improved implementations.

#### `/contracts/nft/`
- `RiddleNFT_v2.sol` - Non-upgradeable NFT version (replaced by RiddleNFTAdvanced)
- `RiddleNFTv3.sol` - Reference implementation with era costs (concepts moved to V2 upgrade)

#### `/contracts/token/`
- `RDLN.sol` - Non-upgradeable RDLN (replaced by RDLNUpgradeable)

#### `/contracts/reputation/`
- `RON.sol` - Non-upgradeable RON (replaced by RONUpgradeable)
- `RONAdvanced.sol` - Intermediate version (replaced by RONUpgradeable)

---

### `/docs/`
Historical documentation and completed project files.

**Archived Documentation**:
- `AUDIT_REPORT_NFT_V2.md` - Early NFT V2 audit
- `NFT_V2_MINIMAL_READY_FOR_DEPLOYMENT.md` - Minimal V2 version docs
- `NFT_V2_VERSIONS_EXPLAINED.md` - Comparison of V2 approaches
- `RESUME_GROUP_INTEGRATION.md` - Group integration process notes
- `STORAGE_LAYOUT_AUDIT.md` - Storage safety validation
- `COMPLETE_ECOSYSTEM_WITH_ORACLE_V2.md` - Ecosystem overview (superseded)
- `COMPLETE_INTEGRATION_MAP.md` - Integration mapping (superseded)
- `DAO_SYSTEM_COMPLETE.md` - DAO implementation guide
- `RON_ADJUSTABLE_REWARDS.md` - RON rewards system docs
- `SECURITY_AUDIT_RiddlenAirdrop_v6.md` - Airdrop audit v6
- `DEVLOG_SECURITY_AUDIT.md` - DevLog audit
- `TEST_RESULTS.md` - Historical test results

---

## Active Contracts (Currently Deployed)

See `/docs/deployment/DeployedContracts.md` for the **7 active contracts** on Amoy testnet:

1. RDLN Token
2. RON Token
3. RiddleNFT
4. Airdrop
5. Group Validator
6. Group Manager
7. Oracle Network

---

## Why These Were Archived

### Contracts
- **Non-upgradeable versions**: Replaced with UUPS upgradeable patterns for future-proofing
- **Reference implementations**: Concepts extracted and integrated into active contracts
- **Deprecated approaches**: Superseded by better architectural decisions

### Documentation
- **Completed milestones**: Projects finished and deployed
- **Superseded guides**: Information integrated into current docs
- **Historical context**: Preserved for reference but no longer primary source

---

## Restoration Policy

Files in this archive should **NOT** be deleted but may be referenced for:
- Understanding design decisions
- Reverting to previous approaches if needed
- Historical context for audits
- Learning from past iterations

---

## Current Documentation Location

**Active docs are in**:
- `/docs/` - Current guides and documentation
- `/AUDIT_REPORT_V2_COMPREHENSIVE.md` - Latest NFT audit
- `/COMPLETE_ECOSYSTEM_STATUS.md` - Current ecosystem status
- `/ORACLE_DEPLOYMENT_GUIDE.md` - Oracle deployment
- `/DEPLOYMENT-INSTRUCTIONS.md` - Deployment procedures

---

**Last Updated**: 2025-10-02
**Maintainer**: Riddlen Development Team
