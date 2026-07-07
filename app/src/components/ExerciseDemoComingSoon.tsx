import { C } from "../theme";
import type { Movement } from "../types";

// Honest "coming soon" card for exercise video demos. SVG play icon only —
// NEVER a unicode ▶, which triggers iOS's native media overlay. Josh films
// real demos in Canada; this card is the slot they drop into.
export function ExerciseDemoComingSoon({ movement }: { movement: Movement }) {
  return (
    <div>
      <div style={{ background: C.gd, borderRadius: 16, padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -10, right: -6, fontSize: 90, color: "rgba(200,169,106,0.07)", fontFamily: "'Georgia',serif", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>○</div>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(200,169,106,0.15)", border: "1px solid " + C.go, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginLeft: 2 }}>
            <polygon points="3,1 16,9 3,17" fill={C.go} />
          </svg>
        </div>
        <div style={{ fontFamily: "'Georgia',serif", fontSize: 16, color: C.cr, marginBottom: 8 }}>Video demo coming soon</div>
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: C.sl, lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
          Real footage of {movement.name} is being filmed and will replace this. For now, lean on the cues and common mistakes above — they cover what the video will show.
        </div>
      </div>
    </div>
  );
}

// Small reusable SVG play triangle for non-demo "start" affordances (e.g.
// the session Start button) — same rationale as above, avoid unicode ▶.
export function PlayIcon({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polygon points="3,1 16,9 3,17" fill={color} />
    </svg>
  );
}

// Compact "coming soon" thumbnail for exercise rows (session intro list,
// Player active header) — same honest slot as ExerciseDemoComingSoon above,
// sized for a row rather than a full detail card. Josh's filmed clips drop
// into this same slot once available.
export function ExerciseThumbnailSlot({ size = 40 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: C.gd, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <PlayIcon color={C.go} size={Math.round(size * 0.28)} />
    </div>
  );
}
