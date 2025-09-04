import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function getHashParams() {
  const raw = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  return new URLSearchParams(raw);
}
function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

export default function AuthCallback() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("Verifying your sign-in…");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const h = getHashParams();
        const q = getQueryParams();

        // 1) Explicit error in hash or query (e.g., otp_expired)
        const err = h.get("error") || q.get("error");
        const errDesc = h.get("error_description") || q.get("error_description");
        if (err) {
          setIsError(true);
          setMsg(decodeURIComponent(errDesc || "Link invalid or expired. Please request a new link."));
          return;
        }

        // 2) New flow: code in query -> exchange for a session
        const code = q.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) throw error;
          setMsg("Success! Redirecting…");
          setTimeout(() => nav("/admin", { replace: true }), 600);
          return;
        }

        // 3) Legacy flow: tokens in hash -> setSession
        const access_token = h.get("access_token");
        const refresh_token = h.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          setMsg("Success! Redirecting…");
          setTimeout(() => nav("/admin", { replace: true }), 600);
          return;
        }

        // 4) Fallback: already signed in?
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setMsg("You are already signed in. Redirecting…");
          setTimeout(() => nav("/admin", { replace: true }), 300);
          return;
        }

        // 5) Nothing useful found
        setIsError(true);
        setMsg("No login data found. Please request a new magic link.");
      } catch (e: any) {
        setIsError(true);
        setMsg(e?.message || "Could not complete sign-in. Please request a new link.");
      }
    };
    run();
  }, [nav]);

  return (
    <div className="p-6 space-y-3">
      <div className={isError ? "text-red-600" : ""}>{msg}</div>
      {isError && (
        <button
          className="rounded bg-black text-white px-3 py-2"
          onClick={() => (window.location.href = "/signin")}
        >
          Back to sign-in
        </button>
      )}
    </div>
  );
}
