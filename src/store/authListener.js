import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser, setLoading } from "./authSlice";

// ✅ Start listening to Supabase auth state changes
export const startAuthListener = (store) => {
  store.dispatch(setLoading(true));

  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log("Auth event:", event);

      if (session?.user) {
        store.dispatch(setUser(session.user));
      } else {
        store.dispatch(clearUser());
      }

      store.dispatch(setLoading(false));
    }
  );

  return () => {
    listener?.subscription?.unsubscribe?.();
  };
};
