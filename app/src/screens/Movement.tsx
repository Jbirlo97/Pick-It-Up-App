import { useCallback, useState } from "react";
import { C } from "../theme";
import { MOVS } from "../data/exercises-legacy";
import { getSession } from "../engines/session-engine";
import { getDetailedSession } from "../engines/program-engine";
import { insertSession } from "../lib/db";
import { useUserId } from "../state/UserContext";
import { RotatingQuote } from "../components/RotatingQuote";
import { Spinner } from "../components/Shared";
import { Player } from "./Player";
import type { AppState, Movement as MovementType, SetState } from "../types";

// Equipment mapping per docs/integration-spec.md Section 4: the live app's
// granular equipment list -> the program engine's equipmentAccess options.
function mapEquipmentToEngineAccess(trainingLocation: AppState["trainingLocation"], equipment: string[]): string[] {
  if (trainingLocation === "bodyweight") return ["None"];
  if (trainingLocation === "commercial") return ["Commercial gym"];
  const map: Record<string, string> = {
    dumbbells: "Dumbbells",
    barbell: "Barbell",
    bench: "Bench",
    "pull-up bar": "Pull-up bar",
    "resistance bands": "Bands",
    kettlebell: "Kettlebell",
    "cable machine": "Cable machine",
    "squat rack": "Squat rack",
  };
  const access = ["Home gym"];
  equipment.forEach((e) => {
    if (map[e]) access.push(map[e]);
  });
  return access;
}

export function Movement({ state, setState }: { state: AppState; setState: SetState }) {
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [detailedLoading, setDetailedLoading] = useState(false);
  const [sessionSource, setSessionSource] = useState<"quick" | "detailed">("quick");
  const { checkIn, currentSession, sessionLoading, week, tone, equipment, injuries, sessionHistory, christianLens, userName, trainingLocation } = state;
  const userId = useUserId();

  const gen = useCallback(() => {
    setState((s) => ({ ...s, sessionLoading: true, currentSession: null }));
    const ses = getSession({ tone, checkIn, week, equipment, injuries, sessionHistory, christianLens, userName });
    setSessionSource("quick");
    setState((s) => ({ ...s, sessionLoading: false, currentSession: ses }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone, checkIn, week, equipment, injuries, sessionHistory, christianLens, userName]);

  const genDetailed = useCallback(() => {
    setDetailedLoading(true);
    const ses = getDetailedSession({
      readiness: checkIn ? checkIn.readiness : 3,
      stress: checkIn ? checkIn.stress : 3,
      injuryFlags: injuries,
      sessionHistory,
      equipmentAccess: mapEquipmentToEngineAccess(trainingLocation, equipment),
      primaryGoal: "Consistency",
      experienceLevel: "Beginner",
    });
    setSessionSource("detailed");
    setState((s) => ({ ...s, currentSession: ses }));
    setDetailedLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, injuries, sessionHistory, trainingLocation, equipment]);

  const finishSession = useCallback(() => {
    setState((s) => {
      const readiness = s.checkIn ? s.checkIn.readiness : 3;
      const entry = { date: new Date().toDateString(), readiness, completed: true };
      if (userId && s.currentSession) insertSession(userId, sessionSource, s.currentSession, readiness);
      return { ...s, sessionHistory: s.sessionHistory.concat([entry]), currentSession: null, day: s.day + 1 };
    });
    setPlaying(false);
  }, [setState, userId, sessionSource]);

  const wantMore = useCallback(() => {
    setState((s) => ({ ...s, sessionLoading: true }));
    const boostedCheckIn = checkIn ? { ...checkIn, readiness: 3 } : { readiness: 3, sleep: 3, mood: 3, stress: 3 };
    const ses = getSession({ tone, checkIn: boostedCheckIn, week, equipment, injuries, sessionHistory, christianLens, userName });
    setState((s) => ({ ...s, sessionLoading: false, currentSession: ses }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone, checkIn, week, equipment, injuries, sessionHistory, christianLens, userName]);

  if (playing && currentSession) {
    return <Player key={currentSession.sessionTitle + currentSession.exercises.length} session={currentSession} onComplete={finishSession} onExit={() => setPlaying(false)} state={state} setState={setState} onWantMore={wantMore} />;
  }

  const r = checkIn ? checkIn.readiness : 3;
  const filtered: MovementType[] = r <= 2 ? MOVS.filter((m) => m.tags.includes("mobility") || m.tags.includes("recovery")) : r >= 4 ? MOVS.filter((m) => m.tags.includes("strength") || m.tags.includes("power")) : MOVS;

  const recent = sessionHistory.slice(-3).map((s) => s.readiness);
  let trend: string | null = null;
  if (recent.length >= 2) {
    const last = recent[recent.length - 1];
    if (last > recent[0]) trend = "↑ Improving";
    else if (last < recent[0]) trend = "↓ Declining";
    else trend = "→ Stable";
  }

  const headline = !checkIn ? "Foundation Program" : r <= 2 ? "Rest & restore." : r >= 4 ? "Strong window. Load it up." : "Build with intention.";
  const isFirstVisit = sessionHistory.length === 0;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "38px 24px 26px", position: "relative" }}>
        <div style={{ position: "absolute", top: 18, right: 24, width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(200,169,106,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.go }}>↑</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.cr, lineHeight: 1.3, marginBottom: 8, maxWidth: 260 }}>{headline}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {checkIn ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>Readiness {r}/5</span> : null}
          {trend ? <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go }}>Trend: {trend}</span> : null}
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>
            Week {week} · {sessionHistory.length} done
          </span>
        </div>
      </div>
      {isFirstVisit ? (
        <div style={{ margin: "16px 24px 0", padding: "14px 16px", borderRadius: 12, background: "rgba(200,169,106,0.1)", border: "1px solid " + C.go }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, marginBottom: 4 }}>Your first session lives here.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>{checkIn ? "Generate it below — built from how you're actually doing today, not a generic plan." : "Do your check-in first so this session is built around today, not guessed at."}</div>
        </div>
      ) : (
        <RotatingQuote cycle={state.quoteCycle} offset={1} margin="16px 24px 0" />
      )}
      <div style={{ padding: "18px 24px 0" }}>
        {checkIn ? (
          <div style={{ marginBottom: 18 }}>
            {sessionLoading || detailedLoading ? (
              <Spinner msg="Building your session..." sub="Selecting movements based on your readiness." />
            ) : currentSession ? (
              <div style={{ background: C.cr, borderRadius: 14, border: "1px solid " + C.go, padding: "16px" }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Today's Program</div>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd, marginBottom: 6 }}>{currentSession.sessionTitle}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 10 }}>{currentSession.sessionRationale}</div>
                {currentSession.flaggedExercises && currentSession.flaggedExercises.length > 0 ? (
                  <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.35)", borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, fontWeight: 600 }}>Worked around your flags</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, lineHeight: 1.4 }}>{currentSession.flaggedExercises.length} exercise{currentSession.flaggedExercises.length === 1 ? "" : "s"} excluded for the injuries you flagged.</div>
                  </div>
                ) : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {currentSession.exercises.map((e, i) => (
                    <span key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, background: C.sl, borderRadius: 20, padding: "3px 10px" }}>
                      {e.movement ? e.movement.name : ""}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPlaying(true)} style={{ flex: 2, padding: "12px", borderRadius: 10, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <svg width="10" height="10" viewBox="0 0 18 18">
                      <polygon points="3,1 16,9 3,17" fill={C.cr} />
                    </svg>
                    Start — ~{currentSession.estimatedMinutes} min
                  </button>
                  <button onClick={gen} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "transparent", color: C.sg, border: "1px solid " + C.sg, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                    ↺ New
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={gen} style={{ width: "100%", padding: "14px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
                  ◈ Quick Session
                </button>
                <button onClick={genDetailed} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "transparent", color: C.gd, border: "1px dashed " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                  ⚙ Detailed Session (warm-up, trend reasoning, regulation finisher)
                </button>
              </>
            )}
            {state.aiInsight && state.aiInsight.movement && !currentSession && !sessionLoading ? (
              <div style={{ background: "rgba(200,169,106,0.1)", borderRadius: 10, padding: "11px 14px", marginTop: 10, border: "1px solid rgba(200,169,106,0.3)" }}>
                <div style={{ fontSize: 10, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>From your check-in</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{state.aiInsight.movement}</div>
              </div>
            ) : null}
          </div>
        ) : null}

        <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, background: open ? C.gd : C.ow, border: "1px solid " + (open ? C.gd : C.sl), display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: 2 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: open ? C.cr : C.ch }}>Movement Library ({filtered.length})</div>
          <div style={{ color: open ? C.go : C.mu, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</div>
        </button>

        {open ? (
          <div style={{ border: "1px solid " + C.sl, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "10px", marginBottom: 14 }}>
            {filtered.map((m, i) => {
              const isExp = exp === i;
              return (
                <div key={m.name} onClick={() => setExp(isExp ? null : i)} style={{ border: "1px solid " + (isExp ? C.gd : C.sl), borderRadius: 10, padding: "12px", marginBottom: 8, background: isExp ? C.ow : C.wh, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.tier === 1 ? C.sg : m.tier === 2 ? C.go : C.gd }} />
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{m.name}</span>
                    </div>
                    <span style={{ color: C.mu, fontSize: 13 }}>{isExp ? "↑" : "↓"}</span>
                  </div>
                  {isExp ? (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + C.sl }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 6 }}>{m.muscles}</div>
                      {m.cues.map((c, j) => (
                        <div key={j} style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, marginBottom: 3 }}>
                          · {c}
                        </div>
                      ))}
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginTop: 6 }}>
                        {m.regression} → {m.progression}
                      </div>
                      {m.contra.length > 0 ? (
                        <div style={{ padding: "5px 8px", background: "rgba(192,57,43,0.06)", borderRadius: 6, marginTop: 8 }}>
                          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.rd }}>⚠ {m.contra.join(" · ")}</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

