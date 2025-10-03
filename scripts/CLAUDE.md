# Claude Code Configuration - Scripts Directory

**Directory Purpose:** Utility and automation scripts

## 🎯 What This Directory Is For

This directory contains **utility scripts**, **automation tools**, and **helper scripts** for infrastructure, deployment, and maintenance tasks.

### Content Types
- Port conflict detection scripts
- Server management utilities
- Deployment helpers
- Database backup scripts
- Log rotation scripts
- Monitoring scripts
- Cleanup utilities

### What Lives Here
- ✅ Shell scripts (*.sh)
- ✅ Node.js utility scripts (*.js)
- ✅ Python automation scripts (*.py)
- ✅ Infrastructure helpers
- ✅ Maintenance tools

### What Does NOT Live Here
- ❌ Smart contract deployment scripts (use `/contracts/scripts/`)
- ❌ .env files or secrets
- ❌ Private keys
- ❌ Application code (use `/frontend/`, etc.)
- ❌ Test files (use `/test/`)

---

## 📁 Stay In Your Lane

### Work ONLY on utility scripts
- Don't modify application code from here
- Don't change smart contracts from here
- Don't touch frontend code from here

### When creating new scripts:
- **Make them reusable**
- **Add help/usage info**
- **Test before committing**
- **Document in README**

---

## 🔒 Security Policy

### ⚠️ CRITICAL: Scripts Have Power

Scripts can:
- Kill processes
- Modify files
- Access servers
- Change configurations

**NEVER:**
- Hardcode credentials in scripts
- Include private keys
- Commit API tokens
- Store passwords

### Use Environment Variables
```bash
# ❌ Bad
API_KEY="abc123secret"

# ✅ Good
API_KEY="${API_KEY:-}"
if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY not set"
  exit 1
fi
```

### Files to NEVER Access
- `.env` files
- Private keys
- Credentials

See `../.claudeignore` for complete list.

---

## 📋 Script Standards

### Script Template
```bash
#!/bin/bash
# Script Name: check-ports.sh
# Purpose: Detect port conflicts and ghost instances
# Usage: ./check-ports.sh [options]
# Author: Riddlen Team
# Last Updated: 2025-10-15

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Help function
show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Description of what this script does

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Verbose output

EXAMPLES:
    $(basename "$0")
    $(basename "$0") --verbose

EOF
}

# Main function
main() {
    echo "Script starting..."
    # Script logic here
}

# Run main
main "$@"
```

### Naming Conventions
- Use kebab-case: `check-ports.sh`
- Be descriptive: `backup-database.sh` not `backup.sh`
- Add file extension: `.sh`, `.js`, `.py`

---

## 🔄 Git Workflow

### Creating New Script
```bash
cd /var/www/riddlen/scripts

# Create script file
touch new-utility.sh

# Make executable
chmod +x new-utility.sh

# Add shebang and template
vim new-utility.sh

# Test it
./new-utility.sh --help

# Add to git
git add scripts/new-utility.sh

# Commit
git commit -m "scripts: add new-utility for [purpose]"

# Push
git push origin main
```

### Commit Message Format
```
scripts: <what the script does>

Examples:
- scripts: add database backup automation
- scripts: fix port detection in check-ports.sh
- scripts: add log rotation utility
- scripts: improve error handling in deploy-helper.sh
```

---

## ✅ Testing Before Commit

### Test Checklist
- [ ] Script runs without errors
- [ ] Help message displays correctly
- [ ] Error handling works
- [ ] No hardcoded secrets
- [ ] Permissions are executable (chmod +x)
- [ ] Works with different inputs
- [ ] Handles edge cases

### Testing Commands
```bash
# Test help
./script.sh --help

# Test with valid input
./script.sh --test-arg value

# Test error cases
./script.sh --invalid-arg

# Test as non-root (if applicable)
sudo -u testuser ./script.sh

# Dry run mode (if applicable)
./script.sh --dry-run
```

---

## 📊 Script Documentation

### README.md in scripts/
```markdown
# Riddlen Utility Scripts

## Available Scripts

### check-ports.sh
**Purpose**: Detect port conflicts and ghost Node.js processes

**Usage**:
\`\`\`bash
./scripts/check-ports.sh
\`\`\`

**Output**: Lists all ports, shows ghost instances, provides kill commands

### backup-database.sh
**Purpose**: Backup application databases

**Usage**:
\`\`\`bash
./scripts/backup-database.sh [database-name]
\`\`\`

**Requirements**: Database credentials in environment
```

### Inline Documentation
```bash
# Function: check_port_status
# Description: Checks if a port is in use and by which process
# Arguments:
#   $1 - Port number to check
# Returns:
#   0 if port is free, 1 if in use
# Example:
#   check_port_status 3000
check_port_status() {
    local port=$1
    # Implementation
}
```

---

## 🧹 Keep It Clean

### File Organization
```
scripts/
├── README.md              # Documentation
├── check-ports.sh         # Port conflict detection
├── backup-database.sh     # Database backups
├── rotate-logs.sh         # Log rotation
├── deploy-helper.sh       # Deployment assistance
├── lib/                   # Shared functions
│   ├── colors.sh
│   └── error-handling.sh
└── archive/
    └── old-scripts/
```

### Regular Cleanup
```bash
# Remove unused scripts
mv scripts/old-script.sh scripts/archive/

# Update documentation
vim scripts/README.md

# Commit cleanup
git add scripts/
git commit -m "scripts: archive unused utilities"
```

---

## 📦 Archive Strategy

### When to Archive
- Script no longer used
- Replaced by better alternative
- Specific to old infrastructure
- One-time migration script (after use)

### How to Archive
```bash
# Move to archive
mkdir -p scripts/archive
mv scripts/old-utility.sh scripts/archive/

# Update README
# Remove from main list, add to archive section

# Commit
git add scripts/
git commit -m "scripts: archive old-utility.sh (replaced by new-utility.sh)"
```

---

## 🔗 Related Directories

### When Creating Scripts For...
- **Infrastructure** → May reference `/docker/`, `/ecosystem.config.js`
- **Deployment** → May use addresses from `/testnet/`
- **Contracts** → Link to `/contracts/scripts/` for smart contract scripts
- **Frontend** → May interact with frontend builds
- **Logs** → May work with `/logs/` directory

### Cross-References
```bash
# Reference other scripts
source "$(dirname "$0")/lib/colors.sh"

# Use config files
CONFIG_FILE="../ecosystem.config.js"

# Check other directories
if [ ! -d "../frontend" ]; then
    echo "Error: frontend directory not found"
    exit 1
fi
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This
- Hardcode credentials or secrets
- Skip error handling
- Forget to make executable (`chmod +x`)
- Use relative paths without validation
- Run destructive commands without confirmation
- Skip testing before commit

### ✅ Do This Instead
- Use environment variables for sensitive data
- Add error handling and validation
- Always `chmod +x` new scripts
- Validate paths exist before using
- Add `--dry-run` mode for destructive operations
- Test thoroughly with different scenarios

---

## 🛡️ Safe Script Practices

### Confirmation for Destructive Actions
```bash
# Before killing processes, deleting files, etc.
read -p "Are you sure you want to kill all node processes? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi
```

### Dry Run Mode
```bash
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
    esac
done

if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN: Would kill process 1234"
else
    kill -9 1234
fi
```

### Error Handling
```bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# Custom error handler
error_exit() {
    echo "Error: $1" >&2
    exit 1
}

# Usage
[ -f "$FILE" ] || error_exit "File not found: $FILE"
```

---

## 📝 Script Categories

### Infrastructure Scripts
- Port management (`check-ports.sh`)
- Process management (PM2 helpers)
- Server health checks
- Resource monitoring

### Deployment Scripts
- Pre-deployment checks
- Post-deployment verification
- Rollback utilities
- Environment setup

### Maintenance Scripts
- Log rotation
- Database backups
- Cache clearing
- Cleanup utilities

### Monitoring Scripts
- Health checks
- Alert triggers
- Metric collection
- Status reports

---

## 🎯 Summary: Your Role

When working in `scripts/`:

✅ **DO:**
- Create reusable utilities
- Add comprehensive help/usage
- Test thoroughly before commit
- Use environment variables for secrets
- Add error handling
- Document in README
- Make scripts executable

❌ **DON'T:**
- Hardcode secrets or credentials
- Skip error handling
- Create destructive scripts without safeguards
- Forget to test
- Duplicate contract deployment scripts
- Leave scripts non-executable

**Goal:** Maintain a collection of safe, well-documented utility scripts that automate infrastructure and maintenance tasks.

---

**Related Files:**
- `../PORT_MAPPING.md` - Port reference
- `../ecosystem.config.js` - PM2 config
- `../.claudeignore` - Files AI should never access
- `../DEPLOYMENT_README.md` - Deployment guide
