import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerDashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!mounted) return
      if (!user) {
        navigate('/speaker-login', { replace: true })
        return
      }
      setEmail(user.email || '')
    })()
    return () => {
      mounted = false
    }
  }, [navigate])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/speaker-login', { replace: true })
  }

  if (!email) return null

  return (
    <div style={{ maxWidth: 880, margin: '40px auto' }}>
      <h1>Speaker Portal</h1>
      <p>
        You are signed in as <strong>{email}</strong>
      </p>
      <button onClick={signOut}>Sign out</button>
      {/* Future: speaker profile editor, uploads, etc. */}
    </div>
  )
}

