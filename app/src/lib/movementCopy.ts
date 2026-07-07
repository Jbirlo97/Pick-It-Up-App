import type { Movement } from "../types";

export function expandCue(cueText: string, mov: Movement) {
  const muscleNote = mov.muscles
    ? "This is keeping tension on your " + mov.muscles.toLowerCase() + " through the rep rather than letting another muscle group take over."
    : "";
  return {
    headline: cueText,
    detail: "Why it matters: " + muscleNote + " Think of it as the difference between doing the movement and doing the exercise — the cue is what makes it count.",
    tryThis: "Slow the rep down and check this specific position before adding speed or load back in.",
  };
}

export function expandError(errorText: string, mov: Movement) {
  const parts = errorText.split("—");
  const whatItLooksLike = parts[0] ? parts[0].trim() : errorText;
  const fix = parts[1] ? parts[1].trim() : "Slow down and reset the position before continuing.";
  return {
    headline: whatItLooksLike,
    detail: "This usually shows up when fatigue, speed, or unfamiliarity with the movement causes a shortcut. It doesn't mean you're doing it wrong overall — just that this rep needs a small correction.",
    fix: "Fix: " + fix + (mov.regression ? " If it keeps happening, " + mov.regression.toLowerCase() + " is a good regression to rebuild the pattern." : ""),
  };
}
