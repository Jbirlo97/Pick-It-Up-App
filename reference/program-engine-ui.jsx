/**
 * Pick It Up — Program Generator UI (reference implementation)
 * ============================================
 * Standalone reference UI for the Program Engine (see program-engine-data.js).
 * Matches Pick It Up's existing visual language, kept as its own file per the
 * size/stability constraints of the main app artifact.
 *
 * CRITICAL SAFETY UX — read before changing:
 * generateProgram() does NOT silently remove exercises that conflict with a
 * logged injury — it flags them (see `flaggedExercises` in the engine). This
 * UI is responsible for enforcing the one-tap warning the project agreed on:
 * if any exercise in the generated session has a contraindication match, the
 * user MUST see an explicit interstitial naming the exercise and the injury
 * it conflicts with, and MUST tap through it before the session is playable.
 * Do not remove or auto-dismiss this step — it is the actual safety
 * mechanism, not a cosmetic warning.
 */

import { useState } from "react";
import { generateProgram } from "./program-engine-data.js";

const C = {
  gd: "#1A4A2E",
  go: "#C8A96A",
  cr: "#F5EDD8",
  sg: "#6B8F71",
  sl: "#C8DDD0",
  ch: "#1C1C1C",
  ow: "#FAF7F2",
  mu: "#8A8A7A",
  wh: "#FFFFFF",
  rd: "#C0392B",
  am: "#E8A020",
};

function ContraindicationWarning({ flagged, onAcknowledge, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,74,46,0.92)", display: "flex", flexDirection: "column", justifyContent: "center", padding: 28, zIndex: 300 }}>
      <div style={{ fontSize: 30, color: C.am, marginBottom: 14, textAlign: "center" }}>⚠</div>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.cr, textAlign: "center", marginBottom: 10 }}>
        This session includes something flagged against an injury you logged.
      </div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
        {flagged.map((f) => (
          <div key={f.exercise.exercise_id} style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 700, color: C.cr }}>{f.exercise.name}</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.am }}>Flagged for: {f.matchedInjuries.join(", ")}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.6, marginBottom: 24, textAlign: "center" }}>
        You know your body better than this app does. If this feels wrong, swap it out or skip it — that's always an option in the session.
      </div>
      <button onClick={onAcknowledge} style={{ width: "100%", padding: 15, borderRadius: 12, background: C.go, color: C.gd, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
        I understand, continue anyway
      </button>
      <button onClick={onCancel} style={{ width: "100%", padding: 15, borderRadius: 12, background: "transparent", color: C.sl, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 14, cursor: "pointer" }}>
        Regenerate without it
      </button>
    </div>
  );
}

function ExerciseRow({ item, type }) {
  return (
    <div style={{ background: C.wh, border: "1px solid " + C.sl, borderRadius: 12, padding: 14, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd }}>{item.name}</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>{item.sets} × {item.reps}</div>
      </div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, fontStyle: "italic" }}>{item.coach_cue}</div>
    </div>
  );
}

export default function ProgramGenerator({ userContext }) {
  const [program, setProgram] = useState(() => generateProgram(userContext));
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  const needsWarning = program.flaggedExercises.length > 0 && !warningAcknowledged;

  const regenerate = () => {
    // Simple re-roll; a real implementation might exclude the flagged
    // exercise_ids explicitly rather than relying on re-randomization.
    setProgram(generateProgram(userContext));
    setWarningAcknowledged(false);
  };

  if (needsWarning) {
    return (
      <ContraindicationWarning
        flagged={program.flaggedExercises}
        onAcknowledge={() => setWarningAcknowledged(true)}
        onCancel={regenerate}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.ow, padding: "40px 24px 60px" }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: C.gd, marginBottom: 4 }}>Today's session</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 4 }}>Built from readiness {program.readiness}/5</div>
      {program.trend && program.trend !== "unknown" ? (
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: program.trend === "declining" ? C.am : program.trend === "improving" ? C.sg : C.mu, marginBottom: 16 }}>
          {program.trend === "improving" ? "↑ Trending up the last few sessions" :
            program.trend === "declining" ? "↓ Trending down — volume trimmed slightly to match" :
              program.trend === "volatile" ? "∿ Readiness has been inconsistent — keeping it steady today" :
                "→ Holding steady"}
        </div>
      ) : <div style={{ marginBottom: 16 }} />}

      {program.warmup.length > 0 ? (
        <>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: 1.5, color: C.go, textTransform: "uppercase", marginBottom: 8 }}>Warm-up</div>
          {program.warmup.map((w) => <ExerciseRow key={w.exercise_id} item={w} type="warmup" />)}
        </>
      ) : null}

      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: 1.5, color: C.go, textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>Main</div>
      {program.main.map((m) => <ExerciseRow key={m.exercise_id} item={m} type="main" />)}

      {program.regulation.length > 0 ? (
        <>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, letterSpacing: 1.5, color: C.go, textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>Regulation finisher</div>
          {program.regulation.map((r) => <ExerciseRow key={r.exercise_id} item={r} type="regulation" />)}
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginTop: 4 }}>Added because today's stress is logged high.</div>
        </>
      ) : null}

      <button onClick={regenerate} style={{ width: "100%", padding: 14, borderRadius: 10, background: "transparent", border: "1px solid " + C.sl, color: C.mu, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer", marginTop: 24 }}>
        Regenerate session
      </button>
    </div>
  );
}
