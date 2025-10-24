import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, User, Lock } from "lucide-react";
import { Chrome } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CustomerSignUpFrom = ({data, setFormData, handleNext, setStep, handleSubmit, step}) => {
   let {fullName, email, phone, dateOfBirth, location, password, confirmPassword} = data;
   const navigate = useNavigate();
   const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
  };
   const handleGoogleSignUp = async () => {
      const provider = new GoogleAuthProvider();

      try {
          // تسجيل الدخول بحساب Google
          const result = await signInWithPopup(auth, provider);
          const user = result.user;

          // التحقق من وجود المستخدم
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
              // مستخدم جديد — احفظ بياناته
              await setDoc(userRef, {
                  fullName: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL || "",
                  userType: userType,
                  createdAt: new Date(),
              });
          }

          toast.success("Signed in with Google!", {
              description: `Welcome to Planora as a ${userType}!`,
          });

          // التوجيه بعد التسجيل
          setTimeout(() => {
              if (userType === "vendor") {
                  navigate("/");
              } else {
                  navigate("/");
              }
          }, 1500);
      } catch (error) {
          console.error("Google Sign-In Error:", error);
          toast.error("Google Sign-In failed", {
              description: error.message,
          });
      }
  };
   return (
      <form onSubmit={handleSubmit}>
         <div className="space-y-6 animate-fade-in">
            {/* Google Sign Up */}
            <Button
               variant="ghost"
               className="w-full text-primary"
               onClick={handleGoogleSignUp}
            >
               <Chrome className="mr-2 h-5 w-5" />
               Continue with Google
            </Button>

            <div className="relative">
               <Separator />
               <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                  or
               </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) =>
                           handleInputChange("fullName", e.target.value)
                        }
                        className="pl-10"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) =>
                           handleInputChange("phone", e.target.value)
                        }
                        className="pl-10"
                        required
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="password"
                        type="password"
                        placeholder="Min. 8 characters"
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
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) =>
                           handleInputChange("confirmPassword", e.target.value)
                        }
                        className="pl-10"
                        required
                     />
                  </div>
               </div>
            </div>

            <div className="flex justify-between pt-4">
               <Button onClick={() => setStep(step === 1 ? 1 : step - 1)} variant="outline">
                  Back
               </Button>
               <Button onClick={handleNext} variant="amber" size="lg">
                  Continue
               </Button>
            </div>
         </div>
      </form>
   );
};

export default CustomerSignUpFrom;
