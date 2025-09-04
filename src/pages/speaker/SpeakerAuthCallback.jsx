// src/pages/speaker/SpeakerAuthCallback.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SpeakerAuthCallback() {
  const [state, setState] = useState({ kind: 'working', msg: 'Finalizing sign-in…' });

  useEffect(() => {
    async function finalize() {
      try {
        // New-style links (?code=…) — best path
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (!error) {
          setState({ kind: 'ok', msg: 'Signed in. Redirecting…' });
          window.location.hash = '#/speaker/dashboard';
          return;
        }

        // Legacy hash token fallback (#access_token=…)
        const hash = window.location.hash || '';
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          const { error: setErr } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!setErr) {
            setState({ kind: 'ok', msg: 'Signed in. Redirecting…' });
            window.location.hash = '#/speaker/dashboard';
            return;
          }
        }

        // If we’re here, it failed
        setState({
          kind: 'error',
          msg:
            'The sign-in link is invalid or expired. Please request a new magic link from the login page.',
        });
      } catch {
        setState({
          kind: 'error',
          msg:
            'Could not complete sign-in. Please request a new magic link from the login page.',
        });
      }
    }
    finalize();
  }, []);

  return (
    <div className="container" style={{ maxWidth: 480, margin: '48px auto' }}>
      <h1>Speaker Portal</h1>
      <p>{state.msg}</p>
      {state.kind === 'error' ? (
        <p style={{ marginTop: 12 }}>
          <a href="#/speaker-admin">Back to login</a>
        </p>
      ) : null}
    </div>
  );
}
