module.exports = {
  apps: [{
    name: 'finance-backend',
    script: 'gunicorn',
    args: '--bind 0.0.0.0:5000 --workers 4 app:app',
    cwd: '/root/finance-bro/backend',
    interpreter: '/root/finance-bro/myenv/bin/python',
    env: {
      NODE_ENV: 'production',
      FLASK_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}; 