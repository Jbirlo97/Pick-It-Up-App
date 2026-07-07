import { C } from "../theme";
import { EXTERNAL_QUOTES, QUOTES } from "../data/content";

export function RotatingQuote({ cycle, offset, margin }: { cycle: number; offset?: number; margin?: string }) {
  const c = (cycle || 0) + (offset || 0);
  const useExternal = c % 2 === 0;
  const q = useExternal ? EXTERNAL_QUOTES[c % EXTERNAL_QUOTES.length] : QUOTES[c % QUOTES.length];
  const attribution = useExternal
    ? (q as (typeof EXTERNAL_QUOTES)[number]).author + " · " + (q as (typeof EXTERNAL_QUOTES)[number]).school
    : "Pick It Up · " + (q as (typeof QUOTES)[number]).pillar;
  return (
    <div style={{ margin: margin || "14px 24px 0", padding: "13px 15px", borderRadius: 12, background: useExternal ? C.gd : C.ow, border: "1px solid " + (useExternal ? C.gd : C.sl) }}>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 13, color: useExternal ? C.cr : C.gd, fontStyle: "italic", lineHeight: 1.6 }}>"{q.text}"</div>
      <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, color: useExternal ? C.go : C.mu, marginTop: 5 }}>{attribution}</div>
    </div>
  );
}
