import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AlohaCSVData {
  venue_id: string
  csv_data: string // Base64 encoded CSV or raw CSV string
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

    const { venue_id, csv_data }: AlohaCSVData = await req.json()

    if (!venue_id || !csv_data) {
      return new Response('Missing venue_id or csv_data', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Parse CSV data (simplified - in real implementation you'd use a proper CSV parser)
    const csvText = csv_data.includes('base64') ? 
      atob(csv_data.replace('data:text/csv;base64,', '')) : 
      csv_data

    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      return new Response('Invalid CSV format', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const salesRecords = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const record: any = {}
      
      headers.forEach((header, index) => {
        const value = values[index] || ''
        record[header] = value
      })

      // Map Aloha fields to our schema
      const salesRecord = {
        venue_id,
        business_date: record.business_date || record.date,
        gross_sales: parseFloat(record.gross_sales || record.total_sales || '0'),
        net_sales: parseFloat(record.net_sales || record.gross_sales || '0'),
        comps: parseFloat(record.comps || record.comp_amount || '0'),
        discounts: parseFloat(record.discounts || record.discount_amount || '0'),
        tax_collected: parseFloat(record.tax || record.tax_amount || '0'),
        guests: parseInt(record.guests || record.guest_count || '0'),
        check_count: parseInt(record.checks || record.check_count || '0'),
        labor_cost: parseFloat(record.labor_cost || '0'),
        labor_hours: parseFloat(record.labor_hours || '0'),
        cogs_food: parseFloat(record.food_cost || '0'),
        cogs_liquor: parseFloat(record.liquor_cost || record.beverage_cost || '0')
      }

      // Validate the record
      if (salesRecord.business_date && salesRecord.net_sales > 0) {
        salesRecords.push(salesRecord)
      }
    }

    if (salesRecords.length === 0) {
      return new Response('No valid sales records found in CSV', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    const { error } = await supabaseClient
      .from('pos_sales_daily')
      .upsert(salesRecords, { onConflict: 'venue_id,business_date' })

    if (error) {
      console.error('Database error:', error)
      return new Response(`Database error: ${error.message}`, { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Aloha POS data ingested successfully. ${salesRecords.length} records processed.`,
        records_processed: salesRecords.length
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