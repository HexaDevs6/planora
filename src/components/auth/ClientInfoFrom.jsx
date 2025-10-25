import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDirection } from "@/hooks/useDirection";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

const ClientInfoFrom = ({ formData, handleInputChange, toggleInterest }) => {
   const { t } = useTranslation();
   const { lang } = useDirection();

   const interestOptions = [
      { en: "Concerts & Music", ar: "الحفلات والموسيقى" },
      { en: "Conferences & Business", ar: "المؤتمرات والأعمال" },
      { en: "Sports & Fitness", ar: "الرياضة واللياقة البدنية" },
      { en: "Art & Culture", ar: "الفن والثقافة" },
      { en: "Food & Dining", ar: "الطعام وتناول الطعام" },
      { en: "Technology", ar: "التكنولوجيا" },
      { en: "Networking", ar: "التواصل" },
      { en: "Education & Workshops", ar: "التعليم وورش العمل" },
      { en: "Entertainment", ar: "الترفيه" },
      { en: "Community Events", ar: "الفعاليات المجتمعية" },
   ];

   return (
      <>
         <div className="space-y-4">
            <Label>{t("auth.register.step2.client.interestsLabel")}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {interestOptions.map((interest) => (
                  <div
                     key={interest.en}
                     onClick={(e) => {
                        e.preventDefault();
                        toggleInterest(interest.en);
                     }}
                     className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.interests.includes(interest.en)
                           ? "border-primary bg-primary/10"
                           : "border-border hover:border-primary/50"
                     }`}
                  >
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                           {interest[lang]}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="fullName">
               {t("common.form.fullName")} *
            </Label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input
                  id="fullName"
                  placeholder={t("auth.form.fullName.placeholder")}
                  value={formData.fullName}
                  onChange={(e) =>
                     handleInputChange("fullName", e.target.value)
                  }
                  className="pl-10"
                  required
               />
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="eventPreferences">
               {t("auth.register.step2.client.eventPreferencesLabel")}
            </Label>
            <Textarea
               id="eventPreferences"
               placeholder={t(
                  "auth.register.step2.client.eventPreferencesPlaceholder"
               )}
               value={formData.eventPreferences}
               onChange={(e) =>
                  handleInputChange("eventPreferences", e.target.value)
               }
               rows={4}
            />
         </div>
      </>
   );
};

export default ClientInfoFrom;
