import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function RequireSpeakerAuth({ children }) {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession()
      setAuthed(!!data?.session)
      setReady(true)
    })()
  }, [])

  if (!ready) return null
  return authed ? children : <Navigate to="/speaker-login" replace state={{ from: location }} />
}

