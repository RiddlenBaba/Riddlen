# Port Info - Staging Frontend

**This app runs on PORT 3001**

## Important
- PM2 Process: `riddlen-staging`
- Domain: staging.riddlen.com
- Directory: `/var/www/riddlen/frontend-staging`
- Start command: `npm start -- -p 3001`

## Other Apps
- Port 3000: Main production (frontend)
- Port 3002: Frames (riddlen-frames)
- Port 3004: Devlog (riddlen-devlog)

**Always check `/var/www/riddlen/PORT_MAPPING.md` before starting servers!**

Run `/var/www/riddlen/scripts/check-ports.sh` to detect port conflicts and ghost instances.
