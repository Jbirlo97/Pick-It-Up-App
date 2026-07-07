import { EXERCISES, type ExerciseV2 } from "../data/exercises-v2";
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

export function checkContraindications(exercise: ExerciseV2, injuryFlags: string[]) {
  if (!injuryFlags || injuryFlags.length === 0) return { blocked: false, matches: [] as string[] };
  const matches = exercise.contraindications.filter((c) => injuryFlags.some((flag) => c.toLowerCase().includes(flag.toLowerCase())));
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
  regulation: ProgramPrescription[];
  flaggedExercises: FlaggedExerciseV2[];
  readiness: number;
  trend: ReadinessTrend;
}

export function generateProgram(context: ProgramContext): Program {
  const { readiness = 3, stress = 3, injuryFlags = [] } = context;
  const trend = detectReadinessTrend(context.sessionHistory);

  // Step 1-2: start with all exercises, filter by equipment/environment
  const equipmentFiltered = EXERCISES.filter((ex) => ex.equipment === "Bodyweight" || (context.equipmentAccess || []).includes(ex.equipment));

  // SAFETY: exclude contraindicated exercises from the pool entirely (see
  // module header note) rather than scoring and flag-and-confirming them.
  const flaggedExercises: FlaggedExerciseV2[] = [];
  equipmentFiltered.forEach((ex) => {
    const contra = checkContraindications(ex, injuryFlags);
    if (contra.blocked) flaggedExercises.push({ exercise: ex, matchedInjuries: contra.matches });
  });
  const flaggedIds = flaggedExercises.map((f) => f.exercise.exercise_id);
  const safePool = equipmentFiltered.filter((ex) => !flaggedIds.includes(ex.exercise_id));

  const scored = safePool.map((ex) => ({ ex, ...scoreExercise(ex, context) }));
  scored.sort((a, b) => b.score - a.score);

  const warmupPool = scored.filter((s) => s.ex.nervous_system_effect === "Regulating" || s.ex.pattern === "Mobility");
  const mainPool = scored.filter((s) => s.ex.pattern !== "Mobility" && s.ex.pattern !== "Recovery");
  const regulationPool = scored.filter((s) => s.ex.nervous_system_effect === "Regulating");

  let exerciseCount = context.exerciseCount || (readiness <= 2 ? 2 : readiness === 3 ? 3 : readiness === 4 ? 4 : 5);
  let setsForReadiness = readiness <= 2 ? 2 : readiness >= 4 ? 4 : 3;
  if (trend === "declining" && exerciseCount > 2) exerciseCount -= 1;
  if (trend === "volatile" && setsForReadiness > 2) setsForReadiness -= 1;
  if (exerciseCount > mainPool.length) exerciseCount = mainPool.length;

  const warmup = warmupPool.slice(0, 1).map((s) => buildPrescription(s.ex, 1, "2 min"));
  const main = mainPool.slice(0, exerciseCount).map((s) => buildPrescription(s.ex, setsForReadiness, readiness <= 2 ? "easy, 10-12" : "10"));
  const regulation = stress >= 4 ? regulationPool.slice(0, 1).map((s) => buildPrescription(s.ex, 1, "3-5 min")) : [];

  return { warmup, main, regulation, flaggedExercises, readiness, trend };
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
  const allPrescriptions = [...program.warmup, ...program.main, ...program.regulation];

  const exercises: SessionExercise[] = allPrescriptions.map((p) => {
    const full = EXERCISES.find((e) => e.exercise_id === p.exercise_id);
    const movement = full
      ? exerciseV2ToMovement(full)
      : { name: p.name, tier: 1 as const, tags: [], muscles: "", primary: [], cues: [p.coach_cue], errors: [], regression: p.makeEasier, progression: p.swapOption, contra: [] };
    return {
      movementKey: p.exercise_id,
      movement,
      sets: p.sets,
      reps: p.reps,
      rest: readiness <= 2 ? 30 : 60,
      coachNote: p.coach_cue,
    };
  });

  return {
    sessionTitle: readiness <= 2 ? "Detailed Session — Rest & Restore" : readiness >= 4 ? "Detailed Session — Strong" : "Detailed Session — Foundation",
    sessionRationale: "Built from your goal, experience level, equipment, and today's readiness — includes a warm-up and, when stress is logged high, a regulation finisher.",
    coachCue: "Every rep is a vote for who you're becoming.",
    estimatedMinutes: exercises.length * (readiness <= 2 ? 5 : 8),
    exercises,
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
