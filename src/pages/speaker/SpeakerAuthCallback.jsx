import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      // Exchange the code from the URL for a session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error('Magic link exchange failed:', error)
        // Bounce to login if something went wrong
        navigate('/speaker-login', { replace: true })
        return
      }

      // Clean up the URL and go to the dashboard
      navigate('/speaker-dashboard', { replace: true })
      // Extra safety: erase ?code=... from the address bar
      window.history.replaceState({}, '', `${window.location.origin}/#/speaker-dashboard`)
    })()
  }, [navigate])

  return (
    <div className="max-w-md mx-auto py-16">
      <p>Signing you in…</p>
    </div>
  )
}

