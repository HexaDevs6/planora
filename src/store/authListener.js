// src/store/auth/startAuthListener.js
import { supabase } from "@/lib/supabaseClient";
import { setUser, clearUser } from "./authSlice";

export const startAuthListener = (store) => {
    // -------------------------
    // 1) Initial session load
    // -------------------------
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
            store.dispatch(setUser(session.user));
        } else {
            store.dispatch(clearUser());
        }
    });

    // -----------------------------------
    // 2) Lightweight Auth Event Listener
    // -----------------------------------
    supabase.auth.onAuthStateChange((event, session) => {
        console.log("AUTH EVENT:", event);

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
            if (session?.user) store.dispatch(setUser(session.user));
        }

        if (event === "TOKEN_REFRESHED") {
            if (session?.user) store.dispatch(setUser(session.user));
        }

        if (event === "SIGNED_OUT") {
            store.dispatch(clearUser());
        }
    });

    // -----------------------------------------------------
    // 3) OPTIONAL — Load DB Profile AFTER the callback finishes
    // -----------------------------------------------------
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            if (!session?.user) return;

            // run AFTER Supabase event: allowed
            setTimeout(async () => {
                const { data: profile } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", session.user.id)
                    .maybeSingle();

                if (profile) {
                    store.dispatch(setUser({ ...session.user, ...profile }));
                }
            }, 0);
        }
    });
};
