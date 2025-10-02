# Port Info - Frames App

**This app runs on PORT 3002**

## Important
- PM2 Process: `riddlen-frames`
- Domain: frames.riddlen.com
- Directory: `/var/www/riddlen/riddlen-frames`
- Package.json has port configured: `next start -p 3002`

## Other Apps
- Port 3000: Main production (frontend)
- Port 3001: Staging (frontend-staging)
- Port 3004: Devlog (riddlen-devlog)

**Always check `/var/www/riddlen/PORT_MAPPING.md` before starting servers!**

Run `/var/www/riddlen/scripts/check-ports.sh` to detect port conflicts and ghost instances.
