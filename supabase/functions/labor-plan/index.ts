import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface LaborPlanRequest {
  venue_id: string
  forecast_date: string
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

    const { venue_id, forecast_date }: LaborPlanRequest = await req.json()

    if (!venue_id || !forecast_date) {
      return new Response('Missing venue_id or forecast_date', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // 1. Get staffing targets
    const { data: staffingTarget, error: staffingError } = await supabaseClient
      .from('staffing_targets')
      .select('*')
      .eq('venue_id', venue_id)
      .single()

    if (staffingError || !staffingTarget) {
      return new Response('Staffing targets not found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // 2. Get roles and wages
    const { data: rolesWages, error: rolesError } = await supabaseClient
      .from('roles_wages')
      .select('*')
      .eq('venue_id', venue_id)

    if (rolesError || !rolesWages) {
      return new Response('Roles and wages not found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // 3. Forecast sales based on historical data
    const forecastDate = new Date(forecast_date)
    const dayOfWeek = forecastDate.getDay()
    
    // Get historical sales for same day of week (last 8 weeks)
    const historicalDates = []
    for (let i = 1; i <= 8; i++) {
      const date = new Date(forecastDate)
      date.setDate(date.getDate() - (i * 7))
      historicalDates.push(date.toISOString().split('T')[0])
    }

    const { data: historicalSales, error: historicalError } = await supabaseClient
      .from('pos_sales_daily')
      .select('net_sales')
      .eq('venue_id', venue_id)
      .in('business_date', historicalDates)

    if (historicalError) {
      console.error('Historical data error:', historicalError)
    }

    // Calculate forecast
    let forecastSales = 3500 // Default fallback
    if (historicalSales && historicalSales.length > 0) {
      const avgSales = historicalSales.reduce((sum, sale) => sum + sale.net_sales, 0) / historicalSales.length
      
      // Apply day-of-week factors
      const dayFactors = [1.15, 0.85, 0.95, 1.0, 1.1, 1.25, 1.4] // Sun-Sat
      forecastSales = avgSales * dayFactors[dayOfWeek]
    }

    // 4. Calculate allowed labor spend and hours
    const allowedLaborSpend = forecastSales * (staffingTarget.target_labor_pct / 100)
    
    // 5. Calculate recommended hours by role
    const roleRecommendations = rolesWages.map(role => {
      // Simplified role distribution - in real app would be more sophisticated
      const roleDistribution: Record<string, number> = {
        'Manager': 0.15,
        'Server': 0.30,
        'Bartender': 0.25,
        'Line Cook': 0.20,
        'Host': 0.10,
        'Prep Cook': 0.15,
        'Kitchen Staff': 0.25,
        'Security': 0.10,
        'Sushi Chef': 0.25
      }

      const distribution = roleDistribution[role.role_name] || 0.15
      const roleSpend = allowedLaborSpend * distribution
      const recommendedHours = roleSpend / role.hourly_wage

      return {
        role_name: role.role_name,
        hourly_wage: role.hourly_wage,
        recommended_hours: Math.round(recommendedHours * 2) / 2, // Round to nearest 0.5
        recommended_spend: Math.round(roleSpend * 100) / 100,
        distribution_pct: distribution * 100
      }
    })

    // 6. Get current scheduled shifts for comparison
    const { data: scheduledShifts, error: shiftsError } = await supabaseClient
      .from('shifts')
      .select('role, scheduled_hours, scheduled_cost')
      .eq('venue_id', venue_id)
      .gte('start_time', forecast_date)
      .lt('start_time', new Date(new Date(forecast_date).getTime() + 24 * 60 * 60 * 1000).toISOString())

    const currentScheduled = scheduledShifts?.reduce((acc, shift) => {
      if (!acc[shift.role]) {
        acc[shift.role] = { hours: 0, cost: 0 }
      }
      acc[shift.role].hours += shift.scheduled_hours
      acc[shift.role].cost += shift.scheduled_cost
      return acc
    }, {} as Record<string, { hours: number, cost: number }>) || {}

    // 7. Generate recommendations
    const recommendations = roleRecommendations.map(role => {
      const current = currentScheduled[role.role_name] || { hours: 0, cost: 0 }
      const hoursDiff = role.recommended_hours - current.hours
      const costDiff = role.recommended_spend - current.cost

      let suggestion = ''
      if (hoursDiff > 0.5) {
        suggestion = `Add ${hoursDiff.toFixed(1)} hours`
      } else if (hoursDiff < -0.5) {
        suggestion = `Cut ${Math.abs(hoursDiff).toFixed(1)} hours`
      } else {
        suggestion = 'On target'
      }

      return {
        ...role,
        current_hours: current.hours,
        current_spend: current.cost,
        hours_difference: hoursDiff,
        cost_difference: costDiff,
        suggestion,
        status: Math.abs(hoursDiff) <= 0.5 ? 'good' : Math.abs(hoursDiff) <= 1.5 ? 'warning' : 'alert'
      }
    })

    const totalCurrentSpend = Object.values(currentScheduled).reduce((sum, curr) => sum + curr.cost, 0)
    const laborVariance = ((totalCurrentSpend - allowedLaborSpend) / allowedLaborSpend) * 100

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          venue_id,
          forecast_date,
          forecast_sales: Math.round(forecastSales),
          target_labor_pct: staffingTarget.target_labor_pct,
          allowed_labor_spend: Math.round(allowedLaborSpend),
          current_labor_spend: Math.round(totalCurrentSpend),
          labor_variance_pct: Math.round(laborVariance * 10) / 10,
          variance_status: Math.abs(laborVariance) <= 5 ? 'good' : Math.abs(laborVariance) <= 10 ? 'warning' : 'alert',
          role_recommendations: recommendations,
          summary: {
            total_recommended_hours: roleRecommendations.reduce((sum, r) => sum + r.recommended_hours, 0),
            total_current_hours: Object.values(currentScheduled).reduce((sum, curr) => sum + curr.hours, 0),
            needs_adjustment: Math.abs(laborVariance) > 5
          }
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