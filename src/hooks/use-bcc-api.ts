import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Types
interface CloseDayRequest {
  venue_id: string
  business_date: string
}

interface LaborPlanRequest {
  venue_id: string
  forecast_date: string
}

interface OrdersSuggestRequest {
  venue_id: string
  order_date?: string
}

// API functions
export const bccApi = {
  // POS Data Ingest
  async ingestToastData(data: any) {
    const response = await fetch('/api/supabase/functions/v1/ingest-pos-toast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Toast ingest failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  async ingestAlohaData(data: any) {
    const response = await fetch('/api/supabase/functions/v1/ingest-pos-aloha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Aloha ingest failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Close Day Processing
  async closeDay(request: CloseDayRequest) {
    const response = await fetch('/api/supabase/functions/v1/close-day', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`Close day failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Labor Planning
  async getLaborPlan(request: LaborPlanRequest) {
    const response = await fetch('/api/supabase/functions/v1/labor-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`Labor plan failed: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Orders Suggestions
  async getOrderSuggestions(request: OrdersSuggestRequest) {
    const response = await fetch('/api/supabase/functions/v1/orders-suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      throw new Error(`Orders suggest failed: ${response.statusText}`)
    }
    
    return response.json()
  }
}

// Hooks for data fetching
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    }
  })
}

export function useVenue(venueId: string) {
  return useQuery({
    queryKey: ['venues', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useVenueSales(venueId: string, fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: ['venue-sales', venueId, fromDate, toDate],
    queryFn: async () => {
      let query = supabase
        .from('pos_sales_daily')
        .select('*')
        .eq('venue_id', venueId)
        .order('business_date', { ascending: false })

      if (fromDate) query = query.gte('business_date', fromDate)
      if (toDate) query = query.lte('business_date', toDate)
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useCashEnvelopes(venueId: string) {
  return useQuery({
    queryKey: ['cash-envelopes', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_envelopes')
        .select('*')
        .eq('venue_id', venueId)
        .order('name')
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useCashTransactions(venvelopeId: string, limit = 50) {
  return useQuery({
    queryKey: ['cash-transactions', venvelopeId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_envelope_tx')
        .select('*')
        .eq('envelope_id', venvelopeId)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data
    },
    enabled: !!venvelopeId
  })
}

export function useGrowthGoals() {
  return useQuery({
    queryKey: ['growth-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('growth_goals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

export function useAIInsights(venueId?: string, days = 7) {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  return useQuery({
    queryKey: ['ai-insights', venueId, days],
    queryFn: async () => {
      let query = supabase
        .from('ai_insights')
        .select('*')
        .gte('business_date', fromDate.toISOString().split('T')[0])
        .order('created_at', { ascending: false })

      if (venueId) {
        query = query.eq('venue_id', venueId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    }
  })
}

export function useStaffingTargets(venueId: string) {
  return useQuery({
    queryKey: ['staffing-targets', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staffing_targets')
        .select('*')
        .eq('venue_id', venueId)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useRolesWages(venueId: string) {
  return useQuery({
    queryKey: ['roles-wages', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles_wages')
        .select('*')
        .eq('venue_id', venueId)
        .order('role_name')
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useShifts(venueId: string, date?: string) {
  return useQuery({
    queryKey: ['shifts', venueId, date],
    queryFn: async () => {
      let query = supabase
        .from('shifts')
        .select('*')
        .eq('venue_id', venueId)
        .order('start_time')

      if (date) {
        const startOfDay = new Date(date).toISOString()
        const endOfDay = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()
        query = query.gte('start_time', startOfDay).lt('start_time', endOfDay)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

export function useSKUs(venueId: string) {
  return useQuery({
    queryKey: ['skus', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skus')
        .select(`
          *,
          inventory_counts(*)
        `)
        .eq('venue_id', venueId)
        .order('category')
        .order('name')
      
      if (error) throw error
      return data
    },
    enabled: !!venueId
  })
}

// Mutation hooks
export function useCloseDay() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: bccApi.closeDay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-envelopes'] })
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] })
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] })
    }
  })
}

export function useLaborPlan() {
  return useMutation({
    mutationFn: bccApi.getLaborPlan
  })
}

export function useOrderSuggestions() {
  return useMutation({
    mutationFn: bccApi.getOrderSuggestions
  })
}

export function useUpdateEnvelopeTarget() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ envelopeId, targetPct }: { envelopeId: string, targetPct: number }) => {
      const { data, error } = await supabase
        .from('cash_envelopes')
        .update({ target_pct: targetPct })
        .eq('id', envelopeId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-envelopes'] })
    }
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert(orderData)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
    }
  })
}