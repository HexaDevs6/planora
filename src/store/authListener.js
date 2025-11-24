// src/store/auth/startAuthListener.js
import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser } from "./authSlice";

/**
 * startAuthListener(store)
 *
 * Responsibilities:
 * - Read initial session on app start and populate Redux
 * - Listen for auth state events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
 * - On TOKEN_REFRESHED: wait for the SDK to finish propagating the new session,
 *   then safely refetch the user and update Redux.
 *
 * Important:
 * - Do NOT perform any session refresh here (SessionManager handles refreshSession)
 * - Keep the listener alive for the app lifecycle (don't unsubscribe)
 */

export const startAuthListener = async (store) => {
  // -----------------------
  // 1) GET EXISTING SESSION
  // -----------------------
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    await fetchAndStoreUser(session.user.id, store);
  } else {
    store.dispatch(clearUser());
  }

  // -----------------------
  // 2) LISTEN FOR CHANGES
  // -----------------------
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth event:", event);

    if (event === "SIGNED_OUT") {
      store.dispatch(clearUser());
      return;
    }

    // TOKEN_REFRESHED: wait until the SDK has a usable session,
    // then fetch the user and update Redux.
    if (event === "TOKEN_REFRESHED") {
      console.log("🔄 Token refreshed — waiting for session propagation...");

      // Poll getSession for up to ~1 second (5 attempts × 200ms)
      const maxAttempts = 5;
      const delayMs = 200;
      let attempt = 0;
      let refreshedSession = null;

      while (attempt < maxAttempts) {
        try {
          const { data } = await supabase.auth.getSession();
          refreshedSession = data?.session ?? null;

          // if we have a session and (optionally) access_token is present -> break
          if (refreshedSession && refreshedSession.access_token) {
            break;
          }
        } catch (err) {
          // ignore transient errors and retry
          console.warn("[AuthListener] getSession attempt failed:", err?.message ?? err);
        }

        // small sleep
        await new Promise((res) => setTimeout(res, delayMs));
        attempt += 1;
      }

      // If still no usable session -> notify and bail (avoid infinite waiting)
      if (!refreshedSession || !refreshedSession.user) {
        console.warn("[AuthListener] TOKEN_REFRESHED but no session available after retries.");
        // It's safer to clear user so UI doesn't stay stuck on loader.
        store.dispatch(clearUser());
        return;
      }

      // Now fetch user data safely
      console.log("🔄 Re-fetching user after refresh");
      await fetchAndStoreUser(refreshedSession.user.id, store);
      return;
    }

    if (event === "SIGNED_IN") {
      if (session?.user) {
        await fetchAndStoreUser(session.user.id, store);
      }
      return;
    }
  });

  // Do not return unsubscribe — we want this listener live for app lifetime.
};

// ------------------------------------------
// Helper to fetch user from Database
// ------------------------------------------
async function fetchAndStoreUser(userId, store) {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (userData) {
      store.dispatch(setUser(userData));
    } else {
      store.dispatch(clearUser());
    }
  } catch (err) {
    console.error("Fetch user error:", err.message || err);
    store.dispatch(clearUser());
  }
}
