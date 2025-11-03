import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Facebook, Instagram } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/fetchCategoriesThunk";
import { useDirection } from "@/hooks/useDirection";

const HostInfoForm = ({ formData, handleInputChange,toggleInterest }) => {
   const { fullName, bio, facebook, instagram } = formData;
   const { t } = useTranslation();
   const { lang } = useDirection();

   const dispatch = useDispatch();
   const { data: categories, loading } = useSelector((state) => state.categories);

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
            <Label htmlFor="businessName">{t("auth.hostInfo.businessName.label")}</Label>
            <div className="relative">
               <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input
                  id="businessName"
                  placeholder={t("auth.hostInfo.businessName.placeholder")}
                  value={fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="pl-10"
                  required
               />
            </div>
         </div>

 {/* Category Select */}
<div className="space-y-2">
  <Label htmlFor="serviceCategory">{t("auth.hostInfo.category.label")}</Label>
  <div className="relative">
    <Select
      value="" // for multi-select we keep trigger empty
      onValueChange={(value) => toggleInterest(value)}
    >
      <SelectTrigger
        id="serviceCategory"
        className="w-full pl-10 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {formData.categories.length > 0
          ? formData.categories
              .map((catId) => CategoryOptions.find((cat) => cat.id === catId)?.displayName)
              .join(", ")
          : t("auth.hostInfo.category.placeholder")}
      </SelectTrigger>
      <SelectContent className="max-h-56 overflow-y-auto">
        {CategoryOptions.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.displayName} {formData.categories.includes(cat.id) ? "✅" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>


         {/* Bio */}
         <div className="space-y-2 md:col-span-2">
            <Label htmlFor="businessDescription">{t("auth.hostInfo.businessDescription.label")}</Label>
            <Textarea
               id="businessDescription"
               placeholder={t("auth.hostInfo.businessDescription.placeholder")}
               value={bio || ""}
               onChange={(e) => handleInputChange("bio", e.target.value)}
               rows={4}
               required
            />
         </div>

         {/* Social Media */}
         <div className="space-y-2">
            <Label htmlFor="facebook">
               <Facebook size={15} /> {t("auth.hostInfo.socialMedia.facebook.label")}
            </Label>
            <Input
               id="facebook"
               type="url"
               placeholder={t("auth.hostInfo.socialMedia.facebook.placeholder")}
               value={facebook || ""}
               onChange={(e) => handleInputChange("facebook", e.target.value)}
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="instagram">
               <Instagram size={15} /> {t("auth.hostInfo.socialMedia.instagram.label")}
            </Label>
            <Input
               id="instagram"
               type="url"
               placeholder={t("auth.hostInfo.socialMedia.instagram.placeholder")}
               value={instagram || ""}
               onChange={(e) => handleInputChange("instagram", e.target.value)}
            />
         </div>
         {/* {console.log(formData)} */}
      </div>
   );
};

export default HostInfoForm;
