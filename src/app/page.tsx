'use client'

import { useState, useEffect } from 'react'
import { KPIGrid, KPICard } from '@/components/ui/kpi-card'
import { AnimatedKPICard } from '@/components/ui/animated-kpi-card'
import { GrowthTracker } from '@/components/ui/growth-tracker'
import { ActionableAIInsights } from '@/components/ui/actionable-ai-insights'
import { WelcomeFlow } from '@/components/onboarding/welcome-flow'
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
    <div className="space-y-8 animate-fade-in">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Portfolio Dashboard
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {portfolioMetrics.venues} venues active
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Target className="h-4 w-4" />
            Quick Actions
          </Button>
          {isFirstVisit && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setShowOnboarding(true)}
              className="gap-1 animate-bounce-gentle"
            >
              <Zap className="h-4 w-4" />
              Take Tour
            </Button>
          )}
        </div>
      </div>

      {/* Animated KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedKPICard
          title="Yesterday Net Sales"
          value={formatCurrency(portfolioMetrics.totalSales)}
          change={{ 
            value: ((portfolioMetrics.totalSales - lastWeekSales) / lastWeekSales * 100), 
            period: 'last week', 
            positive: portfolioMetrics.totalSales > lastWeekSales 
          }}
          icon={DollarSign}
          status="good"
          delay={0}
        />
        <AnimatedKPICard
          title="Labor Efficiency" 
          value={`${laborPercentage.toFixed(1)}%`}
          change={{ 
            value: laborPercentage <= 30 ? 2.1 : -1.8, 
            period: 'target (30%)', 
            positive: laborPercentage <= 30 
          }}
          icon={Users}
          status={laborPercentage <= 30 ? 'good' : laborPercentage <= 33 ? 'warning' : 'alert'}
          delay={150}
        />
        <AnimatedKPICard
          title="Growth Fund"
          value={formatCurrency(totalGrowthFund)}
          subtitle={`${(totalGrowthFund / (2 * 485000) * 100).toFixed(1)}% to expansion goal`}
          change={{
            value: actualDailyGrowth >= dailyGrowthTarget ? 12.3 : -3.2,
            period: 'monthly target',
            positive: actualDailyGrowth >= dailyGrowthTarget
          }}
          icon={TrendingUp}
          status={actualDailyGrowth >= dailyGrowthTarget ? 'good' : 'warning'}
          delay={300}
        />
        <AnimatedKPICard
          title="Avg Check Size"
          value={formatCurrency(avgCheckSize)}
          change={{ value: 4.7, period: 'last month', positive: true }}
          icon={Calendar}
          status="good"
          delay={450}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* AI Daily Brief - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <ActionableAIInsights 
            insights={realisticAIInsights}
            onApplyAction={handleApplyInsight}
          />
        </div>

        {/* Growth Tracker */}
        <div className="space-y-6">
          <GrowthTracker 
            data={growthData}
            venueData={venueGrowthData}
            onAdjustGoals={() => {
              console.log('Adjust goals')
            }}
          />
          
          {/* Quick Stats Card */}
          <Card className="animate-slide-in-left" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="text-lg">Today's Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Best Performer</span>
                <span className="font-medium text-green-600">Shogun Sushi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Action Items</span>
                <span className="font-medium text-orange-600">{realisticAIInsights.filter(i => i.severity === 'high').length} urgent</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Growth Progress</span>
                <span className="font-medium text-blue-600">On track</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Venue Performance Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Venue Performance</h2>
          <Button variant="outline" size="sm">View All Details</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
  
  // Generate realistic envelope data
  const totalCashBalance = venue.net_sales * 0.25 + (Math.random() * 5000)
  const growthFund = venue.net_sales * 0.08 + (Math.random() * 2000)
  const laborPct = (venue.labor_cost / venue.net_sales) * 100
  
  const getStatusColor = () => {
    if (laborPct <= 28) return 'border-green-200 bg-green-50/30'
    if (laborPct <= 32) return 'border-yellow-200 bg-yellow-50/30'
    return 'border-red-200 bg-red-50/30'
  }
  
  const getPerformanceIndicator = () => {
    if (!venue?.venue_name || !venue?.net_sales) {
      return { text: 'Good', color: 'text-blue-600' }
    }
    
    const avgDailySales = Object.values(REALISTIC_VENUES).find(v => 
      v.name === venue.venue_name
    )?.avgDailySales || 5000
    
    const performance = venue.net_sales / avgDailySales
    if (performance >= 1.1) return { text: 'Excellent', color: 'text-green-600' }
    if (performance >= 0.95) return { text: 'Good', color: 'text-blue-600' }
    if (performance >= 0.8) return { text: 'Fair', color: 'text-yellow-600' }
    return { text: 'Below Target', color: 'text-red-600' }
  }
  
  const performance = getPerformanceIndicator()

  return (
    <Card className={cn(
      "transition-all duration-500 hover:scale-105 hover:shadow-lg animate-fade-in-up",
      getStatusColor()
    )} style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{venue.venue_name}</h3>
          <div className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full", 
              laborPct <= 28 ? 'bg-green-500' : 
              laborPct <= 32 ? 'bg-yellow-500' : 'bg-red-500'
            )} />
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Yesterday Sales</span>
            <span className="font-bold text-lg">{formatCurrency(venue.net_sales)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Labor Cost</span>
            <span className={cn("font-medium",
              laborPct <= 28 ? 'text-green-600' : 
              laborPct <= 32 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {laborPct.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Growth Fund</span>
            <span className="font-medium text-blue-600">{formatCurrency(growthFund)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span className="font-medium">{venue.guests}</span>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Performance</span>
              <span className={cn("font-medium text-xs", performance.color)}>
                {performance.text}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}