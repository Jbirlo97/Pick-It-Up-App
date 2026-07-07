import { useState } from "react";
import { C } from "../theme";
import type { AppState, BodyStats, SetState, Unit } from "../types";

export function Onboarding({ state, setState }: { state: AppState; setState: SetState }) {
  const step = state.onboardStep || 0;
  const TOTAL = 6;
  const progressPct = Math.round((step / TOTAL) * 100);

  const [ls, setLs] = useState<Pick<BodyStats, "age" | "weight" | "height" | "unit" | "sex">>({
    age: state.bodyStats?.age || "",
    weight: state.bodyStats?.weight || "",
    height: state.bodyStats?.height || "",
    unit: state.bodyStats?.unit || "metric",
    sex: state.bodyStats?.sex || "",
  });

  const canGo = step === 1 ? (state.userName || "").trim().length > 0 : step === 2 ? !!state.tone : step === 5 ? (state.whys || []).length > 0 : true;

  const goForward = () => {
    if (step === 3) {
      setState((s) => ({ ...s, bodyStats: { ...s.bodyStats, ...ls } }));
    }
    if (step === TOTAL - 1) {
      setState((s) => ({ ...s, onboarded: true, firstWinPending: true }));
    } else {
      setState((s) => ({ ...s, onboardStep: (s.onboardStep || 0) + 1 }));
    }
  };

  const goBack = () => {
    if (step === 3) {
      setState((s) => ({ ...s, bodyStats: { ...s.bodyStats, ...ls } }));
    }
    setState((s) => ({ ...s, onboardStep: (s.onboardStep || 1) - 1 }));
  };

  const eqOpts = ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack"];
  const whyOpts = [
    "Build physical strength",
    "Manage stress and anxiety",
    "Create consistent habits",
    "Reconnect with my body",
    "Support my mental health",
    "Prove something to myself",
    "Be a better example for others",
    "Break a pattern holding me back",
  ];

  function renderBody() {
    if (step === 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 16 }}>Welcome</div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 36, color: C.cr, lineHeight: 1.1, marginBottom: 16 }}>Pick It Up.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, lineHeight: 1.8, marginBottom: 32 }}>
            Built on the philosophy of change.
            <br />
            <em>
              Muscle is built in the gym.
              <br />
              Strength begins in the mind.
            </em>
          </div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(200,221,208,0.5)" }}>Five minutes. Then we begin.</div>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>What do we call you?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 24, lineHeight: 1.5 }}>Not your username. Your name.</div>
          <input
            value={state.userName || ""}
            onChange={(e) => setState((s) => ({ ...s, userName: e.target.value }))}
            placeholder="First name"
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1px solid rgba(200,221,208,0.3)", background: "rgba(255,255,255,0.08)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 16, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      );
    }
    if (step === 2) {
      const tones: [string, string][] = [
        ["Stoic", "Direct, minimal. No reassurance."],
        ["Balanced", "Warm but honest. Grounded."],
        ["Empathic", "Genuinely caring. Still boundaried."],
      ];
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>How do you want to be spoken to?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 24 }}>Shapes every message. Change any time.</div>
          {!state.tone ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,169,106,0.7)", marginBottom: 14 }}>Pick one to continue</div> : null}
          {tones.map(([t, d]) => {
            const active = state.tone === t;
            return (
              <div
                key={t}
                onClick={() => setState((s) => ({ ...s, tone: t as AppState["tone"] }))}
                style={{ border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), borderRadius: 12, padding: "16px", marginBottom: 12, background: active ? "rgba(200,169,106,0.1)" : "transparent", cursor: "pointer" }}
              >
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr, marginBottom: 4 }}>{t}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}>{d}</div>
              </div>
            );
          })}
        </div>
      );
    }
    if (step === 3) {
      const fields: [string, "age" | "weight" | "height", string, string][] = [
        ["Age", "age", "years", "e.g. 32"],
        ["Weight", "weight", ls.unit === "imperial" ? "lbs" : "kg", "e.g. 80"],
        ["Height", "height", ls.unit === "imperial" ? "inches" : "cm", "e.g. 178"],
      ];
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Body stats</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20, lineHeight: 1.5 }}>For BMI and macro calculations. Optional — skip freely.</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {(["metric", "imperial"] as Unit[]).map((u) => {
              const active = ls.unit === u;
              return (
                <button key={u} onClick={() => setLs((s) => ({ ...s, unit: u }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>
                  {u}
                </button>
              );
            })}
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>Sex</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.6)", marginBottom: 8, lineHeight: 1.4 }}>Used only for accurate calorie and macro estimates — biology, not identity.</div>
            <div style={{ display: "flex", gap: 8 }}>
              {([
                ["male", "Male"],
                ["female", "Female"],
                ["unspecified", "Prefer not to say"],
              ] as [BodyStats["sex"], string][]).map(([id, label]) => {
                const active = ls.sex === id;
                return (
                  <button key={id} onClick={() => setLs((s) => ({ ...s, sex: id }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          {fields.map(([label, key, unit, ph]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 6 }}>
                {label} ({unit})
              </div>
              <input
                type="number"
                value={ls[key]}
                onChange={(e) => setLs((s) => ({ ...s, [key]: e.target.value }))}
                placeholder={ph}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(200,221,208,0.25)", background: "rgba(255,255,255,0.07)", color: C.cr, fontFamily: "Inter,sans-serif", fontSize: 16, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
      );
    }
    if (step === 4) {
      const loc = state.trainingLocation || "bodyweight";
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Set up your training</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20 }}>Where do you train?</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
            {([
              ["commercial", "Commercial Gym", "Full equipment access"],
              ["home", "Home Gym", "Pick what you've got"],
              ["bodyweight", "Bodyweight Only", "No equipment needed"],
            ] as [AppState["trainingLocation"], string, string][]).map(([id, label, sub]) => {
              const active = loc === id;
              return (
                <button
                  key={id}
                  onClick={() =>
                    setState((s) => {
                      const eq = id === "commercial" ? eqOpts.concat(["bodyweight"]) : id === "bodyweight" ? ["bodyweight"] : s.equipment.length && s.trainingLocation === "home" ? s.equipment : ["bodyweight"];
                      return { ...s, trainingLocation: id, equipment: eq };
                    })
                  }
                  style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.12)" : "transparent", textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, color: active ? C.go : C.cr, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>{sub}</div>
                </button>
              );
            })}
          </div>
          {loc === "home" ? (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 10 }}>What do you have at home?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {eqOpts.map((eq) => {
                  const active = (state.equipment || []).indexOf(eq) !== -1;
                  return (
                    <button
                      key={eq}
                      onClick={() =>
                        setState((s) => {
                          const base = (s.equipment || []).filter((e) => e !== "bodyweight");
                          const list = active ? base.filter((e) => e !== eq) : base.concat([eq]);
                          return { ...s, equipment: list.length ? list : ["bodyweight"] };
                        })
                      }
                      style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.25)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400 }}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, marginBottom: 10 }}>Weekly session target</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 6].map((n) => {
              const active = (state.weeklyTarget || 3) === n;
              return (
                <button key={n} onClick={() => setState((s) => ({ ...s, weeklyTarget: n }))} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: active ? 700 : 400, cursor: "pointer" }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    if (step === 5) {
      return (
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: C.cr, marginBottom: 8 }}>Why are you here?</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginBottom: 20 }}>Be honest. Pick all that apply.</div>
          {(state.whys || []).length === 0 ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,169,106,0.7)", marginBottom: 14 }}>Pick at least one to continue</div> : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {whyOpts.map((w) => {
              const active = (state.whys || []).indexOf(w) !== -1;
              return (
                <button
                  key={w}
                  onClick={() =>
                    setState((s) => {
                      const list = active ? (s.whys || []).filter((x) => x !== w) : (s.whys || []).concat([w]);
                      return { ...s, whys: list };
                    })
                  }
                  style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid " + (active ? C.go : "rgba(200,221,208,0.2)"), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer", textAlign: "left", fontWeight: active ? 600 : 400 }}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  }

  const buttonText = step === TOTAL - 1 ? "Let's go, " + (state.userName || "") : step === 0 ? "Begin →" : "Continue →";

  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", padding: "56px 28px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 140, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, letterSpacing: 1.5, color: "rgba(200,169,106,0.6)", textTransform: "uppercase" }}>
            Step {step + 1} of {TOTAL}
          </div>
          {step > 0 ? (
            <button onClick={goBack} style={{ background: "none", border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, color: "rgba(200,221,208,0.5)", cursor: "pointer" }}>
              ← Back
            </button>
          ) : null}
        </div>
        <div style={{ height: 3, background: "rgba(200,221,208,0.15)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: progressPct + "%", background: C.go, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{renderBody()}</div>
      <div style={{ marginTop: 28 }}>
        <button onClick={goForward} disabled={!canGo} style={{ width: "100%", padding: "15px", background: canGo ? C.go : "rgba(200,169,106,0.3)", color: canGo ? C.gd : "rgba(26,74,46,0.5)", border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: canGo ? "pointer" : "default" }}>
          {buttonText}
        </button>
        {step > 0 ? (
          <button onClick={goBack} style={{ width: "100%", marginTop: 10, padding: "10px", background: "transparent", color: C.sl, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
        ) : null}
      </div>
    </div>
  );
}
