// src/store/auth/startAuthListener.js
import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser } from "./authSlice";

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

    if (session?.user) {
      await fetchAndStoreUser(session.user.id, store);
    }
  });

  // ❗ VERY IMPORTANT:
  // Don't return unsubscribe and DON'T REMOVE the listener.
  // Supabase listens internally and manages refresh tokens.
};

// ------------------------------------------
// Helper to fetch user from Database
// ------------------------------------------
async function fetchAndStoreUser(userId, store) {
  try {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (userData) {
      store.dispatch(setUser(userData));
    } else {
      store.dispatch(clearUser());
    }
  } catch (err) {
    console.error("Fetch user error:", err.message);
    store.dispatch(clearUser());
  }
}
