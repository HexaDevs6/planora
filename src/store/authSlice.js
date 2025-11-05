import { createSlice } from "@reduxjs/toolkit";

// ✅ الحالة الابتدائية
const initialState = {
    user: null, // يحتوي على بيانات المستخدم الكاملة (من auth + users table)
    isLoading: false, // أثناء العمليات (تسجيل، تسجيل دخول، حفظ بيانات...)
    error: null, // في حالة حدوث خطأ
    isAuthenticated: false, // لتحديد إذا المستخدم داخل النظام
    initialized: false, // 👈 تمت تهيئة حالة المستخدم بعد فحص الجلسة
};

// ✅ إنشاء الـ Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // تعيين المستخدم بعد تسجيل الدخول أو التسجيل
        setUser: (state, action) => {
            let u = action.payload;

            // 🛑 لو جاية من Supabase Auth وطلعت "authenticated"
            if (u?.role === "authenticated") {
                u = { ...u, role: null };
            }

            state.user = u;
            state.isAuthenticated = !!u;
            state.error = null;
            state.initialized = true;
        },

        // أثناء تحميل البيانات
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        // في حالة وجود خطأ
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        // تسجيل خروج المستخدم
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.initialized = true; // ✅ أول مرة نحط user أو نحدثه → اعتبرنا النظام جاهز
        },
    },
});

// ✅ تصدير الـ Actions
export const { setUser, setLoading, setError, clearUser } = authSlice.actions;

// ✅ الـ Reducer الرئيسي
export default authSlice.reducer;
