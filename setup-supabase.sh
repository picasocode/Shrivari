#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  SVEPL - Supabase Database Setup Script                     ║
# ║  Run this after updating .env with your database password    ║
# ╚══════════════════════════════════════════════════════════════╝

set -e

echo ""
echo "🗄️  SVEPL Supabase Database Setup"
echo "═══════════════════════════════════"
echo ""

# Check if .env has the actual password (not placeholder)
if grep -q '\[YOUR-DB-PASSWORD\]' .env 2>/dev/null; then
  echo "❌ Database password not configured!"
  echo ""
  echo "Please update .env with your Supabase database password:"
  echo ""
  echo "  1. Go to: https://supabase.com/dashboard/project/uegbwedkxiimmfaykwxh/settings/database"
  echo "  2. Find 'Connection string' section"
  echo "  3. Copy the password or reset it"
  echo "  4. Replace [YOUR-DB-PASSWORD] in .env with your actual password"
  echo ""
  echo "  DATABASE_URL format:"
  echo "  postgresql://postgres.uegbwedkxiimmfaykwxh:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  echo ""
  echo "  DIRECT_URL format:"
  echo "  postgresql://postgres:YOUR_PASSWORD@db.uegbwedkxiimmfaykwxh.supabase.co:5432/postgres"
  echo ""
  exit 1
fi

# Load .env
set -a
source .env 2>/dev/null || true
set +a

echo "📦 Step 1: Generating Prisma client..."
bun x prisma generate

echo "📦 Step 2: Pushing schema to Supabase..."
bun x prisma db push --accept-data-loss

echo "📦 Step 3: Seeding database..."
bun prisma/seed.ts || echo "⚠️  Seed may have partially failed (check errors above)"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Run 'bun run dev' to start the application."
echo ""
