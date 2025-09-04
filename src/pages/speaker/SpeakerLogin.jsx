// src/pages/speaker/SpeakerLogin.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SpeakerLogin() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ kind: 'idle', msg: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ kind: 'working', msg: 'Sending magic link…' });

    const redirectTo = `${window.location.origin}/#/speaker/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus({ kind: 'error', msg: error.message || 'Could not send link.' });
      return;
    }
    setStatus({
      kind: 'sent',
      msg: 'Magic link sent. Please check your email and open the link on this device.',
    });
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: '48px auto' }}>
      <h1>Speaker Portal</h1>
      <p>Sign in via one-time email link.</p>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 12, marginBottom: 12 }}
        />
        <button
          type="submit"
          disabled={status.kind === 'working'}
          style={{ width: '100%', padding: 12 }}
        >
          {status.kind === 'working' ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      {status.msg ? (
        <p
          style={{
            marginTop: 12,
            color: status.kind === 'error' ? '#b00020' : '#0a7',
          }}
        >
          {status.msg}
        </p>
      ) : null}
    </div>
  );
}
