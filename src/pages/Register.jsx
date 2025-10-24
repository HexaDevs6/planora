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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
   Mail,
   Lock,
   User,
   Chrome,
   Building2,
   Users,
   Phone,
   MapPin,
   Calendar,
   Tag,
   DollarSign,
   Briefcase,
   Heart,
   BriefcaseBusiness,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import CustomerSignUpFrom from "@/components/auth/CustomerSignUpFrom";
import ProviderInfoFrom from "@/components/auth/ProviderInfoFrom";
const saveUserToFirestore = async (uid, formData, userType) => {
   try {
      await setDoc(doc(db, "users", uid), {
         fullName: formData.fullName,
         email: formData.email,
         phone: formData.phone,
         dateOfBirth: formData.dateOfBirth,
         location: formData.location,
         userType,
         interests: formData.interests || [],
         businessName: formData.businessName || "",
         businessType: formData.businessType || "",
         serviceCategory: formData.serviceCategory || "",
         businessDescription: formData.businessDescription || "",
         createdAt: serverTimestamp(),
      });
      toast.success("Account saved to Firestore ✅");
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
      dateOfBirth: "",
      location: "",
      // Client-specific
      interests: [],
      eventPreferences: "",
      budgetRange: "",
      // Vendor-specific
      businessName: "",
      businessType: "",
      serviceCategory: "",
      yearsExperience: "",
      businessDescription: "",
      priceRange: "",
      portfolio: "",
      certifications: "",
      serviceArea: "",
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

   const serviceCategoryOptions = [
      "Venue & Space",
      "Catering & Food",
      "Photography & Videography",
      "Entertainment (DJ, Band, etc.)",
      "Decoration & Design",
      "Event Planning & Coordination",
      "Audio/Visual Equipment",
      "Transportation",
      "Security",
      "Other Services",
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

      if (!agreedToTerms) {
         toast.warning("You must agree to the terms and conditions");
         return false;
      }

      return true;
   };
   const validateStep3 = () => {
      const { fullName, email, password, confirmPassword, phone } = formData;
      if (!fullName || !email || !password || !confirmPassword || !phone) {
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
      e.preventDefault();

      if (!validateStep3()) {
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

         setFormData(initialState);
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
                                             {/* <Checkbox
                                checked={formData.interests.includes(interest)}
                              /> */}
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
                           <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="businessName">
                                       Business/Company Name *
                                    </Label>
                                    <div className="relative">
                                       <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                       <Input
                                          id="businessName"
                                          placeholder="Your Business Name"
                                          value={formData.businessName}
                                          onChange={(e) =>
                                             handleInputChange(
                                                "businessName",
                                                e.target.value
                                             )
                                          }
                                          className="pl-10"
                                          required
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="businessType">
                                       Business Type
                                    </Label>
                                    <RadioGroup
                                       value={formData.businessType}
                                       onValueChange={(value) =>
                                          handleInputChange(
                                             "businessType",
                                             value
                                          )
                                       }
                                    >
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                             value="individual"
                                             id="individual"
                                          />
                                          <Label htmlFor="individual">
                                             Individual/Freelancer
                                          </Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem
                                             value="company"
                                             id="company"
                                          />
                                          <Label htmlFor="company">
                                             Registered Company
                                          </Label>
                                       </div>
                                    </RadioGroup>
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="yearsExperience">
                                       Years of Experience
                                    </Label>
                                    <div className="relative">
                                       <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                       <Input
                                          id="yearsExperience"
                                          type="number"
                                          placeholder="5"
                                          value={formData.yearsExperience}
                                          onChange={(e) =>
                                             handleInputChange(
                                                "yearsExperience",
                                                e.target.value
                                             )
                                          }
                                          className="pl-10"
                                          min="0"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="serviceCategory">
                                       Service Category *
                                    </Label>
                                    <div className="relative">
                                       <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                       <select
                                          id="serviceCategory"
                                          value={formData.serviceCategory}
                                          onChange={(e) =>
                                             handleInputChange(
                                                "serviceCategory",
                                                e.target.value
                                             )
                                          }
                                          className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                          required
                                       >
                                          <option value="">
                                             Select a category
                                          </option>
                                          {serviceCategoryOptions.map((cat) => (
                                             <option key={cat} value={cat}>
                                                {cat}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                 </div>

                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="businessDescription">
                                       Business Description *
                                    </Label>
                                    <Textarea
                                       id="businessDescription"
                                       placeholder="Describe your services, expertise, and what makes your business unique..."
                                       value={formData.businessDescription}
                                       onChange={(e) =>
                                          handleInputChange(
                                             "businessDescription",
                                             e.target.value
                                          )
                                       }
                                       rows={4}
                                       required
                                    />
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="priceRange">
                                       Price Range
                                    </Label>
                                    <div className="relative">
                                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                       <Input
                                          id="priceRange"
                                          placeholder="e.g., $500 - $2000"
                                          value={formData.priceRange}
                                          onChange={(e) =>
                                             handleInputChange(
                                                "priceRange",
                                                e.target.value
                                             )
                                          }
                                          className="pl-10"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <Label htmlFor="serviceArea">
                                       Service Area
                                    </Label>
                                    <div className="relative">
                                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                       <Input
                                          id="serviceArea"
                                          placeholder="Cities/regions you serve"
                                          value={formData.serviceArea}
                                          onChange={(e) =>
                                             handleInputChange(
                                                "serviceArea",
                                                e.target.value
                                             )
                                          }
                                          className="pl-10"
                                       />
                                    </div>
                                 </div>

                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="portfolio">
                                       Portfolio/Website URL
                                    </Label>
                                    <Input
                                       id="portfolio"
                                       type="url"
                                       placeholder="https://yourportfolio.com"
                                       value={formData.portfolio}
                                       onChange={(e) =>
                                          handleInputChange(
                                             "portfolio",
                                             e.target.value
                                          )
                                       }
                                    />
                                 </div>

                                 <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="certifications">
                                       Certifications/Licenses (Optional)
                                    </Label>
                                    <Textarea
                                       id="certifications"
                                       placeholder="List any relevant certifications, licenses, or awards..."
                                       value={formData.certifications}
                                       onChange={(e) =>
                                          handleInputChange(
                                             "certifications",
                                             e.target.value
                                          )
                                       }
                                       rows={3}
                                    />
                                 </div>
                              </div>
                           </>
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
                        />
                     ) : userType === "vendor" ? (
                        <VendorSignUpFrom
                           data={formData}
                           setFormData={setFormData}
                           handleNext={handleNext}
                           setStep={setStep}
                           handleSubmit={handleSubmit}
                           step={step}
                        />
                     ) : userType === "provider" ? (
                        <ProviderSignUpFrom
                           data={formData}
                           setFormData={setFormData}
                           handleNext={handleNext}
                           setStep={setStep}
                           handleSubmit={handleSubmit}
                           step={step}
							handleGoogleSignUp={handleGoogleSignUp}
                        />
                     ) : null)}
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default Register;
