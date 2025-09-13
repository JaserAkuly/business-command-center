import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ToastWebhookData {
  venue_id: string
  business_date: string
  gross_sales: number
  net_sales: number
  tax_collected: number
  guests: number
  check_count: number
  labor_cost: number
  labor_hours: number
  food_sales: number
  liquor_sales: number
  comps?: number
  discounts?: number
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

    const data: ToastWebhookData = await req.json()

    // Validate required fields
    if (!data.venue_id || !data.business_date || !data.net_sales) {
      return new Response('Missing required fields', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Calculate COGS based on food/liquor split
    const totalSales = data.food_sales + data.liquor_sales
    const foodRatio = totalSales > 0 ? data.food_sales / totalSales : 0.7
    const liquorRatio = totalSales > 0 ? data.liquor_sales / totalSales : 0.3

    // Typical COGS percentages
    const cogsFood = data.net_sales * foodRatio * 0.30
    const cogsLiquor = data.net_sales * liquorRatio * 0.20

    const salesRecord = {
      venue_id: data.venue_id,
      business_date: data.business_date,
      gross_sales: data.gross_sales,
      net_sales: data.net_sales,
      comps: data.comps || 0,
      discounts: data.discounts || 0,
      tax_collected: data.tax_collected,
      guests: data.guests,
      check_count: data.check_count,
      labor_cost: data.labor_cost,
      labor_hours: data.labor_hours,
      cogs_food: cogsFood,
      cogs_liquor: cogsLiquor
    }

    const { error } = await supabaseClient
      .from('pos_sales_daily')
      .upsert(salesRecord, { onConflict: 'venue_id,business_date' })

    if (error) {
      console.error('Database error:', error)
      return new Response(`Database error: ${error.message}`, { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Toast POS data ingested successfully' }),
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