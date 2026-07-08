export type Tone = "Stoic" | "Balanced" | "Empathic";
export type Unit = "metric" | "imperial";
export type Sex = "male" | "female" | "unspecified" | "";
export type TrainingLocation = "bodyweight" | "home" | "commercial";

export interface BodyStats {
  weight: string;
  height: string;
  age: string;
  waist?: string;
  unit: Unit;
  sex: Sex;
}

export interface CheckInData {
  readiness: number;
  sleep: number;
  mood: number;
  stress: number;
}

export interface AiInsight {
  message: string;
  movement: string;
  reflection: string;
  pillar: string;
  quote: string;
}

// Per docs/session-structure-spec.md §3 v1: one logged set. `prescribedReps`
// is captured at logging time (parsed from the exercise's `reps` text) so
// v1.5 progression can later tell "did they hit the target" without
// re-deriving it from history. `weight` is present only when the user
// entered one (equipment movements only — bodyweight logs reps alone).
export interface SetLogEntry {
  reps: number;
  prescribedReps: number | null;
  weight?: number;
}

// Compact per-exercise history record — deliberately smaller than
// SessionExercise (no cues/errors/contra) since this is what gets persisted
// in SessionHistoryEntry across many sessions.
export interface ExerciseLogEntry {
  movementKey: string;
  name: string;
  equipment: string;
  setsLogged: SetLogEntry[];
}

export interface SessionHistoryEntry {
  date: string;
  readiness: number;
  completed: boolean;
  exercises?: ExerciseLogEntry[];
}

export type SessionPhase = "warmup" | "main" | "cooldown";

export interface SessionExercise {
  movementKey: string;
  movement: Movement;
  sets: number;
  reps: string;
  rest: number;
  coachNote: string;
  phase: SessionPhase;
  estMinutes: number;
  setsLogged?: SetLogEntry[];
  // Per docs/session-structure-spec.md §4: exercises sharing the same
  // `group` id are a superset, meant to be rendered visually linked with a
  // SUPERSET label. Data-model only for now — nothing assigns this yet and
  // no Player UI reads it; the spec explicitly defers the player UI to a
  // later pass ("ship the data-model support now").
  group?: string;
}

export interface FlaggedMovement {
  movement: Movement;
  matchedInjuries: string[];
}

export interface PlayerSession {
  sessionTitle: string;
  sessionRationale: string;
  coachCue: string;
  estimatedMinutes: number;
  exercises: SessionExercise[];
  phases: { warmup: SessionExercise[]; main: SessionExercise[]; cooldown: SessionExercise[] };
  flaggedExercises: FlaggedMovement[];
  trend: ReadinessTrend;
}

export type ReadinessTrend = "improving" | "declining" | "stable" | "volatile" | "unknown";

export interface Movement {
  name: string;
  tier: 1 | 2 | 3;
  tags: string[];
  muscles: string;
  primary: string[];
  cues: string[];
  errors: string[];
  regression: string;
  progression: string;
  contra: string[];
  // "Bodyweight" for the original library; a specific piece of equipment
  // (e.g. "Dumbbells", "Barbell", "Squat rack") for anything requiring it —
  // see docs/integration-spec.md Section 4's equipment mapping.
  equipment: string;
}

export interface Meal {
  id: number | string;
  name: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
  time: string;
}

export interface SleepEntry {
  date: string;
  hours: number;
  quality: number;
}

export interface Sobriety {
  substance: string;
  startDate: string;
  private: boolean;
}

export interface Goal {
  id: number | string;
  name: string;
  target: string;
  unit: string;
  progress: number;
}

export interface CravingEntry {
  id: number | string;
  date: string;
  time: string;
  intensity: number;
  trigger: string;
  note: string;
}

export interface CommunityPost {
  id: number | string;
  user: string;
  day: number;
  pillar: string;
  text: string;
  seen: string[];
  flagged: boolean;
}

export interface DetailedSessionExercise {
  name: string;
  sets: number;
  reps: string;
  cue: string;
  contra: string[];
}

export interface DetailedSession {
  main: DetailedSessionExercise[];
  warmup: DetailedSessionExercise[];
  cooldown: DetailedSessionExercise[];
  flagged: FlaggedMovement[];
  trend: ReadinessTrend;
  readiness: number;
}

export interface WeeklyDigest {
  headline: string;
  body: string;
  confidence: string;
  pillar: string;
  nextWeekIntent: string;
}

export interface AppState {
  onboarded: boolean;
  firstWinPending: boolean;
  onboardStep: number;
  userName: string;
  weeklyTarget: number;
  bodyStats: BodyStats;
  tone: Tone;
  day: number;
  week: number;
  christianLens: boolean;
  whys: string[];
  checkIn: CheckInData | null;
  checkInDate: string | null;
  aiInsight: AiInsight | null;
  aiLoading: boolean;
  sessionHistory: SessionHistoryEntry[];
  currentSession: PlayerSession | null;
  sessionLoading: boolean;
  trainingLocation: TrainingLocation;
  equipment: string[];
  injuries: string[];
  meals: Meal[];
  sleepLog: SleepEntry[];
  sobriety: Sobriety | null;
  goals: Goal[];
  steps: number;
  communityPosts: CommunityPost[];
  buddy: string | null;
  weeklyDigest: WeeklyDigest | null;
  digestLoading: boolean;
  spotifyConnected: boolean;
  cravingLog: CravingEntry[];
  tutorialSeen: boolean;
  quoteCycle: number;
  isPremium: boolean;
  email: string;
  emailCaptured: boolean;
  emailPromptDismissed: boolean;
  savedRecipeIds: string[];
}

export type ScreenId =
  | "home"
  | "checkin"
  | "movement"
  | "nourish"
  | "track"
  | "regulate"
  | "community"
  | "profile";

export type SetState = (updater: (s: AppState) => AppState) => void;
