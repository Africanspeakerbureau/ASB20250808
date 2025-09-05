import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerAuthCallback() {
  const [msg, setMsg] = useState('Signing you in…')

  useEffect(() => {
    ;(async () => {
      try {
        // 1) Preferred: let Supabase parse hash / query and store the session
        const res = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (!res?.data?.session) throw new Error('No session from URL')
        window.location.replace('/#/speaker-dashboard')
        return
      } catch {
        // fall through to other shapes
      }

      // 2) Fallback for email OTP style links (?token_hash=…&type=magiclink)
      const url = new URL(window.location.href)
      const token_hash = url.searchParams.get('token_hash')
      const type = url.searchParams.get('type') || 'magiclink'

      if (token_hash) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
          if (error) throw error
          if (data?.session) {
            window.location.replace('/#/speaker-dashboard')
            return
          }
        } catch {
          // continue to error UI
        }
      }

      // 3) If we’re here, we couldn’t create a session
      setMsg('Sign-in failed. Please request a new magic link and try again.')
    })()
  }, [])

  return <p style={{ padding: '2rem' }}>{msg}</p>
}

