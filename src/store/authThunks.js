import { supabase } from "@/lib/supabaseClient";
import { setUser, setLoading, clearUser } from "./authSlice";

// ✅ Register with email & password
export const registerUserWithEmail =
    (email, password, phone, userType = "client") =>
    async (dispatch) => {
        dispatch(setLoading(true));
        try {
            // Step 1️⃣: Create account in Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;

            const user = data.user || data.session?.user;
            if (!user) throw new Error("User not created in auth");

            // Step 2️⃣: Insert minimal data in users table
            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: user.id,
                    email,
                    phone: phone || null,
                    role: userType,
                    full_name: "",
                    avatar: null,
                    bio: null,
                    facebook_url: null,
                    instagram_url: null,
                    location: null,
                },
            ]);
            if (insertError) throw insertError;

            dispatch(setUser({ ...user, role: userType }));
            return { success: true, user };
        } catch (error) {
            console.error("Sign up error:", error.message);
            return { success: false, error: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

// ✅ Register or Sign in with Google
export const registerUserWithGoogle =
    ({ userType = "client" }) =>
    async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });
            if (error) throw error;

            const sessionUser = data?.user || data?.session?.user;
            if (!sessionUser)
                throw new Error("Google auth did not return user");

            // Check if exists in users table
            const { data: existingUser, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("id", sessionUser.id)
                .maybeSingle();
            if (fetchError) throw fetchError;

            // If not found → insert new record
            if (!existingUser) {
                const { error: insertError } = await supabase
                    .from("users")
                    .insert([
                        {
                            id: sessionUser.id,
                            email: sessionUser.email,
                            full_name:
                                sessionUser.user_metadata?.full_name || "",
                            avatar:
                                sessionUser.user_metadata?.avatar_url || null,
                            role: userType,
                            phone: null,
                            bio: null,
                            facebook_url: null,
                            instagram_url: null,
                            location: null,
                        },
                    ]);
                if (insertError) throw insertError;
            }

            dispatch(setUser({ ...sessionUser, role: userType }));
            return { success: true, user: sessionUser };
        } catch (error) {
            console.error("Google SignUp error:", error.message);
            return { success: false, error: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

// ✅ Sign in with email and password
export const signInWithEmail = (email, password) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const user = data.user || data.session?.user;
        if (!user) throw new Error("User not found");

        // Fetch user data from users table
        const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
        if (fetchError) throw fetchError;

        dispatch(setUser({ ...user, ...userData }));
        return { success: true, user: { ...user, ...userData } };
    } catch (error) {
        console.error("Sign in error:", error.message);
        return { success: false, error: error.message };
    } finally {
        dispatch(setLoading(false));
    }
};

// ✅ Save user info (after registration)
export const saveUserInfo =
    (userId, userInfo, categories = [], role = "client") =>
    async (dispatch) => {
        dispatch(setLoading(true));
        try {
            // Step 1️⃣: Update users table
            const { error: updateError } = await supabase
                .from("users")
                .update({
                    full_name: userInfo.full_name,
                    bio: userInfo.bio || null,
                    facebook_url: userInfo.facebook_url || null,
                    instagram_url: userInfo.instagram_url || null,
                    location: userInfo.location || null,
                })
                .eq("id", userId);
            if (updateError) throw updateError;

            // Step 2️⃣: Insert user categories
            if (categories.length > 0) {
                // Delete existing first
                await supabase
                    .from("user_categories")
                    .delete()
                    .eq("user_id", userId);

                // Insert new ones
                const inserts = categories.map((catId) => ({
                    user_id: userId,
                    category_id: catId,
                }));
                const { error: categoryError } = await supabase
                    .from("user_categories")
                    .insert(inserts);
                if (categoryError) throw categoryError;
            }

            // Step 3️⃣: Fetch updated user
            const { data: updatedUser } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            dispatch(setUser(updatedUser));
            return { success: true, user: updatedUser };
        } catch (error) {
            console.error("Save user info error:", error.message);
            return { success: false, error: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

// ✅ Sign out
export const signOut = () => async (dispatch) => {
    await supabase.auth.signOut();
    dispatch(clearUser());
};

// ✅ Fetch current user session
export const fetchUserSession = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();
            if (userError) throw userError;

            dispatch(setUser({ ...user, ...userData }));
        } else {
            dispatch(clearUser());
        }
    } catch (error) {
        console.error("Session fetch error:", error.message);
    } finally {
        dispatch(setLoading(false));
    }
};
