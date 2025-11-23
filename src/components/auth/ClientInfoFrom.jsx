import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDirection } from "@/hooks/useDirection";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { useEffect } from "react";

const ClientInfoForm = ({
  formData,
  handleInputChange,
  toggleInterest,
  errors,       // ⭐ ADDED
  setErrors,    // ⭐ ADDED
}) => {

  const { t } = useTranslation();
  const { lang } = useDirection();
  const dispatch = useDispatch();

  const { data: categories, loading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  // filter & translate category names
  const interestOptions = categories
    .filter((category) => category.type === "event")
    .map((category) => ({
      ...category,
      displayName: lang === "ar" ? category.name_ar : category.name,
    }));

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  return (
    <>
      {/* Interests Selection */}
      <div className="space-y-4">
        <Label>{t("auth.register.step2.client.interestsLabel")}</Label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((interest) => (
            <div
              key={interest.id}
              onClick={(e) => {
                e.preventDefault();
                toggleInterest(interest.id);
                setErrors((prev) => ({ ...prev, categories: null })); // clear error
              }}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all 
                ${
                  formData.categories.includes(interest.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {interest.displayName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ⭐ Categories ERROR */}
        {errors?.categories && (
          <p className="text-red-500 text-xs mt-1">{errors.categories[0]}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">{t("common.form.fullName")} *</Label>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          <Input
            id="full_name"
            placeholder={t("auth.form.fullName.placeholder")}
            value={formData.full_name}
            onChange={(e) => {
              handleInputChange("full_name", e.target.value);
              setErrors((prev) => ({ ...prev, full_name: null })); // clear on typing
            }}
            className={`pl-10 ${
              errors?.full_name ? "border-red-500" : ""
            }`}
          />
        </div>

        {/* ⭐ Full Name ERROR */}
        {errors?.full_name && (
          <p className="text-red-500 text-xs mt-1">{errors.full_name[0]}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">
          {t("auth.register.step2.client.eventPreferencesLabel")}
        </Label>

        <Textarea
          id="bio"
          placeholder={t(
            "auth.register.step2.client.eventPreferencesPlaceholder"
          )}
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          rows={4}
        />

        {/* ⭐ Optional — لو عملنا Zod للبـ Bio */}
        {errors?.bio && (
          <p className="text-red-500 text-xs mt-1">{errors.bio[0]}</p>
        )}
      </div>

      {console.log("formData", formData)}
    </>
  );
};

export default ClientInfoForm;
