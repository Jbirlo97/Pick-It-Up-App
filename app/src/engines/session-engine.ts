import { MDB, MOVS } from "../data/exercises-legacy";
import { CONSISTENCY_LINES, PILLARS, QUOTES } from "../data/content";
import { mapEquipmentToEngineAccess } from "../lib/equipmentAccess";
import { getDefaultCooldownPractice, regulationPracticeToMovement } from "../lib/regulationAdapter";
import type {
  AiInsight,
  CheckInData,
  DetailedSession,
  DetailedSessionExercise,
  FlaggedMovement,
  Movement,
  PlayerSession,
  ReadinessTrend,
  SessionHistoryEntry,
  SessionExercise,
  Tone,
  TrainingLocation,
  WeeklyDigest,
} from "../types";

// ---------------------------------------------------------------------------
// AI LAYER — currently running in DETERMINISTIC MODE (no API calls).
// callClaude is kept here (commented out) so the app can reactivate AI
// features in one focused pass when ready. To reconnect: uncomment
// callClaude, then swap getInsight / getSession / getDigest back to their AI
// versions (see docs/backend-brief.md for the full reactivation plan
// including the Supabase Edge Function proxy that should hold the API key
// server-side). Do NOT reactivate without an explicit decision to do so.
// ---------------------------------------------------------------------------

/*
async function callClaude(system: string, userMsg: string, tokens?: number) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: tokens || 1000,
      system: system,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await r.json();
  const block = data.content && data.content.find((b: any) => b.type === "text");
  const text = block ? block.text : "{}";
  return text.replace(/```json|```/g, "").trim();
}
*/

export function checkMovementContraindications(movement: Movement, injuryFlags: string[]) {
  if (!injuryFlags || injuryFlags.length === 0) return { blocked: false, matches: [] as string[] };
  const matches = movement.contra.filter((c) =>
    injuryFlags.some((flag) => c.toLowerCase().includes(flag.toLowerCase()))
  );
  return { blocked: matches.length > 0, matches };
}

export function detectReadinessTrendDeterministic(
  sessionHistory: SessionHistoryEntry[] | undefined,
  windowSize?: number
): ReadinessTrend {
  const win = windowSize || 3;
  const recent = (sessionHistory || []).slice(-win).map((s) => s.readiness);
  if (recent.length < 2) return "unknown";
  const diffs: number[] = [];
  for (let i = 1; i < recent.length; i++) diffs.push(recent[i] - recent[i - 1]);
  const allUp = diffs.every((d) => d > 0);
  const allDown = diffs.every((d) => d < 0);
  const allFlat = diffs.every((d) => d === 0);
  if (allFlat) return "stable";
  if (allUp) return "improving";
  if (allDown) return "declining";
  return "volatile";
}

interface DeterministicSessionContext {
  readiness: number;
  injuryFlags?: string[];
  sessionHistory?: SessionHistoryEntry[];
  trainingLocation?: TrainingLocation;
  equipment?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// Body-region tags shared by MDB `tags` — used to match warm-up/cool-down
// mobility work to whatever the generated main session actually trains
// (docs/session-structure-spec.md §1), rather than picking at random.
const BODY_REGION_TAGS = ["lower", "upper", "core", "full body", "back"];

function dominantBodyRegion(movements: Movement[]): string | null {
  const counts: Record<string, number> = {};
  movements.forEach((m) => m.tags.forEach((t) => { if (BODY_REGION_TAGS.includes(t)) counts[t] = (counts[t] || 0) + 1; }));
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return ranked.length ? ranked[0][0] : null;
}

// Curated bodyweight "raise" candidates for the warm-up (spec's own examples:
// jumping jacks / jump rope / march in place) — a narrow hand-picked set
// rather than a broad tag filter, since not every "power" tagged movement
// (e.g. squat jumps) is an appropriate easy cardio raise.
const RAISE_KEYS = ["jump_rope", "mountain_climber"];

// Excluded from the mobility/stretch pool: it's a breathing exercise, and
// the cool-down already always closes with one (the Regulate practice
// below) — including both would read as a redundant double breathing beat.
const MOBILITY_POOL_EXCLUDE_NAMES = [MDB.breath_work.name];

function filterSafe(pool: Movement[], injuryFlags: string[], flagged: FlaggedMovement[], seen: Set<string>): Movement[] {
  const safe: Movement[] = [];
  pool.forEach((m) => {
    const check = checkMovementContraindications(m, injuryFlags);
    if (check.blocked) {
      if (!seen.has(m.name)) { seen.add(m.name); flagged.push({ movement: m, matchedInjuries: check.matches }); }
    } else {
      safe.push(m);
    }
  });
  return safe;
}

function toDetailedExercise(m: Movement, sets: number, reps: string): DetailedSessionExercise {
  return { name: m.name, sets, reps, cue: m.cues[0], contra: m.contra };
}

// Warm-up (bodyweight-first, no machine assumptions) + cool-down mobility
// picks, matched to the body region the main session trains. Any pool
// candidate blocked by an injury flag is folded into the same `flagged`
// list the main pool uses, so "worked around your flags" stays honest
// about warm-up/cool-down exclusions too, not just the main workout.
function selectWarmupAndCooldown(mainMovements: Movement[], injuryFlags: string[], readiness: number, flagged: FlaggedMovement[], seenNames: Set<string>) {
  const usedInMain = new Set(mainMovements.map((m) => m.name));
  const region = dominantBodyRegion(mainMovements);

  const mobilityPoolRaw = MOVS.filter((m) => m.equipment === "Bodyweight" && m.tags.includes("mobility") && !usedInMain.has(m.name) && !MOBILITY_POOL_EXCLUDE_NAMES.includes(m.name));
  const mobilityPool = filterSafe(mobilityPoolRaw, injuryFlags, flagged, seenNames);
  const regionPool = region ? mobilityPool.filter((m) => m.tags.includes(region)) : [];
  const activationPool = shuffle(regionPool.length ? regionPool : mobilityPool);

  const raisePoolRaw = RAISE_KEYS.map((k) => MDB[k]).filter((m): m is Movement => !!m && !usedInMain.has(m.name));
  const raisePool = shuffle(filterSafe(raisePoolRaw, injuryFlags, flagged, seenNames));

  const warmupMovs: Movement[] = [];
  if (readiness > 2 && raisePool.length) warmupMovs.push(raisePool[0]);
  activationPool.forEach((m) => {
    if (warmupMovs.length < 2 && !warmupMovs.some((w) => w.name === m.name)) warmupMovs.push(m);
  });

  const warmupNames = new Set(warmupMovs.map((m) => m.name));
  const cooldownPool = shuffle(mobilityPool.filter((m) => !warmupNames.has(m.name)));
  const cooldownMovs = cooldownPool.slice(0, 2);

  return { warmupMovs, cooldownMovs };
}

// SAFETY (non-negotiable, see CLAUDE.md): contraindicated movements are
// removed from the selection pool, not just listed. The flagged list is
// returned so the UI can tell the user what was worked around and why.
// Never let a flagged movement be served; never make the exclusion silent.
//
// Equipment filtering: a bodyweight-only user must never be served a
// movement requiring equipment they don't have — this is a functional
// safety concern (attempting an exercise without the right equipment),
// not just a UX nicety, so it's handled with the same rigor as the
// contraindication filter above, not layered on as an afterthought.
export function generateDeterministicSession(context: DeterministicSessionContext): DetailedSession {
  const readiness = context.readiness || 3;
  const injuryFlags = context.injuryFlags || [];
  const trend = detectReadinessTrendDeterministic(context.sessionHistory);
  const equipmentAccess = mapEquipmentToEngineAccess(context.trainingLocation || "bodyweight", context.equipment || []);

  let pool = MOVS.filter((m) => m.equipment === "Bodyweight" || equipmentAccess.includes(m.equipment));
  if (readiness <= 2) pool = pool.filter((m) => m.tier === 1);
  else if (readiness === 3) pool = pool.filter((m) => m.tier <= 2);

  const flagged: FlaggedMovement[] = [];
  const seenNames = new Set<string>();
  pool.forEach((m) => {
    const check = checkMovementContraindications(m, injuryFlags);
    if (check.blocked && !seenNames.has(m.name)) { seenNames.add(m.name); flagged.push({ movement: m, matchedInjuries: check.matches }); }
  });
  const flaggedNames = flagged.map((f) => f.movement.name);
  const safePool = pool.filter((m) => !flaggedNames.includes(m.name));

  let exerciseCount = readiness <= 2 ? 2 : readiness === 3 ? 3 : readiness === 4 ? 4 : 5;
  let sets = readiness <= 2 ? 2 : readiness >= 4 ? 4 : 3;
  if (trend === "declining" && exerciseCount > 2) exerciseCount -= 1;
  if (trend === "volatile" && sets > 2) sets -= 1;
  if (exerciseCount > safePool.length) exerciseCount = safePool.length;

  const mainMovements = shuffle(safePool).slice(0, exerciseCount);
  const main = mainMovements.map((m) => toDetailedExercise(m, sets, readiness <= 2 ? "easy, 10-12" : "10"));

  const { warmupMovs, cooldownMovs } = selectWarmupAndCooldown(mainMovements, injuryFlags, readiness, flagged, seenNames);
  const warmup = warmupMovs.map((m) => toDetailedExercise(m, 1, m.tags.includes("power") ? "1-2 min" : "8-10 each side"));
  const cooldown = cooldownMovs.map((m) => toDetailedExercise(m, 1, "30-45s each side"));

  return { main, warmup, cooldown, flagged, trend, readiness };
}

interface GetInsightArgs {
  tone: Tone;
  checkIn: CheckInData;
  userName?: string;
  christianLens?: boolean;
  sex?: string;
}

// DETERMINISTIC INSIGHT — selects content from curated pools based on
// actual check-in scores. Pillar selection is score-driven, not random.
// Movement suggestions are readiness-calibrated. Reflections are
// tone-branched. Christian lens shows scripture in the UI via PILLARS data
// (no function change needed — PillarDetail and Today's Focus handle it).
export function getInsight(args: GetInsightArgs): AiInsight {
  const tone = args.tone || "Balanced";
  const checkIn = args.checkIn;
  const r = checkIn.readiness;
  const sl = checkIn.sleep;
  const m = checkIn.mood;
  const st = checkIn.stress;

  const avg = (r + sl + m + (6 - st)) / 4;
  let pillarName: string;
  if (st >= 4) {
    pillarName = "Radical Responsibility";
  } else if (r <= 2 || sl <= 2) {
    pillarName = "The Trickle";
  } else if (m <= 2) {
    pillarName = "Thrownness";
  } else if (avg >= 4) {
    pillarName = "Projection";
  } else {
    const cycle = new Date().getDate() % 4;
    pillarName = ["Thrownness", "Radical Responsibility", "The Trickle", "Projection"][cycle];
  }

  const matchingQuotes = QUOTES.filter((q) => q.pillar === pillarName);
  const quote = matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)];

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const consistencyLine = CONSISTENCY_LINES[dayOfYear % CONSISTENCY_LINES.length];

  let message: string;
  if (tone === "Stoic") {
    message =
      r <= 2
        ? "Readiness is low. That changes the instruction, not whether you show up. " + consistencyLine
        : st >= 4
          ? "Stress is high. The controllables are still yours. " + consistencyLine
          : "Check-in logged. " + consistencyLine;
  } else if (tone === "Empathic") {
    message =
      r <= 2
        ? "Lower energy today — that's real information, not a failure. " + consistencyLine
        : sl <= 2
          ? "Rest was rough. Be honest with yourself about what today asks for. " + consistencyLine
          : m <= 2
            ? "Mood is its own kind of weather. You still showed up and checked in. " + consistencyLine
            : "You're in a solid place today. " + consistencyLine;
  } else {
    message =
      r <= 2
        ? "Low readiness day. Adjust, don't cancel. " + consistencyLine
        : avg >= 4
          ? "Strong day across the board — use it well. " + consistencyLine
          : "Check-in recorded. " + consistencyLine;
  }

  let movement: string;
  if (r <= 1) {
    movement = "Rest and a 10-minute walk outside if you can manage it. Full recovery counts.";
  } else if (r === 2) {
    movement = "Gentle movement only today — mobility work, a slow walk, or light stretching.";
  } else if (r === 3) {
    movement =
      st >= 4
        ? "A moderate session, then a regulation practice from the Regulate tab to bring stress down."
        : "A steady, moderate session. Nothing heroic today — just consistent.";
  } else if (r === 4) {
    movement = "Good readiness. A solid session is right — push within your current program.";
  } else {
    movement = "Strong readiness. This is a day to train with intent. Make it count.";
  }

  const reflections: Record<string, Record<string, string>> = {
    Thrownness: {
      Stoic: "What did you not choose — and what will you do with it anyway?",
      Empathic: "What's something you were handed that you're still learning to work with?",
      Balanced: "What's one thing outside your control that you've been trying to carry?",
    },
    "Radical Responsibility": {
      Stoic: "What is in your control right now?",
      Empathic: "Where are you still waiting for someone else to fix something you could move on?",
      Balanced: "What's one thing today you could own rather than observe?",
    },
    "The Trickle": {
      Stoic: "What is the smallest thing that still counts?",
      Empathic: "What would showing up imperfectly look like today — and is that enough?",
      Balanced: "What does consistency look like on a day like this one?",
    },
    Projection: {
      Stoic: "Who are you becoming? Is today's action aligned with that?",
      Empathic: "What does the version of you six months from now wish you'd done today?",
      Balanced: "What's one small thing today that closes the distance to who you're becoming?",
    },
  };
  const reflection = reflections[pillarName][tone] || reflections[pillarName]["Balanced"];

  return {
    message,
    movement,
    reflection,
    pillar: pillarName,
    quote: quote ? quote.text : consistencyLine,
  };
}

interface GetSessionArgs {
  tone: Tone;
  checkIn: CheckInData | null;
  week: number;
  equipment: string[];
  trainingLocation?: TrainingLocation;
  injuries: string[];
  sessionHistory: SessionHistoryEntry[];
  christianLens: boolean;
  userName: string;
}

// DETERMINISTIC SESSION — wraps generateDeterministicSession output into the
// exact shape the Player component expects, so the UI needs no changes.
export function getSession(args: GetSessionArgs): PlayerSession {
  const checkIn = args.checkIn || { readiness: 3, sleep: 3, mood: 3, stress: 3 };
  const readiness = checkIn.readiness || 3;
  const result = generateDeterministicSession({
    readiness,
    injuryFlags: args.injuries || [],
    sessionHistory: args.sessionHistory || [],
    trainingLocation: args.trainingLocation || "bodyweight",
    equipment: args.equipment || [],
  });

  const tonePrefix = args.tone === "Stoic" ? "Logged. " : args.tone === "Empathic" ? "Here's what today looks like. " : "";

  const rationale =
    readiness <= 2
      ? tonePrefix + "Readiness is low. This session is minimal on purpose — showing up gently counts."
      : readiness === 3
        ? tonePrefix + "Moderate readiness. A steady, sustainable session."
        : tonePrefix + "Strong readiness. Built to match it.";

  const mainMinutes = readiness <= 2 ? 5 : 8;
  const toSessionExercise = (m: { name: string; sets: number; reps: string; cue: string }, phase: SessionExercise["phase"], estMinutes: number): SessionExercise => {
    const movKey = Object.keys(MDB).find((k) => MDB[k].name === m.name);
    return {
      movementKey: movKey || "goblet_squat",
      movement: MDB[movKey || "goblet_squat"],
      sets: m.sets,
      reps: m.reps,
      rest: readiness <= 2 ? 30 : 60,
      coachNote: m.cue || "",
      phase,
      estMinutes,
    };
  };

  const warmup = result.warmup.map((m) => toSessionExercise(m, "warmup", 2));
  const main = result.main.map((m) => toSessionExercise(m, "main", mainMinutes));
  const cooldownStretches = result.cooldown.map((m) => toSessionExercise(m, "cooldown", 2));
  const breathPractice = getDefaultCooldownPractice();
  const breathExercise: SessionExercise = {
    movementKey: "regulate_" + breathPractice.id,
    movement: regulationPracticeToMovement(breathPractice),
    sets: 1,
    reps: `${breathPractice.durationMin} min`,
    rest: 0,
    coachNote: "Downshift — from your Regulate library.",
    phase: "cooldown",
    estMinutes: breathPractice.durationMin,
  };
  const cooldown = [...cooldownStretches, breathExercise];
  const exercises = [...warmup, ...main, ...cooldown];

  return {
    sessionTitle: readiness <= 2 ? "Rest & Restore" : readiness >= 4 ? "Strong Session" : "Foundation Session",
    sessionRationale: rationale,
    coachCue: "Every rep is a vote for who you're becoming.",
    estimatedMinutes: exercises.reduce((sum, e) => sum + e.estMinutes, 0),
    exercises,
    phases: { warmup, main, cooldown },
    flaggedExercises: result.flagged,
    trend: result.trend,
  };
}

interface GetDigestArgs {
  sessionHistory: SessionHistoryEntry[];
  week: number;
  tone: Tone;
}

// DETERMINISTIC DIGEST — weekly summary from session count and pillar pool.
// Returns the same shape as the AI version so the UI needs no changes.
export function getDigest(args: GetDigestArgs): WeeklyDigest {
  const done = (args.sessionHistory || []).slice(-7).filter((s) => s.completed).length;
  const week = args.week || 1;
  const tone = args.tone || "Balanced";
  const pillar = PILLARS[week % 4];

  const headlines = [
    "You showed up this week.",
    "Another week in the trickle.",
    "Small things, stacking up.",
    "Consistency over perfection.",
    "One more week of building.",
  ];
  const headline = headlines[done >= 3 ? 0 : done >= 2 ? 1 : 2];

  const body =
    done >= 3
      ? "You hit your sessions this week. That's not nothing — that's the whole thing. The Trickle compounds exactly like this, session by session, week by week."
      : done >= 2
        ? "Not a full week, but not nothing either. Two sessions is two more than zero. The trickle doesn't stop just because one week is harder than another."
        : done === 1
          ? "One session. Lower than you'd probably like, and also: one session is one session. It happened. It counts."
          : "This week was what it was. The app is here next week. So are you.";

  const confidence =
    tone === "Stoic"
      ? "You are building. The results follow the reps, not the other way around."
      : tone === "Empathic"
        ? "Every week you come back to this is a vote for who you're becoming. That matters more than the number."
        : "Consistency isn't about perfect weeks. It's about more weeks than not.";

  return {
    headline,
    body,
    confidence,
    pillar: pillar.name,
    nextWeekIntent: done >= 3 ? "Keep the streak. Same target, same commitment." : "Three sessions next week. That's it. Just three.",
  };
}
