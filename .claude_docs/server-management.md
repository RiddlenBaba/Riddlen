# Server Management Context

## Multi-Server Setup

This Riddlen deployment runs **4 separate Next.js applications** on a single server using PM2 and nginx:

1. **Main Frontend** (riddlen.com) - Port 3000
2. **Staging Frontend** (staging.riddlen.com) - Port 3001
3. **Frames App** (frames.riddlen.com) - Port 3002
4. **Devlog App** (devlog.riddlen.com) - Port 3004

## Key Context for Claude Code

### Always Consider Port Conflicts

Before suggesting any server operations:
1. Check current PM2 processes: `pm2 list`
2. Verify actual port usage: `netstat -tlnp | grep -E "(3000|3001|3002|3004)"`
3. Look for ghost instances: `ps aux | grep node | grep -v grep`

### Ghost Instance Problem

**This is a recurring issue** - PM2 restarts can leave orphaned Node processes that block ports.

**Detection**:
```bash
# PM2 says app is running but domain doesn't work
pm2 list  # Shows app as "online"
netstat -tlnp | grep :3000  # Shows different PID than PM2

# Or PM2 fails to start with "port in use" error
```

**Resolution**:
```bash
# Find the ghost process
lsof -i :3000

# Kill it
kill -9 <PID>
# OR
kill -9 $(lsof -ti:3000)

# Restart clean
pm2 restart riddlen-main
```

### Directory Structure Awareness

```
/var/www/riddlen/
├── frontend/          → Port 3000 (main)
├── frontend-staging/  → Port 3001 (staging)
├── riddlen-frames/    → Port 3002 (frames)
├── riddlen-devlog/    → Port 3004 (devlog)
├── PORT_MAPPING.md    → Reference this FIRST
└── .claude_docs/      → This directory
```

### PM2 Process Management

**Standard naming convention**:
- `riddlen-main` for main app
- `riddlen-staging` for staging
- `riddlen-frames` for frames
- `riddlen-devlog` for devlog

**Always use process names** (not IDs) for operations:
```bash
pm2 restart riddlen-main  # Good
pm2 restart 5             # Bad (ID can change)
```

### Nginx Routing

Each domain is proxied to its respective port:
- riddlen.com → localhost:3000
- staging.riddlen.com → localhost:3001
- frames.riddlen.com → localhost:3002
- devlog.riddlen.com → localhost:3004

If domain doesn't load but port shows process running:
1. Check nginx config: `sudo nginx -t`
2. Check nginx logs: `/var/log/nginx/error.log`
3. Reload nginx: `sudo systemctl reload nginx`

### Development Workflow

**Local dev** (npm run dev):
- Uses same ports (3000, 3001, 3002, 3004)
- Hot reload enabled
- Be careful not to conflict with production PM2 processes

**Production** (npm start via PM2):
- Optimized build required first: `npm run build`
- No hot reload
- Process managed by PM2

### Common Tasks

**Adding a new app**:
1. Assign next available port (3005, 3006, etc.)
2. Update `/var/www/riddlen/PORT_MAPPING.md`
3. Update `.claude_docs/port-configuration.md`
4. Create nginx config in `/etc/nginx/sites-available/`
5. Add PM2 process with descriptive name

**Debugging connection issues**:
```bash
# 1. Verify PM2 status
pm2 list
pm2 logs riddlen-main --lines 50

# 2. Verify port binding
netstat -tlnp | grep :3000

# 3. Check for ghosts
ps aux | grep node | grep 3000

# 4. Test nginx routing
curl -I http://localhost:3000

# 5. Check SSL/domain
curl -I https://riddlen.com
```

**Emergency cleanup**:
```bash
# Nuclear option (use with caution)
pm2 stop all
pm2 delete all
killall -9 node

# Then restart from PORT_MAPPING.md instructions
```

## Critical Files to Check

1. `/var/www/riddlen/PORT_MAPPING.md` - Master port reference
2. `/etc/nginx/sites-enabled/riddlen` - Main nginx config
3. PM2 logs - `pm2 logs <process-name>`
4. Nginx logs - `/var/log/nginx/error.log`

## When Suggesting Commands

- **Always verify current state first** before suggesting changes
- **Reference PORT_MAPPING.md** for accurate port assignments
- **Use PM2 process names** consistently
- **Check for ghost instances** if user reports port conflicts
- **Consider nginx routing** if domain issues are reported
