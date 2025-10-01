#!/bin/bash

PORT=3001
PROJECT_DIR="/var/www/riddlen/frontend-staging"
LOG_FILE="$PROJECT_DIR/staging.log"

echo "🔄 Restarting Riddlen staging server..."

# Kill ALL Next.js processes
echo "🛑 Stopping existing staging servers..."
pkill -9 -f "next start" 2>/dev/null || true
sleep 2

# Force kill anything on port 3001
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port $PORT is still in use, forcing kill..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "✅ Port $PORT is free"

# Fix permissions for .next folder if it exists
if [ -d ".next" ]; then
    echo "🔧 Fixing .next folder permissions..."
    chown -R riddlen:riddlen .next 2>/dev/null || true
fi

# Start the server
echo "🚀 Starting staging server on port $PORT..."
cd "$PROJECT_DIR"
nohup npm start -- -p $PORT > "$LOG_FILE" 2>&1 &

# Wait a moment and check if it started
sleep 3

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Staging server started successfully on port $PORT"
    echo "📝 Logs: tail -f $LOG_FILE"
    exit 0
else
    echo "❌ ERROR: Server failed to start. Check logs:"
    tail -20 "$LOG_FILE"
    exit 1
fi
