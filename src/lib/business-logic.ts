import { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type CashEnvelope = Tables['cash_envelopes']['Row']
type GrowthGoal = Tables['growth_goals']['Row']

// Cash Autopilot Logic
export interface CashAllocation {
  envelopeName: string
  targetPct: number
  currentBalance: number
  allocation: number
  newBalance: number
}

export function calculateCashAllocations(
  netSales: number,
  envelopes: CashEnvelope[]
): CashAllocation[] {
  return envelopes.map(envelope => {
    const allocation = netSales * (envelope.target_pct / 100)
    return {
      envelopeName: envelope.name,
      targetPct: envelope.target_pct,
      currentBalance: envelope.current_balance || 0,
      allocation,
      newBalance: (envelope.current_balance || 0) + allocation
    }
  })
}

// Growth Planner Logic
export interface GrowthMetrics {
  targetUnits: number
  horizonYears: number
  estimatedCostPerUnit: number
  totalCostNeeded: number
  dailyTargetSavings: number
  currentGrowthFund: number
  dailyActualSavings: number
  onTrack: boolean
  etaYears: number
  shortfallPerDay?: number
}

export function calculateGrowthMetrics(
  goal: GrowthGoal,
  currentGrowthFund: number,
  avgDailySales: number,
  growthEnvelopeTargetPct: number = 8
): GrowthMetrics {
  const totalCostNeeded = goal.target_units * goal.estimated_cost_per_unit
  const dailyTargetSavings = totalCostNeeded / (goal.horizon_years * 365)
  const dailyActualSavings = avgDailySales * (growthEnvelopeTargetPct / 100)
  
  const onTrack = dailyActualSavings >= dailyTargetSavings
  const etaYears = currentGrowthFund > 0 
    ? totalCostNeeded / (dailyActualSavings * 365)
    : goal.horizon_years

  return {
    targetUnits: goal.target_units,
    horizonYears: goal.horizon_years,
    estimatedCostPerUnit: goal.estimated_cost_per_unit,
    totalCostNeeded,
    dailyTargetSavings,
    currentGrowthFund,
    dailyActualSavings,
    onTrack,
    etaYears,
    shortfallPerDay: onTrack ? undefined : dailyTargetSavings - dailyActualSavings
  }
}

// Labor Guardrail Logic
export interface LaborGuardrail {
  forecastSales: number
  targetLaborPct: number
  allowedLaborSpend: number
  actualLaborSpend: number
  variancePct: number
  varianceDollars: number
  status: 'good' | 'warning' | 'alert'
  message: string
}

export function calculateLaborGuardrail(
  forecastSales: number,
  targetLaborPct: number,
  actualLaborSpend: number
): LaborGuardrail {
  const allowedLaborSpend = forecastSales * (targetLaborPct / 100)
  const varianceDollars = actualLaborSpend - allowedLaborSpend
  const variancePct = (varianceDollars / allowedLaborSpend) * 100

  let status: 'good' | 'warning' | 'alert' = 'good'
  let message = 'Labor spend is within target range'

  if (Math.abs(variancePct) > 10) {
    status = 'alert'
    message = `Labor is ${variancePct > 0 ? 'over' : 'under'} target by ${Math.abs(variancePct).toFixed(1)}%`
  } else if (Math.abs(variancePct) > 5) {
    status = 'warning'
    message = `Labor is ${variancePct > 0 ? 'over' : 'under'} target by ${Math.abs(variancePct).toFixed(1)}%`
  }

  return {
    forecastSales,
    targetLaborPct,
    allowedLaborSpend,
    actualLaborSpend,
    variancePct,
    varianceDollars,
    status,
    message
  }
}

// Sales Forecasting Logic
export interface SalesForecast {
  date: string
  forecastSales: number
  confidence: number
  factors: {
    historical: number
    seasonal: number
    weather: number
    events: number
  }
}

export function forecastSales(
  historicalSales: { business_date: string; net_sales: number }[],
  targetDate: string,
  weatherFactor: number = 1.0,
  eventsFactor: number = 1.0
): SalesForecast {
  if (historicalSales.length === 0) {
    return {
      date: targetDate,
      forecastSales: 3500, // Default fallback
      confidence: 0.3,
      factors: { historical: 1.0, seasonal: 1.0, weather: weatherFactor, events: eventsFactor }
    }
  }

  const targetDateObj = new Date(targetDate)
  const dayOfWeek = targetDateObj.getDay()

  // Filter to same day of week for better accuracy
  const sameDayData = historicalSales.filter(sale => {
    const saleDate = new Date(sale.business_date)
    return saleDate.getDay() === dayOfWeek
  })

  const dataToUse = sameDayData.length >= 3 ? sameDayData : historicalSales
  
  // Calculate base forecast from historical average
  const avgSales = dataToUse.reduce((sum, sale) => sum + sale.net_sales, 0) / dataToUse.length

  // Apply seasonal factors
  const month = targetDateObj.getMonth()
  const seasonalFactors = [0.9, 0.9, 1.0, 1.05, 1.1, 1.1, 1.05, 1.05, 1.0, 1.05, 1.1, 1.15] // Jan-Dec
  const seasonalFactor = seasonalFactors[month]

  // Apply day-of-week factors
  const dayFactors = [1.15, 0.85, 0.95, 1.0, 1.1, 1.25, 1.4] // Sun-Sat
  const dayFactor = dayFactors[dayOfWeek]

  const combinedSeasonalFactor = seasonalFactor * dayFactor
  const forecastSales = avgSales * combinedSeasonalFactor * weatherFactor * eventsFactor

  const confidence = Math.min(0.9, Math.max(0.3, dataToUse.length / 10))

  return {
    date: targetDate,
    forecastSales: Math.round(forecastSales),
    confidence,
    factors: {
      historical: avgSales,
      seasonal: combinedSeasonalFactor,
      weather: weatherFactor,
      events: eventsFactor
    }
  }
}

// Inventory Management Logic
export interface InventoryRecommendation {
  skuId: string
  skuName: string
  category: string
  currentStock: number
  parLevel: number
  reorderPoint: number
  recommendedOrder: number
  daysOfStock: number
  risk: 'low' | 'medium' | 'high'
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export function calculateInventoryRecommendations(
  skus: Array<{ id: string; name: string; category: string; cost_per_uom: number; lead_time_days: number; safety_stock: number; par: number }>,
  inventoryCounts: Array<{ sku_id: string; on_hand: number }>,
  avgDailySales: number
): InventoryRecommendation[] {
  return skus.map(sku => {
    const latestCount = inventoryCounts.find(count => count.sku_id === sku.id)
    const currentStock = latestCount?.on_hand || 0

    // Estimate daily demand based on category and sales
    const categoryDemandRates: Record<string, number> = {
      'food': 0.15,     // 15% of sales value goes to food costs
      'liquor': 0.08,   // 8% of sales value goes to liquor costs
      'nonfood': 0.02   // 2% of sales value goes to non-food costs
    }

    const demandRate = categoryDemandRates[sku.category] || 0.10
    const dailyDemandValue = avgDailySales * demandRate
    const dailyDemandUnits = dailyDemandValue / sku.cost_per_uom

    const daysOfStock = currentStock / Math.max(dailyDemandUnits, 0.1)
    const reorderPoint = (dailyDemandUnits * sku.lead_time_days) + sku.safety_stock
    const recommendedOrder = Math.max(0, reorderPoint - currentStock)

    let risk: 'low' | 'medium' | 'high' = 'low'
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'low'

    if (daysOfStock < sku.lead_time_days) {
      risk = 'high'
      priority = 'urgent'
    } else if (daysOfStock < sku.lead_time_days * 1.5) {
      risk = 'medium'
      priority = 'high'
    } else if (currentStock < sku.par) {
      priority = 'medium'
    }

    return {
      skuId: sku.id,
      skuName: sku.name,
      category: sku.category,
      currentStock,
      parLevel: sku.par,
      reorderPoint,
      recommendedOrder,
      daysOfStock,
      risk,
      priority
    }
  })
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function getVarianceColor(variancePct: number): string {
  const abs = Math.abs(variancePct)
  if (abs <= 5) return 'text-green-600'
  if (abs <= 10) return 'text-yellow-600'
  return 'text-red-600'
}

export function getStatusColor(status: 'good' | 'warning' | 'alert'): string {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-50 border-green-200'
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'alert': return 'text-red-600 bg-red-50 border-red-200'
  }
}