import {
   createUserWithEmailAndPassword,
   fetchSignInMethodsForEmail,
   signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Users, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import CustomerSignUpFrom from "@/components/auth/CustomerSignUpFrom";
import ProviderInfoFrom from "@/components/auth/ProviderInfoFrom";
import VendorSignUpFrom from "@/components/auth/VendorSignUpFrom";
import VendorInfoForm from "@/components/auth/VendorInfoForm";
import ProviderSignUpFrom from "@/components/auth/ProviderSignUpFrom";

const saveUserToFirestore = async (uid, formData, userType) => {
   let data = {};
   switch (userType) {
      case "client":
         data = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || "",
            interests: formData.interests,
            eventPreferences: formData.eventPreferences || "",
            userType: userType,
            createdAt: serverTimestamp(),
         };
         break;
      case "vendor":
         data = {
            businessName: formData.businessName, //
            category: formData.category, //
            businessDescription: formData.businessDescription,
            facebook: formData.facebook,
            instagram: formData.instagram,
            userType: userType,
            createdAt: serverTimestamp(),
         };
         break;
      case "provider":
         data = {
            fullName: formData.fullName,
            service: formData.service,
            bio: formData.bio,
            email: formData.email,
            userType: userType,
            createdAt: serverTimestamp(),
         };
         break;
   }
   try {
      await setDoc(doc(db, "users", uid), {
         ...data,
      });
   } catch (error) {
      console.error("Firestore Error:", error);
      toast.error("Error saving data: " + error.message);
   }
};

const Register = () => {
   const [step, setStep] = useState(1);
   const [userType, setUserType] = useState(""); // "client" or "vendor"
   const [agreedToTerms, setAgreedToTerms] = useState(false);
   const navigate = useNavigate();
   // Common fields
   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      // Client-specific
      interests: [],
      eventPreferences: "",
      // Vendor-specific
      businessName: "",
      serviceCategory: "",
      businessDescription: "",
      category: "",
      facebook: "",
      instagram: "",
      bio: "",
      service: "",
   });

   const interestOptions = [
      "Concerts & Music",
      "Conferences & Business",
      "Sports & Fitness",
      "Art & Culture",
      "Food & Dining",
      "Technology",
      "Networking",
      "Education & Workshops",
      "Entertainment",
      "Community Events",
   ];

   const usersTypes = [
      {
         type: "client",
         title: "I'm a Client",
         description:
            "Browse events, book tickets, and hire service providers for your events",
         icon: <Users className="h-10 w-10" />,
         list: [
            {
               en: "Discover amazing events",
               ar: "اكتشف الأحداث الرائعة",
            },
            {
               en: "Book event services",
               ar: "احجز خدمات الأحداث",
            },
            {
               en: "Manage your bookings",
               ar: "إدارة الحجوزات",
            },
            {
               en: "Get personalized recommendations",
               ar: "احصل على توصيات مخصصة لك",
            },
         ],
      },
      {
         type: "vendor",
         title: "I'm a Vendor",
         description:
            "Offer your services, manage bookings, and grow your event business",
         icon: <Building2 className="h-10 w-10" />,
         list: [
            {
               en: "List your services",
               ar: "أضف خدماتك",
            },
            {
               en: "Receive booking requests",
               ar: "استقبل طلبات الحجوزات",
            },
            {
               en: "Manage your bookings",
               ar: "إدارة الحجوزات",
            },
            {
               en: "Get personalized recommendations",
               ar: "احصل على توصيات مخصصة لك",
            },
         ],
      },
      {
         type: "provider",
         title: "I'm a Provider",
         description:
            "Offer your services, manage bookings, and grow your event business",
         icon: <BriefcaseBusiness className="h-10 w-10" />,
         list: [
            {
               en: "List your services",
               ar: "أضف خدماتك",
            },
            {
               en: "Receive booking requests",
               ar: "استقبل طلبات الحجوزات",
            },
            {
               en: "Manage your bookings",
               ar: "إدارة الحجوزات",
            },
            {
               en: "Get personalized recommendations",
               ar: "احصل على توصيات مخصصة لك",
            },
         ],
      },
   ];

   const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const toggleInterest = (interest) => {
      setFormData((prev) => ({
         ...prev,
         interests: prev.interests.includes(interest)
            ? prev.interests.filter((i) => i !== interest)
            : [...prev.interests, interest],
      }));
   };

   const validateStep1 = () => {
      if (!userType) {
         toast.error("Please select whether you're a client or vendor");
         return false;
      }
      return true;
   };

   const validateStep2 = () => {
      if (userType === "client" && formData.interests.length === 0) {
         toast.warning("Please select at least one interest");
         return false;
      }

      if (
         userType === "vendor" &&
         (!formData.businessName ||
            !formData.serviceCategory ||
            !formData.businessDescription)
      ) {
         toast.warning("Please fill in all required business information");
         return false;
      }

      if (
         userType === "provider" &&
         (!formData.fullName || !formData.service || !formData.bio)
      ) {
         toast.warning("Please fill in all required information");
         return false;
      }

      return true;
   };

   const validateStep3 = () => {
      const { email, password, confirmPassword } = formData;
      if (!email || !password || !confirmPassword) {
         toast.error("Please fill in all required fields");
         return false;
      }

      if (password !== confirmPassword) {
         toast.error("Passwords do not match");
         return false;
      }

      if (password.length < 8) {
         toast.warning("Password must be at least 8 characters");
         return false;
      }
      if (!agreedToTerms) {
         toast.warning("You must agree to the terms and conditions");
         return false;
      }

      return true;
   };

   const handleNext = () => {
      if (step === 1 && validateStep1()) {
         setStep(2);
      } else if (step === 2 && validateStep2()) {
         setStep(3);
      }
   };

   const handleSubmit = async (e) => {
      console.log("handleSubmit");

      e.preventDefault();

      if (!validateStep3()) {
         console.log("validateStep3 failed");

         return;
      }

      try {
         // check if email already exists in Firestore
         const methods = await fetchSignInMethodsForEmail(auth, formData.email);
         if (methods.length > 0) {
            toast.error("Email already exists");
            return;
         }
         // ✅ إنشاء مستخدم جديد في Firebase Authentication
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
         );
         const user = userCredential.user;

         // ✅ حفظ بيانات المستخدم في Firestore

         await saveUserToFirestore(user.uid, formData, userType);

         // ✅ إشعار نجاح
         toast.success("Registration Successful!", {
            description: `Welcome to Planora as a ${userType}!`,
         });

         // ✅ توجيه المستخدم بعد النجاح
         setTimeout(() => {
            if (userType === "vendor") {
               navigate("/");
            } else {
               navigate("/user");
            }
         }, 1500);

         setFormData("");
      } catch (error) {
         console.error("Error during registration:", error);
         toast.error("Registration failed", {
            description: error.message,
         });
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
         <div className="w-full max-w-4xl">
            <Card className="border-0 shadow-hover">
               <CardContent className="p-8 md:p-12">
                  {/* Logo and Title */}
                  <div className="text-center mb-8">
                     <div className="text-4xl font-bold text-primary mb-4">
                        Planora
                     </div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">
                        Create Account
                     </h1>
                     <p className="text-muted-foreground">
                        {step === 1 && "Choose your account type"}
                        {step === 2 &&
                           userType === "client" &&
                           "Tell us about your interests"}
                        {step === 2 &&
                           userType === "vendor" &&
                           "Complete your business profile"}
                        {step === 3 && "Enter your basic information"}
                     </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-2 mb-8">
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${
                           step >= 1 ? "bg-primary" : "bg-muted"
                        }`}
                     />
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${
                           step >= 2 ? "bg-primary" : "bg-muted"
                        }`}
                     />
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${
                           step >= 3 ? "bg-primary" : "bg-muted"
                        }`}
                     />
                  </div>

                  {/* Step 1: User Type Selection */}
                  {step === 1 && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {usersTypes.map((type, i) => (
                              <Card
                                 className={`cursor-pointer transition-all duration-300 ${
                                    userType === type.type
                                       ? "border-primary shadow-accent bg-primary/5"
                                       : "border-border hover:border-primary/50 hover:shadow-card"
                                 }`}
                                 onClick={() => setUserType(type.type)}
                              >
                                 <CardContent className="p-8 text-center space-y-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary text-primary mx-auto border border-primary">
                                       {type.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">
                                       {type.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {type.description}
                                    </p>
                                    <ul className="text-sm text-muted-foreground text-left space-y-2">
                                       {type.list.map((item) => (
                                          <li key={item.en}>• {item.en}</li>
                                       ))}
                                    </ul>
                                 </CardContent>
                              </Card>
                           ))}
                        </div>

                        <div className="flex justify-between pt-4">
                           <Link to="/signin">
                              <Button variant="link">
                                 Already have an account?
                              </Button>
                           </Link>
                           <Button
                              onClick={handleNext}
                              variant="amber"
                              size="lg"
                           >
                              Continue
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Step 2: Client-Specific or Vendor-Specific */}
                  {step === 2 && (
                     <div className="space-y-6 animate-fade-in">
                        {userType === "client" && (
                           <>
                              <div className="space-y-4">
                                 <Label>
                                    Your Interests * (Select at least one)
                                 </Label>
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {interestOptions.map((interest) => (
                                       <div
                                          key={interest}
                                          onClick={(e) => {
                                             e.preventDefault();
                                             toggleInterest(interest);
                                          }}
                                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                             formData.interests.includes(
                                                interest
                                             )
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                          }`}
                                       >
                                          <div className="flex items-center gap-2">
                                             <span className="text-sm font-medium">
                                                {interest}
                                             </span>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="eventPreferences">
                                    Event Preferences (Optional)
                                 </Label>
                                 <Textarea
                                    id="eventPreferences"
                                    placeholder="Tell us about the types of events you typically attend or organize..."
                                    value={formData.eventPreferences}
                                    onChange={(e) =>
                                       handleInputChange(
                                          "eventPreferences",
                                          e.target.value
                                       )
                                    }
                                    rows={4}
                                 />
                              </div>
                           </>
                        )}

                        {userType === "vendor" && (
                           <VendorInfoForm
                              formData={formData}
                              handleInputChange={handleInputChange}
                           />
                        )}
                        {userType === "provider" && (
                           <ProviderInfoFrom
                              formData={formData}
                              handleInputChange={handleInputChange}
                           />
                        )}

                        <div className="flex justify-between pt-4">
                           <Button
                              onClick={() => setStep(step === 1 ? 1 : step - 1)}
                              variant="outline"
                              type="button"
                           >
                              Back
                           </Button>
                           <Button
                              type="button"
                              onClick={handleNext}
                              variant="amber"
                              size="lg"
                           >
                              Continue
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Step 3: Basic Information */}
                  {step === 3 &&
                     (userType === "client" ? (
                        <CustomerSignUpFrom
                           data={formData}
                           setFormData={setFormData}
                           handleNext={handleNext}
                           setStep={setStep}
                           handleSubmit={handleSubmit}
                           step={step}
                           userType={userType}
                           agreedToTerms={agreedToTerms}
                           setAgreedToTerms={setAgreedToTerms}
                        />
                     ) : userType === "vendor" ? (
                        <VendorSignUpFrom
                           data={formData}
                           setFormData={setFormData}
                           handleNext={handleNext}
                           setStep={setStep}
                           handleSubmit={handleSubmit}
                           step={step}
                           userType={userType}
                           agreedToTerms={agreedToTerms}
                           setAgreedToTerms={setAgreedToTerms}
                        />
                     ) : userType === "provider" ? (
                        <ProviderSignUpFrom
                           data={formData}
                           setFormData={setFormData}
                           handleNext={handleNext}
                           setStep={setStep}
                           handleSubmit={handleSubmit}
                           step={step}
                           userType={userType}
                           agreedToTerms={agreedToTerms}
                           setAgreedToTerms={setAgreedToTerms}
                           handleInputChange={handleInputChange}
                        />
                     ) : null)}
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default Register;
