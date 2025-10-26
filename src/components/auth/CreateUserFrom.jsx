import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Lock, Loader2 } from "lucide-react";
import { Chrome } from "lucide-react";
import {
   signInWithPopup,
   createUserWithEmailAndPassword,
   fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { saveUserToFirestore } from "@/pages/Register";

const CreateUserFrom = ({
   data,
   setFormData,
   setStep,
   step,
   userType,
}) => {
   let { email, phone, password, confirmPassword } = data;
   const navigate = useNavigate();
   const { t } = useTranslation();
   const [isLoading, setIsLoading] = useState(false);
   const [agreedToTerms, setAgreedToTerms] = useState(false);
   const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const getUserTypeTranslation = () => {
      switch (userType) {
         case "client":
            return t("auth.register.step1.client.title");
         case "vendor":
            return t("auth.register.step1.vendor.title");
      }
   };

   const validateForm = () => {
      const { email, password, confirmPassword } = data;
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

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      if (!validateForm()) {
         return;
      }

      try {
         // Check if email already exists in Firestore
         const methods = await fetchSignInMethodsForEmail(auth, data.email);
         if (methods.length > 0) {
            toast.error(t("common.validation.emailExists"));
            return;
         }

         // Create new user in Firebase Authentication
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
         );
         const user = userCredential.user;

         // Save user data to Firestore
         await saveUserToFirestore(user.uid, data, userType);

         // Success notification
         toast.success(t("auth.register.toast.success.title"), {
            description: t("auth.register.toast.success.description" ) + " " + getUserTypeTranslation()
         });

         navigate("/user");
      } catch (error) {
         console.error("Error during registration:", error);
         toast.error(t("auth.register.toast.error.title"), {
            description: error.message,
         });
      } finally {
         setIsLoading(false);
      }
   };
   const handleGoogleSignUp = async () => {
      const provider = new GoogleAuthProvider();

      try {
         setIsLoading(true);
         // Sign in with Google account
         const result = await signInWithPopup(auth, provider);
         const user = result.user;

         // Check if user exists
         const userRef = doc(db, "users", user.uid);
         const userSnap = await getDoc(userRef);

         if (!userSnap.exists()) {
            // New user - save their data
            await saveUserToFirestore(
               user.uid,
               {
                  ...data,
                  fullName: user.displayName,
                  email: user.email,
                  phone: user.phoneNumber || "",
               },
               userType
            );
         }

         toast.success(t("auth.form.toast.googleSuccess.title"), {
            description: t(
               "auth.form.toast.googleSuccess.description" + " " + getUserTypeTranslation()
            )
         });

         navigate("/user");
      } catch (error) {
         console.error("Google Sign-In Error:", error);
         toast.error(t("auth.form.toast.googleError.title"), {
            description: error.message,
         });
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <div className="space-y-6 animate-fade-in">
         {/* Google Sign Up */}
         <Button
            variant="ghost"
            className="w-full text-primary"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
         >
            {isLoading ? (
               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
               <Chrome className="mr-2 h-5 w-5" />
            )}
            {isLoading
               ? t("common.buttons.creating")
               : t("auth.form.googleSignUp")}
         </Button>

         <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
               {t("auth.form.or")}
            </span>
         </div>

         <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground"
         >
            <div className="space-y-2">
               <Label htmlFor="email">
                  {t("common.form.email")} *
               </Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="email"
                     type="email"
                     placeholder={t("auth.form.email.placeholder")}
                     value={email}
                     onChange={(e) =>
                        handleInputChange("email", e.target.value)
                     }
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="phone">
                  {t("common.form.phone")}
               </Label>
               <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="phone"
                     type="tel"
                     placeholder={t("auth.form.phone.placeholder")}
                     value={phone}
                     onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                     }
                     className="pl-10"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="password">
                  {t("common.form.password")} *
               </Label>
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
            <div className="flex items-start space-x-2 pt-4 md:col-span-2">
               <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked)}
                  className={"bg-muted"}
               />
               <label
                  htmlFor="terms"
                  className="text-sm text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

            <div className="flex justify-between pt-4 md:col-span-2">
               <Button
                  onClick={() => setStep(step === 1 ? 1 : step - 1)}
                  variant="outline"
                  disabled={isLoading}
               >
                  {t("common.buttons.back")}
               </Button>
               <Button
                  type="submit"
                  variant="amber"
                  size="lg"
                  disabled={isLoading}
               >
                  {isLoading ? (
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

export default CreateUserFrom;
