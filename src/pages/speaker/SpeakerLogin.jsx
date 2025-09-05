import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/speaker-dashboard', { replace: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  const redirectTo = `${window.location.origin}/#/speaker-callback`

  async function onSubmit(e) {
    e.preventDefault()
    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    setSending(false)
    if (error) return alert(error.message)
    setSent(true)
  }

  return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
      <h1>Speaker Login</h1>

      {!sent ? (
        <form onSubmit={onSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{width:'100%', padding:'10px', marginBottom:12}}
          />
          <button
            type="submit"
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Email me a magic link'}
          </button>
          <p style={{fontSize:'0.875rem', color:'#6b7280'}}>
            We’ll email you a one-time login link. Clicking it brings you back to the site to finish sign-in.
          </p>
        </form>
      ) : (
        <p>Check your inbox for the login link. You can close this tab.</p>
      )}
    </div>
  )
}

