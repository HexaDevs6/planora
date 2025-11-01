import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building2, Facebook, Instagram } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";


const HostInfoForm = ({ formData, handleInputChange }) => {
   const { businessName, serviceCategory, businessDescription, facebook, instagram } = formData;
   const { t, i18n } = useTranslation();
   
   const serviceCategoryOptions = {
      en: [
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
      ],
      ar: [
         "القاعات والأماكن",
         "تقديم الطعام والضيافة",
         "التصوير الفوتوغرافي والفيديو",
         "الترفيه (دي جي، فرق موسيقية، إلخ)",
         "الديكور والتصميم",
         "تخطيط وتنسيق الفعاليات",
         "معدات الصوت والمرئيات",
         "النقل",
         "الأمن",
         "خدمات أخرى"
      ]
   };
   
   const currentLanguage = i18n.language || 'en';
   const currentCategoryOptions = serviceCategoryOptions[currentLanguage] || serviceCategoryOptions.en;
   return (
      <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 ">
               <Label htmlFor="businessName">{t("auth.hostInfo.businessName.label")}</Label>
               <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="businessName"
                     placeholder={t("auth.hostInfo.businessName.placeholder")}
                     value={businessName ? businessName : ""}
                     onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                     }
                     className="pl-10"
                     required
                  />
               </div>
            </div>

            <div className="space-y-2 ">
               <Label htmlFor="serviceCategory">{t("auth.hostInfo.category.label")}</Label>
               <div className="relative">
                  <Select
                     value={serviceCategory ? serviceCategory : t("auth.hostInfo.category.placeholder")}
                     onValueChange={(value) =>
                        handleInputChange("serviceCategory", value)
                     }
                     required
                  >
                     <SelectTrigger
                        id="serviceCategory"
                        className="w-full pl-10 h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                     >
                        {serviceCategory ? serviceCategory : t("auth.hostInfo.category.placeholder")}
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value={t("auth.hostInfo.category.placeholder")}>
                           {t("auth.hostInfo.category.placeholder")}
                        </SelectItem>
                        {currentCategoryOptions.map((cat) => (
                           <SelectItem key={cat} value={cat}>
                              {cat}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="space-y-2 md:col-span-2">
               <Label htmlFor="businessDescription">
                  {t("auth.hostInfo.businessDescription.label")}
               </Label>
               <Textarea
                  id="businessDescription"
                  placeholder={t("auth.hostInfo.businessDescription.placeholder")}
                  value={businessDescription ? businessDescription : ""}
                  onChange={(e) =>
                     handleInputChange("businessDescription", e.target.value)
                  }
                  rows={4}
                  required
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="facebook">
                  <Facebook size={15} /> {t("auth.hostInfo.socialMedia.facebook.label")}
               </Label>
               <Input
                  id="facebook"
                  type="url"
                  placeholder={t("auth.hostInfo.socialMedia.facebook.placeholder")}
                  value={facebook ? facebook : ""}
                  onChange={(e) =>
                     handleInputChange("facebook", e.target.value)
                  }
               />
            </div>
            <div className="space-y-2 ">
               <Label htmlFor="instagram">
                  <Instagram size={15} /> {t("auth.hostInfo.socialMedia.instagram.label")}
               </Label>
               <Input
                  id="instagram"
                  type="url"
                  placeholder={t("auth.hostInfo.socialMedia.instagram.placeholder")}
                  value={instagram ? instagram : ""}
                  onChange={(e) =>
                     handleInputChange("instagram", e.target.value)
                  }
               />
            </div>
         </div>
      </>
   );
};

export default HostInfoForm;
