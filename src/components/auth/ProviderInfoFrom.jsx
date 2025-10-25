import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

const ProviderInfoFrom = ({ formData, handleInputChange }) => {
   const { t } = useTranslation();
   
   return (
      <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="fullname">{t("common.form.fullName")} *</Label>
               <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                     id="fullname"
                     name="fullname"
                     placeholder={t("auth.form.fullName.placeholder")}
                     className="pl-10 text-content"
                     value={formData.fullName}
                     onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                     }
                     
                     required
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="service">{t("auth.providerInfo.service.label")}</Label>
               <Select
                  value={formData.service}
                  onValueChange={(value) => handleInputChange("service", value)}
                  required
               >
                  <SelectTrigger className="w-full h-10">
                     <SelectValue placeholder={t("auth.providerInfo.service.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="photography">{t("auth.providerInfo.service.options.photography")}</SelectItem>
                     <SelectItem value="catering">{t("auth.providerInfo.service.options.catering")}</SelectItem>
                     <SelectItem value="dj">{t("auth.providerInfo.service.options.dj")}</SelectItem>
                     <SelectItem value="planning">{t("auth.providerInfo.service.options.planning")}</SelectItem>
                     <SelectItem value="design">{t("auth.providerInfo.service.options.design")}</SelectItem>
                     <SelectItem value="security">{t("auth.providerInfo.service.options.security")}</SelectItem>
                     <SelectItem value="transport">{t("auth.providerInfo.service.options.transport")}</SelectItem>
                     <SelectItem value="venue">{t("auth.providerInfo.service.options.venue")}</SelectItem>
                     <SelectItem value="av">{t("auth.providerInfo.service.options.av")}</SelectItem>
                     <SelectItem value="other">{t("auth.providerInfo.service.options.other")}</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
               <Label htmlFor="bio">
                  {t("auth.providerInfo.bio.label")}
               </Label>
               <Textarea
                  id="bio"
                  placeholder={t("auth.providerInfo.bio.placeholder")}
                  className="text-content"
                  value={formData.bio}
                  onChange={(e) =>
                     handleInputChange("bio", e.target.value)

                  }
                  rows={5}
                  required
               />
            </div>
         </div>
      </>
   );
};

export default ProviderInfoFrom;
