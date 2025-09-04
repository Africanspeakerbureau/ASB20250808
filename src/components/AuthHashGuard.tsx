import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * - If Supabase drops auth tokens in the hash, forward to /speaker/auth/callback.
 * - If the URL ends with a bare '#' (no params), strip it to avoid blank screens.
 */
export default function AuthHashGuard() {
  const { hash } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (!hash) return;

    // clean up bare "#" fragments
    if (hash === "#" || hash === "") {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
      return;
    }

    // forward auth hashes to our callback
    if (hash.includes("access_token") || hash.includes("refresh_token") || hash.includes("error")) {
      nav(`/speaker/auth/callback${hash}`, { replace: true });
    }
  }, [hash, nav]);

  return null;
}
