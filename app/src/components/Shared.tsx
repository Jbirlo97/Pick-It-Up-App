import { C } from "../theme";
import { PILLARS } from "../data/content";
import type { Tone } from "../types";

export function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 2, color: C.mu, fontFamily: "Inter,sans-serif", fontWeight: 600, textTransform: "uppercase", marginBottom: 14 }}>
      {label}
    </div>
  );
}

export function Spinner({ msg, sub }: { msg?: string; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid " + C.sl, borderTopColor: C.gd, animation: "spin 1s linear infinite" }} />
      <style>{"@keyframes spin{to{transform:rotate(360deg);}}"}</style>
      <div style={{ fontFamily: "'Georgia',serif", fontSize: 15, color: C.gd, textAlign: "center", fontStyle: "italic" }}>{msg || "Loading..."}</div>
      {sub ? <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.mu, textAlign: "center", lineHeight: 1.5, maxWidth: 260 }}>{sub}</div> : null}
    </div>
  );
}

export function GreenButton({
  label,
  onClick,
  full,
  disabled,
}: {
  label: string;
  onClick: () => void;
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: full ? "100%" : "auto", padding: "13px 24px", background: disabled ? "#ccc" : C.gd, color: C.cr, border: "none", borderRadius: 10, fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer" }}
    >
      {label}
    </button>
  );
}

export function SliderField({
  label,
  low,
  high,
  value,
  onChange,
}: {
  label: string;
  low: string;
  high: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: C.ch }}>{label}</span>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.go, fontWeight: 700 }}>{value}/5</span>
      </div>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: C.gd }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif" }}>{low}</span>
        <span style={{ fontSize: 10, color: C.mu, fontFamily: "Inter,sans-serif" }}>{high}</span>
      </div>
    </div>
  );
}

export function ToneToggle({ value, onChange, dark }: { value: Tone; onChange: (t: Tone) => void; dark?: boolean }) {
  const tones: Tone[] = ["Stoic", "Balanced", "Empathic"];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {tones.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{ padding: "5px 11px", borderRadius: 20, border: "1px solid " + (active ? C.go : dark ? "rgba(200,221,208,0.3)" : C.sl), background: active ? "rgba(200,169,106,0.18)" : "transparent", color: active ? C.go : dark ? C.sl : C.mu, fontSize: 11, fontFamily: "Inter,sans-serif", cursor: "pointer", fontWeight: active ? 700 : 400 }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function PillarBadge({ name }: { name: string }) {
  const found = PILLARS.find((x) => x.name === name);
  const icon = found ? found.icon : "◎";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(200,169,106,0.15)", border: "1px solid " + C.go, borderRadius: 20, padding: "3px 10px", fontFamily: "Inter,sans-serif", fontSize: 11, color: C.go, fontWeight: 600 }}>
      {icon} {name}
    </span>
  );
}
