# Riddlen Deployment & Scaling Documentation

Complete reference for deploying and scaling Riddlen infrastructure.

## 📁 Key Files Created

### Port Management
- **`PORT_MAPPING.md`** - Master port reference and troubleshooting guide
- **`scripts/check-ports.sh`** - Detect port conflicts and ghost instances
- **`.claude_docs/`** - Context files for AI assistance

### Containerization
- **`frontend/Dockerfile`** - Main app container (Port 3000)
- **`frontend-staging/Dockerfile`** - Staging container (Port 3001)
- **`riddlen-frames/Dockerfile`** - Frames container (Port 3002)
- **`riddlen-devlog/Dockerfile`** - Devlog container (Port 3004)
- **`docker-compose.yml`** - Multi-container orchestration

### Process Management
- **`ecosystem.config.js`** - PM2 configuration for all apps
- **`logs/`** - Centralized PM2 log directory

### Load Balancing
- **`docker/nginx.conf`** - Nginx config for Docker setup
- **`nginx-upstream-example.conf`** - Production load balancer config

### Documentation
- **`SCALING_GUIDE.md`** - Comprehensive scaling strategies
- **`DEPLOYMENT_README.md`** - This file

---

## 🚀 Quick Start

### Current PM2 Setup (Production)
```bash
# Using ecosystem config (recommended)
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Check status
pm2 list
pm2 logs

# Or check for conflicts
./scripts/check-ports.sh
```

### Docker Setup (Testing/Development)
```bash
# Build and run all containers
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## 📊 Current Architecture

```
Single Server Setup:
┌─────────────────────────────────────┐
│         Nginx (SSL/Routing)         │
│  riddlen.com → :3000               │
│  staging.riddlen.com → :3001       │
│  frames.riddlen.com → :3002        │
│  devlog.riddlen.com → :3004        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│              PM2 Manager            │
│  riddlen-main    → :3000           │
│  riddlen-staging → :3001           │
│  riddlen-frames  → :3002           │
│  riddlen-devlog  → :3004           │
└─────────────────────────────────────┘
```

---

## 🔄 Future Multi-Server Architecture

```
Multi-Server Load Balanced:
                ┌─────────────────┐
                │  Load Balancer  │
                │  (Nginx/HAProxy)│
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   ┌─────────┐      ┌─────────┐     ┌─────────┐
   │Server 1 │      │Server 2 │     │Server 3 │
   │Main:3000│      │Main:3000│     │Frames:  │
   └─────────┘      └─────────┘     │  3002   │
                                      └─────────┘
```

---

## 📋 Port Reference

| Port | Domain | PM2 Process | Directory |
|------|--------|-------------|-----------|
| 3000 | riddlen.com | riddlen-main | `frontend/` |
| 3001 | staging.riddlen.com | riddlen-staging | `frontend-staging/` |
| 3002 | frames.riddlen.com | riddlen-frames | `riddlen-frames/` |
| 3004 | devlog.riddlen.com | riddlen-devlog | `riddlen-devlog/` |
| 5000 | api.riddlen.com | (future) | TBD |

---

## 🔧 Common Operations

### Check What's Running
```bash
# PM2 processes
pm2 list

# Actual ports in use
netstat -tlnp | grep -E "(3000|3001|3002|3004)"

# Check for conflicts
./scripts/check-ports.sh
```

### Deploy New Changes
```bash
# 1. Build new version
cd frontend && npm run build

# 2. Restart with PM2
pm2 restart riddlen-main

# 3. Or restart all from ecosystem
pm2 restart ecosystem.config.js
```

### Scale Horizontally (Add Server)
```bash
# On new server
git clone <repo>
cd riddlen/frontend
npm install && npm run build
pm2 start npm --name riddlen-main -- start

# Update nginx upstream on load balancer
# Add: server NEW_SERVER_IP:3000;
sudo nginx -t && sudo systemctl reload nginx
```

### Fix Ghost Instances
```bash
# Detect
./scripts/check-ports.sh

# Kill specific port
kill -9 $(lsof -ti:3000)

# Or nuclear option
pm2 delete all
killall -9 node
pm2 start ecosystem.config.js
```

---

## 🐳 Docker Deployment

### Local Testing
```bash
# Start all services
docker-compose up -d

# View specific logs
docker-compose logs -f riddlen-main

# Restart one service
docker-compose restart riddlen-staging

# Scale service (load test)
docker-compose up -d --scale riddlen-main=3
```

### Production (Build & Deploy)
```bash
# Build images
docker build -t riddlen/main:v1.0 ./frontend
docker build -t riddlen/staging:v1.0 ./frontend-staging

# Push to registry
docker push riddlen/main:v1.0

# Deploy on server
docker pull riddlen/main:v1.0
docker run -d -p 3000:3000 riddlen/main:v1.0
```

---

## 📈 Scaling Checklist

### Phase 1: Optimize Current Server
- [x] Port mapping documented
- [x] PM2 ecosystem config created
- [x] Dockerfiles ready
- [ ] Enable PM2 cluster mode (use all CPU cores)
- [ ] Add Redis for caching
- [ ] Optimize Next.js build (analyze bundle size)

### Phase 2: Prepare for Multi-Server
- [x] Nginx upstream config created
- [ ] Set up private network between servers
- [ ] Configure centralized logging
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Create deployment scripts

### Phase 3: Deploy Multi-Server
- [ ] Provision additional servers
- [ ] Deploy apps to separate servers
- [ ] Configure load balancer
- [ ] Update DNS to point to LB
- [ ] Test failover

### Phase 4: Auto-scaling
- [ ] Move to Kubernetes/ECS
- [ ] Configure horizontal pod autoscaling
- [ ] Set up CI/CD pipeline
- [ ] Implement blue-green deployments

---

## 🚨 Troubleshooting

### App Won't Start
```bash
# Check logs
pm2 logs riddlen-main --lines 100

# Check port
lsof -i :3000

# Check build
cd frontend && npm run build
```

### Ghost Instances
```bash
# Find them
ps aux | grep node | grep -v grep

# Kill them
./scripts/check-ports.sh  # Shows PIDs
kill -9 <PID>
```

### Load Balancer Not Working
```bash
# Test nginx config
sudo nginx -t

# Check upstream
curl -I http://localhost:3000
curl -I https://riddlen.com

# View nginx logs
tail -f /var/log/nginx/error.log
```

### Docker Issues
```bash
# Rebuild container
docker-compose build --no-cache riddlen-main
docker-compose up -d riddlen-main

# Check container logs
docker-compose logs riddlen-main

# Enter container for debugging
docker-compose exec riddlen-main sh
```

---

## 📝 Next Steps

1. **Test Docker setup**:
   ```bash
   docker-compose up -d
   curl http://localhost:3000
   ```

2. **Migrate to ecosystem.config.js**:
   ```bash
   pm2 stop all
   pm2 delete all
   pm2 start ecosystem.config.js
   pm2 save
   ```

3. **Set up monitoring** (recommended):
   - Install PM2 Plus (free tier)
   - Or set up Prometheus + Grafana
   - Configure uptime alerts

4. **When traffic increases**:
   - Follow `SCALING_GUIDE.md`
   - Start with vertical scaling (PM2 cluster mode)
   - Then horizontal scaling (multiple servers)

---

## 📚 Related Documentation

- **Port Management**: `PORT_MAPPING.md`
- **Scaling Strategies**: `SCALING_GUIDE.md`
- **Nginx Config**: `nginx-upstream-example.conf`
- **PM2 Config**: `ecosystem.config.js`
- **Docker Setup**: `docker-compose.yml`

---

## ✅ You're Ready to Scale!

Your infrastructure is now:
- ✅ **Documented** - Port mapping and processes clear
- ✅ **Containerized** - Dockerfiles for each app
- ✅ **Orchestrated** - PM2 ecosystem config ready
- ✅ **Load-balanced** - Nginx upstream config prepared
- ✅ **Scalable** - Easy to add servers and distribute load

**Start small, scale when needed. Good luck! 🚀**
