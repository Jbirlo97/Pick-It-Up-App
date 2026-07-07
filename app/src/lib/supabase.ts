import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase project creation is still an open item on Josh's side (see
// CLAUDE.md "Open items"). Until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// are set, the app runs in local-only mode (in-memory state, no auth, no
// persistence) rather than crashing — see App.tsx.
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;
