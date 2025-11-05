import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser } from "./authSlice";

export const startAuthListener = async (store) => {

  // ✅ Check existing session on app start
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (userData) {
        store.dispatch(setUser(userData)); // ✅ ONLY DB data
      } else {
        store.dispatch(clearUser());
      }
    } catch (err) {
      console.error("Initial session fetch error:", err.message);
      store.dispatch(clearUser());
    }
  } else {
    store.dispatch(clearUser());
  }

  // ✅ Listen for auth state changes normally
  const { data: listener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth event:", event);

      if (event === "SIGNED_OUT") {
        store.dispatch(clearUser());
        return;
      }

      if (session?.user) {
        try {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (userData) {
            store.dispatch(setUser(userData));
          } else {
            store.dispatch(clearUser());
          }
        } catch (err) {
          console.error("Listener fetch error:", err.message);
        }
      }
    }
  );

  return () => listener?.subscription?.unsubscribe?.();
};
