import { C } from "../theme";
import { PILLARS, type Pillar } from "../data/content";

export function PillarDetail({ pillar, onClose, christianLens }: { pillar: Pillar; onClose: () => void; christianLens?: boolean }) {
  const pillarIndex = PILLARS.findIndex((p) => p.name === pillar.name);
  const numeral = ["I", "II", "III", "IV"][pillarIndex] || "I";
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(26,74,46,0.97)", zIndex: 260, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: 6, fontSize: 200, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>{numeral}</div>
      <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: C.sl, fontSize: 16, cursor: "pointer", zIndex: 2 }}>✕</button>
      <div style={{ fontSize: 34, color: C.go, marginBottom: 14, position: "relative" }}>{pillar.icon}</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 6, position: "relative" }}>{pillar.name}</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, letterSpacing: 1, marginBottom: 18, position: "relative" }}>{pillar.lineage}</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.sl, lineHeight: 1.7, fontStyle: "italic", position: "relative" }}>{pillar.philosophy}</div>
      {christianLens && pillar.scripture ? (
        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(200,221,208,0.2)", position: "relative" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Christian Lens</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.cr, lineHeight: 1.6, fontStyle: "italic" }}>{pillar.scripture}</div>
        </div>
      ) : null}
    </div>
  );
}
