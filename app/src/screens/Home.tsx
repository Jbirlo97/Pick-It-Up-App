import { useState } from "react";
import { C } from "../theme";
import { PILLARS, EXTERNAL_QUOTES } from "../data/content";
import { getDigest } from "../engines/session-engine";
import { PillarBadge, Spinner, GreenButton, ToneToggle } from "../components/Shared";
import { AccountabilityWheel } from "../components/AccountabilityWheel";
import { PillarDetail } from "../components/PillarDetail";
import type { AppState, ScreenId, SetState } from "../types";
import type { Pillar } from "../data/content";

export function Home({ state, setState, setScreen }: { state: AppState; setState: SetState; setScreen: (s: ScreenId) => void }) {
  const [pillarOpen, setPillarOpen] = useState<Pillar | null>(null);
  const { tone, day, week, checkIn, aiInsight, userName, weeklyTarget, sessionHistory, weeklyDigest, digestLoading } = state;
  const checkInIsToday = state.checkInDate === new Date().toDateString();
  const quoteCycle = state.quoteCycle || 0;
  const name = userName || "you";

  const fallbackMsg: Record<string, string> = {
    Stoic: "Day " + day + ". You're here. Keep going.",
    Balanced: "Welcome back, " + name + ". Let's see where you are.",
    Empathic: "Hey " + name + " — really glad you showed up.",
  };

  const wkStart = new Date();
  wkStart.setDate(wkStart.getDate() - wkStart.getDay());
  const wkDone = sessionHistory.filter((s) => new Date(s.date) >= wkStart && s.completed).length;
  const wkSleep = state.sleepLog.filter((s) => new Date(s.date) >= wkStart).length;
  const segments = {
    workouts: { done: wkDone, target: weeklyTarget || 3 },
    nourish: { done: state.meals.length, target: 7 },
    sleep: { done: wkSleep, target: 7 },
  };
  const overallPct = Math.round(
    ((Math.min(segments.workouts.done / segments.workouts.target, 1) +
      Math.min(segments.nourish.done / segments.nourish.target, 1) +
      Math.min(segments.sleep.done / segments.sleep.target, 1)) /
      3) *
      100
  );

  const fetchDigest = () => {
    setState((s) => ({ ...s, digestLoading: true }));
    const d = getDigest({ tone: state.tone, sessionHistory: state.sessionHistory, week: state.week });
    setState((s) => ({ ...s, weeklyDigest: d, digestLoading: false }));
  };

  const todayItems: { label: string; done: boolean; icon: string; detail: string; sc: ScreenId }[] = [
    { label: "Check-In", done: !!checkIn, icon: "◎", detail: checkIn ? "Readiness " + checkIn.readiness + "/5 · Mood " + checkIn.mood + "/5" : "Shapes your whole day", sc: "checkin" },
    { label: "Movement", done: sessionHistory.some((s) => s.date === new Date().toDateString()), icon: "↑", detail: state.currentSession ? state.currentSession.sessionTitle : aiInsight ? "Ready to generate" : "Check in first", sc: "movement" },
    { label: "Nourishment", done: state.meals.length > 0, icon: "◇", detail: state.meals.length > 0 ? state.meals.length + " meal" + (state.meals.length > 1 ? "s" : "") + " logged" : "Log what you ate", sc: "nourish" },
    { label: "Tracking", done: state.sleepLog.some((s) => s.date === new Date().toDateString()), icon: "◎", detail: "Sleep, sobriety & goals", sc: "track" },
  ];

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: C.gd, padding: "50px 24px 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 150, color: "rgba(200,169,106,0.06)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>
          Day {day} · Week {week}
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 25, color: C.cr, fontWeight: 400, lineHeight: 1.3, marginBottom: 14 }}>{checkIn && aiInsight ? aiInsight.message : fallbackMsg[tone]}</div>
        <ToneToggle value={tone} onChange={(v) => setState((s) => ({ ...s, tone: v }))} dark />
      </div>

      <div style={{ margin: "16px 24px 0" }}>
        <div style={{ background: C.wh, borderRadius: 18, border: "1px solid " + C.sl, padding: "18px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(26,74,46,0.05)" }}>
          <AccountabilityWheel segments={segments} overallPct={overallPct} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 3 }}>This Week</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.gd }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>
                  Workouts {wkDone}/{weeklyTarget || 3}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.go }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Nourishment {state.meals.length}/7</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sg }} />
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>Sleep logs {wkSleep}/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {aiInsight && aiInsight.quote ? (
        <div style={{ margin: "10px 24px 0", padding: "13px 15px", borderRadius: 12, background: C.ow, border: "1px solid " + C.sl }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"{aiInsight.quote}"</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 5 }}>Pick It Up · Day {day}</div>
        </div>
      ) : null}

      {(() => {
        const extQ = EXTERNAL_QUOTES[quoteCycle % EXTERNAL_QUOTES.length];
        return (
          <div style={{ margin: "10px 24px 0", padding: "13px 15px", borderRadius: 12, background: C.gd, border: "1px solid " + C.gd }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.cr, fontStyle: "italic", lineHeight: 1.6 }}>"{extQ.text}"</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.go, marginTop: 5 }}>
              {extQ.author} · {extQ.school}
            </div>
          </div>
        );
      })()}

      {checkIn && aiInsight && checkInIsToday ? (
        <div style={{ margin: "14px 24px 0", background: C.gd, borderRadius: 18, padding: "20px", boxShadow: "0 8px 24px rgba(26,74,46,0.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, letterSpacing: 1, color: C.go, fontStyle: "italic" }}>Today's Focus</div>
            <PillarBadge name={aiInsight.pillar} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Movement</div>
            <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.cr, lineHeight: 1.6 }}>{aiInsight.movement}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(200,221,208,0.25)", paddingTop: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.sl, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Sit with this</div>
            <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, fontStyle: "italic", lineHeight: 1.6 }}>{aiInsight.reflection}</div>
          </div>
          {state.christianLens
            ? (() => {
                const matchedPillar = PILLARS.find((p) => p.name === aiInsight.pillar);
                return matchedPillar && matchedPillar.scripture ? (
                  <div style={{ borderTop: "1px solid rgba(200,221,208,0.25)", marginTop: 14, paddingTop: 14 }}>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>Christian Lens</div>
                    <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.go, lineHeight: 1.6, fontStyle: "italic" }}>{matchedPillar.scripture}</div>
                  </div>
                ) : null;
              })()
            : null}
        </div>
      ) : null}

      {checkIn && aiInsight && !checkInIsToday ? (
        <div style={{ margin: "14px 24px 0", background: C.cr, borderRadius: 14, padding: "18px", border: "1px solid " + C.sl, textAlign: "center" }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Yesterday's focus has expired.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 14, lineHeight: 1.5 }}>A new day means a new check-in — today's instruction is built fresh, not carried over.</div>
          <GreenButton label="Do My Check-In" onClick={() => setScreen("checkin")} />
        </div>
      ) : null}

      {!checkIn ? (
        <div style={{ margin: "14px 24px 0", background: C.cr, borderRadius: 14, padding: "18px", border: "1px solid " + C.sl, textAlign: "center" }}>
          <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.gd, marginBottom: 8 }}>Start with where you actually are.</div>
          <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, marginBottom: 14, lineHeight: 1.5 }}>Your check-in shapes your movement, reflection, and session.</div>
          <GreenButton label="Do My Check-In" onClick={() => setScreen("checkin")} />
        </div>
      ) : null}

      {sessionHistory.length >= 3 ? (
        <div style={{ margin: "12px 24px 0" }}>
          {digestLoading ? (
            <Spinner msg="Writing your weekly digest..." />
          ) : weeklyDigest ? (
            <div style={{ background: C.gd, borderRadius: 14, padding: "18px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: C.go, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Weekly Digest</div>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 19, color: C.cr, marginBottom: 8 }}>{weeklyDigest.headline}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 13, color: C.sl, lineHeight: 1.6, marginBottom: 10 }}>{weeklyDigest.body}</div>
              <div style={{ background: "rgba(200,169,106,0.12)", borderRadius: 10, padding: "12px", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: C.go, fontStyle: "italic" }}>{weeklyDigest.confidence}</div>
              </div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl }}>
                <strong style={{ color: C.go }}>Next week:</strong> {weeklyDigest.nextWeekIntent}
              </div>
            </div>
          ) : (
            <button onClick={fetchDigest} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", color: C.gd, border: "2px solid " + C.gd, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              ◈ Get Your Weekly Digest
            </button>
          )}
        </div>
      ) : null}

      <div style={{ padding: "22px 24px 0" }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>Today</div>
        {todayItems.map((item) => (
          <div key={item.label} onClick={() => setScreen(item.sc)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid " + C.sl, cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: item.done ? C.gd : C.sl, display: "flex", alignItems: "center", justifyContent: "center", color: item.done ? C.go : C.mu, fontSize: 15 }}>{item.done ? "✓" : item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, color: C.ch }}>{item.label}</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu }}>{item.detail}</div>
            </div>
            <div style={{ color: C.sg, fontSize: 18 }}>›</div>
          </div>
        ))}
      </div>

      {checkIn && checkInIsToday && checkIn.stress >= 4 ? (
        <div style={{ padding: "0 24px" }}>
          <div onClick={() => setScreen("regulate")} style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 16, padding: "15px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ fontSize: 20, color: C.rd }}>∿</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: C.gd }}>Today's stress is logged high</div>
              <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: C.mu }}>A 2-minute reset is in Regulate, bottom nav</div>
            </div>
            <div style={{ color: C.sg, fontSize: 18 }}>›</div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: "26px 24px 0" }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 12, letterSpacing: 3, color: C.mu, textTransform: "uppercase", marginBottom: 3 }}>The Four Pillars</div>
        <div style={{ height: 2, width: 36, background: C.go, marginBottom: 16 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PILLARS.map((pl, i) => {
            const active = aiInsight && aiInsight.pillar === pl.name;
            const numeral = ["I", "II", "III", "IV"][i];
            return (
              <div
                key={pl.name}
                onClick={() => setPillarOpen(pl)}
                style={{ display: "flex", alignItems: "center", gap: 16, background: active ? C.gd : C.wh, border: active ? "none" : "1px solid " + C.sl, borderRadius: 16, padding: "16px 18px", cursor: "pointer", boxShadow: active ? "0 6px 20px rgba(26,74,46,0.22)" : "0 1px 3px rgba(26,74,46,0.04)", transition: "all 0.35s ease" }}
              >
                <div style={{ fontFamily: "'Georgia',serif", fontSize: 11, color: active ? "rgba(250,247,242,0.45)" : C.sl, width: 16, flexShrink: 0 }}>{numeral}</div>
                <div style={{ fontSize: 26, color: active ? C.go : C.gd, flexShrink: 0, width: 32, textAlign: "center" }}>{pl.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, fontWeight: 700, color: active ? C.cr : C.gd, marginBottom: 2 }}>{pl.name}</div>
                  <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: active ? C.sl : C.mu, lineHeight: 1.4 }}>{pl.desc}</div>
                </div>
                {active ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.go, flexShrink: 0 }} /> : null}
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: C.mu, marginTop: 10, textAlign: "center" }}>{aiInsight && aiInsight.pillar ? "Highlighted: what today's check-in points to. Tap any pillar for the philosophy behind it." : "Tap a pillar for the philosophy behind it"}</div>
      </div>
      {pillarOpen ? <PillarDetail pillar={pillarOpen} onClose={() => setPillarOpen(null)} christianLens={state.christianLens} /> : null}
    </div>
  );
}
