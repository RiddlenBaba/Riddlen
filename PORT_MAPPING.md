# Riddlen Server Port Mapping

**CRITICAL REFERENCE**: Always check this file before starting/restarting servers to prevent port conflicts and ghost instances.

## Port Assignments

| Port | App Directory | Domain(s) | PM2 Process Name | Purpose |
|------|--------------|-----------|------------------|---------|
| **3000** | `frontend/` | riddlen.com<br>www.riddlen.com<br>app.riddlen.com | `riddlen-main` | **Production** frontend |
| **3001** | `frontend-staging/` | staging.riddlen.com | `riddlen-staging` | **Staging** frontend |
| **3002** | `riddlen-frames/` | frames.riddlen.com | `riddlen-frames` | Farcaster frames |
| **3004** | `riddlen-devlog/` | devlog.riddlen.com | `riddlen-devlog` | Development blog |
| **5000** | TBD | api.riddlen.com | `riddlen-api` | API backend (future) |

## Quick Commands

### Check What's Running
```bash
# Check PM2 processes
pm2 list

# Check actual port usage
netstat -tlnp | grep -E "(3000|3001|3002|3004|5000)"

# Find ghost instances
ps aux | grep node | grep -v grep
```

### Start/Restart Apps
```bash
# Start all apps
pm2 start riddlen-main
pm2 start riddlen-staging
pm2 start riddlen-frames
pm2 start riddlen-devlog

# Restart specific app
pm2 restart riddlen-main

# Stop all and clean ghosts
pm2 stop all
pm2 delete all
killall node  # Use with caution!
```

### Kill Ghost Instances
```bash
# Find process on specific port
lsof -ti:3000

# Kill process on specific port
kill -9 $(lsof -ti:3000)
```

## PM2 Configuration

### Current Setup (Manual)
Apps are started manually with:
```bash
# Main (Port 3000)
cd /var/www/riddlen/frontend && pm2 start npm --name "riddlen-main" -- start

# Staging (Port 3001)
cd /var/www/riddlen/frontend-staging && pm2 start npm --name "riddlen-staging" -- start -- -p 3001

# Frames (Port 3002)
cd /var/www/riddlen/riddlen-frames && pm2 start npm --name "riddlen-frames" -- start

# Devlog (Port 3004)
cd /var/www/riddlen/riddlen-devlog && pm2 start npm --name "riddlen-devlog" -- start
```

### Recommended: Create ecosystem.config.js
For easier management, create `/var/www/riddlen/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'riddlen-main',
      cwd: '/var/www/riddlen/frontend',
      script: 'npm',
      args: 'start',
      env: { PORT: 3000 }
    },
    {
      name: 'riddlen-staging',
      cwd: '/var/www/riddlen/frontend-staging',
      script: 'npm',
      args: 'start -- -p 3001',
      env: { PORT: 3001 }
    },
    {
      name: 'riddlen-frames',
      cwd: '/var/www/riddlen/riddlen-frames',
      script: 'npm',
      args: 'start',
      env: { PORT: 3002 }
    },
    {
      name: 'riddlen-devlog',
      cwd: '/var/www/riddlen/riddlen-devlog',
      script: 'npm',
      args: 'start',
      env: { PORT: 3004 }
    }
  ]
}
```

Then use: `pm2 start ecosystem.config.js`

## Nginx Configuration

### Sites Enabled
- `/etc/nginx/sites-enabled/riddlen` - Main, staging, app, API configs
- `/etc/nginx/sites-enabled/frames.riddlen.com` - Frames config
- `/etc/nginx/sites-enabled/devlog.riddlen.com` - Devlog config

### Reload Nginx After Changes
```bash
sudo nginx -t  # Test config
sudo systemctl reload nginx
```

## Common Issues & Solutions

### Problem: Port Already in Use
```bash
# Find what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Problem: Ghost Instances After PM2 Restart
PM2 sometimes leaves orphaned Node processes. Solution:
```bash
# Stop PM2 apps
pm2 stop all

# Find and kill ghost instances
ps aux | grep node | grep -v grep
kill -9 <PID>  # For each ghost process

# Restart clean
pm2 restart all
```

### Problem: App Not Starting
```bash
# Check logs
pm2 logs riddlen-main

# Check if port is blocked
lsof -i :3000

# Restart with fresh logs
pm2 restart riddlen-main --update-env
```

### Problem: Multiple Instances Running
```bash
# Find duplicates
ps aux | grep node | grep -E "(3000|3001|3002|3004)" | grep -v grep

# Nuclear option (stops everything)
pm2 delete all
killall -9 node
# Then restart apps one by one
```

## Development vs Production

### Development (Local)
- Use `npm run dev` (default ports: 3000, 3001, 3002, 3004)
- Hot reload enabled
- Source maps available

### Production (Server)
- Use `npm start` via PM2
- No hot reload
- Optimized builds
- Check this file BEFORE starting!

## Environment-Specific Ports

| Environment | Frontend | Staging | Frames | Devlog |
|------------|----------|---------|--------|--------|
| **Production** | 3000 | 3001 | 3002 | 3004 |
| **Local Dev** | 3000 | 3001 | 3002 | 3004 |

**Note**: Same ports in dev/prod - be careful when testing locally!

## Best Practices

1. **ALWAYS check `pm2 list` before starting new instances**
2. **Run port check** if ports seem occupied: `netstat -tlnp | grep -E "(3000|3001|3002|3004)"`
3. **Use PM2 process names consistently** (riddlen-main, riddlen-staging, etc.)
4. **Check nginx logs** if domain routing fails: `/var/log/nginx/error.log`
5. **Document any new ports** in this file immediately
6. **Save PM2 state** after changes: `pm2 save`

## Emergency Recovery

If everything is broken and you need to start fresh:
```bash
# 1. Stop all PM2 processes
pm2 stop all
pm2 delete all

# 2. Kill any ghost node processes (CAREFUL!)
killall -9 node

# 3. Verify ports are free
netstat -tlnp | grep -E "(3000|3001|3002|3004|5000)"

# 4. Start apps one by one
cd /var/www/riddlen/frontend && pm2 start npm --name "riddlen-main" -- start
cd /var/www/riddlen/frontend-staging && pm2 start npm --name "riddlen-staging" -- start -- -p 3001
cd /var/www/riddlen/riddlen-frames && pm2 start npm --name "riddlen-frames" -- start
cd /var/www/riddlen/riddlen-devlog && pm2 start npm --name "riddlen-devlog" -- start

# 5. Save PM2 configuration
pm2 save

# 6. Verify everything is running
pm2 list
netstat -tlnp | grep LISTEN | grep -E "(3000|3001|3002|3004)"
```

## Last Updated
2025-10-02

**When in doubt, check this file first!**
