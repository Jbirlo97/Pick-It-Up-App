import { useEffect, useRef, useState } from "react";
import { C } from "../theme";
import { expandCue, expandError } from "../lib/movementCopy";
import { ExerciseDemoComingSoon } from "../components/ExerciseDemoComingSoon";
import { SectionLabel } from "../components/Shared";
import type { AppState, PlayerSession, SetState } from "../types";

type Phase = "intro" | "active" | "rest" | "complete";
type Tab = "cues" | "errors" | "demo" | "detail";

export function Player({
  session,
  onComplete,
  onExit,
  state,
  setState,
  onWantMore,
}: {
  session: PlayerSession;
  onComplete: () => void;
  onExit: () => void;
  state: AppState;
  setState: SetState;
  onWantMore?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [exIdx, setExIdx] = useState(0);
  const [setNum, setSetNum] = useState(1);
  const [timer, setTimer] = useState(0);
  const [tab, setTab] = useState<Tab>("cues");
  const [expandedCue, setExpandedCue] = useState<number | null>(null);
  const [expandedError, setExpandedError] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ex = session.exercises[exIdx];
  const mov = ex ? ex.movement : null;
  const totalEx = session.exercises.length;
  const sets = ex ? ex.sets : 3;
  const rest = ex ? ex.rest : 60;
  const pct = ((exIdx * sets + (setNum - 1)) / (totalEx * sets)) * 100;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phase === "rest" && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPhase("active");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timer]);

  const goNext = () => {
    if (setNum < sets) {
      setSetNum(setNum + 1);
      setTimer(rest);
      setPhase("rest");
    } else if (exIdx < totalEx - 1) {
      setExIdx(exIdx + 1);
      setSetNum(1);
      setTab("cues");
      const nextRest = session.exercises[exIdx + 1] ? session.exercises[exIdx + 1].rest : 60;
      setTimer(nextRest);
      setPhase("rest");
    } else {
      setPhase("complete");
    }
  };

  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.gd, padding: "40px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <button onClick={onExit} style={{ background: "none", border: "none", color: C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 24 }}>
          ← Back
        </button>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Your Session</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.cr, lineHeight: 1.2, marginBottom: 10 }}>{session.sessionTitle}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, lineHeight: 1.6, marginBottom: 16 }}>{session.sessionRationale}</div>
        {session.flaggedExercises && session.flaggedExercises.length > 0 ? (
          <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.35)", borderRadius: 10, padding: "10px 13px", marginBottom: 16 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, fontWeight: 600, marginBottom: 3 }}>Worked around your flags</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl, lineHeight: 1.5 }}>
              {session.flaggedExercises.length} exercise{session.flaggedExercises.length === 1 ? " was" : "s were"} excluded because of the injuries you flagged (
              {session.flaggedExercises
                .map((f) => f.movement.name)
                .slice(0, 3)
                .join(", ")}
              {session.flaggedExercises.length > 3 ? "…" : ""}). Not medical advice — if pain persists, see a professional.
            </div>
          </div>
        ) : null}
        <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid " + C.go, borderRadius: 12, padding: "14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Coach Cue</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.cr, fontStyle: "italic" }}>"{session.coachCue}"</div>
        </div>
        {state.aiInsight && state.aiInsight.reflection ? (
          <div style={{ background: "rgba(200,221,208,0.08)", borderRadius: 10, padding: "12px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Carry into this session</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.sl, fontStyle: "italic" }}>{state.aiInsight.reflection}</div>
          </div>
        ) : null}
        {session.exercises.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(200,221,208,0.1)" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(200,221,208,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.cr }}>{e.movement ? e.movement.name : ""}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>
                {e.sets}×{e.reps}
              </div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: C.sl, fontFamily: "Inter,sans-serif", margin: "14px 0", textAlign: "center" }}>
          ~{session.estimatedMinutes} min · {totalEx} exercises
        </div>
        <div style={{ background: "rgba(29,185,84,0.12)", border: "1px solid rgba(29,185,84,0.35)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>♫</span>
            <div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.cr }}>{state.spotifyConnected ? "Training Playlist" : "Spotify"}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{state.spotifyConnected ? "Ready to play during your session" : "Connect to play music while you train"}</div>
            </div>
          </div>
          {state.spotifyConnected ? (
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "#1DB954", fontWeight: 600 }}>Connected</span>
          ) : (
            <button onClick={() => setState((s) => ({ ...s, spotifyConnected: true }))} style={{ padding: "6px 14px", borderRadius: 16, background: "#1DB954", color: "#fff", border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
              Connect
            </button>
          )}
        </div>
        <button onClick={() => setPhase("active")} style={{ width: "100%", padding: "16px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: "auto" }}>
          Start Session →
        </button>
      </div>
    );
  }

  if (phase === "complete") {
    const wasLowReadiness = (state.checkIn ? state.checkIn.readiness : 3) <= 2;
    return (
      <div style={{ minHeight: "100vh", background: C.gd, padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✓</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 10 }}>Session complete.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, lineHeight: 1.7, marginBottom: 16, maxWidth: 280 }}>
          {totalEx} exercises. Every set counted. The trickle continues.
        </div>
        {state.aiInsight && state.aiInsight.reflection ? (
          <div style={{ background: "rgba(200,221,208,0.08)", borderRadius: 10, padding: "14px", marginBottom: 24, maxWidth: 300 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.cr, fontStyle: "italic" }}>{state.aiInsight.reflection}</div>
          </div>
        ) : null}
        {wasLowReadiness && onWantMore ? (
          <div style={{ background: "rgba(200,169,106,0.12)", border: "1px solid " + C.go, borderRadius: 12, padding: "14px", marginBottom: 16, maxWidth: 300 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.go, fontWeight: 600, marginBottom: 4 }}>Feeling more capable than expected?</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.5, marginBottom: 10 }}>You can unlock a slightly fuller session right now — no need to wait for tomorrow.</div>
            <button onClick={onWantMore} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "transparent", color: C.go, border: "1px solid " + C.go, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Unlock a fuller session →
            </button>
          </div>
        ) : null}
        <button onClick={onComplete} style={{ width: "100%", padding: "15px", borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Back to Home
        </button>
      </div>
    );
  }

  if (phase === "rest") {
    const upNext = setNum < sets ? (mov ? mov.name : "") + " — Set " + (setNum + 1) + " of " + sets : session.exercises[exIdx + 1] && session.exercises[exIdx + 1].movement ? session.exercises[exIdx + 1].movement.name : "Final set";
    return (
      <div style={{ minHeight: "100vh", background: C.ch, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ fontSize: 11, color: C.mu, fontFamily: "Inter,sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Rest</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 80, color: C.go, lineHeight: 1 }}>{timer}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginTop: 4, marginBottom: 32 }}>seconds</div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Coming up</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 16, color: C.wh, fontWeight: 600 }}>{upNext}</div>
        </div>
        <button
          onClick={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimer(0);
            setPhase("active");
          }}
          style={{ padding: "12px 28px", borderRadius: 24, background: "transparent", color: C.sl, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}
        >
          Skip →
        </button>
      </div>
    );
  }

  const buttonLabel = setNum < sets ? "Set " + setNum + " Done — Rest " + rest + "s" : exIdx < totalEx - 1 ? "Finish " + (mov ? mov.name : "") + " — Next" : "Complete Session ✓";

  return (
    <div style={{ minHeight: "100vh", background: C.wh, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 4, background: C.sl }}>
        <div style={{ height: "100%", width: pct + "%", background: C.gd, transition: "width 0.4s" }} />
      </div>
      <div style={{ background: C.gd, padding: "18px 24px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={onExit} style={{ background: "none", border: "none", color: C.sl, fontSize: 13, fontFamily: "Inter,sans-serif", cursor: "pointer" }}>
            ✕ Exit
          </button>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>
            {exIdx + 1}/{totalEx} · {Math.round(pct)}%
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.go, fontFamily: "Inter,sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
          Set {setNum} of {sets}
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.cr, marginBottom: 3 }}>{mov ? mov.name : ""}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}>
          {ex.reps} · {ex.rest}s rest
        </div>
      </div>
      <div style={{ background: "rgba(200,169,106,0.08)", padding: "10px 24px", borderBottom: "1px solid " + C.sl }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic" }}>"{ex.coachNote}"</div>
      </div>
      {state.spotifyConnected ? (
        <div style={{ background: "rgba(29,185,84,0.08)", padding: "8px 24px", borderBottom: "1px solid " + C.sl, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>♫</span>
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg }}>Now playing — Training Playlist</span>
        </div>
      ) : null}
      <div style={{ display: "flex", borderBottom: "1px solid " + C.sl }}>
        {(
          [
            ["cues", "Cues"],
            ["errors", "Errors"],
            ["demo", "Demo"],
            ["detail", "Detail"],
          ] as [Tab, string][]
        ).map(([id, label]) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 0", background: active ? C.ow : "transparent", border: "none", borderBottom: "2px solid " + (active ? C.gd : "transparent"), fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 700 : 400, color: active ? C.gd : C.mu, cursor: "pointer" }}>
              {label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, padding: "18px 24px", overflowY: "auto" }}>
        {tab === "cues" && mov
          ? mov.cues.map((c, i) => {
              const isOpen = expandedCue === i;
              const expanded = isOpen ? expandCue(c, mov) : null;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div onClick={() => setExpandedCue(isOpen ? null : i)} style={{ display: "flex", gap: 10, cursor: "pointer", padding: "4px 0" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.go, fontWeight: 700, flexShrink: 0, fontFamily: "Inter,sans-serif" }}>{i + 1}</div>
                    <div style={{ flex: 1, fontFamily: "Inter,sans-serif", fontSize: 14, color: C.ch, lineHeight: 1.5, paddingTop: 1 }}>{c}</div>
                    <div style={{ color: C.mu, fontSize: 12, paddingTop: 3 }}>{isOpen ? "−" : "+"}</div>
                  </div>
                  {isOpen && expanded ? (
                    <div style={{ marginLeft: 32, marginTop: 6, padding: "10px 12px", background: C.ow, borderRadius: 8, border: "1px solid " + C.sl }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6, marginBottom: 8 }}>{expanded.detail}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sg, fontWeight: 600 }}>{expanded.tryThis}</div>
                      <div onClick={() => setTab("demo")} style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, cursor: "pointer", textDecoration: "underline" }}>
                        Check the demo tab →
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
        {tab === "errors" && mov ? (
          <div>
            <SectionLabel label="Common mistakes" />
            {mov.errors.map((e, i) => {
              const isOpen = expandedError === i;
              const expanded = isOpen ? expandError(e, mov) : null;
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div onClick={() => setExpandedError(isOpen ? null : i)} style={{ display: "flex", gap: 10, cursor: "pointer", padding: "10px", background: "rgba(192,57,43,0.05)", borderRadius: 8, border: "1px solid rgba(192,57,43,0.12)" }}>
                    <div style={{ color: C.rd, flexShrink: 0 }}>✕</div>
                    <div style={{ flex: 1, fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{e}</div>
                    <div style={{ color: C.mu, fontSize: 12 }}>{isOpen ? "−" : "+"}</div>
                  </div>
                  {isOpen && expanded ? (
                    <div style={{ marginTop: 6, padding: "10px 12px", background: C.ow, borderRadius: 8, border: "1px solid " + C.sl }}>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, lineHeight: 1.6, marginBottom: 8 }}>{expanded.detail}</div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.gd, fontWeight: 600 }}>{expanded.fix}</div>
                      <div onClick={() => setTab("demo")} style={{ marginTop: 8, fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, cursor: "pointer", textDecoration: "underline" }}>
                        Check the demo tab →
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {tab === "demo" && mov ? <ExerciseDemoComingSoon movement={mov} /> : null}
        {tab === "detail" && mov ? (
          <div>
            {(
              [
                ["Muscles", mov.muscles],
                ["If too hard", mov.regression],
                ["To progress", mov.progression],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, lineHeight: 1.5 }}>{value}</div>
              </div>
            ))}
            {mov.contra.length > 0 ? (
              <div style={{ padding: "10px", background: "rgba(192,57,43,0.05)", borderRadius: 8, border: "1px solid rgba(192,57,43,0.15)" }}>
                <div style={{ fontSize: 10, color: C.rd, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Contraindications</div>
                {mov.contra.map((c, i) => (
                  <div key={i} style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch }}>
                    · {c}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div style={{ padding: "14px 24px 30px", borderTop: "1px solid " + C.sl }}>
        <button onClick={goNext} style={{ width: "100%", padding: "15px", background: C.gd, color: C.cr, border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

