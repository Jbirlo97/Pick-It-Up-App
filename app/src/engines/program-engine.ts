import { EXERCISES, type ExerciseV2 } from "../data/exercises-v2";
import { getDefaultCooldownPractice, regulationPracticeToMovement } from "../lib/regulationAdapter";
import type { Movement, PlayerSession, ReadinessTrend, SessionExercise, SessionHistoryEntry } from "../types";

/**
 * Program Engine — deterministic "Detailed Session" generator (additive,
 * see docs/integration-spec.md Section 3b).
 *
 * SAFETY NOTE — deliberate deviation from the original program-engine-data.js
 * reference: that file's generateProgram() scored contraindicated exercises
 * normally and only asked for a one-tap acknowledgment before serving them
 * ("flag-and-confirm, not silent block"). CLAUDE.md's non-negotiable safety
 * rule (written for the existing generateDeterministicSession) is stricter:
 * "Never let a flagged movement be served; never make the exclusion
 * silent." Per an explicit product decision, this port follows the
 * stricter rule — flagged exercises are excluded from the pool entirely,
 * and the warning UI is informational only ("worked around your flags"),
 * never a gate that can let a flagged exercise through.
 */

export const USER_INPUT_SCHEMA = {
  primaryGoal: { type: "single", options: ["Strength", "Consistency", "Mood support", "Confidence", "Stress management"] },
  experienceLevel: { type: "single", options: ["Beginner", "Intermediate", "Advanced"] },
  // Extended per integration-spec.md Section 4: the live app's equipment
  // list is more specific than the original engine's, so it's added here
  // rather than downgrading the live app's data.
  equipmentAccess: {
    type: "multi",
    options: ["None", "Bands", "Dumbbells", "Home gym", "Commercial gym", "Barbell", "Bench", "Pull-up bar", "Kettlebell", "Cable machine", "Squat rack"],
  },
  trainingDays: { type: "number", range: [2, 6] },
  sessionLength: { type: "single", options: [15, 30, 45, 60] },
  injuryFlags: { type: "multi", options: ["Shoulder", "Back", "Knee", "Hip", "Ankle", "Wrist", "Neck"] },
  movementPreference: { type: "multi", options: ["Gym", "Home", "Walking", "Machines", "Free weights"] },
  readiness: { type: "rating", range: [1, 5] },
  sleep: { type: "rating", range: [1, 5] },
  mood: { type: "rating", range: [1, 5] },
  stress: { type: "rating", range: [1, 5] },
  tonePreference: { type: "single", options: ["Stoic", "Balanced", "Empathic"] },
} as const;

export const SCORING_RULES = {
  EQUIPMENT_MATCH: 30,
  GOAL_MATCH: 25,
  DIFFICULTY_MATCH: 20,
  PREFERENCE_MATCH: 10,
  LOW_CONFIDENCE_DEMAND: 10,
  REGULATION_MATCH: 10,
  HIGH_COMPLEXITY_FOR_BEGINNER: -20,
  HIGH_ENERGY_LOW_READINESS: -15,
} as const;

const GOAL_PATTERN_AFFINITY: Record<string, string[]> = {
  Strength: ["Squat/Hinge", "Push/Pull", "Power"],
  Consistency: ["Squat/Hinge", "Push/Pull", "Core", "Full Body"],
  "Mood support": ["Mobility", "Recovery", "Full Body"],
  Confidence: ["Squat/Hinge", "Push/Pull", "Core"],
  "Stress management": ["Mobility", "Recovery"],
};

export interface ProgramContext {
  equipmentAccess?: string[];
  primaryGoal?: string;
  experienceLevel?: string;
  movementPreference?: string[];
  readiness?: number;
  stress?: number;
  injuryFlags?: string[];
  sessionHistory?: SessionHistoryEntry[];
  exerciseCount?: number;
}

// Per docs/trainer-review-findings.md §1: exact key equality against the
// canonical injury vocabulary (data/injuries.ts) — see
// checkMovementContraindications in session-engine.ts for the full
// rationale (substring matching silently never matched "lower back"
// against "acute low back pain").
export function checkContraindications(exercise: ExerciseV2, injuryFlags: string[]) {
  if (!injuryFlags || injuryFlags.length === 0) return { blocked: false, matches: [] as string[] };
  const matches = exercise.contraindications.filter((c) => injuryFlags.includes(c));
  return { blocked: matches.length > 0, matches };
}

export function scoreExercise(exercise: ExerciseV2, context: ProgramContext) {
  const {
    equipmentAccess = [],
    primaryGoal,
    experienceLevel,
    movementPreference = [],
    readiness = 3,
    stress = 3,
  } = context;

  const breakdown: Record<string, number | string[]> = {};
  let score = 0;

  const equipmentOk = exercise.equipment === "Bodyweight" || equipmentAccess.includes(exercise.equipment);
  if (equipmentOk) {
    score += SCORING_RULES.EQUIPMENT_MATCH;
    breakdown.equipmentMatch = SCORING_RULES.EQUIPMENT_MATCH;
  }

  const goalPatterns = (primaryGoal && GOAL_PATTERN_AFFINITY[primaryGoal]) || [];
  if (goalPatterns.includes(exercise.pattern)) {
    score += SCORING_RULES.GOAL_MATCH;
    breakdown.goalMatch = SCORING_RULES.GOAL_MATCH;
  }

  if (exercise.difficulty === experienceLevel) {
    score += SCORING_RULES.DIFFICULTY_MATCH;
    breakdown.difficultyMatch = SCORING_RULES.DIFFICULTY_MATCH;
  }

  if (movementPreference.some((p) => exercise.environment.toLowerCase().includes(p.toLowerCase()) || exercise.equipment.toLowerCase().includes(p.toLowerCase()))) {
    score += SCORING_RULES.PREFERENCE_MATCH;
    breakdown.preferenceMatch = SCORING_RULES.PREFERENCE_MATCH;
  }

  if (experienceLevel === "Beginner" && exercise.confidence_demand === "Low") {
    score += SCORING_RULES.LOW_CONFIDENCE_DEMAND;
    breakdown.lowConfidenceBonus = SCORING_RULES.LOW_CONFIDENCE_DEMAND;
  }

  if (stress >= 4 && (exercise.nervous_system_effect === "Regulating" || exercise.nervous_system_effect === "Neutral")) {
    score += SCORING_RULES.REGULATION_MATCH;
    breakdown.regulationMatch = SCORING_RULES.REGULATION_MATCH;
  }

  if (experienceLevel === "Beginner" && exercise.coordination_demand === "High") {
    score += SCORING_RULES.HIGH_COMPLEXITY_FOR_BEGINNER;
    breakdown.complexityPenalty = SCORING_RULES.HIGH_COMPLEXITY_FOR_BEGINNER;
  }

  if (readiness <= 2 && exercise.energy_demand === "High") {
    score += SCORING_RULES.HIGH_ENERGY_LOW_READINESS;
    breakdown.energyPenalty = SCORING_RULES.HIGH_ENERGY_LOW_READINESS;
  }

  return { score, breakdown };
}

// Improved over the main app's inline trend logic (which only compared
// first vs. last of the last 3 readiness scores — misses a true monotonic
// trend, e.g. 3,5,3 would read as "stable" when it's actually volatile).
// This checks the full short window for a consistent direction.
export function detectReadinessTrend(sessionHistory: SessionHistoryEntry[] | undefined, window = 3): ReadinessTrend {
  const recent = (sessionHistory || []).slice(-window).map((s) => s.readiness);
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

export interface ProgramPrescription {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  coach_cue: string;
  breath_cue: string;
  video_url: string;
  makeEasier: string;
  swapOption: string;
  pattern: string;
}

function buildPrescription(exercise: ExerciseV2, sets: number, reps: string): ProgramPrescription {
  return {
    exercise_id: exercise.exercise_id,
    name: exercise.name,
    sets,
    reps,
    coach_cue: exercise.coach_cue,
    breath_cue: exercise.breath_cue,
    video_url: exercise.video_url,
    makeEasier: exercise.regression || exercise.sub_1,
    swapOption: exercise.progression || exercise.sub_2,
    pattern: exercise.pattern,
  };
}

export interface FlaggedExerciseV2 {
  exercise: ExerciseV2;
  matchedInjuries: string[];
}

export interface Program {
  warmup: ProgramPrescription[];
  main: ProgramPrescription[];
  cooldown: ProgramPrescription[];
  flaggedExercises: FlaggedExerciseV2[];
  readiness: number;
  trend: ReadinessTrend;
}

// Body-region tags parsed from `subcategory` (e.g. "mobility, lower") — used
// to match warm-up/cool-down mobility picks to whatever the generated main
// session actually trains (docs/session-structure-spec.md §1).
const BODY_REGION_TAGS = ["lower", "upper", "core", "full body", "back"];

function subcategoryTags(ex: ExerciseV2): string[] {
  return ex.subcategory.split(",").map((s) => s.trim());
}

function dominantBodyRegion(exercises: ExerciseV2[]): string | null {
  const counts: Record<string, number> = {};
  exercises.forEach((ex) => subcategoryTags(ex).forEach((t) => { if (BODY_REGION_TAGS.includes(t)) counts[t] = (counts[t] || 0) + 1; }));
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return ranked.length ? ranked[0][0] : null;
}

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// Curated bodyweight "raise" candidates for the warm-up — same narrow,
// hand-picked set as the Quick Session engine (session-engine.ts), not a
// broad tag filter.
const RAISE_IDS = ["EX_JUMP_ROPE", "EX_MOUNTAIN_CLIMBER"];

// Excluded from the mobility/stretch pool: it's a breathing exercise, and
// the cool-down already always closes with one (the Regulate practice in
// getDetailedSession) — including both would read as a redundant double
// breathing beat.
const MOBILITY_POOL_EXCLUDE_IDS = ["EX_BREATH_WORK"];

export function generateProgram(context: ProgramContext): Program {
  const { readiness = 3, stress = 3, injuryFlags = [] } = context;
  const trend = detectReadinessTrend(context.sessionHistory);

  // Step 1-2: start with all exercises, filter by equipment/environment
  const equipmentFiltered = EXERCISES.filter((ex) => ex.equipment === "Bodyweight" || (context.equipmentAccess || []).includes(ex.equipment));

  // SAFETY: exclude contraindicated exercises from the pool entirely (see
  // module header note) rather than scoring and flag-and-confirming them.
  const flaggedExercises: FlaggedExerciseV2[] = [];
  const flaggedSeen = new Set<string>();
  equipmentFiltered.forEach((ex) => {
    const contra = checkContraindications(ex, injuryFlags);
    if (contra.blocked && !flaggedSeen.has(ex.exercise_id)) { flaggedSeen.add(ex.exercise_id); flaggedExercises.push({ exercise: ex, matchedInjuries: contra.matches }); }
  });
  const flaggedIds = flaggedExercises.map((f) => f.exercise.exercise_id);
  const safePool = equipmentFiltered.filter((ex) => !flaggedIds.includes(ex.exercise_id));

  const scored = safePool.map((ex) => ({ ex, ...scoreExercise(ex, context) }));
  scored.sort((a, b) => b.score - a.score);

  const mainPool = scored.filter((s) => s.ex.pattern !== "Mobility" && s.ex.pattern !== "Recovery");

  let exerciseCount = context.exerciseCount || (readiness <= 2 ? 2 : readiness === 3 ? 3 : readiness === 4 ? 4 : 5);
  let setsForReadiness = readiness <= 2 ? 2 : readiness >= 4 ? 4 : 3;
  if (trend === "declining" && exerciseCount > 2) exerciseCount -= 1;
  if (trend === "volatile" && setsForReadiness > 2) setsForReadiness -= 1;
  if (exerciseCount > mainPool.length) exerciseCount = mainPool.length;

  const mainExercises = mainPool.slice(0, exerciseCount).map((s) => s.ex);
  const main = mainExercises.map((ex) => buildPrescription(ex, setsForReadiness, readiness <= 2 ? "easy, 10-12" : "10"));

  const usedInMain = new Set(mainExercises.map((ex) => ex.exercise_id));
  const region = dominantBodyRegion(mainExercises);
  const mobilityPool = safePool.filter((ex) => ex.pattern === "Mobility" && !usedInMain.has(ex.exercise_id) && !MOBILITY_POOL_EXCLUDE_IDS.includes(ex.exercise_id));
  const regionPool = region ? mobilityPool.filter((ex) => subcategoryTags(ex).includes(region)) : [];
  const activationPool = shuffle(regionPool.length ? regionPool : mobilityPool);
  const raisePool = shuffle(safePool.filter((ex) => RAISE_IDS.includes(ex.exercise_id) && !usedInMain.has(ex.exercise_id)));

  const warmupExercises: ExerciseV2[] = [];
  if (readiness > 2 && raisePool.length) warmupExercises.push(raisePool[0]);
  activationPool.forEach((ex) => {
    if (warmupExercises.length < 2 && !warmupExercises.some((w) => w.exercise_id === ex.exercise_id)) warmupExercises.push(ex);
  });
  const warmup = warmupExercises.map((ex, i) => buildPrescription(ex, 1, RAISE_IDS.includes(ex.exercise_id) && i === 0 ? "1-2 min" : "8-10 each side"));

  const warmupIds = new Set(warmupExercises.map((ex) => ex.exercise_id));
  const cooldownMobility = shuffle(mobilityPool.filter((ex) => !warmupIds.has(ex.exercise_id))).slice(0, 2);
  // Bonus: an extra regulation-pattern exercise when stress is logged high,
  // on top of the cool-down that now always runs (see getDetailedSession's
  // closing breath practice) — preserves the old "extra help when stressed"
  // behavior without making the base cool-down conditional on stress.
  const cooldownIds = new Set(cooldownMobility.map((ex) => ex.exercise_id));
  const regulationBonus = stress >= 4 ? safePool.filter((ex) => ex.nervous_system_effect === "Regulating" && !usedInMain.has(ex.exercise_id) && !warmupIds.has(ex.exercise_id) && !cooldownIds.has(ex.exercise_id)).slice(0, 1) : [];
  const cooldown = [...cooldownMobility.map((ex) => buildPrescription(ex, 1, "30-45s each side")), ...regulationBonus.map((ex) => buildPrescription(ex, 1, "3-5 min"))];

  return { warmup, main, cooldown, flaggedExercises, readiness, trend };
}

function exerciseV2ToMovement(ex: ExerciseV2): Movement {
  return {
    name: ex.name,
    tier: ex.tier,
    tags: ex.subcategory.split(",").map((s) => s.trim()),
    muscles: ex.primary_muscles,
    primary: ex.primary_muscle_keys,
    cues: ex.all_cues,
    errors: ex.common_errors,
    regression: ex.regression,
    progression: ex.progression,
    contra: ex.contraindications,
    equipment: ex.equipment,
    note: ex.note,
  };
}

// Adapter: wraps generateProgram's output into the exact shape Player
// expects, the same way getSession() wraps generateDeterministicSession —
// so "Detailed Session" is actually playable, unlike the prototype's
// inline preview (which was explicitly marked "not yet wired to the
// session player in this demo").
export function getDetailedSession(context: ProgramContext): PlayerSession {
  const program = generateProgram(context);
  const readiness = context.readiness || 3;
  const mainMinutes = readiness <= 2 ? 5 : 8;

  const toSessionExercise = (p: ProgramPrescription, phase: SessionExercise["phase"], estMinutes: number): SessionExercise => {
    const full = EXERCISES.find((e) => e.exercise_id === p.exercise_id);
    const movement = full
      ? exerciseV2ToMovement(full)
      : { name: p.name, tier: 1 as const, tags: [], muscles: "", primary: [], cues: [p.coach_cue], errors: [], regression: p.makeEasier, progression: p.swapOption, contra: [], equipment: "Bodyweight" };
    return {
      movementKey: p.exercise_id,
      movement,
      sets: p.sets,
      reps: p.reps,
      rest: readiness <= 2 ? 30 : 60,
      coachNote: p.coach_cue,
      phase,
      estMinutes,
    };
  };

  const warmup = program.warmup.map((p) => toSessionExercise(p, "warmup", 2));
  const main = program.main.map((p) => toSessionExercise(p, "main", mainMinutes));
  const cooldownPrescriptions = program.cooldown.map((p) => toSessionExercise(p, "cooldown", 2));
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
  const cooldown = [...cooldownPrescriptions, breathExercise];
  const exercises = [...warmup, ...main, ...cooldown];

  return {
    sessionTitle: readiness <= 2 ? "Detailed Session — Rest & Restore" : readiness >= 4 ? "Detailed Session — Strong" : "Detailed Session — Foundation",
    sessionRationale: "Built from your goal, experience level, equipment, and today's readiness — includes a warm-up and a cool-down that always closes with a Regulate breath practice.",
    coachCue: "Every rep is a vote for who you're becoming.",
    estimatedMinutes: exercises.reduce((sum, e) => sum + e.estMinutes, 0),
    exercises,
    phases: { warmup, main, cooldown },
    flaggedExercises: program.flaggedExercises.map((f) => ({ movement: exerciseV2ToMovement(f.exercise), matchedInjuries: f.matchedInjuries })),
    trend: program.trend,
  };
}

export interface SessionFeedbackPayload {
  session_id: string;
  completed: boolean;
  RPE: number;
  notes: string;
  pain_flags: string[];
}

export function buildSessionFeedbackPayload({
  sessionId,
  completed,
  rpe,
  notes,
  painFlags,
}: {
  sessionId: string;
  completed: boolean;
  rpe: number;
  notes?: string;
  painFlags?: string[];
}): SessionFeedbackPayload {
  return { session_id: sessionId, completed, RPE: rpe, notes: notes || "", pain_flags: painFlags || [] };
}
