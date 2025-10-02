# Port Info - Devlog App

**This app runs on PORT 3004**

## Important
- PM2 Process: `riddlen-devlog`
- Domain: devlog.riddlen.com
- Directory: `/var/www/riddlen/riddlen-devlog`
- Package.json has port configured: `next start -p 3004`

## Other Apps
- Port 3000: Main production (frontend)
- Port 3001: Staging (frontend-staging)
- Port 3002: Frames (riddlen-frames)

**Always check `/var/www/riddlen/PORT_MAPPING.md` before starting servers!**

Run `/var/www/riddlen/scripts/check-ports.sh` to detect port conflicts and ghost instances.
