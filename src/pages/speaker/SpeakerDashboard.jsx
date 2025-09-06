import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import logoUrl from '/logo-asb.svg'
import { supabase } from '@/lib/supabaseClient'

export default function SpeakerDashboard() {
  const location = useLocation()
  const [status, setStatus] = useState('checking') // 'checking' | 'authed' | 'anon'
  const [email, setEmail] = useState('')

  useEffect(() => {
    // If we’re here and authed, make sure the flag doesn’t keep the guard waiting later.
    sessionStorage.removeItem('asb_justSignedIn')
  }, [])

  useEffect(() => {
    let unsub = () => {}
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setEmail(session.user.email || '')
        setStatus('authed')
      } else {
        setStatus('checking')
      }
      const sub = supabase.auth.onAuthStateChange((_event, s) => {
        if (s?.user) {
          setEmail(s.user.email || '')
          setStatus('authed')
        } else {
          setStatus('anon')
        }
      })
      unsub = () => sub.data.subscription.unsubscribe()
    })()
    return () => unsub()
  }, [])

  const handleSignOut = async (global = false) => {
    try {
      await supabase.auth.signOut(global ? { scope: 'global' } : undefined)
    } catch { /* ignore */ }
    try {
      localStorage.removeItem('asb_pending_email')
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('sb-') || k.includes('supabase') || k.includes('pkce')) {
          localStorage.removeItem(k)
        }
      })
    } catch { /* ignore */ }
    window.location.hash = '/speaker-login'
  }

  if (status === 'checking') return <p style={{ padding: 24 }}>Loading…</p>
  if (status === 'anon') {
    window.location.hash = '/speaker-login'
    return null
  }

  return (
    <div style={{minHeight:'70vh', display:'grid', placeItems:'center', padding:'40px 16px'}}>
      <div style={{maxWidth:640, width:'100%', textAlign:'center'}}>
        <img src={logoUrl} alt="ASB" style={{height:56, margin:'0 auto 20px'}} />
        {location.state?.notice && (
          <div style={{color:'#065f46', background:'#ecfdf5', border:'1px solid #a7f3d0', padding:'10px 12px', borderRadius:10, marginBottom:16}}>
            ✅ {location.state.notice}
          </div>
        )}
        <h1 style={{fontSize:48, lineHeight:1, margin:'0 0 12px'}}>Speaker Portal</h1>
        <p style={{margin:'0 0 20px', color:'#374151'}}>Signed in as <strong>{email}</strong></p>
        <p style={{margin:'0 0 28px', color:'#4b5563'}}>
          This portal lets listed speakers update their public profile on the ASB site.
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap'}}>
          <Link to="/speaker-profile" style={{padding:'10px 16px', borderRadius:10, background:'#111827', color:'#fff', textDecoration:'none'}}>Edit my profile</Link>
          <button onClick={() => handleSignOut(false)} style={{padding:'10px 16px', borderRadius:10, border:'1px solid #e5e7eb', background:'#fff'}}>Sign out</button>
          <button onClick={() => handleSignOut(true)} style={{padding:'10px 16px', borderRadius:10, background:'#111827', color:'#fff'}}>Sign out (all devices)</button>
        </div>
      </div>
    </div>
  )
}
