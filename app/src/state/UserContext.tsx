import { createContext, useContext } from "react";

// The signed-in Supabase user id, or null in local-only mode (no Supabase
// configured) or before auth resolves. Screens read this via useUserId() to
// decide whether to fire a persistence call alongside their local setState.
const UserContext = createContext<string | null>(null);

export const UserProvider = UserContext.Provider;

export function useUserId(): string | null {
  return useContext(UserContext);
}
