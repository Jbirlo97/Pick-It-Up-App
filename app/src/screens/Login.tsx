import { useState } from "react";
import { C } from "../theme";
import { supabase } from "../lib/supabase";

// Invite-only per docs/backend-brief.md Section 3: Josh creates accounts
// manually (or via a simple invite link), so this screen only signs people
// in — it deliberately has no "create account" form.
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!supabase) return;
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 28px" }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 140, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Welcome back</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 32, color: C.cr }}>Pick It Up.</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>Email</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="••••••••"
          style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box" }}
        />
      </div>
      {error ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "#E8A0A0", marginBottom: 16 }}>{error}</div> : null}
      <button onClick={submit} disabled={loading || !email || !password} style={{ padding: "15px", background: loading ? "rgba(200,169,106,0.3)" : C.go, color: C.gd, border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer" }}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(200,221,208,0.5)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>Pick It Up is invite-only right now. If you don't have an account yet, ask Josh for an invite.</div>
    </div>
  );
}
