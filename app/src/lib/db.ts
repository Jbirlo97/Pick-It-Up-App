import { supabase } from "./supabase";
import type { AppState, CommunityPost, CravingEntry, Goal, Meal, PlayerSession, SessionHistoryEntry, SleepEntry, Sobriety } from "../types";

// Data-access layer for Supabase persistence (docs/backend-brief.md Section
// 2). Every function assumes `supabase` is non-null — callers must check
// isSupabaseConfigured first (see App.tsx). Column names are snake_case to
// match schema.sql; conversion to/from the app's camelCase AppState shape
// happens here, not scattered across screens.

export type ProfileRow = {
  id: string;
  user_name: string;
  weekly_target: number;
  weight: number | null;
  height: number | null;
  age: number | null;
  waist: number | null;
  unit: string;
  sex: string;
  tone: string;
  christian_lens: boolean;
  training_location: string;
  equipment: string[];
  injuries: string[];
  whys: string[];
  is_premium: boolean;
  onboarded: boolean;
  onboard_step: number;
  first_win_pending: boolean;
  day: number;
  week: number;
  spotify_connected: boolean;
  buddy: string | null;
  tutorial_seen: boolean;
  email: string | null;
  email_captured: boolean;
  email_prompt_dismissed: boolean;
  steps: number;
};

export function profileRowToState(row: ProfileRow): Partial<AppState> {
  return {
    userName: row.user_name,
    weeklyTarget: row.weekly_target,
    bodyStats: {
      weight: row.weight?.toString() ?? "",
      height: row.height?.toString() ?? "",
      age: row.age?.toString() ?? "",
      waist: row.waist?.toString() ?? "",
      unit: row.unit as AppState["bodyStats"]["unit"],
      sex: row.sex as AppState["bodyStats"]["sex"],
    },
    tone: row.tone as AppState["tone"],
    christianLens: row.christian_lens,
    trainingLocation: row.training_location as AppState["trainingLocation"],
    equipment: row.equipment,
    injuries: row.injuries,
    whys: row.whys,
    isPremium: row.is_premium,
    onboarded: row.onboarded,
    onboardStep: row.onboard_step,
    firstWinPending: row.first_win_pending,
    day: row.day,
    week: row.week,
    spotifyConnected: row.spotify_connected,
    buddy: row.buddy,
    tutorialSeen: row.tutorial_seen,
    email: row.email ?? "",
    emailCaptured: row.email_captured,
    emailPromptDismissed: row.email_prompt_dismissed,
    steps: row.steps,
  };
}

export function stateToProfilePatch(s: AppState): Partial<ProfileRow> {
  return {
    user_name: s.userName,
    weekly_target: s.weeklyTarget,
    weight: s.bodyStats.weight ? Number(s.bodyStats.weight) : null,
    height: s.bodyStats.height ? Number(s.bodyStats.height) : null,
    age: s.bodyStats.age ? Number(s.bodyStats.age) : null,
    waist: s.bodyStats.waist ? Number(s.bodyStats.waist) : null,
    unit: s.bodyStats.unit,
    sex: s.bodyStats.sex,
    tone: s.tone,
    christian_lens: s.christianLens,
    training_location: s.trainingLocation,
    equipment: s.equipment,
    injuries: s.injuries,
    whys: s.whys,
    is_premium: s.isPremium,
    onboarded: s.onboarded,
    onboard_step: s.onboardStep,
    first_win_pending: s.firstWinPending,
    day: s.day,
    week: s.week,
    spotify_connected: s.spotifyConnected,
    buddy: s.buddy,
    tutorial_seen: s.tutorialSeen,
    email: s.email,
    email_captured: s.emailCaptured,
    email_prompt_dismissed: s.emailPromptDismissed,
    steps: s.steps,
  };
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) {
    console.error("fetchProfile failed", error);
    return null;
  }
  return data as ProfileRow;
}

export async function saveProfilePatch(userId: string, patch: Partial<ProfileRow>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) console.error("saveProfilePatch failed", error);
}

export async function fetchCheckInForToday(userId: string): Promise<{ checkIn: AppState["checkIn"]; aiInsight: AppState["aiInsight"] } | null> {
  if (!supabase) return null;
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from("check_ins").select("*").eq("user_id", userId).eq("date", today).maybeSingle();
  if (error) {
    console.error("fetchCheckInForToday failed", error);
    return null;
  }
  if (!data) return null;
  return {
    checkIn: { readiness: data.readiness, sleep: data.sleep, mood: data.mood, stress: data.stress },
    aiInsight: data.ai_insight,
  };
}

export async function upsertTodayCheckIn(userId: string, checkIn: NonNullable<AppState["checkIn"]>, aiInsight: AppState["aiInsight"], injuriesToday: string[]): Promise<void> {
  if (!supabase) return;
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("check_ins").upsert(
    {
      user_id: userId,
      date: today,
      readiness: checkIn.readiness,
      sleep: checkIn.sleep,
      mood: checkIn.mood,
      stress: checkIn.stress,
      ai_insight: aiInsight,
      injuries_today: injuriesToday,
    },
    { onConflict: "user_id,date" }
  );
  if (error) console.error("upsertTodayCheckIn failed", error);
}

export async function fetchSessionHistory(userId: string): Promise<SessionHistoryEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("sessions").select("date, readiness_at_time, completed").eq("user_id", userId).order("created_at", { ascending: true });
  if (error) {
    console.error("fetchSessionHistory failed", error);
    return [];
  }
  return (data || []).map((r) => ({ date: r.date as string, readiness: (r.readiness_at_time as number) ?? 3, completed: r.completed as boolean }));
}

export async function insertSession(userId: string, source: "quick" | "detailed", session: PlayerSession, readiness: number): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("sessions").insert({
    user_id: userId,
    date: new Date().toISOString().slice(0, 10),
    source,
    session_title: session.sessionTitle,
    exercises: session.exercises,
    readiness_at_time: readiness,
    completed: true,
    flagged_contraindications: session.flaggedExercises.length ? session.flaggedExercises : null,
  });
  if (error) console.error("insertSession failed", error);
}

export async function fetchMeals(userId: string): Promise<Meal[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("meals").select("*").eq("user_id", userId).order("created_at", { ascending: true });
  if (error) {
    console.error("fetchMeals failed", error);
    return [];
  }
  return (data || []).map((r) => ({ id: r.id, name: r.name, kcal: String(r.kcal ?? ""), protein: String(r.protein ?? ""), carbs: String(r.carbs ?? ""), fat: String(r.fat ?? ""), notes: r.notes ?? "", time: r.logged_at ?? "" }));
}

export async function insertMeal(userId: string, meal: Omit<Meal, "id">): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("meals").insert({
    user_id: userId,
    name: meal.name,
    kcal: meal.kcal ? Number(meal.kcal) : null,
    protein: meal.protein ? Number(meal.protein) : null,
    carbs: meal.carbs ? Number(meal.carbs) : null,
    fat: meal.fat ? Number(meal.fat) : null,
    notes: meal.notes,
    logged_at: meal.time,
  });
  if (error) console.error("insertMeal failed", error);
}

export async function fetchSleepLog(userId: string): Promise<SleepEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("sleep_log").select("date, hours, quality").eq("user_id", userId).order("created_at", { ascending: true });
  if (error) {
    console.error("fetchSleepLog failed", error);
    return [];
  }
  return (data || []) as SleepEntry[];
}

export async function insertSleepEntry(userId: string, entry: SleepEntry): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("sleep_log").insert({ user_id: userId, date: new Date().toISOString().slice(0, 10), hours: entry.hours, quality: entry.quality });
  if (error) console.error("insertSleepEntry failed", error);
}

export async function fetchSobriety(userId: string): Promise<Sobriety | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("sobriety").select("*").eq("user_id", userId).maybeSingle();
  if (error) {
    console.error("fetchSobriety failed", error);
    return null;
  }
  if (!data) return null;
  return { substance: data.substance, startDate: data.start_date, private: true };
}

export async function upsertSobriety(userId: string, sobriety: Sobriety | null): Promise<void> {
  if (!supabase) return;
  if (!sobriety) {
    const { error } = await supabase.from("sobriety").delete().eq("user_id", userId);
    if (error) console.error("upsertSobriety (delete) failed", error);
    return;
  }
  const { error } = await supabase.from("sobriety").upsert({ user_id: userId, substance: sobriety.substance, start_date: sobriety.startDate });
  if (error) console.error("upsertSobriety failed", error);
}

export async function fetchGoals(userId: string): Promise<Goal[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: true });
  if (error) {
    console.error("fetchGoals failed", error);
    return [];
  }
  return (data || []).map((r) => ({ id: r.id, name: r.name, target: String(r.target ?? ""), unit: r.unit ?? "", progress: r.progress ?? 0 }));
}

export async function insertGoal(userId: string, goal: Omit<Goal, "id">): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("goals").insert({ user_id: userId, name: goal.name, target: goal.target ? Number(goal.target) : null, unit: goal.unit, progress: goal.progress }).select("id").single();
  if (error) {
    console.error("insertGoal failed", error);
    return null;
  }
  return data.id as string;
}

export async function updateGoalProgress(goalId: number | string, progress: number): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("goals").update({ progress }).eq("id", goalId);
  if (error) console.error("updateGoalProgress failed", error);
}

export async function deleteGoal(goalId: number | string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  if (error) console.error("deleteGoal failed", error);
}

export async function fetchCravingLog(userId: string): Promise<CravingEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("craving_log").select("*").eq("user_id", userId).order("created_at", { ascending: true });
  if (error) {
    console.error("fetchCravingLog failed", error);
    return [];
  }
  return (data || []).map((r) => ({ id: r.id, date: r.date, time: r.logged_at ?? "", intensity: r.intensity, trigger: r.trigger, note: r.note ?? "" }));
}

export async function insertCraving(userId: string, entry: Omit<CravingEntry, "id">): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("craving_log").insert({ user_id: userId, date: new Date().toISOString().slice(0, 10), logged_at: entry.time, intensity: entry.intensity, trigger: entry.trigger, note: entry.note });
  if (error) console.error("insertCraving failed", error);
}

export async function fetchSavedRecipeIds(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("saved_recipes").select("recipe_id").eq("user_id", userId);
  if (error) {
    console.error("fetchSavedRecipeIds failed", error);
    return [];
  }
  return (data || []).map((r) => r.recipe_id as string);
}

export async function saveRecipe(userId: string, recipeId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("saved_recipes").upsert({ user_id: userId, recipe_id: recipeId }, { onConflict: "user_id,recipe_id" });
  if (error) console.error("saveRecipe failed", error);
}

export async function unsaveRecipe(userId: string, recipeId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("saved_recipes").delete().eq("user_id", userId).eq("recipe_id", recipeId);
  if (error) console.error("unsaveRecipe failed", error);
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("fetchCommunityPosts failed", error);
    return [];
  }
  return (data || []).map((r) => ({ id: r.id, user: r.user_label, day: r.day, pillar: r.pillar, text: r.text, seen: r.seen ?? [], flagged: r.flagged }));
}

export async function insertCommunityPost(userId: string, post: Omit<CommunityPost, "id" | "seen" | "flagged">): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("community_posts").insert({ user_id: userId, user_label: post.user, day: post.day, pillar: post.pillar, text: post.text });
  if (error) console.error("insertCommunityPost failed", error);
}

export async function markPostSeen(postId: number | string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc("mark_post_seen", { post_id: postId });
  if (error) console.error("markPostSeen failed", error);
}

export async function flagPost(postId: number | string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc("flag_post", { post_id: postId });
  if (error) console.error("flagPost failed", error);
}

// Aggregates every table into the AppState shape on sign-in / app load, so
// App.tsx has one call to make instead of stitching this together itself.
export async function hydrateStateFromSupabase(userId: string): Promise<Partial<AppState> | null> {
  const profile = await fetchProfile(userId);
  if (!profile) return null;

  const [todayCheckIn, sessionHistory, meals, sleepLog, sobriety, goals, cravingLog, communityPosts, savedRecipeIds] = await Promise.all([
    fetchCheckInForToday(userId),
    fetchSessionHistory(userId),
    fetchMeals(userId),
    fetchSleepLog(userId),
    fetchSobriety(userId),
    fetchGoals(userId),
    fetchCravingLog(userId),
    fetchCommunityPosts(),
    fetchSavedRecipeIds(userId),
  ]);

  return {
    ...profileRowToState(profile),
    checkIn: todayCheckIn?.checkIn ?? null,
    checkInDate: todayCheckIn ? new Date().toDateString() : null,
    aiInsight: todayCheckIn?.aiInsight ?? null,
    sessionHistory,
    meals,
    sleepLog,
    sobriety,
    goals,
    cravingLog,
    communityPosts: communityPosts.length ? communityPosts : undefined,
    savedRecipeIds,
  };
}
