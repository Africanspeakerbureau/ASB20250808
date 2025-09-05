import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function SpeakerAuthCallback() {
  const [params] = useSearchParams();
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const code = params.get('code');
        if (!code) throw new Error('Missing code');
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        if (mounted) navigate('/speaker-admin/dashboard', { replace: true });
      } catch (e) {
        setErr(e.message || 'Login failed');
      }
    })();
    return () => { mounted = false; };
  }, [params, navigate]);

  return (
    <section className="container mx-auto max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
      {err && <p className="text-red-600 text-sm">{err}</p>}
    </section>
  );
}
