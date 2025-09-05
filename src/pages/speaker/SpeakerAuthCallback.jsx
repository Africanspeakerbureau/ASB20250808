import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerAuthCallback() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Signing you in…')

  useEffect(() => {
    (async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) {
          console.error('Magic-link exchange failed:', error)
          setMsg(`Sign-in failed: ${error.message}`)
          // Give users a moment to read, then bounce to login
          setTimeout(() => navigate('/speaker-login', { replace: true }), 1500)
          return
        }
        // Success -> dashboard
        navigate('/speaker-dashboard', { replace: true })
        window.history.replaceState({}, '', `${window.location.origin}/#/speaker-dashboard`)
      } catch (e) {
        console.error(e)
        setMsg('Unexpected error during sign-in.')
        setTimeout(() => navigate('/speaker-login', { replace: true }), 1500)
      }
    })()
  }, [navigate])

  return (
    <div className="max-w-md mx-auto py-16">
      <p>{msg}</p>
    </div>
  )
}

