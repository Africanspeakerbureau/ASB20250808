import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SpeakerLogin() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/#/speaker-callback`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (e) {
      setErr(e?.message ?? 'Unable to send magic link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return <p>Check your email for a login link. You can close this tab.</p>
  }

  return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
      <h1>Speaker Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          required
          value={email}
          placeholder="you@example.com"
          onChange={e=>setEmail(e.target.value)}
          style={{width:'100%', padding:'10px', marginBottom:12}}
        />
        <button disabled={loading} type="submit">
          {loading ? 'Sending…' : 'Email me a magic link'}
        </button>
      </form>
      {err && <p style={{color:'crimson'}}>{err}</p>}
    </div>
  )
}

