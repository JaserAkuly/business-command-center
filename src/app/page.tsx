'use client'

import { useState, useEffect } from 'react'
import { KPIGrid, KPICard } from '@/components/ui/kpi-card'
import { PremiumKPICard } from '@/components/ui/premium-kpi-card'
import { GrowthTracker } from '@/components/ui/growth-tracker'
import { PremiumAIInsights } from '@/components/ui/premium-ai-insights'
import { DayComparisonWidget } from '@/components/ui/day-comparison-widget'
import { WelcomeFlow } from '@/components/onboarding/welcome-flow'
import Link from 'next/link'
import { useVenues, useVenueSales, useCashEnvelopes, useGrowthGoals, useAIInsights } from '@/hooks/use-bcc-api'
import { formatCurrency } from '@/lib/business-logic'
import { REALISTIC_VENUES, generateRealisticDailyData, generateRealisticAIInsights } from '@/lib/realistic-data'
import { DollarSign, TrendingUp, Users, Calendar, Target, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function PortfolioDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  
  const { data: venues, isLoading: venuesLoading } = useVenues()
  const { data: growthGoals } = useGrowthGoals()
  const { data: aiInsights } = useAIInsights()
  
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('bcc-onboarding-completed')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    } else {
      setIsFirstVisit(false)
    }
  }, [])
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    setIsFirstVisit(false)
    localStorage.setItem('bcc-onboarding-completed', 'true')
  }

  // Get yesterday's date for sales data
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // Get sales data for all venues
  const { data: allVenueSales } = useVenueSales('', yesterdayStr, yesterdayStr)
  
  // Generate realistic data for demo
  const realisticVenueData = Object.keys(REALISTIC_VENUES).map(venueKey => {
    const venue = REALISTIC_VENUES[venueKey as keyof typeof REALISTIC_VENUES]
    const dailyData = generateRealisticDailyData(venueKey as keyof typeof REALISTIC_VENUES, yesterday)
    return {
      venue_name: venue.name,
      venue_id: venueKey,
      ...dailyData
    }
  })
  
  const realisticAIInsights = realisticVenueData.length > 0 
    ? generateRealisticAIInsights(realisticVenueData, yesterday) 
    : []

  if (venuesLoading && !showOnboarding) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (showOnboarding) {
    return <WelcomeFlow onComplete={handleOnboardingComplete} />
  }

  // Calculate portfolio metrics using realistic data
  const portfolioMetrics = realisticVenueData.reduce((acc, venue) => {
    acc.totalSales += venue.net_sales
    acc.totalLabor += venue.labor_cost
    acc.totalGuests += venue.guests
    acc.venues++
    return acc
  }, { totalSales: 0, totalLabor: 0, totalGuests: 0, venues: 0 })

  const laborPercentage = portfolioMetrics.totalSales > 0 
    ? (portfolioMetrics.totalLabor / portfolioMetrics.totalSales) * 100 
    : 0
    
  const avgCheckSize = portfolioMetrics.totalGuests > 0 
    ? portfolioMetrics.totalSales / portfolioMetrics.totalGuests 
    : 0

  // Realistic growth fund data
  const totalGrowthFund = 127500 // Current growth fund across all venues
  const dailyGrowthTarget = 1850 // Daily savings target
  const actualDailyGrowth = portfolioMetrics.totalSales * 0.085 // 8.5% to growth
  const lastWeekSales = 145600 // Previous week's sales for comparison
  
  // Format change percentages elegantly
  const formatChange = (current: number, previous: number): number => {
    if (previous === 0) return 0
    const change = ((current - previous) / previous) * 100
    // Round to 1 decimal place and cap extreme values
    return Math.round(Math.min(Math.max(change, -99), 99) * 10) / 10
  }

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

  const handleApplyInsight = async (insight: any) => {
    // Simulate applying the insight
    console.log('Applying insight:', insight)
    // In a real app, this would make API calls to implement the suggestion
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Premium Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Portfolio Overview
            </h1>
            <p className="text-muted-foreground text-lg">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric'
              })} • {portfolioMetrics.venues} locations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isFirstVisit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowOnboarding(true)}
                className="gap-2"
              >
                <Target className="h-4 w-4" />
                Take Tour
              </Button>
            )}
            <Link href="/labor">
              <Button size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Premium KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <PremiumKPICard
          title="Revenue"
          value={portfolioMetrics.totalSales}
          change={{ 
            value: formatChange(portfolioMetrics.totalSales, lastWeekSales), 
            period: 'last week', 
            positive: portfolioMetrics.totalSales > lastWeekSales 
          }}
          icon={DollarSign}
          status={portfolioMetrics.totalSales > lastWeekSales * 1.05 ? 'success' : 'neutral'}
          delay={0}
        />
        <PremiumKPICard
          title="Labor Cost" 
          value={`${laborPercentage.toFixed(1)}%`}
          change={{ 
            value: formatChange(laborPercentage, 30), 
            period: 'target 30%', 
            positive: laborPercentage <= 30 
          }}
          icon={Users}
          status={laborPercentage <= 30 ? 'success' : laborPercentage <= 35 ? 'warning' : 'error'}
          delay={150}
        />
        <PremiumKPICard
          title="Growth Fund"
          value={totalGrowthFund}
          change={{
            value: formatChange(actualDailyGrowth, dailyGrowthTarget),
            period: 'daily target',
            positive: actualDailyGrowth >= dailyGrowthTarget
          }}
          icon={TrendingUp}
          status={actualDailyGrowth >= dailyGrowthTarget ? 'success' : 'warning'}
          delay={300}
        />
        <PremiumKPICard
          title="Avg Check"
          value={avgCheckSize}
          change={{ value: 4.7, period: 'last month', positive: true }}
          icon={Target}
          status="success"
          delay={450}
        />
      </div>

      {/* Premium Content Layout */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* AI Insights - Premium real estate */}
        <div className="lg:col-span-3">
          <PremiumAIInsights 
            insights={realisticAIInsights}
            onApplyAction={handleApplyInsight}
          />
        </div>

        {/* Growth Tracker & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Comparison - Critical Business Metric */}
          <DayComparisonWidget />
          
          <GrowthTracker 
            data={growthData}
            venueData={venueGrowthData}
            onAdjustGoals={() => {
              console.log('Adjust goals')
            }}
          />
          
          {/* POS Integration Status */}
          <Card className="animate-scale-in hover-lift" style={{ animationDelay: '600ms' }}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">System Status</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-xs text-success">All systems operational</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Toast POS Integration</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Live sync • 2min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Labor Management</span>
                  </div>
                  <span className="text-xs text-muted-foreground">When I Work • Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm">Financial Reporting</span>
                  </div>
                  <span className="text-xs text-muted-foreground">QuickBooks • Synced</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Data Coverage</span>
                  <span className="font-medium text-success">100% of venues</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Venue Performance Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Location Performance</h2>
          <Link href="/venues">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              View Details
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {realisticVenueData.map((venue, index) => (
            <VenueCashOverview 
              key={venue.venue_id} 
              venue={venue}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function VenueCashOverview({ 
  venue,
  delay = 0
}: { 
  venue: any
  delay?: number
}) {
  const { data: envelopes } = useCashEnvelopes(venue.venue_id)
  
  // Generate realistic data
  const laborPct = (venue.labor_cost / venue.net_sales) * 100
  
  const getPerformanceStatus = () => {
    if (!venue?.venue_name || !venue?.net_sales) {
      return { status: 'neutral', label: 'Normal' }
    }
    
    const avgDailySales = Object.values(REALISTIC_VENUES).find(v => 
      v.name === venue.venue_name
    )?.avgDailySales || 5000
    
    const performance = venue.net_sales / avgDailySales
    if (performance >= 1.1) return { status: 'success', label: 'Excellent' }
    if (performance >= 0.95) return { status: 'neutral', label: 'On Track' }
    if (performance >= 0.8) return { status: 'warning', label: 'Below Target' }
    return { status: 'error', label: 'Attention Needed' }
  }
  
  const { status, label } = getPerformanceStatus()
  const laborStatus = laborPct <= 28 ? 'success' : laborPct <= 32 ? 'warning' : 'error'

  return (
    <Card className={cn(
      "hover-lift animate-fade-in-up group cursor-pointer",
      status === 'success' && "status-success",
      status === 'warning' && "status-warning", 
      status === 'error' && "status-error",
      status === 'neutral' && "border hover:shadow-sm"
    )} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm leading-tight">
                {venue.venue_name?.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  laborStatus === 'success' && "bg-success",
                  laborStatus === 'warning' && "bg-warning",
                  laborStatus === 'error' && "bg-destructive"
                )} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            </div>
          </div>
          
          {/* Key Metric - Revenue */}
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {formatCurrency(venue.net_sales)}
            </div>
            <div className="text-xs text-muted-foreground">Yesterday's Revenue</div>
          </div>
          
          {/* Secondary Metrics */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Labor</span>
              <span className={cn(
                "font-medium",
                laborStatus === 'success' && "text-success",
                laborStatus === 'warning' && "text-warning",
                laborStatus === 'error' && "text-destructive"
              )}>
                {laborPct.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{venue.guests?.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Check</span>
              <span className="font-medium">
                {formatCurrency(venue.guests > 0 ? venue.net_sales / venue.guests : 0)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}