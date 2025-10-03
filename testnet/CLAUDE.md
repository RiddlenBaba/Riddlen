# Claude Code Configuration - Testnet Directory

**Directory Purpose:** Testnet deployment records and configuration

## 🎯 What This Directory Is For

This directory tracks **deployed testnet contracts**, **deployment records**, and **testnet-specific configuration**.

### Content Types
- Deployment records (addresses, tx hashes, timestamps)
- Testnet configuration
- Network setup guides
- Contract verification info
- Deployment scripts output
- Migration records

### What Lives Here
- ✅ Deployed contract addresses (PUBLIC - on blockchain)
- ✅ Deployment transaction hashes
- ✅ Network configuration (public testnets)
- ✅ Deployment logs and records
- ✅ Contract verification status

### What Does NOT Live Here
- ❌ Private keys or mnemonics
- ❌ .env files
- ❌ Deployment wallet private keys
- ❌ Smart contract source code (use `/contracts/`)
- ❌ Deployment scripts (use `/contracts/scripts/`)

---

## 📁 Stay In Your Lane

### Work ONLY on deployment records
- Don't modify contract source code from here
- Don't change deployment scripts from here
- Don't touch frontend configs from here

### When updating deployment info:
- **Record addresses** after deployment
- **Link to block explorer** for verification
- **Update docs** (`/docs/`) with new addresses

---

## 🔒 Security Policy

### ⚠️ Public Information Only

All info in this directory is **PUBLIC** (it's on the blockchain):
- ✅ Contract addresses
- ✅ Transaction hashes
- ✅ Block numbers
- ✅ Network RPC URLs (public)
- ❌ Deployer private keys
- ❌ Admin wallet mnemonics
- ❌ API keys for deployment services

### Files to NEVER Access
- `.env` files
- Private keys
- Deployment wallet credentials

See `../.claudeignore` for complete list.

---

## 📋 Deployment Record Format

### File Structure
```
testnet/
├── TESTNET_DEPLOYMENT.md    # Main deployment record
├── amoy/                     # Polygon Amoy testnet
│   ├── deployment-2025-10.md
│   └── addresses.json
├── sepolia/                  # Ethereum Sepolia (if used)
│   └── deployment-2025-10.md
└── archive/
    └── old-deployments/
```

### Deployment Record Template
```markdown
# Testnet Deployment - [Network Name]

## Deployment Information
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **Date**: 2025-10-15
- **Deployer**: 0x... (first 10 chars only)
- **Gas Used**: X MATIC
- **Deployment Tx**: 0x...

## Deployed Contracts

### RDLN Token (ERC20)
- **Address**: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- **Deployment Tx**: [0xabc...](https://amoy.polygonscan.com/tx/0xabc...)
- **Block**: 12345678
- **Verified**: ✅ Yes
- **Verification URL**: https://amoy.polygonscan.com/address/0x...#code

### RON Token (ERC20)
- **Address**: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- **Deployment Tx**: [0xdef...](https://amoy.polygonscan.com/tx/0xdef...)
- **Block**: 12345679
- **Verified**: ✅ Yes

### RiddleNFT (ERC721)
- **Address**: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`
- **Deployment Tx**: [0xghi...](https://amoy.polygonscan.com/tx/0xghi...)
- **Block**: 12345680
- **Verified**: ✅ Yes

## Configuration
- **RPC URL**: https://rpc-amoy.polygon.technology/
- **Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

## Post-Deployment Steps
- [x] Contracts verified on Polygonscan
- [x] Ownership transferred to multisig
- [x] Frontend updated with addresses
- [x] Documentation updated
- [ ] Community announcement

## Notes
Any special notes about this deployment
```

---

## 🔄 Git Workflow

### After Deploying to Testnet
```bash
cd /var/www/riddlen/testnet

# Create/update deployment record
vim TESTNET_DEPLOYMENT.md

# Add contract addresses
# Add transaction hashes
# Note deployment date

# Stage changes
git add testnet/TESTNET_DEPLOYMENT.md

# Commit
git commit -m "testnet: update deployment record with new contract addresses"

# Push
git push origin main
```

### Commit Message Format
```
testnet: <what changed>

Examples:
- testnet: add Amoy deployment addresses for v5.2
- testnet: update RiddleNFT address after redeployment
- testnet: add deployment record for October 2025
- testnet: archive old Sepolia deployment
```

---

## ✅ Verification Checklist

### After Each Deployment
- [ ] All contract addresses recorded
- [ ] Transaction hashes included
- [ ] Block numbers noted
- [ ] Contracts verified on block explorer
- [ ] Verification links added
- [ ] RPC and explorer URLs correct
- [ ] Gas costs documented
- [ ] Post-deployment steps completed

### Cross-Reference Updates
After updating deployment records:
- [ ] Update `/docs/` with new addresses
- [ ] Update `/frontend/.env.example` with new addresses
- [ ] Update `/contracts/` README if needed
- [ ] Notify team of new addresses

---

## 📊 Tracking Multiple Deployments

### Version Tracking
```markdown
## Deployment History

| Version | Date | Network | RDLN | RON | RiddleNFT |
|---------|------|---------|------|-----|-----------|
| v5.2 | 2025-10-15 | Amoy | 0x1330... | 0xD86b... | 0x5290... |
| v5.1 | 2025-09-01 | Amoy | 0x9876... | 0x5432... | 0x1234... |
```

### Network-Specific Files
```
testnet/
├── amoy/
│   ├── v5.2-deployment.md
│   ├── v5.1-deployment.md
│   └── addresses.json
├── sepolia/
│   └── deployment.md
```

---

## 🧹 Keep It Clean

### File Organization
- One file per network per deployment
- Use clear naming: `amoy-v5.2-deployment.md`
- Keep latest deployment in root: `TESTNET_DEPLOYMENT.md`
- Archive old deployments in `archive/`

### Regular Updates
```bash
# When deploying new version
mv TESTNET_DEPLOYMENT.md archive/v5.1-deployment.md
vim TESTNET_DEPLOYMENT.md  # Create new record

# Update latest addresses
cat > testnet/LATEST_ADDRESSES.md << EOF
# Latest Testnet Addresses (Amoy)
- RDLN: 0x...
- RON: 0x...
- RiddleNFT: 0x...

Last updated: 2025-10-15
EOF
```

---

## 📦 Archive Strategy

### When to Archive
- New version deployed (old addresses deprecated)
- Migrating to different testnet
- Moving to mainnet (archive all testnet records)

### How to Archive
```bash
# Archive old deployment
mkdir -p testnet/archive/v5.1
mv testnet/amoy-v5.1-* testnet/archive/v5.1/

# Update main record
echo "## Archived Deployments\nSee archive/ for old deployments" >> TESTNET_DEPLOYMENT.md

# Commit
git add testnet/
git commit -m "testnet: archive v5.1 deployment records"
```

---

## 🔗 Related Directories

### When Recording Deployments...
- **Contracts** → Reference `/contracts/` for source code
- **Scripts** → Link to `/contracts/scripts/deploy.js` used
- **Docs** → Update `/docs/` with new addresses
- **Frontend** → Update `.env.example` with addresses
- **Audits** → Note audit status in deployment record

### Cross-References
```markdown
## Related
- Source code: [contracts/](../contracts/)
- Deploy script: [contracts/scripts/deploy.js](../contracts/scripts/deploy.js)
- Documentation: [docs/testnet-deployment.md](../docs/testnet-deployment.md)
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
- Include private keys or mnemonics
- Commit deployment wallet addresses (deployer only, not keys)
- Forget to verify contracts
- Use production keys for testnet
- Skip documentation updates

### ✅ Do This Instead
- Only record public addresses
- Verify all contracts on block explorer
- Keep testnet and mainnet keys separate
- Update docs after deployment
- Link to block explorer for verification

---

## 🎯 Deployment Workflow

### Standard Process
1. **Deploy** contracts using scripts in `/contracts/scripts/`
2. **Verify** contracts on block explorer
3. **Record** addresses in `/testnet/TESTNET_DEPLOYMENT.md`
4. **Update** `/docs/` documentation
5. **Update** `/frontend/.env.example`
6. **Test** integration with new addresses
7. **Commit** all changes
8. **Announce** to team

### Emergency Redeployment
If contract has critical bug:
1. Deploy fixed version
2. Archive old deployment record
3. Create new deployment record
4. Update all references
5. Notify users/team immediately

---

## 📝 JSON Format for Addresses

### addresses.json
```json
{
  "network": "amoy",
  "chainId": 80002,
  "deployment": {
    "date": "2025-10-15T12:00:00Z",
    "version": "v5.2",
    "contracts": {
      "RDLN": {
        "address": "0x133029184EC460F661d05b0dC57BFC916b4AB0eB",
        "txHash": "0xabc...",
        "block": 12345678
      },
      "RON": {
        "address": "0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635",
        "txHash": "0xdef...",
        "block": 12345679
      },
      "RiddleNFT": {
        "address": "0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3",
        "txHash": "0xghi...",
        "block": 12345680
      }
    }
  }
}
```

---

## 🎯 Summary: Your Role

When working in `testnet/`:

✅ **DO:**
- Record all deployment addresses
- Link to block explorer
- Verify contracts
- Update documentation
- Archive old deployments
- Track deployment history

❌ **DON'T:**
- Include private keys
- Commit deployment credentials
- Forget to verify contracts
- Skip documentation updates
- Leave unverified contracts

**Goal:** Maintain accurate, public record of all testnet deployments for easy reference and integration.

---

**Related Files:**
- `../contracts/` - Contract source code
- `../docs/` - Documentation to update
- `../.claudeignore` - Files AI should never access
