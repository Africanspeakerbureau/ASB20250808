import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SpeakerLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const emailRedirectTo = `${window.location.origin}/speaker-admin/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo }
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <section className="container mx-auto max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-4">Speaker Login</h1>
      {sent ? (
        <p>Check your email for the login link.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <button className="rounded px-4 py-2 bg-black text-white">Send magic link</button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}
    </section>
  );
}
