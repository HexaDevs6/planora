import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser } from "./authSlice";

export const startAuthListener = async (store) => {
  // ✅ أولاً: فحص الجلسة الحالية يدويًا
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userData) {
        store.dispatch(setUser({ ...session.user, ...userData }));
      } else {
        // لو مفيش بيانات في users table
        store.dispatch(setUser(session.user));
      }
    } catch (err) {
      console.error("Initial session fetch error:", err.message);
      store.dispatch(clearUser());
    }
  } else {
    store.dispatch(clearUser());
  }

  // ✅ ثانياً: الاستماع لتغيرات الحالة (sign in/out)
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
            .single();

          if (userData) {
            store.dispatch(setUser({ ...session.user, ...userData }));
          } else {
            store.dispatch(setUser(session.user));
          }
        } catch (err) {
          console.error("Listener fetch error:", err.message);
        }
      }
    }
  );

  return () => listener?.subscription?.unsubscribe?.();
};
