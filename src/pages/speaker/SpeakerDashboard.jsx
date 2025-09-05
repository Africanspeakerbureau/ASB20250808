import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SpeakerDashboard() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data?.user?.email || ''));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign('/speaker-admin');
  }

  return (
    <section className="container mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-semibold mb-2">Speaker Admin</h1>
      <p className="mb-6">Signed in as {email}</p>

      {/* Placeholder for future portal features */}
      <div className="rounded border p-4">
        <p>Welcome! Your speaker portal is ready for upcoming features.</p>
      </div>

      <button onClick={signOut} className="mt-6 rounded px-4 py-2 border">Sign out</button>
    </section>
  );
}
