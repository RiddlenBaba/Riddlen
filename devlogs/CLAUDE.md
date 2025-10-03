# Claude Code Configuration - Devlogs Directory

**Directory Purpose:** Local development log files and notes

## 🎯 What This Directory Is For

**Private development notes, logs, and planning documents** that DON'T go on-chain.

### What Lives Here
- ✅ Development notes (private)
- ✅ Planning documents
- ✅ Local brainstorming
- ✅ TODO lists
- ✅ Meeting notes

### What Does NOT Live Here
- ❌ Public documentation (use `/docs/`)
- ❌ On-chain devlog posts (use `/riddlen-devlog/` app)
- ❌ .env files or secrets
- ❌ Application code

---

## 📁 Stay In Your Lane

- Keep notes private (don't commit sensitive info)
- Use `/riddlen-devlog/` app for public on-chain posts
- Use `/docs/` for public documentation

---

## 🔒 Security Policy

### Private Notes
This directory is for **YOUR PRIVATE NOTES** only.

### ⚠️ Before Committing
Check that notes don't contain:
- ❌ Private keys or mnemonics
- ❌ Passwords or API keys
- ❌ Sensitive strategy information
- ❌ Personal information

If notes are sensitive, add to `.gitignore`:
```bash
echo "devlogs/private-notes.md" >> .gitignore
```

See `../.claudeignore` for files AI should never read.

---

## 🔄 Git Workflow

```bash
cd /var/www/riddlen/devlogs

# Create note
vim 2025-10-15-infrastructure-planning.md

# Review before committing (check for secrets)
cat 2025-10-15-infrastructure-planning.md

# If safe to share:
git add devlogs/2025-10-15-infrastructure-planning.md
git commit -m "devlogs: add infrastructure planning notes"

# If private:
echo "devlogs/2025-10-15-infrastructure-planning.md" >> .gitignore
```

### Commit Messages
```
devlogs: <what note is about>

Examples:
- devlogs: add Q4 2025 planning notes
- devlogs: update roadmap priorities
- devlogs: add meeting notes from Oct 15
```

---

## 🧹 Keep It Clean

### File Organization
```
devlogs/
├── 2025-10-15-infrastructure.md
├── 2025-10-20-security-review.md
├── planning/
│   ├── roadmap-q4-2025.md
│   └── feature-priorities.md
└── archive/
    └── 2024/
```

### Regular Cleanup
```bash
# Archive old notes
mkdir -p devlogs/archive/2024
mv devlogs/2024-*.md devlogs/archive/2024/

# Commit
git add devlogs/
git commit -m "devlogs: archive 2024 development notes"
```

---

## 📦 Archive Strategy

Archive:
- Old planning documents (after completion)
- Outdated roadmaps
- Historical notes

```bash
mv devlogs/old-roadmap.md devlogs/archive/
git commit -m "devlogs: archive old roadmap"
```

---

## 🔗 Related Directories

### Devlog vs Docs vs Riddlen-Devlog
- **`/devlogs/`** → Private notes (local)
- **`/docs/`** → Public documentation (riddlen.org)
- **`/riddlen-devlog/`** → On-chain blog (devlog.riddlen.com)

### When to Use Each
- **Private brainstorming** → `/devlogs/`
- **Public docs** → `/docs/`
- **On-chain announcements** → Post via `/riddlen-devlog/` app

---

## 🎯 Summary

✅ **DO:**
- Keep private development notes
- Review before committing
- Archive old notes
- Use for planning and brainstorming

❌ **DON'T:**
- Commit secrets or private keys
- Use for public documentation
- Duplicate on-chain devlog posts here

**Goal:** Maintain organized development notes while keeping sensitive information private.

---

**Related Files:**
- `../docs/` - Public documentation
- `../riddlen-devlog/` - On-chain blog app
- `../.gitignore` - Exclude private notes
- `../.claudeignore` - Restricted files
