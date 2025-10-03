# Claude Code Configuration - Audits Directory

**Directory Purpose:** Security audit reports and findings

## 🎯 What This Directory Is For

This directory stores **security audit reports**, **vulnerability assessments**, and **audit-related documentation** for the Riddlen platform.

### Content Types
- Professional security audit reports
- Internal security reviews
- Vulnerability assessments
- Penetration test results
- Bug bounty reports
- Security recommendations
- Remediation documentation

### What Lives Here
- ✅ PDF/Markdown audit reports
- ✅ Security findings and recommendations
- ✅ Vulnerability disclosures (after fixes)
- ✅ Audit response documents
- ✅ Security checklists
- ✅ Remediation tracking

### What Does NOT Live Here
- ❌ Active/unpatched vulnerability details (handle privately first)
- ❌ .env files or secrets
- ❌ Private keys
- ❌ Smart contract source code (use `/contracts/`)
- ❌ Test code (use `/test/`)

---

## 📁 Stay In Your Lane

### Work ONLY on audit documentation in this directory
- Don't modify smart contracts from here
- Don't change tests from here
- Don't touch deployment scripts

### When findings require code changes:
- **Document the issue here**
- **Reference the fix** in `/contracts/` or `/frontend/`
- **Don't duplicate code** - link to the fix

---

## 🔒 Security Policy

### ⚠️ CRITICAL: Handling Vulnerabilities

**NEVER commit active vulnerabilities to Git until they are fixed**

### Process for New Vulnerabilities
1. **Report privately** (see `/SECURITY.md`)
2. **Fix the issue** in relevant code
3. **Deploy the fix**
4. **Then document** in `/audits/`
5. **Coordinate disclosure** timeline

### Files to NEVER Access
- `.env` files
- Private keys
- Unpatched vulnerability exploits (keep private)
- Active attack vectors

See `../.claudeignore` for complete list.

---

## 📋 Audit Report Structure

### Naming Convention
```
audits/
├── [DATE]-[AUDITOR]-[TYPE].md
├── 2025-10-01-internal-security-review.md
├── 2025-11-15-certik-smart-contract-audit.pdf
├── 2025-12-01-bug-bounty-report-001.md
└── archive/
    └── 2024-09-15-preliminary-review.md
```

### Report Template
```markdown
# Security Audit Report

## Audit Information
- **Date**: YYYY-MM-DD
- **Auditor**: Name/Organization
- **Type**: Smart Contract / Frontend / Infrastructure
- **Scope**: What was audited
- **Commit**: Git commit hash

## Executive Summary
Brief overview of findings

## Findings

### Critical (Severity: Critical)
- **Finding ID**: AUDIT-001
- **Title**: [Issue title]
- **Severity**: Critical
- **Status**: Fixed / In Progress / Acknowledged
- **Description**: Detailed description
- **Impact**: What could happen
- **Recommendation**: How to fix
- **Fix Commit**: Link to fix (if resolved)

### High (Severity: High)
...

### Medium (Severity: Medium)
...

### Low (Severity: Low)
...

### Informational
...

## Recommendations
General security improvements

## Conclusion
Overall assessment
```

---

## 🔄 Git Workflow

### Before Adding Audit Reports
```bash
# 1. Ensure vulnerability is FIXED first
# 2. Coordinate disclosure timeline
# 3. Get approval from team

cd /var/www/riddlen/audits
git status
```

### Adding New Audit Report
```bash
# Create report file
touch 2025-10-15-internal-security-review.md

# Write report content
# Include findings, status, fixes

# Add to git
git add audits/2025-10-15-internal-security-review.md

# Commit with clear message
git commit -m "audit: add October 2025 internal security review"

# Push
git push origin main
```

### Commit Message Format
```
audit: <what audit this is>

Examples:
- audit: add CertiK smart contract audit report
- audit: add bug bounty report for UI vulnerability
- audit: update remediation status for AUDIT-005
- audit: add Q4 2025 security review
```

---

## ✅ Verification Before Commit

### Pre-Commit Checklist
- [ ] All critical/high vulnerabilities are **FIXED**
- [ ] Disclosure timeline coordinated
- [ ] No active exploit code included
- [ ] No private keys or secrets in report
- [ ] Fix commits referenced properly
- [ ] Report reviewed by security lead

### Sensitivity Check
- ❌ **Don't include**: Exploit code, attack scripts, private keys
- ✅ **Do include**: Description, impact, recommendation, fix reference

---

## 📊 Tracking Audit Findings

### Create Tracking Document
```markdown
# Audit Findings Tracker

## Active Findings

| ID | Severity | Title | Status | Assigned | Due Date |
|----|----------|-------|--------|----------|----------|
| AUDIT-001 | Critical | Reentrancy in withdraw | Fixed | @dev | 2025-10-10 |
| AUDIT-002 | High | Access control bypass | In Progress | @dev | 2025-10-15 |

## Resolved Findings

| ID | Severity | Title | Fixed Date | Commit |
|----|----------|-------|------------|--------|
| AUDIT-000 | Critical | Integer overflow | 2025-09-30 | abc123 |
```

---

## 🧹 Keep It Clean

### File Organization
```
audits/
├── README.md              # Overview of all audits
├── TRACKER.md             # Active findings tracker
├── 2025-10-01-internal.md
├── 2025-11-15-certik.pdf
├── remediation/
│   ├── AUDIT-001-fix.md
│   └── AUDIT-002-fix.md
└── archive/
    └── 2024/
        └── old-audits.md
```

### Regular Cleanup
```bash
# Archive old reports (after findings resolved)
mkdir -p audits/archive/2024
mv audits/2024-*.md audits/archive/2024/

# Update tracker
# Remove resolved findings from active list
```

---

## 📦 Archive Strategy

### When to Archive
- Audit is more than 1 year old
- All findings are resolved
- New audit supersedes old one
- Pre-mainnet audits (after mainnet launch)

### How to Archive
```bash
# Move to archive
mkdir -p audits/archive/2024
mv audits/2024-* audits/archive/2024/

# Update README
echo "## Archived Audits\nSee archive/ for historical audits" >> README.md

# Commit
git add audits/
git commit -m "audit: archive 2024 audit reports"
```

---

## 🔗 Related Directories

### When Auditing...
- **Smart contracts** → Reference `/contracts/` for source code
- **Tests** → Link to `/test/` for test coverage
- **Frontend** → Reference `/frontend/` for UI security
- **Deployment** → Link to `/scripts/` for deployment security
- **Documentation** → Update `/docs/` with security notes

### Cross-References
```markdown
## Related
- Source code: [contracts/RiddleNFT.sol](../contracts/contracts/RiddleNFT.sol)
- Fix commit: [abc123](https://github.com/org/repo/commit/abc123)
- Test coverage: [test/RiddleNFT.test.js](../test/RiddleNFT.test.js)
```

---

## 🚨 Responsible Disclosure

### For Bug Bounty Reports
1. Report received → Create private issue
2. Verify vulnerability
3. Assign severity
4. Develop fix
5. Deploy fix
6. Verify fix works
7. **Then** document in `/audits/`
8. Pay bounty
9. Public disclosure (coordinated)

### Disclosure Timeline
- **Critical**: Fix immediately, disclose in 7-14 days
- **High**: Fix within 7 days, disclose in 30 days
- **Medium**: Fix within 30 days, disclose in 60 days
- **Low**: Fix within 60 days, disclose in 90 days

---

## 📋 Audit Checklist

### For Internal Audits
- [ ] Smart contract reentrancy checks
- [ ] Access control verification
- [ ] Integer overflow/underflow checks
- [ ] Front-running mitigation
- [ ] Gas optimization review
- [ ] Event logging adequacy
- [ ] Input validation
- [ ] Emergency pause mechanisms

### For External Audits
- [ ] Select reputable auditor
- [ ] Define scope clearly
- [ ] Provide clean codebase
- [ ] Respond to findings promptly
- [ ] Implement recommendations
- [ ] Get re-audit for critical fixes
- [ ] Publish report (after fixes)

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
- Commit unpatched vulnerabilities
- Include exploit code
- Rush disclosure before fix
- Ignore low/informational findings
- Skip retesting after fixes

### ✅ Do This Instead
- Fix first, disclose later
- Describe vulnerability without exploit code
- Coordinate disclosure timeline
- Address all findings (prioritize by severity)
- Verify fixes with tests

---

## 🎯 Summary: Your Role

When working in `audits/`:

✅ **DO:**
- Document fixed vulnerabilities
- Track remediation progress
- Coordinate responsible disclosure
- Reference fixes in other directories
- Archive old audit reports
- Keep findings tracker up-to-date

❌ **DON'T:**
- Commit active vulnerabilities
- Include exploit code
- Expose unpatched issues
- Modify smart contracts here
- Skip verification steps

**Goal:** Maintain transparent security audit trail while protecting users until fixes are deployed.

---

**Related Files:**
- `../SECURITY.md` - Vulnerability reporting policy
- `../contracts/` - Smart contract source code
- `../test/` - Security test coverage
- `../.claudeignore` - Files AI should never access
