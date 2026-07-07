import { C } from "../theme";
import type { AppState, ScreenId } from "../types";

export function Nav({ active, setScreen, state }: { active: ScreenId; setScreen: (s: ScreenId) => void; state: AppState }) {
  const todayStr = new Date().toDateString();
  const movementDone = state.sessionHistory.some((s) => s.date === todayStr);
  const nourishDone = state.meals.length > 0;
  const trackDone = state.sleepLog.some((s) => s.date === todayStr);
  const hasCompletedSession = state.sessionHistory && state.sessionHistory.length > 0;
  const items: { id: ScreenId; icon: string; l: string; dot?: boolean; locked?: boolean }[] = [
    { id: "home", icon: "⌂", l: "Home" },
    { id: "movement", icon: "↑", l: "Move", dot: !!state.checkIn && !movementDone },
    { id: "nourish", icon: "◇", l: "Nourish", dot: !nourishDone },
    { id: "regulate", icon: "∿", l: "Regulate", locked: !hasCompletedSession },
    { id: "track", icon: "◎", l: "Track", dot: !trackDone },
    { id: "community", icon: "◈", l: "Community", locked: !hasCompletedSession },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: C.wh, borderTop: "1px solid " + C.sl, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 14px", zIndex: 100 }}>
      <style>{"@keyframes navpulse{0%{transform:scale(1);opacity:1;}70%{transform:scale(2.2);opacity:0;}100%{transform:scale(2.2);opacity:0;}}"}</style>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.locked) {
                alert("Complete your first session to unlock " + item.l + ".");
                return;
              }
              setScreen(item.id);
            }}
            style={{ background: "none", border: "none", cursor: item.locked ? "default" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: item.locked ? "rgba(138,138,122,0.35)" : isActive ? C.gd : C.mu, position: "relative", opacity: item.locked ? 0.45 : 1 }}
          >
            {item.dot && !item.locked ? (
              <div style={{ position: "absolute", top: -2, right: 0, width: 6, height: 6, borderRadius: "50%", background: C.go }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%", background: C.go, animation: "navpulse 1.8s ease-out infinite" }} />
              </div>
            ) : null}
            {item.locked ? <span style={{ fontSize: 9, position: "absolute", top: -1, right: -1, color: C.mu }}>🔒</span> : null}
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontFamily: "Inter,sans-serif", fontWeight: isActive ? 700 : 400 }}>{item.l}</span>
          </button>
        );
      })}
    </div>
  );
}
