import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SpeakerCallback() {
  useEffect(() => {
    ;(async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')
        const tokenHash = url.searchParams.get('token_hash')
        const type = url.searchParams.get('type')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
          if (error) throw error
        } else if (window.location.hash.includes('access_token=')) {
          // implicit flow: Supabase will pick this up automatically on client init
        } else {
          throw new Error('No Supabase auth parameters found on callback URL.')
        }

        const waitForSession = async (timeoutMs = 4000) => {
          const start = Date.now()
          while (Date.now() - start < timeoutMs) {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) return
            await new Promise(r => setTimeout(r, 50))
          }
          throw new Error('Timed out while waiting for session.')
        }
        await waitForSession()

        window.location.hash = '/speaker-dashboard'
      } catch (err) {
        console.error('Callback error:', err)
        window.location.hash = '/speaker-login'
      }
    })()
  }, [])

  return <p style={{ padding: 24, fontSize: 18 }}>Signing you in…</p>
}
