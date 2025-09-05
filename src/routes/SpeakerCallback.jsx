import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SpeakerCallback() {
  useEffect(() => {
    const go = async () => {
      const hard = (hashPath) => {
        // Hard navigation (not SPA), equivalent to pressing browser refresh
        window.location.replace(`${window.location.origin}/#${hashPath}`)
      }

      try {
        const { hash, search } = window.location

        // Case 1: access_token in hash (magic link default)
        if (hash.includes('access_token=')) {
          const sp = new URLSearchParams(hash.slice(1))
          const access_token = sp.get('access_token')
          const refresh_token = sp.get('refresh_token')
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token })
            // Small delay helps Safari/Firefox persist session before reload
            await new Promise((r) => setTimeout(r, 150))
            hard('/speaker-dashboard')
            return
          }
        }

        // Case 2: PKCE-style ?code=…
        const code = new URLSearchParams(search).get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
            await new Promise((r) => setTimeout(r, 150))
            hard('/speaker-dashboard')
            return
          }
        }
      } catch {
        // fall-through
      }
      hard('/speaker-login')
    }

    go()
  }, [])

  return <p style={{ padding: 24 }}>Signing you in…</p>
}

