import { useCallback, useState } from "react";
import { C } from "../theme";
import { INJURY_OPTIONS } from "../data/content";
import { getInsight } from "../engines/session-engine";
import { upsertTodayCheckIn } from "../lib/db";
import { useUserId } from "../state/UserContext";
import { SliderField, ToneToggle, GreenButton } from "../components/Shared";
import type { AppState, CheckInData, ScreenId, SetState } from "../types";

export function CheckIn({ state, setState, setScreen }: { state: AppState; setState: SetState; setScreen: (s: ScreenId) => void }) {
  const [d, setD] = useState<CheckInData>(state.checkIn || { readiness: 3, sleep: 3, mood: 3, stress: 3 });
  const avg = ((d.readiness + d.sleep + d.mood + (6 - d.stress)) / 4).toFixed(1);
  const userId = useUserId();

  const submit = useCallback(() => {
    const ins = getInsight({ tone: state.tone, checkIn: d, christianLens: state.christianLens, userName: state.userName, sex: state.bodyStats?.sex });
    setState((s) => ({ ...s, checkIn: d, checkInDate: new Date().toDateString(), aiInsight: ins, aiLoading: false }));
    if (userId) upsertTodayCheckIn(userId, d, ins, state.injuries);
    setScreen("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, state.tone, state.christianLens, state.userName, state.injuries, userId]);

  return (
    <div style={{ padding: "30px 24px 100px" }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.gd, marginBottom: 4 }}>Daily Check-In</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginBottom: 26, lineHeight: 1.5 }}>Rate honestly{state.userName ? ", " + state.userName : ""}. This shapes your session.</div>
      <SliderField label="Physical Readiness" low="Depleted" high="Ready" value={d.readiness} onChange={(v) => setD((x) => ({ ...x, readiness: v }))} />
      <SliderField label="Sleep Quality" low="Rough" high="Restored" value={d.sleep} onChange={(v) => setD((x) => ({ ...x, sleep: v }))} />
      <SliderField label="Mood" low="Low" high="Strong" value={d.mood} onChange={(v) => setD((x) => ({ ...x, mood: v }))} />
      <SliderField label="Stress Load" low="Clear" high="Heavy" value={d.stress} onChange={(v) => setD((x) => ({ ...x, stress: v }))} />
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Today's tone</div>
        <ToneToggle value={state.tone} onChange={(v) => setState((s) => ({ ...s, tone: v }))} />
      </div>
      <div style={{ background: Number(avg) >= 3.5 ? "rgba(26,74,46,0.07)" : "rgba(200,169,106,0.12)", border: "1px solid " + (Number(avg) >= 3.5 ? C.sl : C.go), borderRadius: 10, padding: "13px 15px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, fontWeight: 600 }}>Readiness</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: Number(avg) >= 3.5 ? C.gd : C.go }}>{avg}/5</div>
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginTop: 3 }}>{Number(avg) >= 4 ? "Strong. Your session will reflect it." : Number(avg) >= 3 ? "Solid. Build sustainably." : Number(avg) >= 2 ? "Lower energy. Session adjusts." : "Rest is the work."}</div>
      </div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Anything bothering you today?</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Flag it and today's session will work around it. Standing injuries live in Profile — this is just for today.</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {INJURY_OPTIONS.map((inj) => {
            const active = (state.injuries || []).indexOf(inj) !== -1;
            return (
              <button
                key={inj}
                onClick={() =>
                  setState((s) => {
                    const list = active ? s.injuries.filter((i) => i !== inj) : s.injuries.concat([inj]);
                    return { ...s, injuries: list };
                  })
                }
                style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid " + (active ? C.rd : C.sl), background: active ? "rgba(192,57,43,0.08)" : "transparent", color: active ? C.rd : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}
              >
                {inj}
              </button>
            );
          })}
        </div>
      </div>
      <GreenButton label="Complete Check-In" onClick={submit} full />
    </div>
  );
}
