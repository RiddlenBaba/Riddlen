#!/bin/bash

# Riddlen Port Conflict Checker
# Detects ghost instances and port conflicts across all Riddlen apps

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Port mappings
declare -A PORTS=(
    [3000]="riddlen-main (frontend)"
    [3001]="riddlen-staging (frontend-staging)"
    [3002]="riddlen-frames (riddlen-frames)"
    [3004]="riddlen-devlog (riddlen-devlog)"
    [5000]="riddlen-api (future)"
)

echo -e "${BLUE}=== Riddlen Port Conflict Checker ===${NC}\n"

# Check PM2 status
echo -e "${BLUE}PM2 Processes:${NC}"
pm2 list 2>/dev/null || echo -e "${RED}PM2 not running or not installed${NC}"
echo ""

# Check each port
echo -e "${BLUE}Port Status Check:${NC}"
for port in "${!PORTS[@]}"; do
    app_name="${PORTS[$port]}"
    echo -e "\n${YELLOW}Port ${port}${NC} (${app_name}):"

    # Check if port is in use
    pid=$(lsof -ti:$port 2>/dev/null)

    if [ -z "$pid" ]; then
        echo -e "  ${GREEN}✓ Port is FREE${NC}"
    else
        echo -e "  ${RED}✗ Port is IN USE${NC}"

        # Get process details
        process_info=$(ps -p $pid -o comm=,args= 2>/dev/null)
        echo -e "  ${RED}PID: ${pid}${NC}"
        echo -e "  Process: ${process_info}"

        # Check if it's a PM2 process
        pm2_process=$(pm2 jlist 2>/dev/null | grep -o "\"pid\":$pid" 2>/dev/null)

        if [ -z "$pm2_process" ]; then
            echo -e "  ${RED}⚠️  WARNING: This is a GHOST INSTANCE (not managed by PM2)${NC}"
            echo -e "  ${YELLOW}To kill: kill -9 ${pid}${NC}"
        else
            echo -e "  ${GREEN}✓ Managed by PM2${NC}"
        fi
    fi
done

# Check for orphaned node processes
echo -e "\n${BLUE}Checking for orphaned Node processes:${NC}"
orphaned=$(ps aux | grep node | grep -v grep | grep -v pm2 | grep -v "PM2" || true)

if [ -z "$orphaned" ]; then
    echo -e "${GREEN}✓ No orphaned processes found${NC}"
else
    echo -e "${RED}Found potentially orphaned Node processes:${NC}"
    echo "$orphaned" | while read line; do
        echo -e "  ${YELLOW}$line${NC}"
    done
    echo -e "\n${YELLOW}To kill all Node processes (use with caution):${NC}"
    echo -e "  ${RED}killall -9 node${NC}"
fi

# Check for duplicate PM2 processes
echo -e "\n${BLUE}Checking for duplicate PM2 processes:${NC}"
duplicates=$(pm2 jlist 2>/dev/null | grep -o '"name":"riddlen-[^"]*"' | sort | uniq -d || true)

if [ -z "$duplicates" ]; then
    echo -e "${GREEN}✓ No duplicate PM2 processes${NC}"
else
    echo -e "${RED}Found duplicate PM2 processes:${NC}"
    echo -e "  ${duplicates}"
    echo -e "\n${YELLOW}To fix, delete duplicates:${NC}"
    echo -e "  pm2 delete <process-name-or-id>"
fi

# Summary
echo -e "\n${BLUE}=== Summary ===${NC}"
total_ports=${#PORTS[@]}
free_count=0
used_count=0
ghost_count=0

for port in "${!PORTS[@]}"; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ -z "$pid" ]; then
        ((free_count++))
    else
        ((used_count++))
        pm2_process=$(pm2 jlist 2>/dev/null | grep -o "\"pid\":$pid" 2>/dev/null)
        if [ -z "$pm2_process" ]; then
            ((ghost_count++))
        fi
    fi
done

echo -e "Total ports monitored: ${total_ports}"
echo -e "${GREEN}Free ports: ${free_count}${NC}"
echo -e "${YELLOW}Used ports: ${used_count}${NC}"
echo -e "${RED}Ghost instances: ${ghost_count}${NC}"

if [ $ghost_count -gt 0 ]; then
    echo -e "\n${RED}⚠️  ACTION REQUIRED: Ghost instances detected!${NC}"
    echo -e "${YELLOW}Run the following to clean up:${NC}"
    echo -e "  1. pm2 stop all"
    echo -e "  2. Kill ghost processes (PIDs shown above)"
    echo -e "  3. pm2 start <process-name>"
    echo -e "\nOr use the nuclear option:"
    echo -e "  pm2 delete all && killall -9 node"
fi

echo -e "\n${BLUE}For full port mapping details, see:${NC} /var/www/riddlen/PORT_MAPPING.md"
