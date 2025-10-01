#!/bin/bash
# Quick deployment commands for Riddlen Frames
# Run these after npm install completes

echo "🚀 Riddlen Frames Deployment Script"
echo "===================================="
echo ""

# Build the app
echo "📦 Step 1: Building Next.js app..."
cd /var/www/riddlen/riddlen-frames
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo ""
echo "🔧 Step 2: Starting with PM2..."
pm2 start npm --name riddlen-frames -- start
pm2 save

echo ""
echo "📋 Current PM2 processes:"
pm2 list

echo ""
echo "🌐 Step 3: Setting up Nginx..."
echo "Run these commands manually:"
echo ""
echo "  sudo cp /var/www/riddlen/riddlen-frames/nginx-config.conf /etc/nginx/sites-available/frames.riddlen.com"
echo "  sudo ln -s /etc/nginx/sites-available/frames.riddlen.com /etc/nginx/sites-enabled/"
echo "  sudo nginx -t"
echo "  sudo systemctl reload nginx"
echo ""
echo "🔒 Step 4: Add SSL (after DNS propagates):"
echo "  sudo certbot --nginx -d frames.riddlen.com"
echo ""
echo "✅ Done! Check DEPLOYMENT.md for full guide."
