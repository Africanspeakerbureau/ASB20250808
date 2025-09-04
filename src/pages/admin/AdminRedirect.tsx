import { useEffect } from "react";
import { LEGACY_ADMIN_URL } from "../../config";

export default function AdminRedirect() {
  useEffect(() => {
    if (LEGACY_ADMIN_URL) {
      window.location.replace(LEGACY_ADMIN_URL);
    }
  }, []);

  if (!LEGACY_ADMIN_URL) {
    return (
      <div style={{ padding: 24 }}>
        <h1>ASB – Admin</h1>
        <p>No admin URL configured.</p>
        <p>Set <code>VITE_LEGACY_ADMIN_URL</code> in Vercel to your real admin login.</p>
      </div>
    );
  }
  return <div style={{ padding: 24 }}>Opening admin…</div>;
}
