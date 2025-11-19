import { t } from "i18next";
import React from "react";

export default function JoinSection() {
  return (
<section className="static md:relative flex justify-center items-center">
  <div
    className="static md:absolute min-w-full md:min-w-70 -top-0 md:-top-50
    bg-[#F7E9FF] dark:bg-[rgba(51,12,47,0.9)]
    border border-border/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    py-12 px-6 md:px-24 rounded-none md:rounded-xl
    text-center flex justify-center items-center flex-col gap-6
    transition-colors duration-500"
  >
    <h1 className="font-bold text-primary dark:text-accent text-2xl md:text-3xl drop-shadow-sm">
      {t("footer.newstitle")}
    </h1>

    <p className="text-[16px] md:text-xl text-content dark:text-foreground/90 max-w-xl mx-auto">
      {t("footer.newssubtitle")}
    </p>

    <form className="flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-sm bg-transparent border border-border/20">
      <input
        type="email"
        placeholder={t("common.form.email")}
        className="bg-white/70 dark:bg-white/10 text-primary dark:text-foreground placeholder:text-content/70
        px-4 py-3 outline-none w-full sm:w-auto focus:bg-white/80 dark:focus:bg-white/20
        transition-all duration-500"
        required
      />

      {/* Glass Effect Button */}
      <button
        type="submit"
        className="px-6 py-3 font-semibold
        text-primary dark:text-white
        bg-[rgba(51,12,47,0.15)] dark:bg-[rgba(167,123,189,0.25)]
        backdrop-blur-md border border-[rgba(51,12,47,0.2)] dark:border-[rgba(167,123,189,0.3)]
        hover:bg-[rgba(51,12,47,0.25)] dark:hover:bg-[rgba(167,123,189,0.4)]
        hover:shadow-[0_0_12px_rgba(167,123,189,0.5)]
        transition-all duration-500 rounded-r-lg"
      >
        {t("common.buttons.join")}
      </button>
    </form>
  </div>
</section>


  );
}
