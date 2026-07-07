import { useState } from "react";
import { C } from "../theme";
import type { AppState, SetState } from "../types";

export function Paywall({ setState, onClose }: { state: AppState; setState: SetState; onClose: () => void }) {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const plans = {
    monthly: { label: "Monthly", price: "$14.99", sub: "per month", save: null as string | null },
    annual: { label: "Annual", price: "$7.49", sub: "per month, billed yearly", save: "Save 50%" },
  };
  const features = [
    { icon: "↑", title: "Full movement library", body: "Tier 2 & 3 blocs unlocked — 36+ exercises, advanced progressions." },
    { icon: "◈", title: "Unlimited AI sessions", body: "Regenerate as many times as you want, every day." },
    { icon: "◎", title: "Coaching session credit", body: "One 1-on-1 Zoom session with Josh per month, included." },
    { icon: "∿", title: "Full cohort access", body: "Skip the Day 21 wait — join a cohort group immediately." },
  ];
  const activate = () => {
    setState((s) => ({ ...s, isPremium: true }));
    onClose();
  };
  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", padding: "0 0 40px" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: C.sl, fontSize: 15, cursor: "pointer" }}>
          ✕
        </button>
      </div>
      <div style={{ padding: "10px 28px 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 10 }}>Pick It Up Premium</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.cr, lineHeight: 1.25, marginBottom: 6 }}>
          Strength begins in the mind.
          <br />
          Go further with it.
        </div>
      </div>
      <div style={{ padding: "20px 24px 0", flex: 1 }}>
        {features.map((f) => (
          <div key={f.title} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(200,169,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.go, flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.cr, marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.4 }}>{f.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 24px 0" }}>
        {(Object.keys(plans) as (keyof typeof plans)[]).map((id) => {
          const p = plans[id];
          const active = plan === id;
          return (
            <div key={id} onClick={() => setPlan(id)} style={{ border: "2px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.1)" : "transparent", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", position: "relative" }}>
              {p.save ? <div style={{ position: "absolute", top: -9, left: 14, background: C.go, color: C.gd, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, fontFamily: "Inter,sans-serif" }}>{p.save}</div> : null}
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr }}>{p.label}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{p.sub}</div>
              </div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: active ? C.go : C.cr }}>{p.price}</div>
            </div>
          );
        })}
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.6)", textAlign: "center", marginBottom: 14 }}>
          7-day free trial, then {plans[plan].price}/{plan === "annual" ? "mo billed yearly" : "mo"}. Cancel anytime before the trial ends and you won't be charged.
        </div>
        <button onClick={activate} style={{ width: "100%", padding: "16px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          Start Free Trial →
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            Restore purchase
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            Terms & Privacy
          </button>
        </div>
      </div>
    </div>
  );
}
