import { useState } from "react";
import { C } from "../theme";
import { RotatingQuote } from "../components/RotatingQuote";
import { GreenButton } from "../components/Shared";
import { deleteGoal, insertCraving, insertGoal, insertSleepEntry, updateGoalProgress, upsertSobriety } from "../lib/db";
import { useUserId } from "../state/UserContext";
import type { AppState, CravingEntry, Goal, SetState, Sobriety } from "../types";

type Tab = "sleep" | "sobriety" | "mind" | "goals" | "steps";

export function Track({ state, setState }: { state: AppState; setState: SetState }) {
  const userId = useUserId();
  const [tab, setTab] = useState<Tab>("sleep");
  const [sd, setSd] = useState({ hours: 7, quality: 3 });
  const [sobrietySetup, setSobrietySetup] = useState(false);
  const [sobD, setSobD] = useState<Pick<Sobriety, "substance" | "startDate">>({ substance: "alcohol", startDate: "" });
  const [gd, setGd] = useState({ name: "", target: "", unit: "" });
  const [addingG, setAddingG] = useState(false);
  const [cd, setCd] = useState({ intensity: 3, trigger: "stress", note: "" });

  const { sleepLog, sobriety, goals } = state;
  const steps = state.steps;
  const cravingLog = state.cravingLog || [];

  const sobDays = sobriety?.startDate ? Math.floor((Date.now() - new Date(sobriety.startDate).getTime()) / 86400000) : 0;
  const last7 = sleepLog.slice(-7);
  const avgSl = last7.length ? (last7.reduce((a, s) => a + s.hours, 0) / last7.length).toFixed(1) : null;
  const lastNight = sleepLog.length ? sleepLog[sleepLog.length - 1] : null;
  const trackIsEmpty = sleepLog.length === 0 && !sobriety && goals.length === 0 && cravingLog.length === 0 && (steps || 0) === 0;

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "44px 24px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>◎</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>Track</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3 }}>Private. Honest. Yours.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, marginTop: 8 }}>Sleep, sobriety, mind, goals, steps.</div>
      </div>
      {trackIsEmpty ? (
        <div style={{ margin: "0 24px 16px", padding: "14px 16px", borderRadius: 12, background: "rgba(200,169,106,0.1)", border: "1px solid " + C.go }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, marginBottom: 4 }}>An empty page, not a blank score.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Pick whichever tab matters to you right now. None of it needs to be filled in order.</div>
        </div>
      ) : (
        <RotatingQuote cycle={state.quoteCycle} offset={3} margin="0 24px 16px" />
      )}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto" }}>
          {(
            [
              ["sleep", "Sleep"],
              ["sobriety", "Sobriety"],
              ["mind", "Mind"],
              ["goals", "Goals"],
              ["steps", "Steps"],
            ] as [Tab, string][]
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{ flexShrink: 0, padding: "7px 13px", borderRadius: 20, background: active ? C.gd : "transparent", border: "1px solid " + (active ? C.gd : C.sl), color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer" }}>
                {label}
              </button>
            );
          })}
        </div>

        {tab === "sleep" ? (
          <div>
            {avgSl ? (
              <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: C.gd }}>{avgSl}h</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>7-day avg</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 26, color: lastNight && lastNight.hours >= 7 ? C.gd : C.am }}>{lastNight ? lastNight.hours : "—"}h</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 9, color: C.mu, textTransform: "uppercase" }}>Last night</div>
                </div>
              </div>
            ) : null}
            <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 14, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Log last night</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch }}>Hours slept</span>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd }}>{sd.hours}h</span>
                </div>
                <input type="range" min={0} max={12} step={0.5} value={sd.hours} onChange={(e) => setSd((x) => ({ ...x, hours: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.gd }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, marginBottom: 6 }}>Quality</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = sd.quality === n;
                    return (
                      <button key={n} onClick={() => setSd((x) => ({ ...x, quality: n }))} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "1px solid " + (active ? C.gd : C.sl), background: active ? C.gd : "transparent", color: active ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: active ? 700 : 400, cursor: "pointer" }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
              <GreenButton
                label="Log Sleep"
                full
                onClick={() => {
                  const entry = { date: new Date().toDateString(), hours: sd.hours, quality: sd.quality };
                  setState((s) => ({ ...s, sleepLog: s.sleepLog.concat([entry]) }));
                  if (userId) insertSleepEntry(userId, entry);
                }}
              />
            </div>
            {sleepLog
              .slice()
              .reverse()
              .slice(0, 6)
              .map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + C.sl }}>
                  <div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{s.date}</div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Quality: {s.quality}/5</div>
                  </div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 22, color: s.hours >= 7 ? C.gd : s.hours >= 6 ? C.am : C.rd }}>{s.hours}h</div>
                </div>
              ))}
          </div>
        ) : null}

        {tab === "sobriety" ? (
          <div>
            <div style={{ background: "rgba(26,74,46,0.04)", border: "1px solid " + C.sl, borderRadius: 10, padding: "12px", marginBottom: 14 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.6 }}>Private by default. No one sees this. No shame — only honesty.</div>
            </div>
            {sobriety ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 80, color: C.gd, lineHeight: 1 }}>{sobDays}</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.mu, marginTop: 3, marginBottom: 16 }}>days without {sobriety.substance}</div>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd, fontStyle: "italic", lineHeight: 1.6, marginBottom: 20, maxWidth: 260, margin: "0 auto 20px" }}>
                  {sobDays === 0 ? "Day one. That's not nothing." : sobDays < 7 ? "The first week is the hardest. You're in it." : sobDays < 30 ? "The trickle is building." : sobDays < 90 ? "A month. This is becoming who you are." : "The proof is in the pattern."}
                </div>
                <button
                  onClick={() => {
                    setState((s) => ({ ...s, sobriety: null }));
                    if (userId) upsertSobriety(userId, null);
                  }}
                  style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid " + C.sl, background: "transparent", color: C.mu, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}
                >
                  Reset counter
                </button>
              </div>
            ) : sobrietySetup ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "16px", border: "1px solid " + C.sl }}>
                {(
                  [
                    ["What are you tracking?", "substance", "text", "e.g. alcohol"],
                    ["Start date", "startDate", "date", ""],
                  ] as [string, "substance" | "startDate", string, string][]
                ).map(([label, key, type, ph]) => (
                  <div key={key} style={{ marginBottom: 12 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>{label}</div>
                    <input type={type} value={sobD[key]} onChange={(e) => setSobD((x) => ({ ...x, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      if (sobD.substance && sobD.startDate) {
                        const next: Sobriety = { ...sobD, private: true };
                        setState((s) => ({ ...s, sobriety: next }));
                        if (userId) upsertSobriety(userId, next);
                        setSobrietySetup(false);
                      }
                    }}
                    style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Start tracking
                  </button>
                  <button onClick={() => setSobrietySetup(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 18, color: C.gd, marginBottom: 10 }}>Start a counter</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, lineHeight: 1.6, marginBottom: 20 }}>Track time without something holding you back.</div>
                <GreenButton label="Set up my counter" onClick={() => setSobrietySetup(true)} />
              </div>
            )}
          </div>
        ) : null}

        {tab === "mind" ? (
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 14 }}>Most people don't fail from not knowing what to do. They fail from stress, cravings, and emotional pulls nobody helped them name. Log it here — pattern over time, not shame in the moment.</div>
            <div style={{ background: C.cr, borderRadius: 12, padding: "16px", marginBottom: 16, border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch, marginBottom: 12 }}>Log a craving or trigger</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch }}>Intensity</span>
                  <span style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>{cd.intensity}/5</span>
                </div>
                <input type="range" min={1} max={5} value={cd.intensity} onChange={(e) => setCd((x) => ({ ...x, intensity: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.gd }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.ch, marginBottom: 6 }}>What triggered it?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["stress", "boredom", "loneliness", "fatigue", "social", "habit/time of day"].map((t) => {
                    const active = cd.trigger === t;
                    return (
                      <button key={t} onClick={() => setCd((x) => ({ ...x, trigger: t }))} style={{ padding: "6px 12px", borderRadius: 18, border: "1px solid " + (active ? C.go : C.sl), background: active ? "rgba(200,169,106,0.15)" : "transparent", color: active ? C.go : C.mu, fontFamily: "Inter,sans-serif", fontSize: 11, cursor: "pointer" }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 4 }}>Optional note</div>
                <input value={cd.note} onChange={(e) => setCd((x) => ({ ...x, note: e.target.value }))} placeholder="What was happening right before?" style={{ width: "100%", padding: "9px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
              </div>
              <GreenButton
                label="Log it"
                full
                onClick={() => {
                  const entry: CravingEntry = { id: Date.now(), date: new Date().toDateString(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), intensity: cd.intensity, trigger: cd.trigger, note: cd.note };
                  setState((s) => ({ ...s, cravingLog: (s.cravingLog || []).concat([entry]) }));
                  if (userId) insertCraving(userId, entry);
                  setCd({ intensity: 3, trigger: "stress", note: "" });
                }}
              />
            </div>
            {cravingLog.length > 0 ? (
              <div>
                <div style={{ background: C.ow, borderRadius: 10, padding: "12px", marginBottom: 14, border: "1px solid " + C.sl }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Most common trigger</div>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd }}>
                    {(() => {
                      const counts: Record<string, number> = {};
                      cravingLog.forEach((c) => {
                        counts[c.trigger] = (counts[c.trigger] || 0) + 1;
                      });
                      let top = "—",
                        max = 0;
                      Object.keys(counts).forEach((k) => {
                        if (counts[k] > max) {
                          max = counts[k];
                          top = k;
                        }
                      });
                      return top;
                    })()}
                  </div>
                </div>
                {cravingLog
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((c) => (
                    <div key={c.id} style={{ border: "1px solid " + C.sl, borderRadius: 10, padding: "11px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, textTransform: "capitalize" }}>{c.trigger}</span>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>{c.time}</span>
                      </div>
                      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>
                        Intensity {c.intensity}/5{c.note ? " · " + c.note : ""}
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "goals" ? (
          <div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5, marginBottom: 14 }}>Personal goals. Habit tracking. Custom counters. Things that matter to you.</div>
            {addingG ? (
              <div style={{ background: C.cr, borderRadius: 12, padding: "14px", marginBottom: 14, border: "1px solid " + C.sl }}>
                {(
                  [
                    ["Goal name", "name", "text", "e.g. Read daily"],
                    ["Target", "target", "number", "e.g. 30"],
                    ["Unit", "unit", "text", "e.g. days"],
                  ] as [string, "name" | "target" | "unit", string, string][]
                ).map(([label, key, type, ph]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 3 }}>{label}</div>
                    <input type={type} value={gd[key]} onChange={(e) => setGd((x) => ({ ...x, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      if (gd.name.trim()) {
                        const tempId = Date.now();
                        const entry: Goal = { ...gd, id: tempId, progress: 0 };
                        setState((s) => ({ ...s, goals: s.goals.concat([entry]) }));
                        if (userId) {
                          insertGoal(userId, entry).then((realId) => {
                            if (realId) setState((s) => ({ ...s, goals: s.goals.map((x) => (x.id === tempId ? { ...x, id: realId } : x)) }));
                          });
                        }
                        setGd({ name: "", target: "", unit: "" });
                        setAddingG(false);
                      }
                    }}
                    style={{ flex: 2, padding: "10px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Add
                  </button>
                  <button onClick={() => setAddingG(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingG(true)} style={{ width: "100%", padding: "13px", borderRadius: 12, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
                + Add a goal
              </button>
            )}
            {goals.map((g) => {
              const pct = Math.min((g.progress || 0) / Math.max(Number(g.target), 1) * 100, 100);
              return (
                <div key={g.id} style={{ border: "1px solid " + C.sl, borderRadius: 10, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{g.name}</div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd }}>
                      {g.progress || 0}/{g.target} {g.unit}
                    </div>
                  </div>
                  <div style={{ height: 5, background: C.sl, borderRadius: 3, marginBottom: 10 }}>
                    <div style={{ height: "100%", width: pct + "%", background: C.gd, borderRadius: 3 }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        const nextProgress = (g.progress || 0) + 1;
                        setState((s) => ({
                          ...s,
                          goals: s.goals.map((x) => (x.id === g.id ? { ...x, progress: nextProgress } : x)),
                        }));
                        if (userId) updateGoalProgress(g.id, nextProgress);
                      }}
                      style={{ flex: 1, padding: "7px", borderRadius: 8, background: C.gd, color: C.cr, border: "none", fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}
                    >
                      + Log one
                    </button>
                    <button
                      onClick={() => {
                        setState((s) => ({ ...s, goals: s.goals.filter((x) => x.id !== g.id) }));
                        if (userId) deleteGoal(g.id);
                      }}
                      style={{ padding: "7px 12px", borderRadius: 8, background: "transparent", color: C.mu, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === "steps" ? (
          <div>
            <div style={{ textAlign: "center", padding: "16px 0 10px" }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 72, color: C.gd, lineHeight: 1 }}>{(steps || 0).toLocaleString()}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.mu, marginTop: 3, marginBottom: 14 }}>steps today</div>
              <div style={{ height: 5, background: C.sl, borderRadius: 3, marginBottom: 4 }}>
                <div style={{ height: "100%", width: Math.min(((steps || 0) / 10000) * 100, 100) + "%", background: C.gd, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu, marginBottom: 20 }}>{Math.min(((steps || 0) / 10000) * 100, 100).toFixed(0)}% of 10,000</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
                {[1000, 2500, 5000].map((n) => (
                  <button key={n} onClick={() => setState((s) => ({ ...s, steps: (s.steps || 0) + n }))} style={{ padding: "10px 14px", borderRadius: 10, background: C.ow, border: "1px solid " + C.sl, fontFamily: "Inter,sans-serif", fontSize: 12, color: C.ch, cursor: "pointer" }}>
                    +{n.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: C.cr, borderRadius: 10, padding: "14px", border: "1px solid " + C.sl }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: C.ch, marginBottom: 5 }}>Watch & Health Integration</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, lineHeight: 1.5 }}>Apple Watch, Garmin, Fitbit sync coming in the full app via HealthKit (iOS) or Health Connect (Android).</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
