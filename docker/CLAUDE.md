# Claude Code Configuration - Docker Directory

**Directory Purpose:** Docker configuration files

## 🎯 What This Directory Is For

Contains **Docker-specific configuration** for containerized deployment.

### What Lives Here
- ✅ nginx.conf for Docker containers
- ✅ docker-compose overrides
- ✅ Container-specific configs
- ✅ Health check scripts

### What Does NOT Live Here
- ❌ Dockerfiles (those live in each app directory)
- ❌ .env files
- ❌ Application code
- ❌ docker-compose.yml (that's in root)

---

## 📁 Stay In Your Lane

- Modify only Docker configs here
- Don't change application code
- Don't touch Dockerfiles (they're in app dirs)

---

## 🔒 Security Policy

### ⚠️ Files to NEVER Access
- `.env` files
- Secrets/credentials
- Private keys

**Use docker-compose environment variables instead:**
```yaml
environment:
  - NODE_ENV=production
  - PORT=${PORT}  # From .env, not hardcoded
```

See `../.claudeignore` for complete list.

---

## 🔄 Git Workflow

```bash
cd /var/www/riddlen/docker

# Edit nginx config
vim nginx.conf

# Test config
docker-compose config

# Commit
git add docker/nginx.conf
git commit -m "docker: update nginx load balancing config"
git push
```

### Commit Messages
```
docker: <what changed>

Examples:
- docker: add health check endpoints to nginx
- docker: update upstream pool configuration
- docker: fix nginx websocket support
```

---

## ✅ Testing Docker Configs

### Before Committing
```bash
# Validate docker-compose
docker-compose config

# Test nginx config
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx nginx -t

# Test full stack
docker-compose up -d
docker-compose ps
docker-compose logs
docker-compose down
```

### Test Checklist
- [ ] nginx -t passes
- [ ] docker-compose config validates
- [ ] Containers start successfully
- [ ] Health checks pass
- [ ] Load balancing works

---

## 🧹 Keep It Clean

### File Organization
```
docker/
├── nginx.conf           # Main nginx config
├── nginx-dev.conf       # Development config
├── healthcheck.sh       # Container health checks
└── archive/
    └── old-configs/
```

### Regular Cleanup
```bash
# Archive old configs
mv docker/old-nginx.conf docker/archive/

# Update documentation
vim docker/README.md

# Commit
git add docker/
git commit -m "docker: archive old nginx configuration"
```

---

## 📦 Archive Strategy

Archive when:
- Config replaced by better version
- Moving to Kubernetes (deprecating docker-compose)
- Old load balancing strategies

```bash
mkdir -p docker/archive
mv docker/old-config.conf docker/archive/
git commit -m "docker: archive deprecated config"
```

---

## 🔗 Related Directories

### Docker Ecosystem
- **Root** → `docker-compose.yml` orchestrates everything
- **App Dirs** → Each has own `Dockerfile`
- **Scripts** → May have docker helper scripts
- **Logs** → Container logs may go to `/logs/`

### Cross-References
```nginx
# In nginx.conf, reference container names from docker-compose.yml
upstream riddlen_main {
    server riddlen-main:3000;  # From docker-compose service name
}
```

---

## ⚠️ Common Mistakes

### ❌ Don't Do This
- Hardcode secrets in nginx.conf
- Put Dockerfiles here (they go in app dirs)
- Duplicate docker-compose.yml (it's in root)
- Forget to test nginx config

### ✅ Do This Instead
- Use environment variables
- Reference Dockerfiles in app directories
- Edit root docker-compose.yml for orchestration
- Always run `nginx -t` before committing

---

## 🎯 Summary

✅ **DO:**
- Store Docker-specific configs
- Test configs before committing
- Use environment variables
- Document config changes
- Archive old configs

❌ **DON'T:**
- Hardcode secrets
- Put Dockerfiles here
- Duplicate docker-compose.yml
- Skip validation tests

**Goal:** Maintain clean Docker configurations for containerized deployment.

---

**Related Files:**
- `../docker-compose.yml` - Root orchestration file
- `../Dockerfile` (in each app) - Application containers
- `../.claudeignore` - Restricted files
- `../SCALING_GUIDE.md` - Docker deployment guide
