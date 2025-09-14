import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgtdgbnxgfqlscyurkzh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRndGRnYm54Z2ZxbHNjeXVya3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODcwNjMsImV4cCI6MjA3MzM2MzA2M30.40ss8S1YAvKJsW2hGyWEtj6HVDt1e76jCzMy8E9RozM'

console.log('Supabase client initialization:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'missing',
  envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
  envKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing'
})

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRndGRnYm54Z2ZxbHNjeXVya3poIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzc4NzA2MywiZXhwIjoyMDczMzYzMDYzfQ.Vu9znUNzEf_kuA8j55lxMNbtcc-cRjFoBhqsHAJRd3U',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)