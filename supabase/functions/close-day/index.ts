import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface CloseDayRequest {
  venue_id: string
  business_date: string
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

    const { venue_id, business_date }: CloseDayRequest = await req.json()

    if (!venue_id || !business_date) {
      return new Response('Missing venue_id or business_date', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    console.log(`Processing close-day for venue ${venue_id} on ${business_date}`)

    // 1. Get sales data for the day
    const { data: salesData, error: salesError } = await supabaseClient
      .from('pos_sales_daily')
      .select('*')
      .eq('venue_id', venue_id)
      .eq('business_date', business_date)
      .single()

    if (salesError || !salesData) {
      return new Response('Sales data not found for this date', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // 2. Get cash envelopes for this venue
    const { data: envelopes, error: envelopesError } = await supabaseClient
      .from('cash_envelopes')
      .select('*')
      .eq('venue_id', venue_id)

    if (envelopesError || !envelopes) {
      return new Response('Cash envelopes not found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // 3. Cash Autopilot - Allocate net sales into envelopes
    const transactions = []
    const envelopeUpdates = []

    for (const envelope of envelopes) {
      const allocation = salesData.net_sales * (envelope.target_pct / 100)
      const balanceBefore = envelope.current_balance || 0
      const balanceAfter = balanceBefore + allocation

      transactions.push({
        envelope_id: envelope.id,
        amount: Math.round(allocation * 100) / 100,
        balance_before: Math.round(balanceBefore * 100) / 100,
        balance_after: Math.round(balanceAfter * 100) / 100,
        description: `Daily allocation from ${business_date} sales`,
        transaction_date: business_date
      })

      envelopeUpdates.push({
        id: envelope.id,
        current_balance: Math.round(balanceAfter * 100) / 100
      })
    }

    // Insert cash transactions
    const { error: txError } = await supabaseClient
      .from('cash_envelope_tx')
      .insert(transactions)

    if (txError) {
      console.error('Transaction error:', txError)
      return new Response(`Transaction error: ${txError.message}`, { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Update envelope balances
    for (const update of envelopeUpdates) {
      await supabaseClient
        .from('cash_envelopes')
        .update({ current_balance: update.current_balance })
        .eq('id', update.id)
    }

    // 4. Calculate labor metrics
    const laborTarget = salesData.net_sales * 0.325 // 32.5% target
    const laborVariance = ((salesData.labor_cost - laborTarget) / laborTarget) * 100
    
    // 5. Calculate inventory needs (simplified)
    const { data: skus } = await supabaseClient
      .from('skus')
      .select('*, inventory_counts(*)')
      .eq('venue_id', venue_id)
      .order('par', { ascending: false })
      .limit(5) // Top 5 SKUs by PAR level

    // 6. Generate AI insights (simplified - would call OpenAI in production)
    const insights = [
      {
        venue_id,
        business_date,
        category: 'cash' as const,
        message: `Net sales: $${salesData.net_sales.toLocaleString()}. Growth envelope received $${Math.round(salesData.net_sales * 0.08)} (8% target).`,
        severity: 'medium' as const,
        action_data: { 
          type: 'cash_move', 
          envelope: 'growth', 
          amount: salesData.net_sales * 0.08 
        }
      },
      {
        venue_id,
        business_date,
        category: 'labor' as const,
        message: laborVariance > 5 
          ? `Labor over target by ${laborVariance.toFixed(1)}%. Target: $${laborTarget.toFixed(0)}, Actual: $${salesData.labor_cost.toFixed(0)}.`
          : `Labor on target. Used ${salesData.labor_hours} hours at $${salesData.labor_cost.toFixed(0)}.`,
        severity: laborVariance > 10 ? 'high' as const : laborVariance > 5 ? 'medium' as const : 'low' as const,
        action_data: laborVariance > 5 ? { 
          type: 'labor_reduce', 
          target_reduction: Math.abs(salesData.labor_cost - laborTarget) 
        } : null
      },
      {
        venue_id,
        business_date,
        category: 'growth' as const,
        message: `Daily growth target: $${(salesData.net_sales * 0.08 * 365 / 365).toFixed(0)}. On track for expansion in 2.5 years.`,
        severity: 'low' as const,
        action_data: { 
          type: 'growth_track', 
          daily_target: salesData.net_sales * 0.08,
          annual_projection: salesData.net_sales * 0.08 * 365
        }
      }
    ]

    // Insert AI insights
    const { error: insightsError } = await supabaseClient
      .from('ai_insights')
      .insert(insights)

    if (insightsError) {
      console.error('Insights error:', insightsError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Close-day processing complete',
        data: {
          sales_processed: salesData.net_sales,
          transactions_created: transactions.length,
          insights_generated: insights.length,
          labor_variance: laborVariance.toFixed(1) + '%'
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