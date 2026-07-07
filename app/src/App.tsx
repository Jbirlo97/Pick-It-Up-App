import { useEffect, useRef, useState } from "react";
import { C } from "./theme";
import { DEFAULT } from "./state/defaultState";
import { UserProvider } from "./state/UserContext";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { hydrateStateFromSupabase, saveProfilePatch, stateToProfilePatch } from "./lib/db";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { CheckIn } from "./screens/CheckIn";
import { Movement } from "./screens/Movement";
import { Nourish } from "./screens/Nourish";
import { Track } from "./screens/Track";
import { Regulate } from "./screens/Regulate";
import { Community } from "./screens/Community";
import { Profile } from "./screens/Profile";
import { Login } from "./screens/Login";
import { Nav } from "./components/Nav";
import { Spinner } from "./components/Shared";
import { Tutorial } from "./components/Tutorial";
import { EmailCapture } from "./components/EmailCapture";
import type { AppState, ScreenId } from "./types";

function FullScreenSpinner({ msg }: { msg: string }) {
  return (
    <div style={{ minHeight: "100vh", background: C.gd, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner msg={msg} />
    </div>
  );
}

// Local-only mode (no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set — see
// .env.example and CLAUDE.md "Open items on Josh's side: Supabase project
// creation") skips auth entirely and behaves exactly like the prototype:
// in-memory state, nothing persisted across a refresh.
function useAuthGatedUserId(): { userId: string | null; ready: boolean } {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { userId, ready };
}

export default function App() {
  const { userId, ready } = useAuthGatedUserId();
  const [state, setState] = useState<AppState>(DEFAULT);
  const [hydrated, setHydrated] = useState(!isSupabaseConfigured);
  const [screen, setScreenRaw] = useState<ScreenId>("home");

  // Load persisted state once per sign-in.
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    setHydrated(false);
    hydrateStateFromSupabase(userId).then((loaded) => {
      if (loaded) {
        setState((s) => {
          const next = { ...s };
          (Object.keys(loaded) as (keyof AppState)[]).forEach((k) => {
            const v = loaded[k];
            if (v !== undefined) (next as Record<string, unknown>)[k] = v;
          });
          return next;
        });
      }
      setHydrated(true);
    });
  }, [userId]);

  // Debounced write-through for the "settings" (profile-shaped) slice of
  // state — covers onboarding, Profile edits, tone/christianLens toggles,
  // etc. without needing a persistence call at every individual handler.
  const profileSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured || !userId || !hydrated) return;
    if (profileSyncTimer.current) clearTimeout(profileSyncTimer.current);
    profileSyncTimer.current = setTimeout(() => {
      saveProfilePatch(userId, stateToProfilePatch(state));
    }, 800);
    return () => {
      if (profileSyncTimer.current) clearTimeout(profileSyncTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userId,
    hydrated,
    state.userName,
    state.weeklyTarget,
    state.bodyStats,
    state.tone,
    state.christianLens,
    state.trainingLocation,
    state.equipment,
    state.injuries,
    state.whys,
    state.isPremium,
    state.onboarded,
    state.onboardStep,
    state.firstWinPending,
    state.day,
    state.week,
    state.spotifyConnected,
    state.buddy,
    state.tutorialSeen,
    state.email,
    state.emailCaptured,
    state.emailPromptDismissed,
    state.steps,
  ]);

  const setScreen = (s: ScreenId) => {
    setState((st) => ({ ...st, quoteCycle: (st.quoteCycle || 0) + 1 }));
    setScreenRaw(s);
  };

  if (!ready) return <FullScreenSpinner msg="Loading..." />;
  if (isSupabaseConfigured && !userId) return <Login />;
  if (!hydrated) return <FullScreenSpinner msg="Loading your data..." />;

  if (!state.onboarded) {
    return (
      <UserProvider value={userId}>
        <Onboarding state={state} setState={setState} />
      </UserProvider>
    );
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
    <UserProvider value={userId}>
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
    </UserProvider>
  );
}
