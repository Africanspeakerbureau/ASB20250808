import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function getHashParam(name: string) {
  const h = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const params = new URLSearchParams(h);
  return params.get(name);
}

export default function AuthCallback() {
  const nav = useNavigate();
  const [status, setStatus] = useState<"checking"|"ok"|"error">("checking");
  const [message, setMessage] = useState("Verifying your sign-in…");

  useEffect(() => {
    const run = async () => {
      // If Supabase sent an error in the hash (e.g. otp_expired), show it nicely.
      const hashError = getHashParam("error");
      const hashDesc = getHashParam("error_description");
      if (hashError) {
        setStatus("error");
        setMessage(decodeURIComponent(hashDesc || "Link invalid or expired. Please request a new link."));
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setStatus("error");
        setMessage(error.message || "Could not complete sign-in. Please request a new link.");
        return;
      }

      setStatus("ok");
      setMessage("Success! Redirecting…");
      setTimeout(() => nav("/admin", { replace: true }), 600);
    };
    run();
  }, [nav]);

  if (status === "checking") return <div className="p-6">🔐 {message}</div>;
  if (status === "ok") return <div className="p-6">{message}</div>;

  // error
  return (
    <div className="p-6 space-y-3">
      <div className="text-red-600">⚠ {message}</div>
      <button
        className="rounded bg-black text-white px-3 py-2"
        onClick={() => (window.location.href = "/signin")}
      >
        Back to sign-in
      </button>
    </div>
  );
}
