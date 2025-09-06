import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

function parseSupabaseTokensFromUrl() {
  // Works for:
  //   #access_token=...&refresh_token=...
  //   ?access_token=...&refresh_token=...
  //   #/speaker-callback#access_token=... (double-hash)
  const { href, hash, search } = window.location;

  const doubleHashIdx = href.indexOf('#access_token=');
  if (doubleHashIdx !== -1) {
    const frag = href.substring(doubleHashIdx + 1);
    return new URLSearchParams(frag);
  }

  if (hash && hash.startsWith('#access_token=')) {
    return new URLSearchParams(hash.slice(1));
  }

  if (search && search.includes('access_token=')) {
    return new URLSearchParams(search.slice(1));
  }

  return null;
}

export default function SpeakerCallback() {
  useEffect(() => {
    (async () => {
      try {
        const params = parseSupabaseTokensFromUrl();

        if (params) {
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const code = params.get('code');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) throw error;
          } else if (code && supabase.auth.exchangeCodeForSession) {
            try {
              await supabase.auth.exchangeCodeForSession({ code });
            } catch {
              await supabase.auth.exchangeCodeForSession(window.location.search);
            }
          }
        }

        history.replaceState({}, '', '/#/speaker-dashboard');

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          await new Promise((resolve) => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, s) => {
              if (s) { subscription.unsubscribe(); resolve(); }
            });
            setTimeout(() => { subscription.unsubscribe(); resolve(); }, 2500);
          });
        }
        window.location.replace('/#/speaker-dashboard');
      } catch (err) {
        console.error('Callback error:', err);
        document.body.innerHTML = `<p style="font: 18px/1.5 system-ui, sans-serif; padding: 24px; color: #b00020;">
      Sorry—sign-in failed. Please close this tab and try again.
    </p>`;
      }
    })();
  }, []);

  return (
    <p style={{ font: '18px/1.5 system-ui, sans-serif', padding: 24 }}>
      Signing you in…
    </p>
  );
}

