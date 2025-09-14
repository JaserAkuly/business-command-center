'use client'

import { KPIGrid, KPICard } from '@/components/ui/kpi-card'
import { GrowthTracker } from '@/components/ui/growth-tracker'
import { AIInsights } from '@/components/ui/ai-insights'
import { useVenues, useVenueSales, useCashEnvelopes, useGrowthGoals, useAIInsights } from '@/hooks/use-bcc-api'
import { formatCurrency } from '@/lib/business-logic'
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react'

export default function PortfolioDashboard() {
  const { data: venues, isLoading: venuesLoading } = useVenues()
  const { data: growthGoals } = useGrowthGoals()
  const { data: aiInsights } = useAIInsights()

  // Get yesterday's date for sales data
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // Get sales data for all venues
  const { data: allVenueSales } = useVenueSales('', yesterdayStr, yesterdayStr)

  if (venuesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Calculate portfolio metrics
  const portfolioMetrics = venues?.reduce((acc, venue) => {
    const venueSales = allVenueSales?.find(sale => sale.venue_id === venue.id)
    if (venueSales) {
      acc.totalSales += venueSales.net_sales
      acc.totalLabor += venueSales.labor_cost
      acc.totalGuests += venueSales.guests
      acc.venues++
    }
    return acc
  }, { totalSales: 0, totalLabor: 0, totalGuests: 0, venues: 0 }) || 
  { totalSales: 0, totalLabor: 0, totalGuests: 0, venues: 0 }

  const laborPercentage = portfolioMetrics.totalSales > 0 
    ? (portfolioMetrics.totalLabor / portfolioMetrics.totalSales) * 100 
    : 0

  // Mock growth fund data - in real app would aggregate from cash envelopes
  const totalGrowthFund = 65000 // Sum of all venue growth envelopes
  const dailyGrowthTarget = 850
  const actualDailyGrowth = portfolioMetrics.totalSales * 0.08

  const growthData = {
    target_units: growthGoals?.[0]?.target_units || 3,
    horizon_years: growthGoals?.[0]?.horizon_years || 2.5,
    estimated_cost_per_unit: growthGoals?.[0]?.estimated_cost_per_unit || 450000,
    total_cost_needed: (growthGoals?.[0]?.target_units || 3) * (growthGoals?.[0]?.estimated_cost_per_unit || 450000),
    daily_target_savings: dailyGrowthTarget,
    current_growth_fund: totalGrowthFund,
    daily_actual_savings: actualDailyGrowth,
    on_track: actualDailyGrowth >= dailyGrowthTarget,
    eta_years: totalGrowthFund > 0 ? ((3 * 450000) / (actualDailyGrowth * 365)) : 2.5
  }

  const venueGrowthData = venues?.map(venue => ({
    venue_name: venue.name,
    current_fund: Math.floor(Math.random() * 20000) + 5000, // Mock data
    daily_savings: Math.floor(Math.random() * 200) + 100,
    on_track: Math.random() > 0.3
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <KPIGrid>
        <KPICard
          title="Yesterday Net Sales"
          value={formatCurrency(portfolioMetrics.totalSales)}
          change={{ value: 12.5, period: 'last week', positive: true }}
          icon={DollarSign}
          status="good"
        />
        <KPICard
          title="Labor Percentage" 
          value={`${laborPercentage.toFixed(1)}%`}
          change={{ value: -2.1, period: 'target', positive: true }}
          icon={Users}
          status={laborPercentage <= 32 ? 'good' : laborPercentage <= 35 ? 'warning' : 'alert'}
        />
        <KPICard
          title="Growth Fund"
          value={formatCurrency(totalGrowthFund)}
          subtitle={`${(totalGrowthFund / (3 * 450000) * 100).toFixed(1)}% to goal`}
          icon={TrendingUp}
          status={growthData.on_track ? 'good' : 'warning'}
        />
        <KPICard
          title="Daily Guests"
          value={portfolioMetrics.totalGuests.toLocaleString()}
          change={{ value: 8.3, period: 'last week', positive: true }}
          icon={Calendar}
          status="good"
        />
      </KPIGrid>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Daily Brief */}
        <div className="lg:col-span-2">
          <AIInsights 
            insights={aiInsights || []}
            onApplyAction={(insight) => {
              console.log('Apply action:', insight)
              // Would implement action handling here
            }}
          />
        </div>

        {/* Growth Tracker */}
        <GrowthTracker 
          data={growthData}
          venueData={venueGrowthData}
          onAdjustGoals={() => {
            console.log('Adjust goals')
            // Would open growth goals modal
          }}
        />
      </div>

      {/* Cash Autopilot Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Cash Autopilot by Venue</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {venues?.map(venue => (
            <VenueCashOverview 
              key={venue.id} 
              venue={venue}
              sales={allVenueSales?.find(sale => sale.venue_id === venue.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function VenueCashOverview({ 
  venue, 
  sales 
}: { 
  venue: { id: string; name: string; type: string }
  sales?: { venue_id: string; net_sales: number } 
}) {
  const { data: envelopes } = useCashEnvelopes(venue.id)
  
  const totalBalance = envelopes?.reduce((sum, env) => sum + (env.current_balance || 0), 0) || 0
  const growthEnvelope = envelopes?.find(env => env.name === 'growth')

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{venue.name}</h3>
        <span className="text-xs text-muted-foreground capitalize">{venue.type}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total Cash</span>
          <span className="text-sm font-medium">{formatCurrency(totalBalance)}</span>
        </div>
        
        {sales && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Yesterday Sales</span>
            <span className="text-sm font-medium">{formatCurrency(sales.net_sales)}</span>
          </div>
        )}
        
        {growthEnvelope && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Growth Fund</span>
            <span className="text-sm font-medium">{formatCurrency(growthEnvelope.current_balance || 0)}</span>
          </div>
        )}
      </div>
    </div>
  )
}