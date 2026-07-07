import { useState } from "react";
import { C } from "../theme";
import { REGULATION_PRACTICES, type RegulationPractice } from "../data/content";
import { PracticeDetail } from "./PracticeDetail";
import type { AppState } from "../types";

type Filter = "all" | "breath" | "somatic";

export function Regulate({ state }: { state: AppState }) {
  const [openPractice, setOpenPractice] = useState<RegulationPractice | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const checkIn = state.checkIn;
  const checkInIsToday = state.checkInDate === new Date().toDateString();
  const highStress = checkIn && checkInIsToday && checkIn.stress >= 4;

  const suggested = highStress ? REGULATION_PRACTICES.find((p) => p.id === "physiological_sigh") : null;
  const filtered = filter === "all" ? REGULATION_PRACTICES : REGULATION_PRACTICES.filter((p) => p.category === filter);

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "50px 24px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>∿</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Nervous System</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3 }}>Regulate</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginTop: 8, lineHeight: 1.5 }}>Breathwork and somatic practices for steadying your body, not just your mind.</div>
      </div>

      {suggested ? (
        <div style={{ margin: "16px 24px 0" }}>
          <div onClick={() => setOpenPractice(suggested)} style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 16, padding: "16px 18px", cursor: "pointer" }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: C.rd, textTransform: "uppercase", marginBottom: 6 }}>Today's stress is logged high</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 4 }}>
              Try {suggested.name} — {suggested.durationMin} min
            </div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.4 }}>The fastest tool here for bringing your system down quickly.</div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {(
            [
              ["all", "All"],
              ["breath", "Breathwork"],
              ["somatic", "Somatic"],
            ] as [Filter, string][]
          ).map(([id, label]) => {
            const active = filter === id;
            return (
              <button key={id} onClick={() => setFilter(id)} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                {label}
              </button>
            );
          })}
        </div>
        {filtered.map((p) => (
          <div key={p.id} onClick={() => setOpenPractice(p)} style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 14, padding: "15px 16px", marginBottom: 10, cursor: "pointer", boxShadow: "0 1px 3px rgba(26,74,46,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd }}>{p.name}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, whiteSpace: "nowrap" }}>{p.durationMin} min</div>
            </div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.4 }}>{p.bestFor}</div>
          </div>
        ))}
      </div>
      {openPractice ? <PracticeDetail practice={openPractice} onClose={() => setOpenPractice(null)} /> : null}
    </div>
  );
}
