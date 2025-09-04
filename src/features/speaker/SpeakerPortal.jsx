import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

/** Read current hash (#/path... or tokens after #access_token=...) */
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || '');
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

function parseTokenFragment(fragment) {
  // Example: "#/speaker/auth/callback#access_token=...&refresh_token=..."
  const parts = fragment.split('#');
  const tokenStr = parts.length > 2 ? parts.slice(2).join('#') : parts[1] || '';
  const params = new URLSearchParams(tokenStr);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    error: params.get('error'),
    error_description: params.get('error_description'),
  };
}

export default function SpeakerPortal() {
  const hash = useHash();

  // IMPORTANT: Only handle speaker routes. Never touch "#/admin".
  const route = useMemo(() => {
    if (hash.startsWith('#/speaker/signin')) return 'signin';
    if (hash.startsWith('#/speaker/auth/callback')) return 'callback';
    if (hash.startsWith('#/speaker/admin')) return 'admin';
    return null;
  }, [hash]);

  if (!route) return null; // keep site unchanged for all other hashes (incl. #/admin)

  return (
    <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:1000, overflow:'auto', color:'#111' }}>
      {route === 'signin'   && <SpeakerSignIn />}
      {route === 'callback' && <SpeakerAuthCallback />}
      {route === 'admin'    && <SpeakerAdmin />}
    </div>
  );
}

function SpeakerSignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  async function sendLink(e) {
    e.preventDefault();
    setErr('');
    const redirectTo = `${window.location.origin}/#/speaker/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });
    if (error) { setErr(error.message); return; }
    setSent(true);
  }

  return (
    <div style={{maxWidth:480, margin:'80px auto', padding:24}}>
      <h1 style={{fontSize:32, fontWeight:800, marginBottom:8}}>Speaker Login</h1>
      <p style={{marginBottom:16}}>Enter your email to receive a magic sign-in link.</p>
      {sent ? (
        <div style={{padding:12, background:'#eef6ff', borderRadius:8}}>
          Check your inbox — we sent a login link to <b>{email}</b>.
        </div>
      ) : (
        <form onSubmit={sendLink}>
          {err && <div style={{marginBottom:12, background:'#fee', color:'#a00', padding:8, borderRadius:8}}>{err}</div>}
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                 placeholder="you@example.com"
                 style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:8}} />
          <button type="submit"
                  style={{marginTop:12, width:'100%', padding:'10px 12px', border:'none',
                          borderRadius:8, background:'#111', color:'#fff', cursor:'pointer'}}>
            Send Magic Link
          </button>
        </form>
      )}
      <div style={{marginTop:16}}><a href="#/">← Back to site</a></div>
    </div>
  );
}

function SpeakerAuthCallback() {
  const [msg, setMsg] = useState('Finishing sign-in…');

  useEffect(() => {
    const { access_token, refresh_token, error, error_description } = parseTokenFragment(window.location.hash);
    if (error) { setMsg(`Access denied: ${error_description || error}`); return; }
    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(() => window.location.replace('/#/speaker/admin'))
        .catch(() => setMsg('Could not complete sign-in. Please request a new link.'));
    } else {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) window.location.replace('/#/speaker/admin');
        else setMsg('Email link is invalid or expired. Please request a new one.');
      });
    }
  }, []);

  return (
    <div style={{maxWidth:480, margin:'80px auto', padding:24}}>
      <h1 style={{fontSize:28, fontWeight:700, marginBottom:8}}>Speaker Login</h1>
      <p>{msg}</p>
    </div>
  );
}

function SpeakerAdmin() {
  const [state, setState] = useState({ loading:true, email:'' });

  useEffect(() => {
    let ok = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!ok) return;
      if (!data?.user) window.location.replace('/#/speaker/signin');
      else setState({ loading:false, email: data.user.email || '' });
    });
    return () => { ok = false; };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.replace('/#/speaker/signin');
  }

  if (state.loading) return null;

  return (
    <div style={{padding:24}}>
      <h1 style={{fontSize:32, fontWeight:800, marginBottom:8}}>Speaker Dashboard</h1>
      <p style={{marginBottom:16}}>Signed in as <b>{state.email}</b></p>
      <button onClick={signOut}
              style={{background:'#111', color:'#fff', borderRadius:8, padding:'8px 14px',
                      border:'none', cursor:'pointer'}}>Sign out</button>
      <hr style={{margin:'24px 0'}} />
      <p>Next: we’ll show your profile details here.</p>
      <ul>
        <li>Profile completeness</li>
        <li>Topics / Bio / Videos</li>
        <li>Update requests</li>
      </ul>
      <div style={{marginTop:16}}><a href="#/">← Back to site</a></div>
    </div>
  );
}
