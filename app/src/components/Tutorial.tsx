import { useState } from "react";
import { C } from "../theme";
import { TUTORIAL_CARDS } from "../data/content";

export function Tutorial({ onSkip }: { onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const card = TUTORIAL_CARDS[step];
  const isLast = step === TUTORIAL_CARDS.length - 1;
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(26,74,46,0.94)", zIndex: 300, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 24px 110px" }}>
      <div style={{ background: C.cr, borderRadius: 16, padding: "22px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {TUTORIAL_CARDS.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? C.gd : C.sl, transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 19, color: C.gd, marginBottom: 8 }}>{card.title}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.6, marginBottom: 20 }}>{card.body}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSkip} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>
            Skip
          </button>
          <button onClick={() => (isLast ? onSkip() : setStep(step + 1))} style={{ flex: 2, padding: "12px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {isLast ? "Let's go" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
