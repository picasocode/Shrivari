#!/bin/bash
set -e

# ╔══════════════════════════════════════════════════════════════╗
# ║  SVEPL - Single Run Deploy Script                           ║
# ║  Target: AWS EC2 Ubuntu + Nginx + Bun + PM2 + Supabase      ║
# ║  Domain: omarchy.dpdns.org                                   ║
# ╚══════════════════════════════════════════════════════════════╝

DOMAIN="omarchy.dpdns.org"
APP_DIR="/var/www/svepl"
APP_PORT=3000

# ── Force PATH (critical when run via sudo) ──
export PATH="/root/.bun/bin:/home/ubuntu/.bun/bin:/usr/local/bin:/usr/bin:/bin:/sbin:/usr/sbin:$PATH"

# Source nvm if available
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null || true
export NVM_DIR_ROOT="/root/.nvm"
[ -s "$NVM_DIR_ROOT/nvm.sh" ] && . "$NVM_DIR_ROOT/nvm.sh" 2>/dev/null || true

echo ""
echo "🚀 SVEPL Deployment Script (Supabase Edition)"
echo "   Domain : $DOMAIN"
echo "   App Dir: $APP_DIR"
echo "   Port   : $APP_PORT"
echo ""

# ──────────────────────────────────────────────
# 1. System Update & Core Dependencies
# ──────────────────────────────────────────────
echo "📦 [1/7] Updating system & installing dependencies..."
apt-get update -y
apt-get upgrade -y
apt-get install -y \
  curl wget git unzip build-essential \
  nginx certbot python3-certbot-nginx \
  ca-certificates gnupg dnsutils

# ──────────────────────────────────────────────
# 2. Install Node.js
# ──────────────────────────────────────────────
echo "📦 [2a] Installing Node.js..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  echo "   Node.js installed: $(node --version)"
else
  echo "   Node.js already installed: $(node --version)"
fi

# Make npm available system-wide
if command -v npm &> /dev/null; then
  NPM_PATH=$(command -v npm)
  ln -sf "$NPM_PATH" /usr/local/bin/npm 2>/dev/null || true
fi

# ──────────────────────────────────────────────
# 3. Install Bun
# ──────────────────────────────────────────────
echo "🍞 [2b] Installing Bun..."
if command -v bun &> /dev/null; then
  echo "   Bun already installed: $(bun --version)"
else
  curl -fsSL https://bun.sh/install | bash
  export PATH="/root/.bun/bin:$PATH"
  echo "   Bun installed: $(bun --version)"
fi

BUN_BIN="/root/.bun/bin/bun"
[ ! -f "$BUN_BIN" ] && BUN_BIN="/home/ubuntu/.bun/bin/bun"
ln -sf "$BUN_BIN" /usr/local/bin/bun 2>/dev/null || true
ln -sf "${BUN_BIN}x" /usr/local/bin/bunx 2>/dev/null || true

echo "   bun  : $(which bun 2>/dev/null || echo 'NOT FOUND') → $(bun --version 2>/dev/null || echo 'N/A')"
echo "   node : $(which node 2>/dev/null || echo 'NOT FOUND') → $(node --version 2>/dev/null || echo 'N/A')"
echo "   npm  : $(which npm 2>/dev/null || echo 'NOT FOUND') → $(npm --version 2>/dev/null || echo 'N/A')"

# ──────────────────────────────────────────────
# 4. Setup Application Directory
# ──────────────────────────────────────────────
echo "📁 [3/7] Setting up application directory..."
mkdir -p "$APP_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "   Copying project files to $APP_DIR..."
rsync -av \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='download' \
  --exclude='*.log' \
  --exclude='screenshot-*.png' \
  --exclude='hero-*.png' \
  --exclude='about-*.png' \
  --exclude='mini-services' \
  --exclude='examples' \
  --exclude='skills' \
  --exclude='agent-ctx' \
  --exclude='tool-results' \
  --exclude='upload' \
  --exclude='scrapped_*.json' \
  --exclude='*_data.json' \
  --exclude='tata_reference.json' \
  --exclude='db/' \
  "$SCRIPT_DIR/" "$APP_DIR/"

# ──────────────────────────────────────────────
# 5. Check Supabase Credentials
# ──────────────────────────────────────────────
echo "🗄️ [4/7] Checking Supabase connection..."
cd "$APP_DIR"

# Load .env
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "$DATABASE_URL" ] || echo "$DATABASE_URL" | grep -q "PROJECT_REF\|YOUR_PASSWORD"; then
  echo ""
  echo "   ⚠️  Supabase credentials not configured!"
  echo ""
  echo "   Please update $APP_DIR/.env with your Supabase credentials:"
  echo ""
  echo "   DATABASE_URL=\"postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true\""
  echo "   DIRECT_URL=\"postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres\""
  echo ""
  echo "   Then re-run this script or manually run:"
  echo "   cd $APP_DIR && bun install && bun run db:setup && bun run build"
  echo ""
  exit 1
fi

echo "   ✅ Supabase DATABASE_URL configured"

# ──────────────────────────────────────────────
# 6. Install Dependencies, Migrate & Build
# ──────────────────────────────────────────────
echo "📥 [5/7] Installing dependencies..."
bun install

echo "🗄️ Pushing schema to Supabase..."
bun x prisma generate
bun x prisma db push --accept-data-loss

echo "   Seeding database..."
bun prisma/seed.ts || echo "   ⚠️ Seed failed (may already be seeded)"

echo "🔨 [6/7] Building Next.js application..."
npx next build 2>&1 | tail -30 || {
  echo "❌ Build failed! Check errors above."
  exit 1
}

# ──────────────────────────────────────────────
# 7. PM2 + Nginx + SSL
# ──────────────────────────────────────────────
echo "⚙️ [7/7] Setting up PM2 + Nginx..."

if ! command -v npm &> /dev/null; then
  export NVM_DIR="/home/ubuntu/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

if command -v pm2 &> /dev/null; then
  echo "   PM2 already installed"
else
  npm install -g pm2
  PM2_PATH=$(command -v pm2 2>/dev/null || true)
  if [ -n "$PM2_PATH" ] && [ ! -f /usr/local/bin/pm2 ]; then
    ln -sf "$PM2_PATH" /usr/local/bin/pm2
  fi
fi

# Create PM2 ecosystem file — load .env vars
cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
const fs = require('fs');
const path = require('path');
let envVars = {};
try {
  const envFile = fs.readFileSync('/var/www/svepl/.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
  });
} catch (e) {}

module.exports = {
  apps: [
    {
      name: 'svepl',
      script: '/usr/local/bin/bun',
      args: 'run start',
      cwd: '/var/www/svepl',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        PATH: '/root/.bun/bin:/home/ubuntu/.bun/bin:/usr/local/bin:/usr/bin:/bin',
        ...envVars,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/svepl-error.log',
      out_file: '/var/log/svepl-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
EOF

pm2 delete svepl 2>/dev/null || true
cd "$APP_DIR"
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

mkdir -p /var/log
touch /var/log/svepl-error.log /var/log/svepl-out.log
echo "   ✅ Application started on port $APP_PORT"

# ──────────────────────────────────────────────
# Nginx
# ──────────────────────────────────────────────
cat > /etc/nginx/sites-available/svepl << NGINX_CONF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    location /_next/image {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /images/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    client_max_body_size 50M;
    access_log /var/log/nginx/svepl-access.log;
    error_log  /var/log/nginx/svepl-error.log;
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/svepl /etc/nginx/sites-enabled/svepl
nginx -t
systemctl enable nginx
systemctl reload nginx

# ──────────────────────────────────────────────
# SSL
# ──────────────────────────────────────────────
echo ""
echo "🔒 Setting up SSL certificate..."
mkdir -p /var/www/certbot

SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
DOMAIN_IP=$(dig +short "$DOMAIN" 2>/dev/null | tail -1 || echo "unknown")

if [ "$SERVER_IP" = "$DOMAIN_IP" ]; then
  echo "   DNS: $DOMAIN → $DOMAIN_IP (matches this server: $SERVER_IP)"
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" --redirect
  echo "   ✅ SSL certificate installed!"
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | sort -u | crontab -
else
  echo "   ⚠️  DNS not pointing to this server yet!"
  echo "   Server IP: $SERVER_IP | Domain IP: $DOMAIN_IP"
  echo "   After updating DNS: certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect"
fi

# ──────────────────────────────────────────────
# Firewall
# ──────────────────────────────────────────────
echo ""
echo "🛡️  Configuring firewall..."
if command -v ufw &> /dev/null; then
  ufw --force enable
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force reload
  echo "   ✅ Firewall configured"
else
  echo "   ⚠️  ufw not available"
fi

# ──────────────────────────────────────────────
echo ""
echo "═════════════════════════════════════════════════════════"
echo "  ✅ SVEPL Deployment Complete! (Supabase)"
echo "═════════════════════════════════════════════════════════"
echo ""
echo "  🌐 Website : https://$DOMAIN"
echo "  🔧 Admin   : https://$DOMAIN/#admin"
echo "  🗄️ Database: Supabase PostgreSQL"
echo "  📊 PM2     : pm2 status"
echo "  📋 Logs    : pm2 logs svepl"
echo "  🔄 Restart : pm2 restart svepl"
echo ""
echo "  Admin credentials: admin@svepl.com / admin123"
echo ""
echo "═════════════════════════════════════════════════════════"
