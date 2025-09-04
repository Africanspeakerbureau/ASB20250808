// src/pages/speaker/SpeakerDashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SpeakerDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription?.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  if (!session) {
    // Not signed in — go to login
    window.location.hash = '#/speaker-admin';
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.hash = '#/speaker-admin';
  }

  return (
    <div className="container" style={{ maxWidth: 760, margin: '48px auto' }}>
      <h1>Speaker Dashboard</h1>
      <p>Signed in as <strong>{session.user?.email}</strong></p>

      {/* Placeholder: actual speaker admin content goes here */}
      <div style={{ marginTop: 16, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <p>Welcome to your portal. (Replace this box with the real dashboard content.)</p>
      </div>

      <button onClick={signOut} style={{ marginTop: 24, padding: '10px 14px' }}>
        Sign out
      </button>
    </div>
  );
}
