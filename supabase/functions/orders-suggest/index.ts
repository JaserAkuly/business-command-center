import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface OrdersSuggestRequest {
  venue_id: string
  order_date?: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const { venue_id, order_date = new Date().toISOString().split('T')[0] }: OrdersSuggestRequest = await req.json()

    if (!venue_id) {
      return new Response('Missing venue_id', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // 1. Get all SKUs for the venue with latest inventory counts
    const { data: skus, error: skusError } = await supabaseClient
      .from('skus')
      .select(`
        *,
        inventory_counts!inner(on_hand, business_date)
      `)
      .eq('venue_id', venue_id)
      .order('inventory_counts.business_date', { ascending: false })

    if (skusError) {
      console.error('SKUs error:', skusError)
      return new Response(`SKUs error: ${skusError.message}`, { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    if (!skus || skus.length === 0) {
      return new Response('No SKUs found for venue', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // 2. Get recent sales data to calculate demand
    const last28Days = new Date()
    last28Days.setDate(last28Days.getDate() - 28)

    const { data: salesData, error: salesError } = await supabaseClient
      .from('pos_sales_daily')
      .select('net_sales, business_date')
      .eq('venue_id', venue_id)
      .gte('business_date', last28Days.toISOString().split('T')[0])
      .order('business_date', { ascending: false })

    const avgDailySales = salesData && salesData.length > 0 
      ? salesData.reduce((sum, sale) => sum + sale.net_sales, 0) / salesData.length
      : 3500 // fallback

    // 3. Calculate order suggestions for each SKU
    const orderSuggestions = skus.map(sku => {
      // Get latest inventory count (first one due to ordering)
      const latestCount = sku.inventory_counts[0]
      const onHand = latestCount?.on_hand || 0

      // Calculate demand based on sales and SKU category
      const categoryMultipliers: Record<string, number> = {
        'food': 0.15,    // Food items use 15% of daily sales value
        'liquor': 0.08,  // Liquor items use 8% of daily sales value  
        'nonfood': 0.02  // Non-food items use 2% of daily sales value
      }

      const categoryMultiplier = categoryMultipliers[sku.category] || 0.10
      const dailyDemandValue = avgDailySales * categoryMultiplier
      const dailyDemandUnits = dailyDemandValue / sku.cost_per_uom

      // Apply seasonal adjustment (simplified)
      const seasonalAdjustment = 1.0 // Could be calculated based on historical patterns

      const adjustedDailyDemand = dailyDemandUnits * seasonalAdjustment

      // Calculate reorder point (ROP) = demand * lead time + safety stock
      const rop = (adjustedDailyDemand * sku.lead_time_days) + sku.safety_stock

      // Calculate recommended order quantity
      let recommendedQty = Math.max(0, rop - onHand)

      // Adjust for case pack if applicable
      let orderInCases = false
      let casesNeeded = 0
      if (sku.case_pack_qty && sku.case_cost && recommendedQty > 0) {
        casesNeeded = Math.ceil(recommendedQty / sku.case_pack_qty)
        recommendedQty = casesNeeded * sku.case_pack_qty
        orderInCases = true
      }

      // Calculate costs and risks
      const unitCost = orderInCases ? sku.case_cost! : sku.cost_per_uom
      const totalCost = orderInCases ? casesNeeded * sku.case_cost! : recommendedQty * sku.cost_per_uom

      // Assess risks
      const daysOfStock = onHand / Math.max(adjustedDailyDemand, 0.1)
      const stockoutRisk = daysOfStock < sku.lead_time_days ? 'high' : daysOfStock < (sku.lead_time_days * 1.5) ? 'medium' : 'low'
      const wasteRisk = daysOfStock > 14 ? 'high' : daysOfStock > 7 ? 'medium' : 'low'

      // Margin impact calculation
      const assumedMargin = sku.category === 'liquor' ? 0.75 : sku.category === 'food' ? 0.65 : 0.50
      const potentialRevenue = recommendedQty * sku.cost_per_uom / (1 - assumedMargin)
      const marginImpact = potentialRevenue * assumedMargin

      return {
        sku_id: sku.id,
        sku_name: sku.name,
        category: sku.category,
        uom: sku.uom,
        current_on_hand: onHand,
        par_level: sku.par,
        reorder_point: Math.round(rop * 10) / 10,
        recommended_qty: Math.round(recommendedQty * 10) / 10,
        unit_cost: unitCost,
        total_cost: Math.round(totalCost * 100) / 100,
        order_in_cases: orderInCases,
        cases_needed: casesNeeded,
        case_pack_qty: sku.case_pack_qty,
        lead_time_days: sku.lead_time_days,
        days_of_stock: Math.round(daysOfStock * 10) / 10,
        stockout_risk,
        waste_risk,
        margin_impact: Math.round(marginImpact * 100) / 100,
        daily_demand: Math.round(adjustedDailyDemand * 100) / 100,
        priority: stockoutRisk === 'high' ? 'urgent' : recommendedQty > 0 ? 'recommended' : 'optional',
        notes: stockoutRisk === 'high' ? 'Urgent - risk of stockout' : 
               wasteRisk === 'high' ? 'Review - potential overstock' : 
               recommendedQty === 0 ? 'No order needed' : 'Standard reorder'
      }
    })

    // 4. Sort by priority and filter
    const prioritizedSuggestions = orderSuggestions
      .filter(s => s.recommended_qty > 0 || s.stockout_risk === 'high')
      .sort((a, b) => {
        const priorityOrder = { urgent: 3, recommended: 2, optional: 1 }
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
      })

    // 5. Generate summary statistics
    const summary = {
      total_skus_reviewed: skus.length,
      items_to_order: prioritizedSuggestions.filter(s => s.recommended_qty > 0).length,
      urgent_items: prioritizedSuggestions.filter(s => s.priority === 'urgent').length,
      total_estimated_cost: prioritizedSuggestions.reduce((sum, s) => sum + s.total_cost, 0),
      high_stockout_risk: prioritizedSuggestions.filter(s => s.stockout_risk === 'high').length,
      high_waste_risk: prioritizedSuggestions.filter(s => s.waste_risk === 'high').length
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          venue_id,
          order_date,
          avg_daily_sales: Math.round(avgDailySales),
          suggestions: prioritizedSuggestions,
          summary
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(`Server error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})