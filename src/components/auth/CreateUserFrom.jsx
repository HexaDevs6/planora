import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Lock, Chrome, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { registerUserWithEmail, saveUserInfo } from "@/store/authThunks";
import { setLoading, setUser } from "@/store/authSlice";
import { supabase } from "@/lib/supabaseClient";

const CreateUserForm = ({ formData, setStep, step, userType, handleInputChange }) => {
   const { t } = useTranslation();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { email, password, confirmPassword, phone, categories } = formData;
   const { loading } = useSelector((state) => state.auth);

   const [agreedToTerms, setAgreedToTerms] = useState(false);

   // ✅ Validate form fields
   const validateForm = () => {
      if (!email || !password || !confirmPassword) {
         toast.error(t("common.validation.fillAllFields"));
         return false;
      }
      if (password !== confirmPassword) {
         toast.error(t("common.validation.passwordsNoMatch"));
         return false;
      }
      if (password.length < 8) {
         toast.warning(t("common.validation.passwordLength"));
         return false;
      }
      if (!agreedToTerms) {
         toast.warning(t("common.validation.agreeToTerms"));
         return false;
      }
      return true;
   };

   // ✅ Handle Email Sign Up
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm() || loading) return;

      try {
         // 1️⃣ إنشاء الحساب في Supabase Auth
         const { success, user, error } = await dispatch(
            registerUserWithEmail(email, password)
         );

         if (!success || !user) {
            toast.error(error || t("common.errors.somethingWentWrong"));
            return;
         }

         // 2️⃣ حفظ البيانات الإضافية
         const { success: infoSuccess, error: infoError } = await dispatch(
            saveUserInfo({
               userId: user.id,
               userInfo: { ...formData },
               categories: categories || [],
               role: userType,
            })
         );

         if (infoSuccess) {
            toast.success(t("auth.register.toast.success.title"));
            navigate("/"); // 🔹 توجيه المستخدم بعد التسجيل
         } else {
            toast.error(infoError || t("common.errors.somethingWentWrong"));
         }
      } catch (err) {
         console.error(err);
         toast.error(t("common.errors.somethingWentWrong"));
      }
   };

   // ✅ Handle Google Sign Up 
   const handleGoogleSignUp = async () => {
      if (!agreedToTerms) {
         toast.warning(t("common.validation.agreeToTerms"));
         return;
      }

      try {
         setLoading(true);

         // ✅ تسجيل الدخول بجوجل
         const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
               skipBrowserRedirect: true,
            },
         });

         if (error) throw error;

         // ✅ فتح نافذة البوب-أب
         const popup = window.open(
            data.url,
            "googlePopup",
            "width=500,height=600"
         );

         // ✅ استماع لحالة تسجيل الدخول
         const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
               if (event === "SIGNED_IN") {
                  listener.subscription.unsubscribe();
                  popup?.close();

                  const user = session?.user;
                  console.log("user",user);
                  
                  if (!user) {
                     toast.error(t("common.errors.somethingWentWrong"));
                     setLoading(false);
                     return;
                  }

                  // ✅ بناء بيانات المستخدم من الفورم + بيانات جوجل
                  const userData = {
                     id: user.id,
                     email: user.email,
                     full_name:
                        formData.full_name?.trim() ||
                        user.user_metadata?.full_name?.trim() ||
                        user.user_metadata?.name?.trim() ||
                        (user.email ? user.email.split("@")[0] : "User"),
                     avatar:
                        user.user_metadata?.avatar_url ||
                        user.user_metadata?.picture ||
                        null,
                     phone: formData.phone || null,
                     bio: formData.bio || null,
                     facebook: formData.facebook || null,
                     instagram: formData.instagram || null,
                     location: formData.location || null,
                  };

                  console.log("userdata",userData);
                  


                  // ✅ تسجيل البيانات والكاتيجوريات باستخدام الـ thunk الجاهز
                  const { success, error: infoError } = await dispatch(
                     saveUserInfo({
                        userId: user.id,
                        userInfo: {...userData},
                        categories: categories || [],
                        role: userType,
                     })
                  );

                  if (!success) {
                     console.error(infoError);
                     toast.error(t("common.errors.somethingWentWrong"));
                     setLoading(false);
                     return;
                  }

                  toast.success(t("auth.register.toast.success.title"));
                  navigate(userType === "host" ? "/host" : "/user");
                  setLoading(false);
               }
            }
         );
      } catch (err) {
         console.error(err);
         toast.error(t("common.errors.somethingWentWrong"));
         setLoading(false);
      }
   };



   return (
      <div className="space-y-6 animate-fade-in">
         {/* 🔹 Google Sign Up */}
         <Button
            variant="outline"
            onClick={handleGoogleSignUp}
            disabled={loading || !agreedToTerms}
            className={`w-full flex items-center justify-center gap-3 border-2 rounded-md py-4 transition-all
      ${!agreedToTerms
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-amber hover:bg-amber/10"
               }`}
         >
            {loading ? (
               <>
                  <Loader2 className="h-5 w-5 animate-spin text-amber" />
                  <span className="text-amber">جارٍ التسجيل...</span>
               </>
            ) : (
               <>
                  <Chrome className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">
                     {t("auth.form.googleSignUp")}
                  </span>
               </>
            )}
         </Button>

         {/* Divider */}
         <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
               {t("auth.form.or")}
            </span>
         </div>

         {/* 🔹 Form */}
         <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground"
         >
            {/* Email */}
            <div className="space-y-2">
               <Label htmlFor="email">{t("common.form.email")} *</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="email"
                     type="email"
                     placeholder={t("auth.form.email.placeholder")}
                     value={email}
                     onChange={(e) => handleInputChange("email", e.target.value)}
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
               <Label htmlFor="phone">{t("common.form.phone")}</Label>
               <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="phone"
                     type="tel"
                     placeholder={t("auth.form.phone.placeholder")}
                     value={phone}
                     onChange={(e) => handleInputChange("phone", e.target.value)}
                     className="pl-10"
                  />
               </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
               <Label htmlFor="password">{t("common.form.password")} *</Label>
               <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="password"
                     type="password"
                     placeholder={t("auth.form.password.placeholder")}
                     value={password}
                     onChange={(e) =>
                        handleInputChange("password", e.target.value)
                     }
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
               <Label htmlFor="confirmPassword">
                  {t("common.form.confirmPassword")} *
               </Label>
               <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="confirmPassword"
                     type="password"
                     placeholder={t("auth.form.confirmPassword.placeholder")}
                     value={confirmPassword}
                     onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                     }
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-4 md:col-span-2">
               <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked)}
                  className="bg-muted"
               />
               <label
                  htmlFor="terms"
                  className="text-sm text-foreground leading-none"
               >
                  {t("auth.form.terms.text")}{" "}
                  <Link to="/terms" className="text-primary underline">
                     {t("auth.form.terms.termsLink")}
                  </Link>{" "}
                  {t("auth.form.terms.and")}{" "}
                  <Link to="/privacy" className="text-primary underline">
                     {t("auth.form.terms.privacyLink")}
                  </Link>
               </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4 md:col-span-2">
               <Button
                  onClick={() => setStep(step === 1 ? 1 : step - 1)}
                  variant="outline"
                  disabled={loading}
               >
                  {t("common.buttons.back")}
               </Button>
               <Button
                  type="submit"
                  variant="amber"
                  size="lg"
                  disabled={loading}
                  className={loading ? "opacity-70 cursor-not-allowed" : ""}
               >
                  {loading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("common.buttons.creating")}
                     </>
                  ) : (
                     t("common.buttons.create")
                  )}
               </Button>
            </div>
         </form>
         {console.log(`User Type: ${userType}`)}
         {console.log(`Form Data: ${formData}`)}
         {console.log(`categories: ${categories}`)}

      </div>
   );
};

export default CreateUserForm;
