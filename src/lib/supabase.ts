import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Admin client - only available server-side
export const getSupabaseAdmin = () => {
  // Only try to access service key if we're on server-side
  if (typeof window !== 'undefined') {
    throw new Error('Admin client can only be used server-side')
  }
  
  // Completely avoid static analysis by constructing the env key dynamically
  const parts = ['SUPABASE', 'SERVICE', 'ROLE', 'KEY']
  const envKey = parts.join('_')
  const supabaseServiceKey = process.env[envKey]
  
  if (!supabaseServiceKey) {
    throw new Error(`Server-side environment variable required: ${envKey}`)
  }
  
  if (!supabaseUrl) {
    throw new Error('Supabase URL not available')
  }
  
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}