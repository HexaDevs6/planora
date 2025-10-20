import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  Heart
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
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
      createdAt: new Date(),
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
    serviceArea: ""
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
    "Community Events"
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
    "Other Services"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
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
  const validateStep1 = () => {
    if (!userType) {
      toast.error("Please select whether you're a client or vendor");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
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
  const validateStep3 = () => {
    if (userType === "client" && formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return false;
    }

    if (
      userType === "vendor" &&
      (!formData.businessName || !formData.serviceCategory || !formData.businessDescription)
    ) {
      toast.error("Please fill in all required business information");
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
  e.preventDefault();

  if (!validateStep3()) {
    return;
  }

  try {
    // ✅ إنشاء مستخدم جديد في Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;

    // ✅ حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, "users", user.uid), {
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
      createdAt: new Date(),
    });

    // ✅ إشعار نجاح
    toast.success("Registration Successful!", {
      description: `Welcome to Planora as a ${userType}!`,
    });

    // ✅ توجيه المستخدم بعد النجاح
    setTimeout(() => {
      if (userType === "vendor") {
        navigate("/");
      } else {
        navigate("/");
      }
    }, 1500);
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                {step === 1 && "Choose your account type"}
                {step === 2 && "Enter your basic information"}
                {step === 3 && userType === "client" && "Tell us about your interests"}
                {step === 3 && userType === "vendor" && "Complete your business profile"}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              <div className={`h-2 w-20 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-20 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-20 rounded-full transition-all ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            {/* Step 1: User Type Selection */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${userType === "client"
                        ? "border-primary shadow-accent bg-primary/5"
                        : "border-border hover:border-primary/50 hover:shadow-card"
                      }`}
                    onClick={() => setUserType("client")}
                  >
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary text-primary mx-auto border border-primary">
                        <Users className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold">I'm a Client</h3>
                      <p className="text-sm text-muted-foreground">
                        Browse events, book tickets, and hire service providers for your events
                      </p>
                      <ul className="text-sm text-muted-foreground text-left space-y-2">
                        <li>• Discover amazing events</li>
                        <li>• Book event services</li>
                        <li>• Manage your bookings</li>
                        <li>• Get personalized recommendations</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all duration-300 ${userType === "vendor"
                        ? "border-primary shadow-accent bg-primary/5"
                        : "border-border hover:border-primary/50 hover:shadow-card"
                      }`}
                    onClick={() => setUserType("vendor")}
                  >
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-accent text-primary border border-primary mx-auto">
                        <Building2 className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold">I'm a Vendor</h3>
                      <p className="text-sm text-muted-foreground">
                        Offer your services, manage bookings, and grow your event business
                      </p>
                      <ul className="text-sm text-muted-foreground text-left space-y-2">
                        <li>• List your services</li>
                        <li>• Receive booking requests</li>
                        <li>• Manage your business</li>
                        <li>• Analytics & insights</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between pt-4">
                  <Link to="/signin">
                    <Button variant="link">
                      Already have an account?
                    </Button>
                  </Link>
                  <Button onClick={handleNext} variant="amber" size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {step === 2 && (
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
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
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
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="City, State/Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="pl-10"
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
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleNext} variant="amber" size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Client-Specific or Vendor-Specific */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                {userType === "client" && (
                  <>
                    <div className="space-y-4">
                      <Label>Your Interests * (Select at least one)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => (
                          <div
                            key={interest}

                            onClick={(e) => {
                              e.preventDefault();
                              toggleInterest(interest);
                            }}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.interests.includes(interest)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              {/* <Checkbox
                                checked={formData.interests.includes(interest)}
                              /> */}
                              <span className="text-sm font-medium">{interest}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Typical Event Budget Range</Label>
                      <RadioGroup
                        value={formData.budgetRange}
                        onValueChange={(value) => handleInputChange("budgetRange", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="under-1000" id="under-1000" />
                          <Label htmlFor="under-1000">Under $1,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1000-5000" id="1000-5000" />
                          <Label htmlFor="1000-5000">$1,000 - $5,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5000-10000" id="5000-10000" />
                          <Label htmlFor="5000-10000">$5,000 - $10,000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="over-10000" id="over-10000" />
                          <Label htmlFor="over-10000">Over $10,000</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventPreferences">Event Preferences (Optional)</Label>
                      <Textarea
                        id="eventPreferences"
                        placeholder="Tell us about the types of events you typically attend or organize..."
                        value={formData.eventPreferences}
                        onChange={(e) => handleInputChange("eventPreferences", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {userType === "vendor" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessName">Business/Company Name *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="businessName"
                            placeholder="Your Business Name"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange("businessName", e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <RadioGroup
                          value={formData.businessType}
                          onValueChange={(value) => handleInputChange("businessType", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="individual" id="individual" />
                            <Label htmlFor="individual">Individual/Freelancer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="company" id="company" />
                            <Label htmlFor="company">Registered Company</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearsExperience">Years of Experience</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="yearsExperience"
                            type="number"
                            placeholder="5"
                            value={formData.yearsExperience}
                            onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                            className="pl-10"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="serviceCategory">Service Category *</Label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <select
                            id="serviceCategory"
                            value={formData.serviceCategory}
                            onChange={(e) => handleInputChange("serviceCategory", e.target.value)}
                            className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                          >
                            <option value="">Select a category</option>
                            {serviceCategoryOptions.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessDescription">Business Description *</Label>
                        <Textarea
                          id="businessDescription"
                          placeholder="Describe your services, expertise, and what makes your business unique..."
                          value={formData.businessDescription}
                          onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priceRange">Price Range</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="priceRange"
                            placeholder="e.g., $500 - $2000"
                            value={formData.priceRange}
                            onChange={(e) => handleInputChange("priceRange", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceArea">Service Area</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="serviceArea"
                            placeholder="Cities/regions you serve"
                            value={formData.serviceArea}
                            onChange={(e) => handleInputChange("serviceArea", e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="portfolio">Portfolio/Website URL</Label>
                        <Input
                          id="portfolio"
                          type="url"
                          placeholder="https://yourportfolio.com"
                          value={formData.portfolio}
                          onChange={(e) => handleInputChange("portfolio", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="certifications">Certifications/Licenses (Optional)</Label>
                        <Textarea
                          id="certifications"
                          placeholder="List any relevant certifications, licenses, or awards..."
                          value={formData.certifications}
                          onChange={(e) => handleInputChange("certifications", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={() => setStep(2)} variant="outline" type="button">
                    Back
                  </Button>
                  <Button type="submit" variant="amber" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            {step !== 1 && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default Register;

