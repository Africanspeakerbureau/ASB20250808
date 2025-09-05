import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!session);
      setChecking(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (checking) return null; // or a tiny loader
  return authed ? <Outlet /> : <Navigate to="/speaker-admin" replace />;
}
