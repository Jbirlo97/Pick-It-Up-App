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

export interface SessionHistoryEntry {
  date: string;
  readiness: number;
  completed: boolean;
}

export interface SessionExercise {
  movementKey: string;
  movement: Movement;
  sets: number;
  reps: string;
  rest: number;
  coachNote: string;
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

export interface DetailedSession {
  main: { name: string; sets: number; reps: string; cue: string; contra: string[] }[];
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
