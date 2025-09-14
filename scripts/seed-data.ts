import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/types/supabase'

// Only initialize when actually running the script
let supabase: ReturnType<typeof createClient<Database>>

function initializeSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

const VENUES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Shogun', type: 'restaurant', avgSales: 4500, cogsFood: 0.30, cogsLiquor: 0.20 },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Corner Pocket', type: 'bar', avgSales: 3000, cogsFood: 0.32, cogsLiquor: 0.22 },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Speak Easy', type: 'lounge', avgSales: 4000, cogsFood: 0.28, cogsLiquor: 0.18 },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Harbor House', type: 'restaurant', avgSales: 3600, cogsFood: 0.34, cogsLiquor: 0.24 },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Velvet Room', type: 'lounge', avgSales: 6000, cogsFood: 0.26, cogsLiquor: 0.16 }
]

function getSeasonalityFactor(date: Date): number {
  const dayOfWeek = date.getDay()
  const month = date.getMonth()
  
  // Weekend boost
  let factor = 1.0
  if (dayOfWeek === 5) factor = 1.25 // Friday
  else if (dayOfWeek === 6) factor = 1.4 // Saturday  
  else if (dayOfWeek === 0) factor = 1.15 // Sunday
  else if (dayOfWeek === 1) factor = 0.85 // Monday slower
  
  // Holiday season boost (Nov-Dec)
  if (month === 10 || month === 11) factor *= 1.1
  
  return factor
}

function getWeatherFactor(): number {
  // Random weather impact -10% to +5%
  return 0.9 + Math.random() * 0.15
}

function getPromotionFactor(): number {
  // 20% chance of promotion day (+15% to +25%)
  return Math.random() < 0.2 ? 1.15 + Math.random() * 0.1 : 1.0
}

function generateDailySales(venue: typeof VENUES[0], date: Date) {
  const seasonality = getSeasonalityFactor(date)
  const weather = getWeatherFactor()
  const promotion = getPromotionFactor()
  
  const baseSales = venue.avgSales
  const actualSales = baseSales * seasonality * weather * promotion
  
  // Add some randomness (-20% to +20%)
  const randomFactor = 0.8 + Math.random() * 0.4
  const grossSales = actualSales * randomFactor
  
  // Calculate other metrics
  const comps = grossSales * (0.01 + Math.random() * 0.02) // 1-3% comps
  const discounts = grossSales * (0.02 + Math.random() * 0.03) // 2-5% discounts
  const netSales = grossSales - comps - discounts
  const taxCollected = netSales * 0.0825 // 8.25% tax
  
  // Guest metrics
  const avgCheck = 35 + Math.random() * 25 // $35-60 average check
  const guests = Math.floor(grossSales / avgCheck)
  const checkCount = Math.floor(guests * (0.7 + Math.random() * 0.3)) // 70-100% guest to check ratio
  
  // Labor metrics (target labor percentage with variance)
  const targetLaborPct = venue.type === 'restaurant' ? 0.33 : venue.type === 'bar' ? 0.30 : 0.27
  const laborVariance = 0.9 + Math.random() * 0.2 // 90-110% of target
  const laborCost = netSales * targetLaborPct * laborVariance
  const avgWage = 18 // $18/hour average
  const laborHours = laborCost / avgWage
  
  // COGS
  const foodSalesRatio = venue.type === 'bar' ? 0.4 : venue.type === 'lounge' ? 0.3 : 0.7
  const liquorSalesRatio = 1 - foodSalesRatio
  
  const cogsFood = netSales * foodSalesRatio * venue.cogsFood
  const cogsLiquor = netSales * liquorSalesRatio * venue.cogsLiquor
  
  return {
    venue_id: venue.id,
    business_date: date.toISOString().split('T')[0],
    gross_sales: Math.round(grossSales * 100) / 100,
    net_sales: Math.round(netSales * 100) / 100,
    comps: Math.round(comps * 100) / 100,
    discounts: Math.round(discounts * 100) / 100,
    tax_collected: Math.round(taxCollected * 100) / 100,
    guests,
    check_count: checkCount,
    labor_cost: Math.round(laborCost * 100) / 100,
    labor_hours: Math.round(laborHours * 100) / 100,
    cogs_food: Math.round(cogsFood * 100) / 100,
    cogs_liquor: Math.round(cogsLiquor * 100) / 100
  }
}

function generateInventoryCounts(skuIds: string[], date: Date) {
  return skuIds.map(skuId => ({
    sku_id: skuId,
    business_date: date.toISOString().split('T')[0],
    on_hand: Math.floor(Math.random() * 30) + 5, // 5-35 units on hand
    waste: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0, // 30% chance of 1-3 waste
    notes: Math.random() < 0.1 ? 'Low stock alert' : null
  }))
}

async function seedDays(days: number) {
  console.log(`🌱 Seeding ${days} days of data...`)
  
  // Get all SKU IDs for inventory counts
  const { data: skus } = await supabase.from('skus').select('id')
  const skuIds = skus?.map(s => s.id) || []
  
  const salesData = []
  const inventoryData = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Generate sales for each venue
    for (const venue of VENUES) {
      salesData.push(generateDailySales(venue, date))
    }
    
    // Generate inventory counts (every 3 days)
    if (i % 3 === 0) {
      inventoryData.push(...generateInventoryCounts(skuIds, date))
    }
  }
  
  // Insert sales data
  console.log(`📊 Inserting ${salesData.length} sales records...`)
  const { error: salesError } = await supabase
    .from('pos_sales_daily')
    .upsert(salesData, { onConflict: 'venue_id,business_date' })
  
  if (salesError) {
    console.error('Error inserting sales data:', salesError)
    return
  }
  
  // Insert inventory data
  console.log(`📦 Inserting ${inventoryData.length} inventory records...`)
  const { error: inventoryError } = await supabase
    .from('inventory_counts')
    .upsert(inventoryData, { onConflict: 'sku_id,business_date' })
  
  if (inventoryError) {
    console.error('Error inserting inventory data:', inventoryError)
    return
  }
  
  console.log('✅ Seed data generation complete!')
}

async function generateCashEnvelopeTransactions(days: number) {
  console.log('💰 Generating cash envelope transactions...')
  
  const { data: envelopes } = await supabase.from('cash_envelopes').select('*')
  if (!envelopes) return
  
  const transactions = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Get sales for this date
    const { data: dailySales } = await supabase
      .from('pos_sales_daily')
      .select('*')
      .eq('business_date', date.toISOString().split('T')[0])
    
    if (!dailySales) continue
    
    for (const sale of dailySales) {
      const venueEnvelopes = envelopes.filter(e => e.venue_id === sale.venue_id)
      
      for (const envelope of venueEnvelopes) {
        const allocation = sale.net_sales * (envelope.target_pct / 100)
        const balanceBefore = envelope.current_balance || 0
        const balanceAfter = balanceBefore + allocation
        
        transactions.push({
          envelope_id: envelope.id,
          amount: Math.round(allocation * 100) / 100,
          balance_before: Math.round(balanceBefore * 100) / 100,
          balance_after: Math.round(balanceAfter * 100) / 100,
          description: `Daily allocation from sales`,
          transaction_date: date.toISOString().split('T')[0]
        })
        
        // Update envelope balance
        envelope.current_balance = balanceAfter
      }
    }
  }
  
  // Insert transactions
  const { error } = await supabase.from('cash_envelope_tx').insert(transactions)
  if (error) {
    console.error('Error inserting cash transactions:', error)
    return
  }
  
  // Update envelope balances
  for (const envelope of envelopes) {
    await supabase
      .from('cash_envelopes')
      .update({ current_balance: envelope.current_balance })
      .eq('id', envelope.id)
  }
  
  console.log(`💰 Generated ${transactions.length} cash transactions`)
}

async function main() {
  // Initialize supabase client
  supabase = initializeSupabase()
  
  const numDays = parseInt(process.env.SEED_DAYS || '30')
  
  console.log('🚀 Starting BCC seed process...')
  
  await seedDays(numDays)
  await generateCashEnvelopeTransactions(numDays)
  
  console.log('🎉 Seeding complete!')
  process.exit(0)
}

if (require.main === module) {
  main().catch(console.error)
}

export { seedDays, generateCashEnvelopeTransactions }