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
import { registerUserWithEmail, registerUserWithGoogle } from "@/store/authThunks";
// import { resetAuthState } from "@/store/authSlice";

const CreateUserForm = ({ data, setFormData, setStep, step, userType }) => {
   const { email, phone, password, confirmPassword } = data;
   const { t } = useTranslation();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { loading, error, user } = useSelector((state) => state.auth);

   const [agreedToTerms, setAgreedToTerms] = useState(false);

   // 🔹 Handle Input
   const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   // 🔹 Translate user type
   const getUserTypeTranslation = () => {
      switch (userType) {
         case "client":
            return t("auth.register.step1.client.title");
         case "host":
            return t("auth.register.step1.host.title");
         default:
            return "";
      }
   };

   // 🔹 Validate inputs
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

   // 🔹 Handle Email Sign Up
   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const resultAction = await dispatch(
         registerUserWithEmail({ email, password, phone, userType })
      );

      if (registerUserWithEmail.fulfilled.match(resultAction)) {
         toast.success(t("auth.register.toast.success.title"), {
            description:
               t("auth.register.toast.success.description") +
               " " +
               getUserTypeTranslation(),
         });
         navigate("/user");
      } else {
         toast.error(t("auth.register.toast.error.title"), {
            description: resultAction.payload || resultAction.error.message,
         });
      }

      // dispatch(resetAuthState());
   };

   // 🔹 Handle Google Sign Up
   const handleGoogleSignUp = async () => {
      const resultAction = await dispatch(registerUserWithGoogle({ userType }));

      if (registerUserWithGoogle.fulfilled.match(resultAction)) {
         toast.success(t("auth.form.toast.googleSuccess.title"), {
            description:
               t("auth.form.toast.googleSuccess.description") +
               " " +
               getUserTypeTranslation(),
         });
         navigate("/user");
      } else {
         toast.error(t("auth.form.toast.googleError.title"), {
            description: resultAction.payload || resultAction.error.message,
         });
      }

      dispatch(resetAuthState());
   };

   return (
      <div className="space-y-6 animate-fade-in">
         {/* 🔹 Google Sign Up */}
         <Button
            variant="ghost"
            className="w-full text-primary"
            onClick={handleGoogleSignUp}
            disabled={loading}
         >
            {loading ? (
               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
               <Chrome className="mr-2 h-5 w-5" />
            )}
            {loading
               ? t("common.buttons.creating")
               : t("auth.form.googleSignUp")}
         </Button>

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

            {/* 🔹 Terms */}
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

            {/* 🔹 Buttons */}
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
      </div>
   );
};

export default CreateUserForm;
