import { C } from "../theme";
import type { RegulationPractice } from "../data/content";

export function PracticeDetail({ practice, onClose }: { practice: RegulationPractice; onClose: () => void }) {
  const p = practice;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.5)", display: "flex", alignItems: "flex-end", zIndex: 250 }} onClick={onClose}>
      <div style={{ background: C.cr, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: 24, margin: "0 auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, color: C.mu, cursor: "pointer" }}>
            ✕
          </button>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: C.go, textTransform: "uppercase", marginBottom: 4 }}>
          {p.category === "breath" ? "Breathwork" : "Somatic Movement"} · {p.durationMin} min
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 14 }}>{p.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 6 }}>What's happening physiologically</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 16 }}>{p.mechanism}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.ch, marginBottom: 8 }}>How to do it</div>
        {p.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5, paddingTop: 1 }}>{s}</div>
          </div>
        ))}
        <div style={{ background: C.ow, borderRadius: 10, padding: "12px 14px", marginTop: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, color: C.sg, marginBottom: 3 }}>Best for</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.5 }}>{p.bestFor}</div>
        </div>
        <div style={{ borderTop: "1px solid " + C.sl, paddingTop: 12 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, color: C.mu, marginBottom: 3 }}>Before you start</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, lineHeight: 1.5 }}>{p.contraindications}</div>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 14, fontStyle: "italic", textAlign: "center" }}>This is a self-regulation tool, not trauma therapy. If something difficult comes up consistently, that's worth bringing to a counsellor directly.</div>
      </div>
    </div>
  );
}
