import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerDashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!alive) return
      if (!data?.user) {
        nav('/speaker-login', { replace: true })
      } else {
        setUser(data.user)
      }
    })()
    return () => { alive = false }
  }, [nav])

  async function signOut() {
    await supabase.auth.signOut()
    nav('/speaker-login', { replace: true })
  }

  if (!user) return null

  return (
    <div style={{maxWidth: 880, margin:'40px auto'}}>
      <h1>Speaker Portal</h1>
      <p>You are signed in as <strong>{user.email}</strong></p>
      <button onClick={signOut}>Sign out</button>
      {/* Future: speaker profile editor, uploads, etc. */}
    </div>
  )
}

