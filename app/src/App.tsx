import { useState } from "react";
import { C } from "./theme";
import { DEFAULT } from "./state/defaultState";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { CheckIn } from "./screens/CheckIn";
import { Movement } from "./screens/Movement";
import { Nourish } from "./screens/Nourish";
import { Track } from "./screens/Track";
import { Regulate } from "./screens/Regulate";
import { Community } from "./screens/Community";
import { Profile } from "./screens/Profile";
import { Nav } from "./components/Nav";
import { Spinner } from "./components/Shared";
import { Tutorial } from "./components/Tutorial";
import { EmailCapture } from "./components/EmailCapture";
import type { AppState, ScreenId } from "./types";

export default function App() {
  const [screen, setScreenRaw] = useState<ScreenId>("home");
  const [state, setState] = useState<AppState>(DEFAULT);

  const setScreen = (s: ScreenId) => {
    setState((st) => ({ ...st, quoteCycle: (st.quoteCycle || 0) + 1 }));
    setScreenRaw(s);
  };

  if (!state.onboarded) {
    return <Onboarding state={state} setState={setState} />;
  }

  // Research-backed: get user to first win (check-in) immediately after
  // onboarding rather than landing on a full feature wall. firstWinPending
  // clears after check-in.
  if (state.firstWinPending) {
    return (
      <div style={{ minHeight: "100vh", background: C.gd, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ position: "absolute", top: -20, right: -10, fontSize: 140, color: "rgba(200,169,106,0.05)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>PIU</div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 32, color: C.cr, textAlign: "center", marginBottom: 10 }}>You're in, {state.userName || ""}.</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: C.sl, textAlign: "center", lineHeight: 1.7, marginBottom: 36 }}>One thing before we go to the app. It takes two minutes and it shapes everything you see today.</div>
        <button
          onClick={() => {
            setState((s) => ({ ...s, firstWinPending: false }));
            setScreen("checkin");
          }}
          style={{ padding: "16px 36px", background: C.go, color: C.gd, border: "none", borderRadius: 12, fontFamily: "Inter,sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Do my first check-in →
        </button>
        <button onClick={() => setState((s) => ({ ...s, firstWinPending: false }))} style={{ marginTop: 16, background: "none", border: "none", fontFamily: "Inter,sans-serif", fontSize: 12, color: "rgba(200,221,208,0.4)", cursor: "pointer" }}>
          Skip for now
        </button>
      </div>
    );
  }

  let activeScreen;
  if (screen === "home") activeScreen = <Home state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "checkin") activeScreen = <CheckIn state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "movement") activeScreen = <Movement state={state} setState={setState} />;
  else if (screen === "nourish") activeScreen = <Nourish state={state} setState={setState} setScreen={setScreen} />;
  else if (screen === "track") activeScreen = <Track state={state} setState={setState} />;
  else if (screen === "regulate") activeScreen = <Regulate state={state} />;
  else if (screen === "community") activeScreen = <Community state={state} setState={setState} />;
  else if (screen === "profile") activeScreen = <Profile state={state} setState={setState} />;
  else activeScreen = <Home state={state} setState={setState} setScreen={setScreen} />;

  return (
    <div style={{ minHeight: "100vh", background: "#DDD9D1", display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ width: "100%", maxWidth: 420, background: C.wh, minHeight: "100vh", position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.18)", overflowX: "hidden" }}>
        {state.aiLoading ? (
          <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, height: "100%", background: "rgba(245,237,216,0.96)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner msg="Reading your check-in..." sub="Your responses are being weighed against the four pillars." />
          </div>
        ) : null}
        {activeScreen}
        {!state.tutorialSeen ? <Tutorial onSkip={() => setState((s) => ({ ...s, tutorialSeen: true }))} /> : null}
        {state.tutorialSeen && state.sessionHistory.length > 0 && !state.emailCaptured && !state.emailPromptDismissed ? (
          <EmailCapture onDismiss={() => setState((s) => ({ ...s, emailPromptDismissed: true }))} onSave={(em) => setState((s) => ({ ...s, email: em, emailCaptured: true }))} />
        ) : null}
        <Nav active={screen} setScreen={setScreen} state={state} />
        <button onClick={() => setScreen("profile")} style={{ position: "fixed", bottom: 66, right: 12, width: 32, height: 32, borderRadius: "50%", background: C.gd, color: C.go, border: "none", fontSize: 13, cursor: "pointer", zIndex: 99, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          ◈
        </button>
      </div>
    </div>
  );
}
