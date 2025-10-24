import React from "react";

const ProviderSignUpFrom = ({ data, setFormData, handleNext, setStep, handleSubmit, step, handleGoogleSignUp }) => {
   return (
      <form onSubmit={handleSubmit}>
         <div className="space-y-6 animate-fade-in">
            <Button
               variant="ghost"
               className="w-full text-primary"
               onClick={handleGoogleSignUp}
               type="button"
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
               <Button
                  onClick={() => setStep(step === 1 ? 1 : step - 1)}
                  variant="outline"
                  type="button"
               >
                  Back
               </Button>
               <Button type="submit" variant="amber" size="lg">
                  Sign Up
               </Button>
            </div>
         </div>
      </form>
   );
};

export default ProviderSignUpFrom;
