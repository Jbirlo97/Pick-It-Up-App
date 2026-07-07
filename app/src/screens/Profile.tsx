import { useState } from "react";
import { C } from "../theme";
import { INJURY_OPTIONS } from "../data/content";
import { ProgressCalendar } from "../components/ProgressCalendar";
import { ToneToggle } from "../components/Shared";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { Paywall } from "./Paywall";
import type { AppState, BodyStats, SetState, TrainingLocation } from "../types";

export function Profile({ state, setState }: { state: AppState; setState: SetState }) {
  const { tone, christianLens, day, sessionHistory, equipment, injuries, userName, bodyStats, weeklyTarget } = state;
  const [editStats, setEditStats] = useState(false);
  const [ls, setLs] = useState<BodyStats>(bodyStats || { weight: "", height: "", age: "", waist: "", unit: "metric", sex: "" });
  const [showPaywall, setShowPaywall] = useState(false);
  const isPremium = state.isPremium;
  const recent = sessionHistory.slice(-7).map((s) => s.readiness);
  const avgR = recent.length ? (recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(1) : "—";
  const eqOpts = ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack"];

  if (showPaywall) {
    return <Paywall state={state} setState={setState} onClose={() => setShowPaywall(false)} />;
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "44px 24px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(200,169,106,0.18)", border: "2px solid " + C.go, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia',serif", fontSize: 22, color: C.go, flexShrink: 0 }}>{(userName || "Y").charAt(0).toUpperCase()}</div>
        <div>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 24, color: C.cr, lineHeight: 1.1 }}>{userName || "You"}</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl, marginTop: 3 }}>{isPremium ? "Premium member" : "Day " + day + " of the climb"}</div>
        </div>
      </div>
      {!isPremium ? (
        <div style={{ margin: "16px 24px 0" }} onClick={() => setShowPaywall(true)}>
          <div style={{ background: "linear-gradient(135deg, " + C.gd + ", #0F2E1C)", borderRadius: 14, padding: "16px", border: "1px solid " + C.go, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.go, marginBottom: 2 }}>Go Premium</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sl }}>Full movement library, training blocs & more</div>
            </div>
            <div style={{ color: C.go, fontSize: 18 }}>›</div>
          </div>
        </div>
      ) : null}
      <div style={{ padding: "18px 24px 0" }}>
        <div style={{ background: C.ow, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", marginBottom: recent.length > 1 ? 12 : 0 }}>
            {[
              { v: day, l: "Day" },
              { v: sessionHistory.length, l: "Sessions" },
              { v: avgR, l: "Avg Readiness" },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.gd, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>
          {recent.length > 1 ? (
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
                {recent.map((r, i) => {
                  const c = r >= 4 ? C.gd : r >= 3 ? C.sg : r >= 2 ? C.am : C.rd;
                  return <div key={i} style={{ flex: 1, background: c, borderRadius: "2px 2px 0 0", height: (r / 5) * 100 + "%", minHeight: 3 }} />;
                })}
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, marginTop: 3 }}>Last {recent.length} readiness scores</div>
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Progress Calendar</div>
          <ProgressCalendar sessionHistory={sessionHistory} />
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>Body Stats</div>
            <button
              onClick={() => {
                if (editStats) setState((s) => ({ ...s, bodyStats: { ...ls } }));
                setEditStats(!editStats);
              }}
              style={{ padding: "4px 12px", borderRadius: 16, border: "1px solid " + C.sl, background: "transparent", fontFamily: "Inter,sans-serif", fontSize: 11, color: C.sg, cursor: "pointer" }}
            >
              {editStats ? "Save" : "Edit"}
            </button>
          </div>
          {editStats ? (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {(["metric", "imperial"] as const).map((u) => {
                  const active = ls.unit === u;
                  return (
                    <button key={u} onClick={() => setLs((s) => ({ ...s, unit: u }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                      {u}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {(
                  [
                    ["male", "Male"],
                    ["female", "Female"],
                    ["unspecified", "N/A"],
                  ] as [BodyStats["sex"], string][]
                ).map(([id, label]) => {
                  const active = ls.sex === id;
                  return (
                    <button key={id} onClick={() => setLs((s) => ({ ...s, sex: id }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>
                      {label}
                    </button>
                  );
                })}
              </div>
              {(
                [
                  ["Age", "age", "years"],
                  ["Weight", "weight", ls.unit === "imperial" ? "lbs" : "kg"],
                  ["Height", "height", ls.unit === "imperial" ? "inches" : "cm"],
                ] as [string, "age" | "weight" | "height", string][]
              ).map(([label, key, unit]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>
                    {label} ({unit})
                  </div>
                  <input type="number" value={ls[key] || ""} onChange={(e) => setLs((s) => ({ ...s, [key]: e.target.value }))} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>Waist ({ls.unit === "imperial" ? "inches" : "cm"}) — optional</div>
                <input type="number" value={ls.waist || ""} onChange={(e) => setLs((s) => ({ ...s, waist: e.target.value }))} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 4, lineHeight: 1.4 }}>Measured around the belly button. Unlocks waist-to-height ratio — a more muscle-aware measure than BMI alone.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {(
                [
                  ["Age", bodyStats?.age || "", "yr"],
                  ["Weight", bodyStats?.weight || "", bodyStats?.unit === "imperial" ? "lbs" : "kg"],
                  ["Height", bodyStats?.height || "", bodyStats?.unit === "imperial" ? "in" : "cm"],
                ] as [string, string, string][]
              ).map(([label, v, u]) => (
                <div key={label}>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: v ? C.gd : C.sl }}>
                    {v || "—"}
                    {v && u ? " " + u : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Weekly Target</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[2, 3, 4, 5, 6].map((n) => {
              const active = weeklyTarget === n;
              return (
                <button key={n} onClick={() => setState((s) => ({ ...s, weeklyTarget: n }))} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.1)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: active ? 700 : 400, cursor: "pointer" }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Tone</div>
          <ToneToggle value={tone} onChange={(v) => setState((s) => ({ ...s, tone: v }))} />
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 10 }}>Training Location</div>
          <div style={{ display: "flex", gap: 7, marginBottom: state.trainingLocation === "home" ? 14 : 0 }}>
            {(
              [
                ["commercial", "Gym"],
                ["home", "Home"],
                ["bodyweight", "Bodyweight"],
              ] as [TrainingLocation, string][]
            ).map(([id, label]) => {
              const active = (state.trainingLocation || "bodyweight") === id;
              return (
                <button
                  key={id}
                  onClick={() =>
                    setState((s) => {
                      const eq = id === "commercial" ? ["dumbbells", "barbell", "bench", "pull-up bar", "resistance bands", "kettlebell", "cable machine", "squat rack", "bodyweight"] : id === "bodyweight" ? ["bodyweight"] : s.trainingLocation === "home" && s.equipment.length ? s.equipment : ["bodyweight"];
                      return { ...s, trainingLocation: id, equipment: eq };
                    })
                  }
                  style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400 }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {state.trainingLocation === "home" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {eqOpts.map((eq) => {
                const active = (equipment || []).indexOf(eq) !== -1;
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
                    style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}
                  >
                    {eq}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Injury Flags</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Standing injuries — always avoided. For something that's only bothering you today, flag it in your daily check-in instead.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {INJURY_OPTIONS.map((inj) => {
              const active = (injuries || []).indexOf(inj) !== -1;
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

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Christian Lens</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Theological framing in insights. Off by default.</div>
          <button onClick={() => setState((s) => ({ ...s, christianLens: !s.christianLens }))} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (christianLens ? C.gd : C.sl), background: christianLens ? C.gd : "transparent", color: christianLens ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
            {christianLens ? "Enabled — tap to disable" : "Enable"}
          </button>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 4 }}>Spotify</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 8 }}>Play music during workout sessions. Full OAuth requires backend setup beyond this prototype.</div>
          <button onClick={() => setState((s) => ({ ...s, spotifyConnected: !s.spotifyConnected }))} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid " + (state.spotifyConnected ? "#1DB954" : C.sl), background: state.spotifyConnected ? "#1DB954" : "transparent", color: state.spotifyConnected ? "#fff" : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
            {state.spotifyConnected ? "Connected — tap to disconnect" : "Connect Spotify"}
          </button>
        </div>

        <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 6 }}>Refer a Friend</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 10 }}>Give a friend 1 month Premium free. When they subscribe, you get 1 month free.</div>
          <div style={{ background: C.ow, borderRadius: 8, padding: "10px 12px", border: "1px solid " + C.sl, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, fontWeight: 600 }}>pickitup.app/join/{(userName || "you").toLowerCase()}</span>
            <button style={{ padding: "4px 10px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>Copy</button>
          </div>
        </div>

        {isSupabaseConfigured ? (
          <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid " + C.sl }}>
            <button onClick={() => supabase?.auth.signOut()} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "transparent", color: C.rd, border: "1px solid rgba(192,57,43,0.3)", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Sign out
            </button>
          </div>
        ) : null}

        <div style={{ padding: "14px", borderRadius: 12, background: C.cr, border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"Muscle is built in the gym. Strength begins in the mind."</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 5 }}>Pick It Up — Built on the philosophy of change.</div>
        </div>
      </div>
    </div>
  );
}
