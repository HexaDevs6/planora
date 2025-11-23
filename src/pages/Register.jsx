import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import HostInfoForm from "@/components/auth/HostInfoForm";
import { useTranslation } from "react-i18next";
import ClientInfoFrom from "@/components/auth/ClientInfoFrom";
import CreateUserFrom from "@/components/auth/CreateUserFrom";
import { RegisterSchema } from "@/validators";



const Register = () => {
   const [step, setStep] = useState(1);
   const [userType, setUserType] = useState(""); // "client", "host", or
   const { t } = useTranslation();
   const [errors, setErrors] = useState({});


   const [formData, setFormData] = useState({
      email: "",
      password: "",
      role: "",
      full_name: "",
      confirmPassword: "",
      phone: "",
      avatar: "",
      bio: "", // client bio
      categories: [], // host
      facebook: "",
      instagram: "",
      location: "",
   });
   
   const usersTypes = [
      {
         type: "client",
         title: t("auth.register.step1.client.title"),
         description: t("auth.register.step1.client.description"),
         icon: <Users className="h-10 w-10" />,
         features: t("auth.register.step1.client.features", {
            returnObjects: true,
         }),
      },
      {
         type: "host",
         title: t("auth.register.step1.host.title"),
         description: t("auth.register.step1.host.description"),
         icon: <Building2 className="h-10 w-10" />,
         features: t("auth.register.step1.host.features", {
            returnObjects: true,
         }),
      },
   ];

   const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const toggleInterest = (interest) => {
      setFormData((prev) => ({
         ...prev,
         categories: prev.categories.includes(interest)
            ? prev.categories.filter((i) => i !== interest)
            : [...prev.categories, interest],
      }));
   };

   const validateStep1 = () => {
      if (!userType) {
         toast.error(t("auth.register.toast.validation.selectUserType"));
         return false;
      }
      return true;
   };

   const validateStep2 = () => {
      if (userType === "client" && (formData.categories.length === 0 || !formData.full_name)) {
         toast.warning(t("auth.register.toast.validation.selectInterestsAndFullName"));
         return false;
      }

      if (
         userType === "host" &&
         (!formData.full_name ||
            formData.categories.length === 0)
      ) {
         toast.warning(t("auth.register.toast.validation.fillBusinessInfo"));
         return false;
      }

      return true;
   };

   const handleNext = () => {
      console.log(userType);

      if (step === 1 && validateStep1()) {
         setStep(2);
      } else if (step === 2 && validateStep2()) {
         setStep(3);
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
                        {t("auth.register.title")}
                     </h1>
                     <p className="text-muted-foreground">
                        {step === 1 && t("auth.register.step1.subtitle")}
                        {step === 2 &&
                           userType === "client" &&
                           t("auth.register.step2.client.subtitle")}
                        {step === 2 &&
                           userType === "host" &&
                           t("auth.register.step2.host.subtitle")}
                        {step === 3 && t("auth.register.step3.subtitle")}
                     </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-2 mb-8">
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-muted"
                           }`}
                     />
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-muted"
                           }`}
                     />
                     <div
                        className={`h-2 w-20 rounded-full transition-all ${step >= 3 ? "bg-primary" : "bg-muted"
                           }`}
                     />
                  </div>

                  {/* Step 1: User Type Selection */}
                  {step === 1 && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {usersTypes.map((type, i) => (
                              <Card
                                 key={i}
                                 className={`cursor-pointer transition-all duration-300 ${userType === type.type
                                       ? "border-primary shadow-accent bg-primary/5"
                                       : "border-border hover:border-primary/50 hover:shadow-card"
                                    }`}
                                 onClick={() => setUserType(type.type)}
                              >
                                 <CardContent className="px-4 py-6 text-center space-y-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary text-primary mx-auto border border-primary">
                                       {type.icon}
                                    </div>
                                    <h3 className="text-xl font-bold">
                                       {type.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {type.description}
                                    </p>
                                    <ul className="text-xs text-muted-foreground text-start space-y-1">
                                       {type.features.map((feature, index) => (
                                          <li key={index}>• {feature}</li>
                                       ))}
                                    </ul>
                                 </CardContent>
                              </Card>
                           ))}
                        </div>

                        <div className="flex justify-between pt-4">
                           <Link to="/signin">
                              <Button variant="link">
                                 {t("auth.register.step1.alreadyHaveAccount")}
                              </Button>
                           </Link>
                           <Button
                              onClick={handleNext}
                              variant="amber"
                              size="lg"
                              disabled={!userType}
                              className={
                                 !userType
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                              }
                           >
                              {t("common.buttons.continue")}
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Step 2: Client-Specific or host-Specific */}
                  {step === 2 && (
                     <div className="space-y-6 animate-fade-in">
                        {userType === "client" && (
                           <ClientInfoFrom
                              formData={formData}
                              handleInputChange={handleInputChange}
                              toggleInterest={toggleInterest}
                           />
                        )}

                        {userType === "host" && (
                           <HostInfoForm
                              formData={formData}
                              handleInputChange={handleInputChange}
                              toggleInterest={toggleInterest}
                           />
                        )}

                        <div className="flex justify-between pt-4">
                           <Button
                              onClick={() => setStep(step === 1 ? 1 : step - 1)}
                              variant="outline"
                              type="button"
                           >
                              {t("common.buttons.back")}
                           </Button>
                           <Button
                              type="button"
                              onClick={handleNext}
                              variant="amber"
                              size="lg"
                           >
                              {t("common.buttons.continue")}
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Step 3: Basic Information */}
                  {step === 3 && (
                     <CreateUserFrom
                        formData={formData}
                        setStep={setStep}
                        step={step}
                        userType={userType}
                        handleInputChange={handleInputChange}
                     />
                  )}
               </CardContent>
            </Card>
         </div>

      </div>
   );
};
export default Register;
