# Claude Code Configuration - Documentation Directory

**Directory Purpose:** GitHub Pages documentation site (riddlen.org)

## 🎯 What This Directory Is For

This directory contains **public-facing documentation** that gets published to **riddlen.org** via GitHub Pages.

### Content Types
- Technical integration guides
- API documentation
- Contract documentation
- User guides (how to play, tokenomics)
- Developer guides (frontend integration)
- Architecture documentation
- Deployment guides (testnet info)

### What Lives Here
- ✅ Markdown documentation files
- ✅ Integration guides
- ✅ Public contract ABIs and addresses
- ✅ Architecture diagrams
- ✅ User-facing tutorials
- ✅ Developer onboarding docs

### What Does NOT Live Here
- ❌ .env files or secrets
- ❌ Private deployment keys
- ❌ Internal strategy documents
- ❌ Private notes (use `/devlogs/`)
- ❌ Application code (use `/frontend/`, etc.)
- ❌ Smart contracts (use `/contracts/`)

---

## 📁 Stay In Your Lane

### Work ONLY on documentation files in this directory
- Don't modify frontend code from here
- Don't change smart contracts from here
- Don't touch deployment configs from here

### When you need to reference other directories:
- **Link to them** in documentation
- **Don't duplicate** code or configs
- **Reference canonical sources** (e.g., "See `/contracts/` for source")

---

## 🔒 Security Policy

### ⚠️ Files to NEVER Access
- `.env` files (all variants)
- Private keys (`*.key`, `*.pem`, etc.)
- Secrets/credentials
- Database files

### Public Information Only
- ✅ Deployed contract addresses (public on blockchain)
- ✅ Public ABIs
- ✅ Testnet configuration (public networks)
- ❌ Private keys, mnemonics, or deployment secrets

See `../.claudeignore` for complete list.

---

## 🔄 Git Workflow

### Before Making Changes
```bash
# 1. Make sure you're in docs/
cd /var/www/riddlen/docs

# 2. Check git status
git status

# 3. Create feature branch if needed
git checkout -b docs/update-integration-guide
```

### Making Changes
1. **Edit documentation files** (*.md)
2. **Test links** - ensure all links work
3. **Check formatting** - preview markdown rendering
4. **Verify accuracy** - ensure technical details are correct

### Testing Your Changes
```bash
# Preview locally (if Jekyll/GitHub Pages setup)
bundle exec jekyll serve

# Or use markdown preview in editor
# Verify all links work
# Check code snippets are correct
```

### Committing Changes
```bash
# Add only docs files
git add docs/

# Commit with clear message
git commit -m "docs: update frontend integration guide with Wagmi v2 examples"

# Push to branch
git push origin docs/update-integration-guide
```

### Commit Message Format
```
docs: <what you changed>

Examples:
- docs: add RON reputation tier guide
- docs: update contract addresses for mainnet
- docs: fix broken links in integration guide
- docs: improve tokenomics documentation
```

---

## ✅ Testing & Verification

### Before Committing
- [ ] All markdown files render correctly
- [ ] All links work (internal and external)
- [ ] Code snippets are accurate and tested
- [ ] Contract addresses are correct
- [ ] No typos or formatting issues
- [ ] No sensitive information included

### Validation Checklist
1. **Links**: Click every link to verify
2. **Code**: Test any code snippets
3. **Addresses**: Verify contract addresses on block explorer
4. **Formatting**: Check headers, lists, code blocks
5. **Images**: Ensure any images load correctly

---

## 📋 Audit & Review

### Self-Audit Before Commit
- **Accuracy**: Is all technical information correct?
- **Completeness**: Does this fully explain the topic?
- **Clarity**: Can a new developer/user understand this?
- **Up-to-date**: Are contract addresses current?
- **Security**: No secrets or private info exposed?

### Peer Review (Optional)
For major documentation updates:
```bash
# Create pull request for review
gh pr create --title "docs: major update to integration guide" \
  --body "Updated integration guide with latest contract changes"
```

---

## 🧹 Keep It Clean

### File Organization
```
docs/
├── README.md              # Index/overview
├── integration/           # Integration guides
├── contracts/             # Contract documentation
├── guides/                # User guides
├── api/                   # API reference
└── architecture/          # System architecture
```

### Naming Conventions
- Use kebab-case: `frontend-integration.md`
- Be descriptive: `ron-reputation-tiers.md` not `tiers.md`
- Group by topic: `contracts/rdln-token.md`

### Regular Cleanup
```bash
# Remove outdated docs
mv old-guide.md archive/

# Update stale information
grep -r "TODO" docs/  # Find incomplete docs
grep -r "OUTDATED" docs/  # Find docs marked for update
```

---

## 📦 Archive Strategy

### When to Archive
- Documentation for deprecated features
- Old contract versions (after migration)
- Outdated integration guides
- Superseded tutorials

### How to Archive
```bash
# Create archive directory if needed
mkdir -p docs/archive/v1

# Move old docs
mv docs/old-integration-guide.md docs/archive/v1/

# Add note in main doc
echo "See archive/v1/ for legacy documentation" >> README.md

# Commit archive
git add docs/archive/
git commit -m "docs: archive v1 integration guides"
```

### Archive Structure
```
docs/archive/
├── v1/           # Version 1 docs
├── v2/           # Version 2 docs
└── deprecated/   # Deprecated features
```

---

## 📝 Documentation Standards

### Markdown Formatting
- Use clear headings (H1, H2, H3)
- Include code blocks with language hints
- Add links to related docs
- Use tables for structured data
- Include examples

### Code Examples
```javascript
// ✅ Good: Include context and comments
import { useAccount } from 'wagmi';

// Connect wallet and get address
const { address } = useAccount();

// ❌ Bad: No context
const { address } = useAccount();
```

### Contract Addresses
Always specify network:
```markdown
## Contract Addresses

### Polygon Amoy Testnet (Chain ID: 80002)
- RDLN: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- RON: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
```

---

## 🔗 Related Directories

### When Documenting...
- **Frontend features** → Reference `/frontend/`, don't duplicate code
- **Smart contracts** → Link to `/contracts/`, include ABIs here
- **Deployment** → Reference `/testnet/` for addresses
- **Testing** → Link to `/test/` for test examples
- **Security** → Reference `/audits/` for audit reports

### Cross-References
```markdown
For contract source code, see [contracts/](../contracts/)
For testnet addresses, see [testnet deployment](../testnet/TESTNET_DEPLOYMENT.md)
```

---

## 🚀 Publishing to riddlen.org

### GitHub Pages Setup
This directory publishes to **riddlen.org** via GitHub Pages.

### Publication Workflow
1. Commit changes to `main` branch (or `docs` branch)
2. GitHub Actions automatically builds site
3. Changes appear on riddlen.org within minutes

### Preview Before Publishing
```bash
# Test locally before pushing
bundle exec jekyll serve --watch

# Visit http://localhost:4000
# Verify changes look correct
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
- Hardcode private keys or secrets in examples
- Copy/paste code from other directories without attribution
- Create duplicate documentation (check if it exists first)
- Commit broken links or incorrect addresses
- Include outdated contract addresses

### ✅ Do This Instead
- Use placeholder values: `PRIVATE_KEY=your_key_here`
- Link to source: "See implementation in `/frontend/`"
- Update existing docs rather than creating new ones
- Test all links before committing
- Verify addresses on block explorer

---

## 📊 Documentation Metrics

### Keep Track Of
- Last updated date (add to each doc)
- Version compatibility
- Deprecated status
- Related PRs or issues

### Add Frontmatter
```markdown
---
title: Frontend Integration Guide
last_updated: 2025-10-02
version: 5.2
status: current
---
```

---

## 🎯 Summary: Your Role

When working in `docs/`:

✅ **DO:**
- Write clear, accurate documentation
- Test all code examples
- Verify contract addresses
- Keep docs up-to-date
- Archive outdated information
- Stay in the docs/ directory

❌ **DON'T:**
- Modify application code
- Change smart contracts
- Touch deployment configs
- Include secrets or private keys
- Duplicate content from other directories

**Goal:** Maintain high-quality public documentation for riddlen.org that helps developers and users understand and integrate with Riddlen.

---

**Related Files:**
- `../.claudeignore` - Files AI should never access
- `../CLAUDE.md` - Root configuration
- `../AI_ACCESS_POLICY.md` - Security policy
