import { C } from "../theme";

export interface WheelSegment {
  done: number;
  target: number;
}

export function AccountabilityWheel({
  segments,
  overallPct,
}: {
  segments: { workouts: WheelSegment; nourish: WheelSegment; sleep: WheelSegment };
  overallPct: number;
}) {
  const size = 116,
    cx = 58,
    cy = 58;
  const rings: { r: number; key: keyof typeof segments; color: string }[] = [
    { r: 50, key: "workouts", color: C.gd },
    { r: 39, key: "nourish", color: C.go },
    { r: 28, key: "sleep", color: C.sg },
  ];
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {rings.map((ring) => {
          const seg = segments[ring.key] || { done: 0, target: 1 };
          const circ = 2 * Math.PI * ring.r;
          const pct = Math.min(seg.done / Math.max(seg.target, 1), 1);
          const dash = pct * circ;
          return (
            <g key={ring.key}>
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={C.sl} strokeWidth={7} opacity={0.4} />
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color} strokeWidth={7} strokeDasharray={dash + " " + (circ - dash)} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 20, color: C.gd, lineHeight: 1 }}>{overallPct}%</div>
      </div>
    </div>
  );
}
