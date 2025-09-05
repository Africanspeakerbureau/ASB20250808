import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

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
      if (!user) return navigate('/speaker-login', { replace: true })
      setEmail(user.email || '')
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignOut = async (global = false) => {
    try {
      // Ends session on this browser. If your supabase-js supports it,
      // set { scope: 'global' } to revoke all sessions.
      await supabase.auth.signOut(global ? { scope: 'global' } : undefined)
    } catch { /* ignore */ }
    // Hard clean local artifacts so we don't see stale emails/tokens
    try {
      localStorage.removeItem('asb_pending_email')
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('sb-') || k.includes('supabase') || k.includes('pkce')) {
          localStorage.removeItem(k)
        }
      })
    } catch { /* ignore */ }
    navigate('/speaker-login', { replace: true })
  }

  if (!email) return null

  return (
    <div style={{ padding: 24 }}>
      <h1>Speaker Portal</h1>
      <p>You are signed in as <strong>{email}</strong></p>
      <p><Link to="/speaker-profile" style={{ textDecoration: 'underline' }}>Edit my profile</Link></p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => handleSignOut(false)}>Sign out</button>
        <button onClick={() => handleSignOut(true)} style={{ background: 'black', color: '#fff' }}>
          Sign out (all devices)
        </button>
      </div>
    </div>
  )
}

