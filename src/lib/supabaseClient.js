import { createClient } from '@supabase/supabase-js'

const url =
  import.meta.env.VITE_SUPABASE_URL
const anon =
  import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  // Keep this tiny to avoid leaking values in logs
  // We fail loudly so misconfig is obvious in Preview
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // picks up tokens on callback
    flowType: 'pkce',
  },
})

