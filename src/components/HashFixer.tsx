import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Global hash handler:
 * - If hash is "#/admin" → go to /admin (real page).
 * - If hash is just "#" → strip it (avoid blank).
 * - If Supabase auth tokens are in the hash → forward to /speaker/auth/callback.
 */
export default function HashFixer() {
  const { hash } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (!hash) return;

    if (hash === "#/admin") {
      window.location.replace("/admin");
      return;
    }

    if (hash === "#" || hash === "") {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
      return;
    }

    if (hash.includes("access_token") || hash.includes("refresh_token") || hash.includes("error")) {
      nav(`/speaker/auth/callback${hash}`, { replace: true });
    }
  }, [hash, nav]);

  return null;
}
