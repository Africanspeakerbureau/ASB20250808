import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

/**
 * Guard for /speaker-dashboard (and any other speaker-only routes).
 * Key differences vs. old version:
 *  - Listens to onAuthStateChange so we react *immediately* when the callback sets a session.
 *  - Grace period (max ~3s) when "asb_justSignedIn" is present to avoid a premature redirect.
 */
export default function RequireSpeakerAuth({ children }) {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const waitingBecauseJustSignedIn = useRef(false)
  const waitDeadline = useRef(0)

  useEffect(() => {
    // If the callback set this, give Supabase a short window to hydrate the session.
    if (sessionStorage.getItem('asb_justSignedIn') === '1') {
      waitingBecauseJustSignedIn.current = true
      waitDeadline.current = Date.now() + 3000 // up to 3s
    }

    let unsub = () => {}

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setAuthed(!!data?.session)
      setLoading(false)

      const sub = supabase.auth.onAuthStateChange((_evt, session) => {
        setAuthed(!!session)
        if (session) {
          // Once we know we are signed in, clear the flag.
          sessionStorage.removeItem('asb_justSignedIn')
          waitingBecauseJustSignedIn.current = false
        }
      })
      unsub = () => sub?.data?.subscription?.unsubscribe?.()
    })()

    const tick = setInterval(async () => {
      if (!waitingBecauseJustSignedIn.current) return
      if (Date.now() > waitDeadline.current) {
        // Grace window over; stop waiting.
        waitingBecauseJustSignedIn.current = false
        return
      }
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        sessionStorage.removeItem('asb_justSignedIn')
        waitingBecauseJustSignedIn.current = false
        setAuthed(true)
      }
    }, 120)

    return () => {
      clearInterval(tick)
      unsub()
    }
  }, [])

  // While checking / during grace window: show nothing or a tiny placeholder.
  if (loading || waitingBecauseJustSignedIn.current) {
    return <div style={{ padding: 24 }}>Loading…</div>
  }

  if (!authed) {
    return <Navigate to="/speaker-login" replace state={{ from: location }} />
  }

  return children
}
