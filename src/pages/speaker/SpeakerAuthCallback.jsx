import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerAuthCallback() {
  const nav = useNavigate()
  const [msg, setMsg] = useState('Completing sign-in…')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // Supabase v2 + detectSessionInUrl handles URL hash automatically.
        // We just wait for a session and then move on.
        const { data } = await supabase.auth.getSession()
        if (!alive) return
        if (data?.session) {
          setMsg('Signed in. Redirecting…')
          nav('/speaker-dashboard', { replace: true })
          return
        }
        // Fallback: listen briefly for state change
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
          if (!alive) return
          if (s) nav('/speaker-dashboard', { replace: true })
        })
        return () => sub.subscription.unsubscribe()
      } catch {
        setMsg('Could not complete sign-in.')
      }
    })()
    return () => { alive = false }
  }, [nav])

  return <p style={{textAlign:'center', marginTop:40}}>{msg}</p>
}

