import { supabase } from "@/lib/supabaseClient";
import { setUser, setLoading, clearUser } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Register with email & password (only Auth)
export const registerUserWithEmail = (email, password) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        const user = data.user || data.session?.user;
        if (!user) throw new Error("User not created in auth");

        return { success: true, user };
    } catch (error) {
        console.error("Sign up error:", error.message);
        return { success: false, error: error.message };
    } finally {
        dispatch(setLoading(false));
    }
};



// ✅ Sign in with email and password using  "createAsyncThunk"
export const signInWithEmail = createAsyncThunk(
    "auth/signInWithEmail",
    async ({ email, password }, { rejectWithValue, dispatch }) => {
        dispatch(setLoading(true));
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            const user = data.user || data.session?.user;
            if (!user) throw new Error("User not found");

            const { data: userData, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();
            if (fetchError) throw fetchError;

            dispatch(setUser({ ...user, ...userData }));
            return { user: { ...user, ...userData } };
        } catch (error) {
            console.error("Sign in error:", error.message);
            return rejectWithValue(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// ✅ الخطوة 1: تسجيل الدخول بجوجل (يفتح الـ popup)
export const signInWithGoogle = createAsyncThunk(
    "auth/signInWithGoogle",
    async (_, { rejectWithValue, dispatch }) => {
        dispatch(setLoading(true));
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.origin, // مهم جدًا
                },
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error("Google sign-in error:", error.message);
            return rejectWithValue(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// ✅ الخطوة 2: بعد الرجوع من جوجل، نتحقق من وجود المستخدم في قاعدة البيانات
export const checkGoogleUser = createAsyncThunk(
    "auth/checkGoogleUser",
    async (_, { rejectWithValue, dispatch }) => {
        dispatch(setLoading(true));
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (!user) throw new Error("No user returned from Google.");

            // Check if exists in DB
            const { data: existingUser, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();
            if (fetchError) throw fetchError;

            if (existingUser) {
                dispatch(setUser({ ...user, ...existingUser }));
                return { success: true, user: { ...user, ...existingUser } };
            } else {
                return { success: false, needsRegistration: true, user };
            }
        } catch (error) {
            console.error("Check Google user error:", error.message);
            return rejectWithValue(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);


// ✅ Register new Google user with extra info (for Register)
export const registerUserWithGoogleData = createAsyncThunk(
    "auth/registerUserWithGoogleData",
    async ({ formData, role }, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        try {
            // Step 1: تسجيل الدخول بجوجل
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.origin,
                    skipBrowserRedirect: false,
                },
            });
            if (error) throw error;

            // Step 2: جلب بيانات المستخدم من Supabase بعد الرجوع
            const { data: userSession } = await supabase.auth.getUser();
            const user = userSession?.user;
            if (!user) throw new Error("Google user not found after sign-up.");

            const { fullName, bio, facebook, instagram, categories, location } =
                formData;

            // Step 3: إدخال البيانات كلها في جدول users
            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: user.id,
                    email: user.email,
                    full_name: fullName || user.user_metadata?.full_name,
                    avatar: user.user_metadata?.avatar_url || null,
                    bio: bio || null,
                    facebook_url: facebook || null,
                    instagram_url: instagram || null,
                    location: location || null,
                    role,
                },
            ]);
            if (insertError) throw insertError;

            // Step 4: ربط التصنيفات لو موجودة
            if (categories && categories.length > 0) {
                const inserts = categories.map((catId) => ({
                    user_id: user.id,
                    category_id: catId,
                }));
                const { error: catError } = await supabase
                    .from("user_categories")
                    .insert(inserts);
                if (catError) throw catError;
            }

            // Step 5: حفظ المستخدم في Redux
            dispatch(setUser({ ...user, ...formData, role }));

            return { success: true, user: { ...user, ...formData, role } };
        } catch (error) {
            console.error("Google registration error:", error.message);
            return rejectWithValue(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);



// ✅ Save or update user info
export const saveUserInfo =
    ({ userId, userInfo, categories, role }) =>
        async (dispatch) => {
            dispatch(setLoading(true));
            try {
                const {
                    fullName,
                    bio,
                    facebook,
                    instagram,
                    location,
                    avatar,
                    phone,
                } = userInfo;

                // check if user exists
                const { data: existingUser } = await supabase
                    .from("users")
                    .select("id")
                    .eq("id", userId)
                    .maybeSingle();

                let dbAction;
                if (existingUser) {
                    // Update existing
                    dbAction = supabase
                        .from("users")
                        .update({
                            full_name: fullName,
                            bio: bio || null,
                            facebook_url: facebook || null,
                            instagram_url: instagram || null,
                            location: location || null,
                            avatar: avatar || null,
                            phone: phone || null,
                        })
                        .eq("id", userId);
                } else {
                    // Insert new
                    dbAction = supabase.from("users").insert([
                        {
                            id: userId,
                            email: userInfo.email || user.email,
                            full_name: fullName,
                            bio: bio || null,
                            facebook_url: facebook || null,
                            instagram_url: instagram || null,
                            location: location || null,
                            avatar: avatar || null,
                            phone: phone || null,
                            role,
                        },
                    ]);
                }

                const { error: dbError } = await dbAction;
                if (dbError) throw dbError;

                // Handle categories if provided
                if (categories.length > 0) {
                    await supabase
                        .from("user_categories")
                        .delete()
                        .eq("user_id", userId);
                    const inserts = categories.map((catId) => ({
                        user_id: userId,
                        category_id: catId,
                    }));
                    const { error: categoryError } = await supabase
                        .from("user_categories")
                        .insert(inserts);
                    if (categoryError) throw categoryError;
                }

                // Fetch updated user
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
