import { useEffect, useState } from "react";
import AdminInlineLogin from "./AdminInlineLogin";

export default function AdminHashGate() {
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem("asb_admin") === "1"; } catch { return false; }
  });

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Poll session storage in case the modal sets it
  useEffect(() => {
    const t = setInterval(() => {
      try { setAuthed(sessionStorage.getItem("asb_admin") === "1"); } catch {}
    }, 300);
    return () => clearInterval(t);
  }, []);

  if (hash === "#/admin" && !authed) {
    return <AdminInlineLogin onSuccess={() => window.location.reload()} />;
  }
  return null;
}
