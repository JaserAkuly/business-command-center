// Realistic business data generators for restaurant portfolio

export const REALISTIC_VENUES = {
  shogun: {
    name: 'Shogun Sushi & Hibachi',
    type: 'restaurant' as const,
    avgDailySales: 8500,
    peakDays: ['friday', 'saturday'],
    laborTarget: 28,
    avgGuests: 180,
    avgCheck: 47.20,
    trends: {
      salesGrowth: 0.12, // 12% YoY growth
      guestGrowth: 0.08,
      laborEfficiency: 0.95
    }
  },
  cornerPocket: {
    name: 'Corner Pocket Sports Bar',
    type: 'bar' as const,
    avgDailySales: 6200,
    peakDays: ['thursday', 'friday', 'saturday', 'sunday'],
    laborTarget: 32,
    avgGuests: 145,
    avgCheck: 42.75,
    trends: {
      salesGrowth: 0.18,
      guestGrowth: 0.15,
      laborEfficiency: 0.88
    }
  },
  speakEasy: {
    name: 'Speak Easy Cocktail Lounge',
    type: 'lounge' as const,
    avgDailySales: 4800,
    peakDays: ['friday', 'saturday'],
    laborTarget: 25,
    avgGuests: 95,
    avgCheck: 50.50,
    trends: {
      salesGrowth: 0.22,
      guestGrowth: 0.18,
      laborEfficiency: 1.02
    }
  },
  harborHouse: {
    name: 'Harbor House Seafood',
    type: 'restaurant' as const,
    avgDailySales: 9200,
    peakDays: ['friday', 'saturday', 'sunday'],
    laborTarget: 30,
    avgGuests: 195,
    avgCheck: 47.20,
    trends: {
      salesGrowth: 0.09,
      guestGrowth: 0.06,
      laborEfficiency: 0.91
    }
  },
  velvetRoom: {
    name: 'Velvet Room Fine Dining',
    type: 'restaurant' as const,
    avgDailySales: 5600,
    peakDays: ['friday', 'saturday'],
    laborTarget: 26,
    avgGuests: 85,
    avgCheck: 65.90,
    trends: {
      salesGrowth: 0.07,
      guestGrowth: 0.04,
      laborEfficiency: 1.05
    }
  }
}

export const generateRealisticDailyData = (venue: keyof typeof REALISTIC_VENUES, date: Date) => {
  const config = REALISTIC_VENUES[venue]
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const isPeakDay = config.peakDays.includes(dayOfWeek)
  const isWeekend = ['friday', 'saturday', 'sunday'].includes(dayOfWeek)
  
  // Base sales with realistic variance
  let salesMultiplier = 1
  if (isPeakDay) salesMultiplier *= 1.35
  if (isWeekend && !isPeakDay) salesMultiplier *= 1.15
  if (dayOfWeek === 'monday') salesMultiplier *= 0.65
  if (dayOfWeek === 'tuesday') salesMultiplier *= 0.75
  
  // Add seasonal and random variance
  const seasonalFactor = 1 + (Math.sin(date.getMonth() * Math.PI / 6) * 0.1)
  const randomVariance = 0.85 + Math.random() * 0.3
  
  const netSales = Math.round(config.avgDailySales * salesMultiplier * seasonalFactor * randomVariance)
  const guests = Math.round((netSales / config.avgCheck) * (0.9 + Math.random() * 0.2))
  
  // Labor calculations
  const baseHours = isWeekend ? 85 : 70
  const laborHours = baseHours + (isPeakDay ? 15 : 0) + (Math.random() * 10 - 5)
  const avgWage = 18.50
  const laborCost = Math.round(laborHours * avgWage)
  
  // Food costs (28-35% of sales)
  const cogsFoodPct = 0.28 + Math.random() * 0.07
  const cogsFood = Math.round(netSales * cogsFoodPct)
  
  return {
    business_date: date.toISOString().split('T')[0],
    net_sales: netSales,
    gross_sales: Math.round(netSales * 1.08), // Add tax
    labor_cost: laborCost,
    labor_hours: Math.round(laborHours * 10) / 10,
    guests: guests,
    check_count: Math.round(guests * (0.7 + Math.random() * 0.3)),
    cogs_food: cogsFood,
    cogs_liquor: Math.round(netSales * 0.22),
    tax_collected: Math.round(netSales * 0.08),
    discounts: Math.round(netSales * 0.02),
    comps: Math.round(netSales * 0.015)
  }
}

export const generateRealisticAIInsights = (venueData: any[], date: Date) => {
  const insights = []
  
  for (const venue of venueData) {
    const config = REALISTIC_VENUES[venue.name.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof REALISTIC_VENUES]
    if (!config) continue
    
    const laborPct = (venue.labor_cost / venue.net_sales) * 100
    const salesTrend = config.trends.salesGrowth
    
    // Labor insights
    if (laborPct > config.laborTarget + 3) {
      insights.push({
        venue_id: venue.venue_id,
        category: 'labor' as const,
        severity: laborPct > config.laborTarget + 6 ? 'high' as const : 'medium' as const,
        message: `${venue.venue_name} labor at ${laborPct.toFixed(1)}% (target: ${config.laborTarget}%). Consider adjusting tonight's schedule - cut 1 server shift to save $85.`,
        action_data: {
          type: 'schedule_adjustment',
          savings: 85,
          shifts_to_cut: 1,
          position: 'server'
        },
        business_date: date.toISOString().split('T')[0]
      })
    }
    
    // Growth opportunities
    if (salesTrend > 0.15) {
      insights.push({
        venue_id: venue.venue_id,
        category: 'opportunity' as const,
        severity: 'medium' as const,
        message: `${venue.venue_name} showing strong ${(salesTrend * 100).toFixed(0)}% growth. Consider expanding happy hour menu or extending hours on weekends.`,
        action_data: {
          type: 'menu_expansion',
          potential_revenue: 1200,
          implementation_cost: 300
        },
        business_date: date.toISOString().split('T')[0]
      })
    }
    
    // Cash flow insights
    const dailyCashTarget = venue.net_sales * 0.12
    if (venue.net_sales > config.avgDailySales * 1.2) {
      insights.push({
        venue_id: venue.venue_id,
        category: 'cash' as const,
        severity: 'low' as const,
        message: `Excellent sales day at ${venue.venue_name} ($${venue.net_sales.toLocaleString()})! Move $${Math.round(dailyCashTarget).toLocaleString()} to growth envelope.`,
        action_data: {
          type: 'envelope_transfer',
          amount: Math.round(dailyCashTarget),
          from: 'operating',
          to: 'growth'
        },
        business_date: date.toISOString().split('T')[0]
      })
    }
  }
  
  return insights
}

export const GROWTH_SCENARIOS = {
  aggressive: {
    target_units: 3,
    horizon_years: 2,
    estimated_cost_per_unit: 485000,
    confidence: 0.75
  },
  moderate: {
    target_units: 2,
    horizon_years: 2.5,
    estimated_cost_per_unit: 465000,
    confidence: 0.90
  },
  conservative: {
    target_units: 1,
    horizon_years: 1.5,
    estimated_cost_per_unit: 425000,
    confidence: 0.95
  }
}