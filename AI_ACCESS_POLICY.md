# 🤖 AI Access & Information Security Policy

**Last Updated:** October 2, 2025

This document defines what information AI assistants (Claude, GitHub Copilot, etc.) should and should **NOT** access in the Riddlen project.

---

## 🎯 Core Principles

1. **Zero Secrets Access**: AI assistants must NEVER read files containing secrets, keys, or credentials
2. **Privacy First**: Personal information, private keys, and sensitive data remain completely private
3. **You Control Access**: Only you have access to sensitive information
4. **Server Migration Security**: When moving servers, sensitive files never leave your control
5. **Public vs Private**: Clear separation between what's public (GitHub) and what stays private (server only)

---

## 🚫 NEVER Accessible to AI

### Environment & Configuration Files
```
❌ .env
❌ .env.local
❌ .env.production
❌ .env.development
❌ .env.*
❌ config.secret.js
❌ config.private.js
```

**Why:** These contain:
- Private keys for wallet accounts
- API keys for services (Alchemy, Infura, etc.)
- Database credentials
- WalletConnect project IDs
- Deployment secrets
- Service tokens

### Private Keys & Credentials
```
❌ *.key
❌ *.pem
❌ *.p12
❌ *.pfx
❌ id_rsa
❌ id_rsa.pub
❌ *.ppk
❌ keystore-*
❌ mnemonic.txt
❌ private-keys/
❌ secrets/
❌ credentials/
```

**Why:** These are cryptographic keys that control:
- Deployment wallets
- Contract ownership
- Server SSH access
- SSL/TLS certificates
- Signing keys

### Database & Backups
```
❌ *.db
❌ *.sqlite
❌ *.sqlite3
❌ *.backup
❌ *.bak
❌ backup/
❌ dumps/
```

**Why:** May contain:
- User data
- Private transaction history
- API usage logs
- Sensitive metadata

### Cloud Provider Credentials
```
❌ .aws/
❌ .gcloud/
❌ .azure/
❌ .do/
❌ *-credentials.json
❌ service-account-*.json
```

**Why:** These grant access to:
- Cloud infrastructure
- Hosted databases
- File storage
- DNS management

### Personal & Private Files
```
❌ PRIVATE*
❌ private/
❌ personal/
❌ notes/
❌ TODO-private.md
```

**Why:** Your personal notes and planning documents should remain private.

---

## ✅ Safe for AI to Access

### Public Configuration
```
✅ package.json
✅ tsconfig.json
✅ next.config.js
✅ tailwind.config.js
✅ hardhat.config.js (if no secrets)
✅ .env.example
✅ .env.template
```

**Why:** These contain only public configuration, no secrets.

### Documentation
```
✅ README.md
✅ CLAUDE.md
✅ *.md (documentation)
✅ docs/**/*
✅ DEPLOYMENT_README.md
✅ PORT_MAPPING.md
```

**Why:** Public information meant to be shared.

### Source Code
```
✅ *.js
✅ *.jsx
✅ *.ts
✅ *.tsx
✅ *.sol
✅ components/**/*
✅ pages/**/*
✅ contracts/**/*.sol
```

**Why:** Source code is public (on GitHub) and contains no secrets.

### Public Contract Information
```
✅ Deployed contract addresses
✅ ABIs (Application Binary Interfaces)
✅ Public blockchain data
✅ Testnet configuration
```

**Why:** All blockchain data is public by design.

---

## 🔐 How This is Enforced

### 1. `.claudeignore` File
Located at `/var/www/riddlen/.claudeignore`

This file lists all patterns that Claude should never access. Similar to `.gitignore`, but for AI assistants.

### 2. CLAUDE.md Files
Every directory has a `CLAUDE.md` file with explicit warnings:
- `/var/www/riddlen/CLAUDE.md` (root)
- `frontend/CLAUDE.md`
- `frontend-staging/CLAUDE.md`
- `contracts/CLAUDE.md`
- `riddlen-frames/CLAUDE.md`
- `riddlen-devlog/CLAUDE.md`

Each file contains:
```markdown
## ⚠️ IMPORTANT: Files to NEVER Access
- .env files (all variants)
- Private keys
- Secrets/credentials
- Database files

See `.claudeignore` in project root for complete list.
```

### 3. Git Exclusion
`.gitignore` already excludes these files from version control:
```gitignore
.env
.env.*
*.key
*.pem
secrets/
private-keys/
logs/
```

**This means they never get committed to GitHub - they stay only on your server.**

---

## 🔄 Server Migration Security

### When Moving to New Servers

**Sensitive Files (Manual Transfer Only):**
```bash
# These you transfer manually via secure methods:
.env
.env.local
.env.production
private-keys/
secrets/
credentials/
```

**Transfer Methods:**
1. **SSH/SCP** (encrypted transfer):
   ```bash
   scp .env user@new-server:/path/to/app/
   ```

2. **Encrypted USB** (for local transfer)

3. **Secure Password Manager** (for small configs)

4. **HashiCorp Vault / AWS Secrets Manager** (enterprise solution)

**Public Files (Can Use Git):**
```bash
# These can be cloned from GitHub:
Source code
Documentation
Public configs
Dockerfiles
```

### Migration Checklist

- [ ] **DO** back up all .env files locally
- [ ] **DO** transfer .env files via encrypted SSH/SCP
- [ ] **DO** verify .gitignore includes sensitive files
- [ ] **DO** test new server with .env in place
- [ ] **DO NOT** commit .env files to Git
- [ ] **DO NOT** send .env files via email/Slack
- [ ] **DO NOT** paste .env contents in AI chat
- [ ] **DO NOT** include secrets in docker-compose.yml

---

## 📋 Security Checklist

### Before Working with AI
- [ ] Review `.claudeignore` to confirm sensitive files are listed
- [ ] Check that `.env` files are not committed to Git
- [ ] Verify `CLAUDE.md` warnings are in place
- [ ] Confirm `.gitignore` includes all sensitive patterns

### During Development
- [ ] Never paste secret values in AI conversations
- [ ] Use placeholder values when discussing configs
- [ ] Reference `.env.example` instead of real `.env`
- [ ] Ask AI to read public docs, not private files

### After Server Changes
- [ ] Rotate any keys that may have been exposed
- [ ] Verify new `.env` files have correct permissions (600)
- [ ] Test that apps start with new environment
- [ ] Confirm secrets are not in Git history

---

## 🛠️ Practical Examples

### ❌ DON'T Do This
```bash
# User to AI: "Read my .env file and tell me what's wrong"
# AI should REFUSE this request
```

### ✅ DO This Instead
```bash
# User to AI: "I'm getting an error about missing NEXT_PUBLIC_CHAIN_ID.
# What should I add to my .env file?"
# AI can suggest: "Add NEXT_PUBLIC_CHAIN_ID=80002 to your .env.local file"
# AI never reads the actual file
```

### ❌ DON'T Do This
```bash
# User: "Here's my .env file: PRIVATE_KEY=0x123456..."
# Never paste actual secrets
```

### ✅ DO This Instead
```bash
# User: "I need to configure a deployment wallet. What environment
# variables should I set?"
# AI: "Add these to your .env.local (use your actual values):
#   DEPLOYER_PRIVATE_KEY=your_key_here
#   ALCHEMY_API_KEY=your_key_here"
```

---

## 🚀 Server Deployment Security

### Production .env Template
```bash
# Never commit this file
# Copy to .env.production on server and fill in real values

# Blockchain
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology/
ALCHEMY_API_KEY=<your_key_here>

# Contracts (public addresses - safe to share)
NEXT_PUBLIC_RDLN_CONTRACT=0x133029184EC460F661d05b0dC57BFC916b4AB0eB
NEXT_PUBLIC_RON_CONTRACT=0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635
NEXT_PUBLIC_RIDDLE_CONTRACT=0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3

# Deployment (KEEP SECRET)
DEPLOYER_PRIVATE_KEY=<never_commit_this>
ADMIN_WALLET=<never_commit_this>

# Services (KEEP SECRET)
WALLETCONNECT_PROJECT_ID=<never_commit_this>
ETHERSCAN_API_KEY=<never_commit_this>
```

### File Permissions
```bash
# Set restrictive permissions on sensitive files
chmod 600 .env
chmod 600 .env.production
chmod 700 secrets/
chmod 600 secrets/*
```

---

## 📞 If Something Goes Wrong

### If You Accidentally Exposed a Secret

1. **Immediately rotate the key/secret**
   - Generate new private key
   - Get new API key from service
   - Update `.env` file

2. **Remove from Git history** (if committed):
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Check for leaked funds** (if wallet key):
   - Check balance on blockchain explorer
   - Transfer funds to new wallet immediately

4. **Revoke API keys**:
   - Alchemy, Infura, WalletConnect, etc.
   - Generate new keys

---

## ✅ Summary: Your Information is Protected

### What AI Assistants CAN Do
✅ Read public source code
✅ Read documentation
✅ Suggest environment variable names
✅ Review public configurations
✅ Help with deployment strategies
✅ Write code that uses environment variables

### What AI Assistants CANNOT Do
❌ Read .env files
❌ Access private keys
❌ See your secrets
❌ Read credentials
❌ Access databases
❌ View personal notes

### Your Guarantees
1. **Only you** see sensitive files (.env, keys, secrets)
2. **Git never stores** sensitive files (via .gitignore)
3. **AI never reads** sensitive files (via .claudeignore + CLAUDE.md)
4. **Server migration** keeps secrets under your control
5. **If exposed accidentally**, you can immediately rotate keys

---

## 🔗 Related Documents

- **`.claudeignore`** - Complete list of restricted files
- **`CLAUDE.md`** - Root AI assistant configuration
- **`SECURITY.md`** - Vulnerability reporting policy
- **`.gitignore`** - Git exclusion patterns
- **`DEPLOYMENT_README.md`** - Deployment procedures

---

**Your security and privacy are paramount. This policy ensures that AI assistants help you build, without ever accessing your sensitive information.** 🔒

*If you have questions or concerns about this policy, you're the only one who can modify it.*
