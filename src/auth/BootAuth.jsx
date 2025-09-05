import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BootAuth() {
  useEffect(() => {
    const goDashboard = () => {
      if (window.location.hash !== '#/speaker-dashboard') {
        window.history.replaceState({}, '', `${window.location.pathname}#/speaker-dashboard`)
      }
    }

    const cleanUrl = () => {
      const path = window.location.pathname
      const hash = window.location.hash.startsWith('#/') ? window.location.hash : '#/'
      window.history.replaceState({}, '', path + hash)
    }

    const handleUrl = async () => {
      try {
        const { hash, search } = window.location

        // Case 1: magic-link tokens in hash
        if (hash.includes('access_token=')) {
          const sp = new URLSearchParams(hash.slice(1))
          const access_token = sp.get('access_token')
          const refresh_token = sp.get('refresh_token')
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token })
            // Clean URL and force a single, safe reload to hydrate auth everywhere.
            cleanUrl()
            window.history.replaceState({}, '', `${window.location.pathname}#/speaker-dashboard`)
            window.location.reload() // ← one-time hard reload
            return
          }
        }

        // Case 2: code (PKCE-style)
        const qs = new URLSearchParams(search)
        const code = qs.get('code')
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error) {
            cleanUrl()
            window.history.replaceState({}, '', `${window.location.pathname}#/speaker-dashboard`)
            window.location.reload() // ← one-time hard reload
          }
        }
      } catch { /* no-op */ }
    }

    handleUrl()

    // Also react when auth becomes ready or user signs in elsewhere
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        goDashboard()
      }
    })

    // If the hash changes to include tokens (some browsers), re-handle
    const onHash = () => {
      if (window.location.hash.includes('access_token=')) handleUrl()
    }
    window.addEventListener('hashchange', onHash)

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  return null
}
