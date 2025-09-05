import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

function getAuthParams() {
  // We use a hash router. Examples we must support:
  //  A) /#/speaker-callback?code=...                (PKCE style)
  //  B) /#/speaker-callback#access_token=...&...    (implicit/hash tokens)
  //  C) ?token_hash=... (rare, but possible)
  const search = window.location.search.startsWith('?')
    ? window.location.search.slice(1)
    : ''

  const rawHash = window.location.hash || ''
  // "#/speaker-callback?code=..." or "#/speaker-callback#access_token=...&..."
  const afterLastHash = rawHash.startsWith('#')
    ? rawHash.slice(1).split('#').pop()
    : rawHash

  let qs = ''
  if (afterLastHash.includes('?')) {
    qs = afterLastHash.split('?')[1]
  } else if (/access_token=|refresh_token=|token_hash=|code=/.test(afterLastHash)) {
    qs = afterLastHash
  } else {
    qs = search
  }
  return new URLSearchParams(qs)
}

export default function SpeakerCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Signing you in…')

  useEffect(() => {
    ;(async () => {
      try {
        const params = getAuthParams()
        const token_hash = params.get('token_hash')
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        const code = params.get('code')

        // 1) Preferred: magic-link token_hash
        if (token_hash) {
          const email = localStorage.getItem('asb_pending_email') || undefined
          const { error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash,
            email,
          })
          if (error) throw error
        }
        // 2) Implicit/hash tokens
        else if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) throw error
        }
        // 3) PKCE fallback (only if a verifier exists from this browser)
        else if (code) {
          const hasVerifier = Object.keys(localStorage).some(
            k => k.includes('pkce') && k.includes('verifier'),
          )
          if (!hasVerifier) {
            throw new Error(
              'This link requires the same browser that requested it. Please request a new login link.',
            )
          }
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href,
          )
          if (error) throw error
        } else {
          throw new Error('No Supabase auth parameters found on callback URL.')
        }

        // Clean URL + temp email
        localStorage.removeItem('asb_pending_email')
        window.history.replaceState(
          {},
          document.title,
          `${window.location.origin}/#/speaker-callback`,
        )

        // Go to dashboard
        navigate('/speaker-dashboard', { replace: true })
      } catch (err) {
        console.error(err)
        setMessage(`Sign-in failed: ${err.message || 'Unknown error'}`)
        setTimeout(() => navigate('/speaker-login', { replace: true }), 1500)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Speaker Sign-in</h1>
      <p>{message}</p>
    </div>
  )
}

