#!/bin/bash

# Riddlen Production Server Restart Script
# This script properly stops the old server and starts a new one

echo "🔄 Restarting Riddlen production server..."

# Find and kill all Next.js processes
echo "🛑 Stopping existing Next.js servers..."
pkill -f "next-server" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true

# Wait for processes to die
sleep 2

# Double check port 3000 is free
PORT_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PORT_PID" ]; then
    echo "⚠️  Port 3000 still in use by PID $PORT_PID, force killing..."
    kill -9 $PORT_PID
    sleep 1
fi

# Verify port is free
if lsof -i:3000 >/dev/null 2>&1; then
    echo "❌ ERROR: Could not free port 3000"
    exit 1
fi

echo "✅ Port 3000 is free"

# Start the production server
echo "🚀 Starting production server..."
cd /var/www/riddlen/frontend
npm start > /tmp/riddlen-prod.log 2>&1 &

# Wait for server to start
sleep 3

# Check if server is running
if lsof -i:3000 >/dev/null 2>&1; then
    echo "✅ Production server started successfully on port 3000!"
    echo "📋 View logs: tail -f /tmp/riddlen-prod.log"
else
    echo "❌ ERROR: Server failed to start. Check logs:"
    cat /tmp/riddlen-prod.log
    exit 1
fi