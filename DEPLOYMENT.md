# Deployment Guide

## Automatic Deployment Setup

This project is configured for automatic deployment to Vercel with GitHub Actions CI/CD.

### 1. Create a Supabase Production Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` key 
   - `service_role` key

### 2. Deploy Database Schema

```bash
# Link to your production project
npx supabase link --project-ref your-project-ref

# Push migrations to production
npx supabase db push

# Deploy Edge Functions
npx supabase functions deploy ingest-pos-toast
npx supabase functions deploy ingest-pos-aloha  
npx supabase functions deploy close-day
npx supabase functions deploy labor-plan
npx supabase functions deploy orders-suggest
```

### 3. Deploy to Vercel

#### Option A: Connect GitHub to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository
2. Vercel will auto-detect Next.js and configure build settings
3. Add these environment variables in Vercel dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
SEED_DAYS=30
BANKING_PROVIDER_WEBHOOK_SECRET=your_webhook_secret
```

4. Deploy! Vercel will automatically deploy on every push to main.

#### Option B: Manual Vercel Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (will prompt for project setup)
npx vercel

# Deploy to production
npx vercel --prod
```

### 4. Set up GitHub Actions (Optional but Recommended)

Add these secrets to your GitHub repository (**Settings** → **Secrets and variables** → **Actions**):

**Required Secrets:**
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

**How to get Vercel tokens:**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create a new token
3. Get org/project IDs from: `npx vercel link` (creates `.vercel/project.json`)

### 5. Seed Production Data

After deployment, seed your production database:

```bash
# Set production environment variables locally
export NEXT_PUBLIC_SUPABASE_URL="your_production_url"
export SUPABASE_SERVICE_ROLE_KEY="your_production_service_key"

# Seed production with 60 days of data
SEED_DAYS=60 npm run seed
```

## What Happens on Each Deploy

### On Pull Request:
✅ **Code quality checks** (lint, typecheck)  
✅ **Database migration validation**  
✅ **Build verification**  
✅ **Preview deployment** with comment on PR  

### On Main Branch Push:
✅ **Full CI pipeline**  
✅ **Production deployment**  
✅ **Automatic environment sync**  

## URLs After Deployment

- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-git-branch.vercel.app` 

## Monitoring

- **Vercel Dashboard**: Monitor deployments, functions, and analytics
- **Supabase Dashboard**: Monitor database, auth, and edge function logs
- **GitHub Actions**: Monitor CI/CD pipeline status

## Environment-Specific Configuration

### Development (Local)
- Uses local Supabase instance
- Mock data with configurable SEED_DAYS
- All features available

### Production 
- Uses production Supabase project
- Real OpenAI API integration
- Full feature set enabled

### Preview (PR Deploys)
- Uses production Supabase (shared)
- Limited OpenAI quota
- Full functionality for testing

## Troubleshooting

### Build Failures
```bash
# Check locally first
npm run build
npm run lint
npx tsc --noEmit
```

### Database Issues
```bash
# Reset and re-seed local
npx supabase db reset
npm run seed

# Check production migrations
npx supabase db diff --linked
```

### Deployment Issues
- Check Vercel function logs in dashboard
- Verify all environment variables are set
- Ensure Supabase Edge Functions are deployed

## Manual Rollback

```bash
# Rollback to previous Vercel deployment
npx vercel rollback [deployment-url]

# Rollback database migration
npx supabase migration repair --status reverted [migration-version]
```