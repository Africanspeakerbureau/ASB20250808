import { LEGACY_ADMIN_URL } from "../../config";

export default function SiteAdmin() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>ASB – Site Admin</h1>
      <p>This is the site admin landing (not the speaker portal).</p>
      <ul style={{ marginTop: 16, lineHeight: 1.8 }}>
        <li><a href="/speaker/signin">Speaker Portal (sign in)</a></li>
        <li><a href="/speaker/admin">Speaker Portal (dashboard)</a></li>
        <li><a href={LEGACY_ADMIN_URL} target="_blank" rel="noreferrer">Open Admin Login</a></li>
      </ul>
    </div>
  );
}
