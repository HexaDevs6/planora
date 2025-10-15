import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Lock,
  User,
  Building2,
  Users,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    location: "",
  });

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (step === 1 && userType) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome, ${formData.fullName}!`);
    navigate(userType === "vendor" ? "/provider-dashboard" : "/user-dashboard");
  };

  const handleGoogleSignUp = () => {
    alert("Google Sign Up coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-4xl">
        <Card className="border border-text/20 shadow-lg rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md">
          <CardContent className="p-10 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-primary mb-2">
                Create Account
              </h1>
              <p className="text-text text-sm">
                {step === 1 && "Choose your account type"}
                {step === 2 && "Enter your basic information"}
                {step === 3 && "Confirm your details and get started"}
              </p>
            </div>

            {/* Step Progress */}
            <div className="flex items-center justify-center gap-4 mb-12 relative">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 ${
                      step >= i
                        ? "bg-primary text-white border-primary shadow-md scale-105"
                        : "bg-white text-text border-text/30"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`absolute top-1/2 left-10 w-16 h-[2px] rounded-full transition-all duration-300 ${
                        step > i ? "bg-amber" : "bg-text/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1 - Choose Type */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                {/* Client Card */}
                <div
                  onClick={() => setUserType("client")}
                  className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-4 ${
                    userType === "client"
                      ? "border-primary bg-amber/10 shadow-md scale-105"
                      : "border-text/20 hover:border-amber hover:shadow-md"
                  }`}
                >
                  <div className="bg-amber/20 text-primary p-4 rounded-xl">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary">
                    I’m a Client
                  </h3>
                  <p className="text-text text-sm">
                    Discover and book amazing events & services.
                  </p>
                </div>

                {/* Vendor Card */}
                <div
                  onClick={() => setUserType("vendor")}
                  className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-4 ${
                    userType === "vendor"
                      ? "border-primary bg-amber/10 shadow-md scale-105"
                      : "border-text/20 hover:border-amber hover:shadow-md"
                  }`}
                >
                  <div className="bg-amber/20 text-primary p-4 rounded-xl">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg text-primary">
                    I’m a Vendor
                  </h3>
                  <p className="text-text text-sm">
                    Offer your services and manage your clients.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1 Buttons */}
            {step === 1 && (
              <div className="flex justify-between mt-10">
                <Link to="/signin">
                  <Button
                    variant="outline"
                    className="border-text/30 text-text hover:bg-amber/10"
                  >
                    Already have an account?
                  </Button>
                </Link>
                <Button
                  onClick={handleNext}
                  disabled={!userType}
                  className={`transition-all ${
                    userType
                      ? "bg-primary text-white hover:bg-amber"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2 - Basic Info */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                {/* Google Button */}
                <Button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-full border border-text/20 bg-white text-primary shadow-sm hover:shadow-md hover:border-amber transition-all duration-200"
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google logo"
                    className="h-5 w-5"
                  />
                  <span className="font-medium">Continue with Google</span>
                </Button>

                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-text/70">
                    or
                  </span>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup icon={<User />} label="Full Name *" value={formData.fullName} onChange={(v) => handleInputChange("fullName", v)} />
                  <InputGroup icon={<Mail />} label="Email *" value={formData.email} onChange={(v) => handleInputChange("email", v)} />
                  <InputGroup icon={<Phone />} label="Phone *" value={formData.phone} onChange={(v) => handleInputChange("phone", v)} />
                  <InputGroup icon={<Calendar />} label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v) => handleInputChange("dateOfBirth", v)} />
                  <InputGroup icon={<MapPin />} label="Location" value={formData.location} onChange={(v) => handleInputChange("location", v)} colSpan={2} />
                  <InputGroup icon={<Lock />} label="Password *" type="password" value={formData.password} onChange={(v) => handleInputChange("password", v)} />
                  <InputGroup icon={<Lock />} label="Confirm Password *" type="password" value={formData.confirmPassword} onChange={(v) => handleInputChange("confirmPassword", v)} />
                </div>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)} className="border-text/30 text-text hover:bg-amber/10">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="bg-primary text-white hover:bg-amber">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 - Confirm */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-fade-in space-y-8 text-center">
                <p className="text-text text-lg">
                  Please confirm your details before continuing.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-background/60 p-6 rounded-2xl border border-text/20 shadow-sm">
                  <ConfirmField label="Full Name" value={formData.fullName} />
                  <ConfirmField label="Email" value={formData.email} />
                  <ConfirmField label="Phone" value={formData.phone} />
                  <ConfirmField label="Date of Birth" value={formData.dateOfBirth || "—"} />
                  <ConfirmField label="Location" value={formData.location || "—"} />
                  <ConfirmField label="Account Type" value={userType === "vendor" ? "Vendor" : "Client"} />
                </div>

                <div className="flex items-center justify-center gap-3 mt-6">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-text text-sm cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>
                  </Label>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-text/30 text-text hover:bg-amber/10"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!agreedToTerms}
                    className={`transition-all rounded-full px-8 ${
                      agreedToTerms
                        ? "bg-primary text-white hover:bg-amber"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Confirm & Create Account
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InputGroup = ({ icon, label, type = "text", value, onChange, colSpan }) => (
  <div className={`flex flex-col space-y-1 ${colSpan ? "md:col-span-2" : ""}`}>
    <Label className="text-text text-sm font-medium">{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text/60">{icon}</div>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-text/20 focus:border-amber focus:ring-amber rounded-xl"
      />
    </div>
  </div>
);

const ConfirmField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-text/70">{label}</p>
    <p className="font-medium text-primary">{value}</p>
  </div>
);

export default Register;
