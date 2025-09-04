import { useState } from "react";
import { validateAdmin } from "@/utils/auth";

export default function AdminInlineLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const ok = await validateAdmin(username, password);
    if (!ok) { setErr("Invalid credentials. Please try again."); return; }
    sessionStorage.setItem("asb_admin", "1");
    onSuccess?.();
  };

  return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:380,maxWidth:"100%",border:"1px solid #eee",borderRadius:12,padding:20}}>
        <h2 style={{margin:"0 0 8px",fontSize:24,fontWeight:800}}>Admin Login</h2>
        <p style={{margin:"0 0 16px",color:"#555"}}>Access the ASB admin panel</p>
        {err && <div style={{marginBottom:12,background:"#fee",color:"#a00",padding:8,borderRadius:8}}>{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} required
                   style={{width:"100%",padding:"8px 10px",border:"1px solid #ddd",borderRadius:8}}/>
          </div>
          <div style={{marginTop:10}}>
            <label className="block text-sm mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                   style={{width:"100%",padding:"8px 10px",border:"1px solid #ddd",borderRadius:8}}/>
          </div>
          <button type="submit" style={{marginTop:14,width:"100%",padding:"10px 12px",border:"none",
                  borderRadius:8,background:"#111",color:"#fff",cursor:"pointer"}}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
