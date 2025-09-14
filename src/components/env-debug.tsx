'use client'

export function EnvDebug() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof window !== 'undefined') {
    console.log('Environment variables check:', {
      NEXT_PUBLIC_SUPABASE_URL: url ? 'Present' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? 'Present' : 'Missing',
      url: url,
      key: key ? `${key.slice(0, 20)}...` : 'undefined'
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs z-50 rounded">
      <div>URL: {url ? '✓' : '✗'}</div>
      <div>Key: {key ? '✓' : '✗'}</div>
    </div>
  )
}