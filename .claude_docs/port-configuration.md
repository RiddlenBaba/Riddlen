# Port Configuration Context

This file provides Claude Code with critical context about the Riddlen server port configuration.

## Port Assignments (ALWAYS CHECK BEFORE ACTIONS)

When working with any server-related tasks, ALWAYS reference these port assignments:

- **Port 3000**: Main production frontend (`frontend/`) - riddlen.com, www.riddlen.com, app.riddlen.com
- **Port 3001**: Staging frontend (`frontend-staging/`) - staging.riddlen.com
- **Port 3002**: Frames app (`riddlen-frames/`) - frames.riddlen.com
- **Port 3004**: Devlog app (`riddlen-devlog/`) - devlog.riddlen.com
- **Port 5000**: API backend (future) - api.riddlen.com

## PM2 Process Names

- `riddlen-main` → Port 3000 → `/var/www/riddlen/frontend`
- `riddlen-staging` → Port 3001 → `/var/www/riddlen/frontend-staging`
- `riddlen-frames` → Port 3002 → `/var/www/riddlen/riddlen-frames`
- `riddlen-devlog` → Port 3004 → `/var/www/riddlen/riddlen-devlog`

## Critical Rules

1. **NEVER start a new server without checking current port usage first**
   - Run `pm2 list` to see PM2 processes
   - Run `netstat -tlnp | grep -E "(3000|3001|3002|3004|5000)"` to check actual port usage

2. **Ghost instances are a recurring problem**
   - PM2 restarts can leave orphaned Node processes
   - Always verify with `ps aux | grep node` if ports seem occupied
   - Use `kill -9 $(lsof -ti:PORT)` to kill ghost processes

3. **When suggesting server commands**
   - Always check `/var/www/riddlen/PORT_MAPPING.md` for current configuration
   - Reference specific PM2 process names (riddlen-main, riddlen-staging, etc.)
   - Never assume a port is free without verification

4. **Directory-to-Port mapping**
   - `frontend/` = 3000 (production)
   - `frontend-staging/` = 3001 (staging)
   - `riddlen-frames/` = 3002 (frames)
   - `riddlen-devlog/` = 3004 (devlog)

## Common Scenarios

### Starting a server
```bash
# ALWAYS check first
pm2 list
netstat -tlnp | grep :3000

# Then start if port is free
cd /var/www/riddlen/frontend && pm2 start npm --name "riddlen-main" -- start
```

### Restarting after code changes
```bash
# Restart existing PM2 process (safer)
pm2 restart riddlen-main

# If ghost instances exist
pm2 stop riddlen-main
kill -9 $(lsof -ti:3000)
pm2 start riddlen-main
```

### Checking what's running where
```bash
# Quick port check
netstat -tlnp | grep -E "(3000|3001|3002|3004)"

# Detailed PM2 info
pm2 show riddlen-main
```

## Reference Files

- **Complete port documentation**: `/var/www/riddlen/PORT_MAPPING.md`
- **Nginx configs**: `/etc/nginx/sites-enabled/riddlen`, `frames.riddlen.com`, `devlog.riddlen.com`
- **PM2 logs**: `pm2 logs riddlen-main` (or other process name)

## When Helping Users

If a user mentions:
- "server won't start" → Check port conflicts first
- "ghost instances" → Check `ps aux | grep node` and kill orphans
- "which port" → Reference this file and PORT_MAPPING.md
- "restart server" → Use PM2 process name, verify port isn't blocked
- "add new app" → Assign next available port, update PORT_MAPPING.md
