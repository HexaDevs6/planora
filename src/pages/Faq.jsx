import React from "react";
import { useTranslation } from "react-i18next";
import faqContent from "@/data/faqContent.json";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const Faq = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Get the content for the current language
  const content = faqContent[currentLang] || faqContent.en;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="relative pt-32 pb-16 px-8 flex items-center justify-center text-center bg-cover bg-center">
        <div className="relative z-10 flex flex-col gap-5 max-w-4xl w-full mx-auto text-center">
          <div className="space-y-4">
            <h1 className="text-gradient-amber text-4xl md:text-5xl font-bold drop-shadow-lg">
              {t("faqPage.title")}
            </h1>
            <p className="text-lg md:text-xl text-content">
              {t("faqPage.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl border-t">
        {/* FAQ Icon Badge */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <HelpCircle className="w-6 h-6 text-primary dark:text-accent" />
          <p className="text-sm text-muted-foreground dark:text-foreground/60 font-medium">
            {t("faqPage.questionsCount", { count: content.items.length })}
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-2">
          {content.items.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="bg-card dark:bg-card/50 rounded-lg px-6 border border-border dark:border-border/20"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary dark:hover:text-accent">
                <span className="flex items-start gap-3 text-start">
                  <span className="text-amber-500 dark:text-amber-400 shrink-0">
                    {item.id}.
                  </span>
                  <span>{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-content dark:text-foreground/80 leading-relaxed rtl:pr-8 ltr:pl-8">
                  {item.answer.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={`${
                        paragraph.startsWith("•")
                          ? "rtl:pr-4 ltr:pl-4"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border dark:border-border/20 text-center">
          <p className="text-muted-foreground dark:text-foreground/60 mb-4">
            {t("faqPage.stillHaveQuestions")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-primary dark:text-accent hover:underline font-medium"
          >
            {t("faqPage.contactSupport")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Faq;

