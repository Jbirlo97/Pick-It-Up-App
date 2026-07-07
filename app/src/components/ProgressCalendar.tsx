import { C } from "../theme";
import type { SessionHistoryEntry } from "../types";

export function ProgressCalendar({ sessionHistory }: { sessionHistory: SessionHistoryEntry[] }) {
  const today = new Date();
  const days: { short: number; done: boolean; r: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();
    const found = sessionHistory.find((x) => x.date === ds);
    days.push({ short: d.getDate(), done: !!found, r: found ? found.readiness : 0 });
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {days.map((d, i) => {
        let bg: string = C.ow;
        if (d.done) {
          if (d.r >= 4) bg = C.gd;
          else if (d.r >= 3) bg = C.sg;
          else bg = C.sl;
        }
        return (
          <div key={i} style={{ width: 28, height: 28, borderRadius: 5, background: bg, border: "1px solid " + C.sl, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: d.done ? C.cr : C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600 }}>
            {d.short}
          </div>
        );
      })}
    </div>
  );
}
