import { createSlice } from "@reduxjs/toolkit";

// ✅ الحالة الابتدائية
const initialState = {
  user: null,         // يحتوي على بيانات المستخدم الكاملة (من auth + users table)
  isLoading: false,   // أثناء العمليات (تسجيل، تسجيل دخول، حفظ بيانات...)
  error: null,        // في حالة حدوث خطأ
  isAuthenticated: false, // لتحديد إذا المستخدم داخل النظام
};

// ✅ إنشاء الـ Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // تعيين المستخدم بعد تسجيل الدخول أو التسجيل
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
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
    },
  },
});

// ✅ تصدير الـ Actions
export const { setUser, setLoading, setError, clearUser } = authSlice.actions;

// ✅ الـ Reducer الرئيسي
export default authSlice.reducer;
