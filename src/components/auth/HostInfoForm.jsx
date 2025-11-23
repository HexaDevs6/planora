import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Facebook, Instagram } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { useDirection } from "@/hooks/useDirection";

const HostInfoForm = ({
  formData,
  handleInputChange,
  toggleInterest,
  errors,       // ⭐ ADDED
  setErrors,    // ⭐ ADDED
}) => {
  const { full_name, bio, facebook, instagram } = formData;
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
  }, [dispatch, categories]);

  const CategoryOptions = categories
    .filter((category) => category.type === "event")
    .map((category) => ({
      ...category,
      displayName: lang === "ar" ? category.name_ar : category.name,
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-muted-foreground">
          {t("loading") || "Loading categories..."}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName">
          {t("auth.hostInfo.businessName.label")} *
        </Label>

        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          <Input
            id="businessName"
            placeholder={t("auth.hostInfo.businessName.placeholder")}
            value={full_name || ""}
            onChange={(e) => {
              handleInputChange("full_name", e.target.value);
              setErrors((prev) => ({ ...prev, full_name: null }));
            }}
            className={`pl-10 ${errors?.full_name ? "border-red-500" : ""}`}
          />
        </div>

        {/* ⭐ Full Name ERROR */}
        {errors?.full_name && (
          <p className="text-red-500 text-xs mt-1">{errors.full_name[0]}</p>
        )}
      </div>

      {/* Category Selector */}
      <div className="space-y-2">
        <Label>{t("auth.hostInfo.category.label")} *</Label>

        <Select
          value=""
          onValueChange={(value) => {
            toggleInterest(value);
            setErrors((prev) => ({ ...prev, categories: null }));
          }}
        >
          <SelectTrigger
            className={`w-full pl-3 h-10 ${
              errors?.categories ? "border-red-500" : ""
            }`}
          >
            {formData.categories.length > 0
              ? formData.categories
                  .map(
                    (catId) =>
                      CategoryOptions.find((cat) => cat.id === catId)
                        ?.displayName
                  )
                  .join(", ")
              : t("auth.hostInfo.category.placeholder")}
          </SelectTrigger>

          <SelectContent className="max-h-56 overflow-y-auto">
            {CategoryOptions.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.displayName}{" "}
                {formData.categories.includes(cat.id) ? "✅" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ⭐ Categories ERROR */}
        {errors?.categories && (
          <p className="text-red-500 text-xs mt-1">{errors.categories[0]}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="businessDescription">
          {t("auth.hostInfo.businessDescription.label")}
        </Label>

        <Textarea
          id="businessDescription"
          placeholder={t("auth.hostInfo.businessDescription.placeholder")}
          value={bio || ""}
          onChange={(e) => {
            handleInputChange("bio", e.target.value);
            setErrors((prev) => ({ ...prev, bio: null }));
          }}
          rows={4}
          className={`${errors?.bio ? "border-red-500" : ""}`}
        />

        {/* ⭐ Bio ERROR */}
        {errors?.bio && (
          <p className="text-red-500 text-xs mt-1">{errors.bio[0]}</p>
        )}
      </div>

      {/* Facebook */}
      <div className="space-y-2">
        <Label htmlFor="facebook">
          <Facebook size={15} />{" "}
          {t("auth.hostInfo.socialMedia.facebook.label")}
        </Label>

        <Input
          id="facebook"
          type="url"
          placeholder={t("auth.hostInfo.socialMedia.facebook.placeholder")}
          value={facebook || ""}
          onChange={(e) => {
            handleInputChange("facebook", e.target.value);
            setErrors((prev) => ({ ...prev, facebook: null }));
          }}
          className={`${errors?.facebook ? "border-red-500" : ""}`}
        />

        {/* ⭐ Facebook ERROR */}
        {errors?.facebook && (
          <p className="text-red-500 text-xs mt-1">{errors.facebook[0]}</p>
        )}
      </div>

      {/* Instagram */}
      <div className="space-y-2">
        <Label htmlFor="instagram">
          <Instagram size={15} />{" "}
          {t("auth.hostInfo.socialMedia.instagram.label")}
        </Label>

        <Input
          id="instagram"
          type="url"
          placeholder={t("auth.hostInfo.socialMedia.instagram.placeholder")}
          value={instagram || ""}
          onChange={(e) => {
            handleInputChange("instagram", e.target.value);
            setErrors((prev) => ({ ...prev, instagram: null }));
          }}
          className={`${errors?.instagram ? "border-red-500" : ""}`}
        />

        {/* ⭐ Instagram ERROR */}
        {errors?.instagram && (
          <p className="text-red-500 text-xs mt-1">
            {errors.instagram[0]}
          </p>
        )}
      </div>
    </div>
  );
};

export default HostInfoForm;
