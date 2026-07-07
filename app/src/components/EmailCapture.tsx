import { useState } from "react";
import { C } from "../theme";

export function EmailCapture({ onDismiss, onSave }: { onDismiss: () => void; onSave: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 388, background: C.gd, borderRadius: 16, padding: "18px", zIndex: 250, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
      <button onClick={onDismiss} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", color: C.sl, fontSize: 16, cursor: "pointer" }}>
        ✕
      </button>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, marginBottom: 5, paddingRight: 20 }}>Don't lose this.</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.5, marginBottom: 12 }}>Save your email and we'll keep your progress safe, plus send the occasional thing worth reading. No spam.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 13, outline: "none" }} />
        <button onClick={() => valid && onSave(email)} disabled={!valid} style={{ padding: "10px 16px", borderRadius: 8, background: valid ? C.go : "rgba(200,169,106,0.3)", color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: valid ? "pointer" : "default" }}>
          Save
        </button>
      </div>
    </div>
  );
}
