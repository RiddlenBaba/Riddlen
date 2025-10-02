# Riddlen Scaling Guide

Your infrastructure is now ready for multi-server deployment and load balancing. This guide shows you how to scale from single server to distributed architecture.

## Current Setup ✅

You now have:
- ✅ **Dockerfiles** for all 4 apps (containerized deployment)
- ✅ **docker-compose.yml** for local multi-container testing
- ✅ **ecosystem.config.js** for consistent PM2 deployment
- ✅ **nginx-upstream-example.conf** for load balancing across servers
- ✅ **Port documentation** and conflict detection

## Deployment Options

### Option 1: Current PM2 Setup (What you have now)
```bash
# Start all apps with ecosystem config
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Pros**: Simple, already working, low overhead
**Cons**: Single server, manual scaling, no isolation

---

### Option 2: Docker Containers (Local Testing)
```bash
# Build and run all containers
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f riddlen-main

# Scale specific service
docker-compose up -d --scale riddlen-main=3
```

**Pros**: Isolated environments, easy testing, portable
**Cons**: Overhead, need Docker knowledge

---

### Option 3: Multi-Server Load Balanced (Production Scale)

#### Step 1: Deploy Apps to Multiple Servers

**Server 1 (10.0.1.10)** - Main Frontend
```bash
ssh user@10.0.1.10
cd /var/www/riddlen/frontend
npm install && npm run build
pm2 start npm --name riddlen-main -- start
```

**Server 2 (10.0.1.11)** - Main Frontend (Load balanced)
```bash
ssh user@10.0.1.11
cd /var/www/riddlen/frontend
npm install && npm run build
pm2 start npm --name riddlen-main -- start
```

**Server 3 (10.0.2.10)** - Staging
```bash
ssh user@10.0.2.10
cd /var/www/riddlen/frontend-staging
npm install && npm run build
pm2 start npm --name riddlen-staging -- start -- -p 3001
```

**Server 4 (10.0.3.10)** - Frames
```bash
ssh user@10.0.3.10
cd /var/www/riddlen/riddlen-frames
npm install && npm run build
pm2 start npm --name riddlen-frames -- start
```

**Server 5 (10.0.4.10)** - Devlog
```bash
ssh user@10.0.4.10
cd /var/www/riddlen/riddlen-devlog
npm install && npm run build
pm2 start npm --name riddlen-devlog -- start
```

#### Step 2: Configure Load Balancer

On your **nginx load balancer server**:

1. Copy upstream config:
```bash
sudo cp /var/www/riddlen/nginx-upstream-example.conf /etc/nginx/sites-available/riddlen-lb
```

2. Update IP addresses in the file to match your servers

3. Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/riddlen-lb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 3: Monitor and Scale

```bash
# Check upstream status
curl http://localhost/health

# Monitor nginx upstream
tail -f /var/log/nginx/access.log | grep upstream

# Add more instances by deploying to new servers and adding to upstream pool
```

---

## Scaling Strategies

### Horizontal Scaling (Add More Servers)

**For Main App** (most traffic):
```nginx
upstream riddlen_main_pool {
    least_conn;
    server 10.0.1.10:3000;  # Instance 1
    server 10.0.1.11:3000;  # Instance 2
    server 10.0.1.12:3000;  # Instance 3
    server 10.0.1.13:3000;  # Instance 4
}
```

### Vertical Scaling (PM2 Cluster Mode)

Run multiple instances on same server:
```javascript
// In ecosystem.config.js, change:
instances: 1,
// To:
instances: 'max',  // Use all CPU cores
// Or:
instances: 4,  // Specific number
```

Then:
```bash
pm2 reload ecosystem.config.js
```

### Database Scaling (When You Add One)

When you add a database:
1. Use connection pooling
2. Implement read replicas for scaling reads
3. Use Redis for caching and sessions
4. Consider managed database (RDS, MongoDB Atlas)

---

## Migration Path: Single Server → Multi-Server

### Phase 1: Prepare (Now)
- ✅ Dockerfiles created
- ✅ Port mapping documented
- ✅ PM2 ecosystem config ready
- ✅ Nginx upstream config ready

### Phase 2: Containerize (Optional, 1-2 days)
```bash
# Test locally with Docker
docker-compose up -d

# Build images and push to registry
docker build -t riddlen/main:latest ./frontend
docker push riddlen/main:latest
```

### Phase 3: Deploy to Multiple Servers (1 week)
1. Provision new servers (AWS EC2, DigitalOcean, etc.)
2. Set up private networking between servers
3. Deploy apps using Docker or PM2 ecosystem config
4. Configure nginx load balancer with upstream pools
5. Update DNS to point to load balancer

### Phase 4: Auto-scaling (Future)
- Use Kubernetes for orchestration
- Implement auto-scaling based on CPU/memory
- Add monitoring (Prometheus + Grafana)
- Set up CI/CD pipeline

---

## Quick Commands Reference

### Docker
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Scale a service
docker-compose up -d --scale riddlen-main=3

# View logs
docker-compose logs -f riddlen-main

# Stop all
docker-compose down
```

### PM2 Ecosystem
```bash
# Start all apps
pm2 start ecosystem.config.js

# Restart all
pm2 restart ecosystem.config.js

# Stop all
pm2 stop ecosystem.config.js

# View logs
pm2 logs riddlen-main

# Monitor
pm2 monit
```

### Nginx Load Balancing
```bash
# Test config
sudo nginx -t

# Reload without downtime
sudo systemctl reload nginx

# Check upstream health
curl http://localhost/health

# Monitor upstream
tail -f /var/log/nginx/access.log | grep upstream_addr
```

---

## Cost Estimates (AWS/DigitalOcean)

### Single Server (Current)
- 1x VPS ($20-40/mo) - All apps

### Small Scale (2-3 servers)
- 1x Load Balancer ($10-20/mo)
- 2x App Servers ($20-40/mo each)
- **Total: ~$50-100/mo**

### Medium Scale (5-10 servers)
- 1x Load Balancer ($20/mo)
- 6x App Servers ($30/mo each)
- 2x Database Servers ($50/mo each)
- 1x Redis Cache ($20/mo)
- **Total: ~$300-400/mo**

### Large Scale (Auto-scaling)
- Kubernetes cluster ($200-500/mo base)
- Auto-scaling nodes ($500-2000/mo)
- Managed databases ($100-500/mo)
- CDN ($50-200/mo)
- **Total: ~$1000-3000/mo**

---

## Next Steps

1. **Test Docker setup locally**:
   ```bash
   cd /var/www/riddlen
   docker-compose up -d
   ```

2. **Try PM2 ecosystem config**:
   ```bash
   pm2 stop all
   pm2 delete all
   pm2 start ecosystem.config.js
   pm2 save
   ```

3. **When ready to scale**:
   - Provision additional servers
   - Update `nginx-upstream-example.conf` with real IPs
   - Deploy apps using ecosystem config or Docker
   - Configure load balancer

4. **Monitoring (recommended)**:
   - Set up Prometheus + Grafana
   - Add application performance monitoring (APM)
   - Configure alerts for downtime

---

## Troubleshooting

### Docker containers won't start
```bash
# Check logs
docker-compose logs riddlen-main

# Rebuild
docker-compose build --no-cache riddlen-main
docker-compose up -d riddlen-main
```

### PM2 ecosystem not working
```bash
# Check paths in ecosystem.config.js
pm2 logs riddlen-main

# Restart with env update
pm2 restart ecosystem.config.js --update-env
```

### Load balancer not distributing
```bash
# Check upstream status
nginx -t
systemctl status nginx

# Monitor distribution
tail -f /var/log/nginx/access.log | grep upstream_addr
```

---

## Resources

- **Docker Docs**: https://docs.docker.com/
- **PM2 Docs**: https://pm2.keymetrics.io/
- **Nginx Load Balancing**: https://nginx.org/en/docs/http/load_balancing.html
- **Next.js Deployment**: https://nextjs.org/docs/deployment

**You're now ready to scale! Start with Docker testing, then move to multi-server when traffic demands it.**
