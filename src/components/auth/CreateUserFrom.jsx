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
import { setLoading } from "@/store/authSlice";
import { supabase } from "@/lib/supabaseClient";
import { RegisterSchema } from "@/validators";

const CreateUserForm = ({
  formData,
  setStep,
  step,
  userType,
  handleInputChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Inject role + agreedToTerms into formData قبل التحقق
    const validationData = {
      ...formData,
      role: userType,
      agreedToTerms,
    };

    // ⭐ Validate using ZOD
    const result = RegisterSchema.safeParse(validationData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      toast.error(t("common.validation.fixErrors"));
      return;
    }

    setErrors({});

    try {
      const { success, user, error } = await dispatch(
        registerUserWithEmail(formData.email, formData.password)
      );

      if (!success || !user) {
        toast.error(error || t("common.errors.somethingWentWrong"));
        return;
      }

      const { success: infoSuccess, error: infoError } = await dispatch(
        saveUserInfo({
          userId: user.id,
          userInfo: { ...formData },
          categories: formData.categories || [],
          role: userType,
        })
      );

      if (infoSuccess) {
        toast.success(t("auth.register.toast.success.title"));
        navigate("/");
      } else {
        toast.error(infoError || t("common.errors.somethingWentWrong"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("common.errors.somethingWentWrong"));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* GOOGLE SIGNUP */}
      <Button
        variant="outline"
        onClick={() => {}}
        disabled={loading || !agreedToTerms}
        className={`w-full flex items-center justify-center gap-3 border-2 rounded-md py-4 transition-all
          ${
            !agreedToTerms
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-amber hover:bg-amber/10"
          }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-amber" />
            <span className="text-amber">Loading...</span>
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

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
          {t("auth.form.or")}
        </span>
      </div>

      {/* FORM */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        {/* EMAIL */}
        <div className="space-y-2">
          <Label>Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email[0]}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone[0]}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <Label>Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password[0]}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="space-y-2">
          <Label>Confirm Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="pl-10"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword[0]}</p>
          )}
        </div>

        {/* TERMS */}
        <div className="flex items-start space-x-2 pt-4 md:col-span-2">
          <Checkbox
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked)}
          />
          <label className="text-sm">
            {t("auth.form.terms.text")}
            <Link
              to="/terms"
              target="_blank"
              className="text-primary underline"
            >
              Terms
            </Link>
            {" and "}
            <Link to="/privacy" className="text-primary underline">
              Privacy
            </Link>
          </label>
        </div>
        {errors.agreedToTerms && (
          <p className="text-red-500 text-xs md:col-span-2">
            {errors.agreedToTerms[0]}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between pt-4 md:col-span-2">
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>

          <Button
            type="submit"
            variant="amber"
            disabled={loading || !agreedToTerms}
            className={`${
              !agreedToTerms ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {" "}
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
