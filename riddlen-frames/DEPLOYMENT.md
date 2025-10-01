# Riddlen Frames - Complete Deployment Guide

## Current Status
✅ DNS A record set for frames.riddlen.com
✅ npm install running
⏳ Waiting for: build, PM2, Nginx, SSL

---

## Step 1: Build the App (After npm install completes)

```bash
cd /var/www/riddlen/riddlen-frames
npm run build
```

**Expected output**: `.next` folder with production build

---

## Step 2: Start with PM2

```bash
# Start the app on port 3002
pm2 start npm --name riddlen-frames -- start

# Check it's running
pm2 list

# Save PM2 config
pm2 save
```

**Verify**: App should be running on http://localhost:3002

Test it:
```bash
curl http://localhost:3002
```

---

## Step 3: Configure Nginx

### Copy the config file:
```bash
sudo cp /var/www/riddlen/riddlen-frames/nginx-config.conf /etc/nginx/sites-available/frames.riddlen.com
```

### Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/frames.riddlen.com /etc/nginx/sites-enabled/
```

### Test Nginx configuration:
```bash
sudo nginx -t
```

**Expected output**: "test is successful"

### Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## Step 4: Test HTTP Access

Wait 5-10 minutes for DNS propagation, then:

```bash
# Test from server
curl http://frames.riddlen.com

# Or visit in browser:
# http://frames.riddlen.com
```

**Expected**: You should see the Next.js app

---

## Step 5: Add SSL Certificate

### Install certbot (if not already installed):
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Get SSL certificate:
```bash
sudo certbot --nginx -d frames.riddlen.com
```

**Follow the prompts**:
- Enter email address
- Agree to terms
- Choose option 2 (Redirect HTTP to HTTPS)

### Verify SSL:
```bash
sudo certbot certificates
```

### Test HTTPS:
```bash
curl https://frames.riddlen.com
```

---

## Step 6: Verify Everything Works

1. **Check PM2**:
```bash
pm2 list
# riddlen-frames should be "online"
```

2. **Check Nginx**:
```bash
sudo nginx -t
sudo systemctl status nginx
```

3. **Check logs if issues**:
```bash
# PM2 logs
pm2 logs riddlen-frames

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

4. **Test Frame endpoint**:
```bash
curl https://frames.riddlen.com/frames/riddle
```

Should return HTML with Frame metadata.

---

## Step 7: Test in Farcaster

1. Go to https://warpcast.com/~/developers/frames
2. Enter your Frame URL: `https://frames.riddlen.com/frames/riddle`
3. Click "Validate"
4. You should see your Frame preview!

---

## Troubleshooting

### DNS not propagating
```bash
# Check DNS
dig frames.riddlen.com

# If not working, wait longer (can take up to 1 hour)
```

### PM2 app crashing
```bash
# Check logs
pm2 logs riddlen-frames --lines 50

# Restart
pm2 restart riddlen-frames
```

### Nginx errors
```bash
# Check config
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload
sudo systemctl reload nginx
```

### Port 3002 not accessible
```bash
# Check if something else is using it
sudo lsof -i :3002

# Check firewall
sudo ufw status
```

---

## Your 3 Riddlen Apps

After deployment, you'll have:

| App | Port | Domain | Status |
|-----|------|--------|--------|
| **Production** | 3000 | riddlen.com | ✅ Running |
| **Staging** | 3001 | staging.riddlen.com | ✅ Running |
| **Frames** | 3002 | frames.riddlen.com | 🚀 Deploying |

---

## PM2 Useful Commands

```bash
# List all apps
pm2 list

# View logs
pm2 logs riddlen-frames

# Restart
pm2 restart riddlen-frames

# Stop
pm2 stop riddlen-frames

# Delete
pm2 delete riddlen-frames

# Monitor
pm2 monit
```

---

## SSL Auto-Renewal

Certbot automatically renews certificates. Test it:

```bash
# Dry run
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

---

## Next Steps After Deployment

1. **Test Frames** in Warpcast Frame validator
2. **Post first Frame** in /riddlen channel
3. **Add more Frames** (leaderboard, profile)
4. **Connect real blockchain data** (replace mock data)
5. **Monitor performance** with PM2

---

## Success! 🎉

Once completed, your Frame will be live at:
**https://frames.riddlen.com/frames/riddle**

Share it on Farcaster and watch Riddlen grow!
