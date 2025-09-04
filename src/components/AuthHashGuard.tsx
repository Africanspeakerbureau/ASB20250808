import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * If Supabase drops us on "/" with hash tokens (e.g. #access_token=...),
 * immediately push to /auth/callback while preserving the hash.
 */
export default function AuthHashGuard() {
  const { hash } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (!hash) return;
    // If the hash contains auth info or an auth error, let the callback handle it.
    if (hash.includes("access_token") || hash.includes("refresh_token") || hash.includes("error")) {
      nav(`/speaker/auth/callback${hash}`, { replace: true });
    }
  }, [hash, nav]);

  return null;
}
