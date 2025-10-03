# Riddlen Directory Structure & AI Configuration Guide

**Last Updated:** October 2, 2025

This document explains the complete Riddlen repository structure and AI assistant configuration system.

---

## 📁 Complete Directory Structure

```
/var/www/riddlen/
├── CLAUDE.md                    # Root AI configuration
├── .claudeignore                # AI access restrictions
├── AI_ACCESS_POLICY.md          # Security policy
├── PORT_MAPPING.md              # Port assignments
├── SCALING_GUIDE.md             # Infrastructure scaling
├── DEPLOYMENT_README.md         # Deployment guide
├── DIRECTORY_GUIDE.md           # This file
├── ecosystem.config.js          # PM2 configuration
├── docker-compose.yml           # Container orchestration
├── nginx-upstream-example.conf  # Load balancer config
│
├── frontend/                    # Main site (Port 3000)
│   ├── CLAUDE.md               # Frontend AI config
│   ├── Dockerfile              # Container config
│   ├── .dockerignore           # Docker exclusions
│   └── .claude_docs/           # AI context files
│
├── frontend-staging/            # Staging site (Port 3001)
│   ├── CLAUDE.md               # Staging AI config
│   ├── Dockerfile              # Container config
│   └── .claude_docs/           # AI context files
│
├── riddlen-frames/              # Farcaster frames (Port 3002)
│   ├── CLAUDE.md               # Frames AI config
│   ├── Dockerfile              # Container config
│   └── .claude_docs/           # AI context files
│
├── riddlen-devlog/              # On-chain blog (Port 3004)
│   ├── CLAUDE.md               # Devlog AI config
│   ├── Dockerfile              # Container config
│   └── .claude_docs/           # AI context files
│
├── contracts/                   # Smart contracts
│   ├── CLAUDE.md               # Contracts AI config
│   └── contracts/              # Solidity source code
│
├── docs/                        # Public documentation (riddlen.org)
│   └── CLAUDE.md               # Docs AI config
│
├── audits/                      # Security audit reports
│   └── CLAUDE.md               # Audits AI config
│
├── testnet/                     # Deployment records
│   └── CLAUDE.md               # Testnet AI config
│
├── scripts/                     # Utility scripts
│   ├── CLAUDE.md               # Scripts AI config
│   └── check-ports.sh          # Port conflict detector
│
├── test/                        # Test files
│   └── CLAUDE.md               # Test AI config
│
├── docker/                      # Docker configs
│   ├── CLAUDE.md               # Docker AI config
│   └── nginx.conf              # Container nginx
│
├── devlogs/                     # Private dev notes
│   └── CLAUDE.md               # Devlogs AI config
│
├── riddlen-theme/               # Shared design system
│   └── CLAUDE.md               # Theme AI config
│
├── logs/                        # Runtime logs
│   └── CLAUDE.md               # Logs AI config
│
└── .claude_docs/                # Root AI context
    ├── port-configuration.md    # Port info
    └── server-management.md     # Server info
```

---

## 🎯 Directory Purposes

### 🌐 Frontend Applications (4 apps)

| Directory | Port | Domain | Purpose |
|-----------|------|--------|---------|
| `frontend/` | 3000 | riddlen.com | Main production site |
| `frontend-staging/` | 3001 | staging.riddlen.com | Staging environment |
| `riddlen-frames/` | 3002 | frames.riddlen.com | Farcaster frames |
| `riddlen-devlog/` | 3004 | devlog.riddlen.com | On-chain blog |

### 📜 Smart Contracts

| Directory | Purpose |
|-----------|---------|
| `contracts/` | Solidity smart contracts, deployment scripts, tests |

### 📚 Documentation & Records

| Directory | Purpose | Public/Private |
|-----------|---------|----------------|
| `docs/` | GitHub Pages documentation (riddlen.org) | Public |
| `audits/` | Security audit reports | Public (after fixes) |
| `testnet/` | Deployment records and addresses | Public |
| `devlogs/` | Private development notes | Private |

### 🛠️ Infrastructure & Tools

| Directory | Purpose |
|-----------|---------|
| `scripts/` | Utility and automation scripts |
| `test/` | Cross-project test files |
| `docker/` | Docker configuration files |
| `logs/` | PM2 and application logs |
| `riddlen-theme/` | Shared design system |

---

## 🤖 AI Configuration System

### 3-Layer Security System

1. **`.claudeignore`** (Root)
   - Lists files AI should NEVER access
   - .env files, private keys, secrets, etc.

2. **`CLAUDE.md`** (Every Directory)
   - Directory-specific configuration
   - What AI can/cannot do
   - Git workflow
   - Testing requirements
   - Security policy

3. **`.claude_docs/`** (App Directories)
   - Additional context files
   - Port configuration
   - Server management info

---

## 📋 What Each CLAUDE.md Contains

Every `CLAUDE.md` file includes:

1. **Purpose** - What this directory is for
2. **What Lives Here** - File types that belong
3. **What Does NOT Live Here** - What to avoid
4. **Stay In Your Lane** - Work boundaries
5. **Security Policy** - Files to never access
6. **Git Workflow** - How to commit changes
7. **Testing** - What to test before committing
8. **Audit & Review** - Verification steps
9. **Keep It Clean** - Organization standards
10. **Archive Strategy** - When/how to archive
11. **Related Directories** - Cross-references
12. **Common Mistakes** - What to avoid
13. **Summary** - Quick reference

---

## 🔒 Security Guarantees

### AI Assistants NEVER Access:
- ❌ `.env` files (all variants)
- ❌ Private keys (*.key, *.pem, id_rsa, etc.)
- ❌ Secrets/credentials
- ❌ Database files
- ❌ Cloud provider credentials
- ❌ API keys or tokens
- ❌ Deployment wallet keys

### AI Assistants CAN Access:
- ✅ Source code
- ✅ Public documentation
- ✅ Public configurations
- ✅ Test files
- ✅ Build configs
- ✅ Public contract addresses

---

## 🔄 Git Workflow Standards

### Every Directory Follows:

1. **Check current state**
   ```bash
   git status
   ```

2. **Make changes** in appropriate directory

3. **Test changes**
   - Run tests
   - Verify functionality
   - Check for errors

4. **Stage changes**
   ```bash
   git add [directory]/[file]
   ```

5. **Commit with clear message**
   ```bash
   git commit -m "[directory]: [what changed]"
   ```

6. **Push to remote**
   ```bash
   git push origin main
   ```

### Commit Message Format

```
[directory]: <concise description>

Examples:
- frontend: add wallet connection modal
- contracts: fix reentrancy vulnerability in withdraw
- docs: update integration guide with Wagmi v2
- scripts: add database backup automation
- audits: add October 2025 security audit report
- testnet: update deployment addresses for v5.2
```

---

## ✅ Testing Requirements

### Before Committing (All Directories):
- [ ] Changes work as expected
- [ ] No errors in console/logs
- [ ] Tests pass (if applicable)
- [ ] No secrets accidentally included
- [ ] Documentation updated (if needed)
- [ ] Cross-references updated (if needed)

### Directory-Specific Testing:
- **Frontend**: Run locally, test features
- **Contracts**: Run test suite, check coverage
- **Scripts**: Execute with test data
- **Docs**: Preview markdown rendering
- **Docker**: Validate configs

---

## 🧹 Organization Standards

### File Naming
- Use kebab-case: `integration-guide.md`
- Be descriptive: `rdln-token-contract.md`
- Add dates for logs: `2025-10-15-deployment.md`

### Directory Cleanliness
- Archive old files regularly
- Remove unused code
- Update stale documentation
- Rotate large logs

### Archive When:
- Files are deprecated
- Features are removed
- Old versions superseded
- Historical records (keep for reference)

---

## 🔗 Cross-Directory Relationships

### Common Patterns:

**Documentation References:**
```markdown
For source code, see [contracts/](../contracts/)
For deployment info, see [testnet/TESTNET_DEPLOYMENT.md](../testnet/TESTNET_DEPLOYMENT.md)
```

**Scripts Reference:**
```bash
# Reference configs
CONFIG_FILE="../ecosystem.config.js"

# Check other directories
if [ ! -d "../frontend" ]; then
    echo "Error: frontend directory not found"
    exit 1
fi
```

**Tests Reference:**
```javascript
// Import from contracts
const RiddleNFT = artifacts.require("../contracts/contracts/RiddleNFT.sol");
```

---

## 📊 Directory-to-Domain Mapping

| Directory | Domain | Port | Purpose |
|-----------|--------|------|---------|
| `frontend/` | riddlen.com, www.riddlen.com, app.riddlen.com | 3000 | Main site |
| `frontend-staging/` | staging.riddlen.com | 3001 | Staging |
| `riddlen-frames/` | frames.riddlen.com | 3002 | Frames |
| `riddlen-devlog/` | devlog.riddlen.com | 3004 | Blog |
| `docs/` | riddlen.org | - | GitHub Pages |

**See `PORT_MAPPING.md` for complete port reference.**

---

## 🎯 Best Practices Summary

### For AI Assistants:
1. **Always check** which directory you're in
2. **Read that directory's** `CLAUDE.md` first
3. **Stay in your lane** - don't modify unrelated files
4. **Never access** files in `.claudeignore`
5. **Test before committing** - run validation
6. **Follow git workflow** - commit messages matter
7. **Keep it clean** - archive old files
8. **Document changes** - update related docs

### For Developers:
1. **Check `CLAUDE.md`** when working in any directory
2. **Follow directory conventions** - keep files organized
3. **Test before committing** - verify changes work
4. **Update documentation** - keep docs in sync
5. **Archive regularly** - keep directories clean
6. **Never commit secrets** - check before pushing
7. **Use port checker** - `./scripts/check-ports.sh`
8. **Follow security policy** - see `AI_ACCESS_POLICY.md`

---

## 🚀 Quick Reference

### Find Information:
```bash
# Which directory am I in?
pwd

# What's the purpose of this directory?
cat CLAUDE.md | head -20

# What files should AI never access?
cat .claudeignore

# What ports are in use?
./scripts/check-ports.sh

# What are the deployment addresses?
cat testnet/TESTNET_DEPLOYMENT.md

# How do I deploy?
cat DEPLOYMENT_README.md
```

### Common Tasks:
```bash
# Start all apps
pm2 start ecosystem.config.js

# Check port conflicts
./scripts/check-ports.sh

# View logs
pm2 logs riddlen-main

# Test Docker setup
docker-compose up -d

# Build contracts
cd contracts && npx hardhat compile

# Run tests
cd contracts && npx hardhat test
```

---

## 📞 Need Help?

**Reference Files:**
- `CLAUDE.md` (in current directory) - Directory-specific guide
- `PORT_MAPPING.md` - Port assignments
- `AI_ACCESS_POLICY.md` - Security policy
- `DEPLOYMENT_README.md` - Deployment guide
- `SCALING_GUIDE.md` - Infrastructure scaling
- `SECURITY.md` - Vulnerability reporting

**Per-Directory Guides:**
- Each directory has its own `CLAUDE.md`
- Read it first before making changes
- Follow its specific guidelines

---

## ✅ System Complete

Your Riddlen repository now has:

✅ **15 CLAUDE.md files** - One in every directory
✅ **`.claudeignore`** - AI access restrictions
✅ **`AI_ACCESS_POLICY.md`** - Comprehensive security policy
✅ **Clear boundaries** - Each directory knows its role
✅ **Git best practices** - Consistent workflow
✅ **Testing requirements** - Quality standards
✅ **Security enforcement** - Triple-layer protection
✅ **Organization standards** - Clean, maintainable structure

**Your code is organized, secure, and AI assistants know exactly what to do (and what NOT to do) in every directory.** 🎯

---

*Last updated: October 2, 2025*
*For questions or updates, modify this file and relevant CLAUDE.md files.*
