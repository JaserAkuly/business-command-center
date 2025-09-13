#!/bin/bash

# Production seed script
# You need to get your service role key from Supabase dashboard

echo "🌱 Seeding production database..."

# Set production environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://dgtdgbnxgfqlscyurkzh.supabase.co"

# You need to replace this with your actual service role key from Supabase dashboard
# Go to: https://supabase.com/dashboard/project/dgtdgbnxgfqlscyurkzh/settings/api
echo "❌ Please get your SERVICE_ROLE key from Supabase dashboard:"
echo "   1. Go to: https://supabase.com/dashboard/project/dgtdgbnxgfqlscyurkzh/settings/api"
echo "   2. Copy the 'service_role' key (secret)"
echo "   3. Run: export SUPABASE_SERVICE_ROLE_KEY='your_actual_key_here'"
echo "   4. Then run: SEED_DAYS=60 npm run seed"

echo ""
echo "🚀 Meanwhile, checking Vercel deployment..."

# Check if Vercel deployment is ready
npx vercel list --yes