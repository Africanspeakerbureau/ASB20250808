import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function SpeakerCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Signing you in…')

  useEffect(() => {
    const run = async () => {
      try {
        // Combine both hash and query params (Supabase can use either)
        const hash = window.location.hash.startsWith('#')
          ? window.location.hash.slice(1)
          : ''
        const search = window.location.search.startsWith('?')
          ? window.location.search.slice(1)
          : ''

        const params = new URLSearchParams(hash || search)
        const token_hash = params.get('token_hash')
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        const code = params.get('code')

        // 1) Magic link: token_hash flow (preferred for email OTP)
        if (token_hash) {
          const email = localStorage.getItem('asb_pending_email') || undefined
          const { error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash,
            email,
          })
          if (error) throw error
          // Session is set internally by supabase-js on successful verifyOtp
        }
        // 2) Hash tokens present (implicit): setSession directly
        else if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) throw error
        }
        // 3) OAuth PKCE fallback: exchange the code for a session
        else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href,
          )
          if (error) throw error
        }
        // 4) No recognizable params
        else {
          throw new Error('No Supabase auth parameters found on callback URL.')
        }

        // Clean up: remove temp email and URL noise
        localStorage.removeItem('asb_pending_email')
        window.history.replaceState(
          {},
          document.title,
          `${window.location.origin}/#/speaker-callback`,
        )

        // Redirect to dashboard
        navigate('/speaker-dashboard', { replace: true })
      } catch (err) {
        console.error(err)
        setMessage(`Sign-in failed: ${err.message || 'Unknown error'}`)
        // Safety: bounce to login after short delay
        setTimeout(() => navigate('/speaker-login', { replace: true }), 1500)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Speaker Sign-in</h1>
      <p>{message}</p>
    </div>
  )
}

