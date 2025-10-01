# Riddlen Farcaster Frames

Next.js-based Farcaster Frames using Frames.js framework.

## Setup

1. **Install dependencies**:
```bash
cd /var/www/riddlen/riddlen-frames
npm install
```

2. **Run development server**:
```bash
npm run dev
```

Server runs on: http://localhost:3002

3. **Test the Frame**:
   - Visit: http://localhost:3002
   - Frame endpoint: http://localhost:3002/frames/riddle

## Deploy to Production

### Start with PM2:
```bash
npm run build
pm2 start npm --name riddlen-frames -- start
pm2 save
```

### Configure Nginx:

Create `/etc/nginx/sites-available/frames.riddlen.com`:

```nginx
server {
    listen 80;
    server_name frames.riddlen.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/frames.riddlen.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Add SSL:
```bash
sudo certbot --nginx -d frames.riddlen.com
```

### Configure DNS:
Add A record for `frames` subdomain pointing to your server IP.

## Frame Routes

- `/frames/riddle` - Active riddle display with mint button
- `/frames/leaderboard` - Top RON scorers (coming soon)
- `/frames/profile` - User stats (coming soon)

## Contract Integration

Update with your actual Polygon contracts in future frames:
- RDLN: `0x133029184EC460F661d05b0dC57BFC916b4AB0eB`
- RON: `0xD86b146Ed091b59cE050B9d40f8e2760f14Ab635`
- Riddle NFT: `0x529e3076cB9A48D6FAd086abE5d23ea76159e9E3`

## Tech Stack

- **Next.js 14** - React framework
- **Frames.js** - Farcaster Frames SDK
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Viem** - Ethereum interactions

## Next Steps

1. Install dependencies: `npm install`
2. Run locally: `npm run dev`
3. Build for production: `npm run build`
4. Deploy with PM2: `pm2 start npm --name riddlen-frames -- start`
5. Configure Nginx subdomain
6. Add SSL certificate
7. Update DNS

Your Frames will be live at: **https://frames.riddlen.com**
