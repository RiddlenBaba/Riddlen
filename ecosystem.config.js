// PM2 Ecosystem Configuration for Riddlen Apps
// Usage: pm2 start ecosystem.config.js
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'riddlen-main',
      cwd: '/var/www/riddlen/frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/riddlen/logs/riddlen-main-error.log',
      out_file: '/var/www/riddlen/logs/riddlen-main-out.log',
      log_file: '/var/www/riddlen/logs/riddlen-main-combined.log',
      time: true
    },
    {
      name: 'riddlen-staging',
      cwd: '/var/www/riddlen/frontend-staging',
      script: 'npm',
      args: 'start -- -p 3001',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/www/riddlen/logs/riddlen-staging-error.log',
      out_file: '/var/www/riddlen/logs/riddlen-staging-out.log',
      log_file: '/var/www/riddlen/logs/riddlen-staging-combined.log',
      time: true
    },
    {
      name: 'riddlen-frames',
      cwd: '/var/www/riddlen/riddlen-frames',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '/var/www/riddlen/logs/riddlen-frames-error.log',
      out_file: '/var/www/riddlen/logs/riddlen-frames-out.log',
      log_file: '/var/www/riddlen/logs/riddlen-frames-combined.log',
      time: true
    },
    {
      name: 'riddlen-devlog',
      cwd: '/var/www/riddlen/riddlen-devlog',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
      error_file: '/var/www/riddlen/logs/riddlen-devlog-error.log',
      out_file: '/var/www/riddlen/logs/riddlen-devlog-out.log',
      log_file: '/var/www/riddlen/logs/riddlen-devlog-combined.log',
      time: true
    }
  ],

  // Deployment configuration (for future use with pm2 deploy)
  deploy: {
    production: {
      user: 'riddlen',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-org/riddlen.git',
      path: '/var/www/riddlen',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
};

// Quick Commands:
// pm2 start ecosystem.config.js                   # Start all apps
// pm2 restart ecosystem.config.js                 # Restart all apps
// pm2 stop ecosystem.config.js                    # Stop all apps
// pm2 delete ecosystem.config.js                  # Delete all apps
// pm2 logs                                        # View all logs
// pm2 logs riddlen-main                           # View specific app logs
// pm2 monit                                       # Monitor all apps
// pm2 save                                        # Save current PM2 process list
// pm2 startup                                     # Generate startup script
