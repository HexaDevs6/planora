import React from "react";
import { useTranslation } from "react-i18next";
import termsContent from "@/data/termsContent.json";
import { FileText } from "lucide-react";

const Terms = () => {
   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;

   // Get the content for the current language
   const content = termsContent[currentLang] || termsContent.en;

   return (
      <div className="min-h-screen">
         {/* Header Section */}
         <header
            className="relative pt-32 pb-16 px-8 flex items-center justify-center text-center bg-cover bg-center"
         >
            <div className="relative z-10 flex flex-col gap-5 max-w-4xl w-full mx-auto text-center">
               <div className=" space-y-4">
                  <h1 className="text-gradient-amber text-4xl md:text-5xl font-bold drop-shadow-lg">
                     {t("termsPage.title")}
                  </h1>
                  <p className="text-lg md:text-xl text-content">
                     {t("termsPage.subtitle")}
                  </p>
               </div>
            </div>
         </header>

         {/* Main Content */}
         <div className="container mx-auto px-4 py-16 max-w-4xl border-t">
            {/* Last Updated Badge */}
            <div className="flex items-center justify-center gap-2 mb-12">
               <FileText className="w-5 h-5 text-primary dark:text-accent" />
               <p className="text-sm text-muted-foreground dark:text-foreground/60 font-medium">
                  {content.lastUpdated}
               </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-12">
               {content.sections.map((section) => (
                  <section
                     key={section.id}
                     className="scroll-mt-24"
                     id={`section-${section.id}`}
                  >
                     {/* Section Title */}
                     <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-baseline gap-3">
                        <span className="text-amber-500 dark:text-amber-400">
                           {section.id}.
                        </span>
                        <span>{section.title}</span>
                     </h2>

                     {/* Section Body */}
                     <div className="space-y-4 text-content dark:text-foreground/80 leading-relaxed">
                        {section.body.map((paragraph, idx) => (
                           <p
                              key={idx}
                              className={`${
                                 paragraph.startsWith("•") ||
                                 paragraph.startsWith('"')
                                    ? "rtl:pr-6 ltr:pl-6"
                                    : ""
                              }`}
                           >
                              {paragraph}
                           </p>
                        ))}
                     </div>
                  </section>
               ))}
            </div>

            {/* Bottom Divider */}
            <div className="mt-16 pt-8 border-t border-border dark:border-border/20">
               <p className="text-center text-sm text-muted-foreground dark:text-foreground/60">
                  {t("termsPage.footer")}
               </p>
            </div>
         </div>
      </div>
   );
};

export default Terms;
