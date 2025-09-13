# Business Command Center (BCC)

An AI-powered Business Command Center for managing a 5-venue restaurant portfolio with obsessive focus on money clarity and growth.

## Features

### Core Business Logic
- **Cash Autopilot**: Automated cash envelope allocation from daily sales
- **Growth Planner**: Track progress toward unit expansion goals with daily targets
- **Labor Guardrail**: Real-time labor cost monitoring with role-based recommendations
- **Smart Buy Sheets**: Inventory reorder point calculations with case-pack optimization

### AI-Powered Insights
- Daily business intelligence with actionable recommendations
- Automated risk detection and opportunity identification
- Category-based insights: Cash, Growth, Labor, Inventory, Risk, Opportunity

### Comprehensive Dashboard
- Portfolio-level KPIs and venue rollups
- Real-time cash envelope management
- Labor variance tracking with suggested adjustments
- Growth fund progress monitoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Postgres, Auth, RLS, Edge Functions)
- **Data**: TanStack Query for state management
- **AI**: OpenAI API integration for insights
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Architecture

### Database Schema
- Multi-tenant architecture with RLS policies
- Venues: 5 seeded locations (Shogun, Corner Pocket, Speak Easy, Harbor House, Velvet Room)
- Cash envelopes: tax, payroll, debt, growth, reserves, cogs
- POS sales tracking with COGS breakdown
- Inventory management with PAR levels and vendor case-packs
- AI insights with structured action data

### API Layer
Supabase Edge Functions provide:
- `POST /ingest/pos/toast` - Toast POS webhook simulator
- `POST /ingest/pos/aloha` - NCR Aloha CSV import
- `POST /close-day` - End-of-day processing (Cash Autopilot + AI insights)
- `POST /labor/plan` - Labor planning and guardrail calculations
- `POST /orders/suggest` - Smart buy sheet generation

## Quick Start

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 2. Database Setup

```bash
# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db reset

# Seed with demo data (30/45/60/90 days)
SEED_DAYS=30 npm run seed
```

### 3. Development

```bash
# Start development server
npm run dev

# Deploy Edge Functions (if using remote Supabase)
npx supabase functions deploy
```

## Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Seeding
SEED_DAYS=30

# Banking Provider Mock
BANKING_PROVIDER_WEBHOOK_SECRET=your_webhook_secret
```

## Demo Data

The application comes pre-seeded with:

### Venues
- **Shogun**: Japanese restaurant with sushi margin profile
- **Corner Pocket**: Sports bar with standard bar margins  
- **Speak Easy**: Upscale cocktail lounge
- **Harbor House**: Seafood restaurant with premium pricing
- **Velvet Room**: Ultra-premium lounge with luxury service

### Financial Targets
- Tax envelope: 8.25%
- Payroll: 30-35% (venue-specific)
- Debt service: 5%
- Growth fund: 5-12%
- Reserves: 3-5%
- COGS: Variable by actuals (18-34%)

### Growth Planning
- Target: 3 new units in 2.5 years
- Estimated cost: $450K per unit
- Required daily savings across portfolio

## Key Components

### Cash Autopilot
Automatically allocates net sales into designated envelopes based on target percentages. Tracks 28-day rolling averages and provides runway calculations.

### Labor Guardrail  
Forecasts sales using historical data and seasonality factors. Calculates allowed labor spend and provides real-time variance alerts with role-specific recommendations.

### Smart Buy Sheets
Calculates reorder points using: `ROP = demand_avg * lead_time + safety_stock`
Optimizes for vendor case-pack quantities and flags waste/stockout risks.

### Growth Planner
Tracks daily progress toward expansion goals. Calculates required daily set-aside per venue and provides ETA projections based on current savings rate.

## API Documentation

### POS Integration
Mock integrations simulate real POS webhook data:

```javascript
// Toast webhook format
POST /api/supabase/functions/v1/ingest-pos-toast
{
  "venue_id": "uuid",
  "business_date": "2024-01-01", 
  "gross_sales": 4500.00,
  "net_sales": 4200.00,
  "tax_collected": 346.50,
  "guests": 120,
  "check_count": 85,
  "labor_cost": 1365.00,
  "labor_hours": 68.25,
  "food_sales": 3150.00,
  "liquor_sales": 1050.00
}
```

### Close Day Processing
Triggers complete end-of-day workflow:

```javascript
POST /api/supabase/functions/v1/close-day
{
  "venue_id": "uuid",
  "business_date": "2024-01-01"
}
```

Returns cash allocations, labor analysis, and AI-generated insights.

## Deployment

### Vercel Deployment

```bash
# Connect to Vercel
npx vercel

# Deploy with environment variables
npx vercel --prod
```

### Supabase Production

1. Create production project at [supabase.com](https://supabase.com)
2. Update environment variables
3. Deploy Edge Functions: `npx supabase functions deploy`
4. Run migrations: `npx supabase db push`

## Testing

```bash
# Run linting
npm run lint

# Type checking  
npx tsc --noEmit

# Run tests (if implemented)
npm test
```

## Contributing

This is a demo application showcasing restaurant portfolio management concepts. Key areas for extension:

- **Real POS integrations** (Toast, Square, NCR Aloha)
- **Banking API integration** for actual cash movements
- **Advanced AI insights** with OpenAI function calling
- **Mobile-responsive scheduler** for shift management
- **Inventory vendor integrations** (Sysco, US Foods)
- **Comprehensive reporting** and audit trails

## License

MIT License - see LICENSE file for details.

## Support

For questions about this demo application, please create an issue in the GitHub repository.

---

Built with ❤️ for restaurant operators who obsess over unit economics and growth.