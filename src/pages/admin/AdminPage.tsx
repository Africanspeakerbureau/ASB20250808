import { useEffect, useState } from "react";
import { validateAdmin } from "../../utils/adminAuth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    try { setAuthed(sessionStorage.getItem("asb_admin") === "1"); } catch {}
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await validateAdmin(username, password);
    if (!ok) { setErr("Invalid credentials. Please try again."); return; }
    try { sessionStorage.setItem("asb_admin", "1"); } catch {}
    setAuthed(true);
  };

  const signOut = () => {
    try { sessionStorage.removeItem("asb_admin"); } catch {}
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 380, maxWidth: "100%", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>Admin Login</h1>
          <p style={{ margin: "0 0 16px", color: "#555" }}>Enter your admin credentials.</p>
          {err && <div style={{ marginBottom: 12, background: "#fee", color: "#a00", padding: 8, borderRadius: 8 }}>{err}</div>}
          <form onSubmit={submit}>
            <div style={{ marginBottom: 10 }}>
              <label className="block text-sm mb-2">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} required
                     style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8 }} />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                     style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8 }} />
            </div>
            <button type="submit"
                    style={{ marginTop: 14, width: "100%", padding: "10px 12px", border: "none",
                             borderRadius: 8, background: "#111", color: "#fff", cursor: "pointer" }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged-in admin view (minimal; matches old behavior of "you're in")
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>ASB Admin</h1>
      <p>You are signed in.</p>
      <div style={{ marginTop: 16 }}>
        <button onClick={signOut}
                style={{ background: "#111", color: "#fff", borderRadius: 8, padding: "8px 14px", border: "none", cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
