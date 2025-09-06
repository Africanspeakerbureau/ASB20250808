import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

/**
 * Extract auth params from both ?query and #hash (HashRouter).
 * Supports:
 *   - /#/speaker-callback?code=...                       (PKCE, rare)
 *   - /#/speaker-callback#access_token=...&refresh_token=...
 *   - /#/speaker-callback?token_hash=...&type=magiclink  (email OTP)
 */
function readAuthParams() {
  const search = new URLSearchParams(window.location.search || '')
  const hashStr = (window.location.hash || '').replace(/^#/, '')
  const hash = new URLSearchParams(hashStr.includes('?') ? hashStr.split('?')[1] : hashStr.split('#')[1] || hashStr)

  const get = (k) => search.get(k) || hash.get(k)

  return {
    code: get('code'),
    token_hash: get('token_hash'),
    type: get('type') || get('t') || null,
    access_token: get('access_token'),
    refresh_token: get('refresh_token'),
  }
}

export default function SpeakerCallback() {
  const [message, setMessage] = useState('Signing you in…')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const { code, token_hash, type, access_token, refresh_token } = readAuthParams()

        let session = null

        if (access_token && refresh_token) {
          // Implicit/hash flow
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
          session = data?.session
        } else if (token_hash) {
          // Email magic link / OTP flow
          const otpType = type === 'signup' ? 'signup' : 'magiclink'
          const { data, error } = await supabase.auth.verifyOtp({ type: otpType, token_hash })
          if (error) throw error
          session = data?.session
        } else if (code) {
          // PKCE code flow (rare with our current settings, but harmless to support)
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          session = data?.session
        } else {
          setMessage('Sign-in failed: No Supabase auth parameters found on callback URL.')
          // Small delay so the user can see the message, then back to login
          setTimeout(() => navigate('/speaker-login', { replace: true }), 1200)
          return
        }

        // Ensure Supabase has persisted the session
        const confirm = async () => (await supabase.auth.getSession()).data.session
        let confirmed = session || (await confirm())
        const started = Date.now()
        while (!confirmed && Date.now() - started < 2500) {
          await new Promise(r => setTimeout(r, 75))
          confirmed = await confirm()
        }
        if (!confirmed) throw new Error('Could not establish a session.')

        // Let the guard know we *just* signed in (cleared in the dashboard/guard)
        sessionStorage.setItem('asb_justSignedIn', '1')

        // Clean the URL so the token bits aren’t kept in history
        window.history.replaceState({}, document.title, `${window.location.origin}/#/speaker-callback`)

        if (!cancelled) {
          setMessage('Success. Redirecting…')
          navigate('/speaker-dashboard', { replace: true })
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setMessage(`Sign-in failed: ${err.message || 'Unknown error'}`)
          setTimeout(() => navigate('/speaker-login', { replace: true }), 1500)
        }
      }
    })()

    return () => { cancelled = true }
  }, [navigate])

  return (
    <div style={{ padding: 24 }}>
      <h1>Speaker Sign-in</h1>
      <p>{message}</p>
    </div>
  )
}
