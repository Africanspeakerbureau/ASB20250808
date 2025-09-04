import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../providers/AuthProvider";

export default function SpeakerDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Speaker Dashboard</h1>
      <p>Signed in as <strong>{user?.email ?? "unknown"}</strong></p>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/speaker/signin";
          }}
          style={{
            background: "#111", color: "#fff", borderRadius: 8,
            padding: "8px 14px", border: "none", cursor: "pointer"
          }}
        >
          Sign out
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <p>Next: we’ll show your profile details here.</p>
      <ul style={{ marginTop: 8 }}>
        <li>Profile completeness</li>
        <li>Topics / Bio / Videos</li>
        <li>Update requests</li>
      </ul>
    </div>
  );
}
