#!/bin/bash

# Production seed script
# You need to get your service role key from Supabase dashboard

echo "🌱 Seeding production database..."

# Environment variables should be set via Vercel dashboard or .env files
echo "❌ Please configure environment variables in Vercel dashboard:"
echo "   1. Go to your Vercel project settings"
echo "   2. Add NEXT_PUBLIC_SUPABASE_URL from your Supabase project"
echo "   3. Add NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase project"
echo "   4. Add SUPABASE_SERVICE_ROLE_KEY from your Supabase project"
echo "   5. Then run: SEED_DAYS=60 npm run seed"

echo ""
echo "🚀 Meanwhile, checking Vercel deployment..."

# Check if Vercel deployment is ready
npx vercel list --yes