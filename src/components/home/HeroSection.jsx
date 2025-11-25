import React from "react";
import AutoFadeCarousel from "../AutoFadeCarousel";
import { Button, buttonVariants } from "../ui/button";
import { SplittingText } from "../ui/shadcn-io/splitting-text/index";
import { FlipWords } from "../ui/shadcn-io/flip-words";
import CircularText from "../ui/shadcn-io/circular-text/index";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDirection } from "@/hooks/useDirection";

function HeroSection() {
  const { lang } = useDirection();
  const heroImages = [
    "/images/homeHero/hero1.webp",
    "/images/homeHero/hero2.webp",
    "/images/homeHero/hero3.webp",
    "/images/homeHero/hero4.webp",
    "/images/homeHero/hero5.webp",
  ];

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className={`overlay w-full h-full absolute z-10 ${lang === "ar" ? "bg-gradient-to-r" : "bg-gradient-to-l"} from-transparent to-background`}></div>
      {/* الخلفية المتغيرة */}
      <AutoFadeCarousel images={heroImages} />

      {/* المحتوى النصي */}
      <div className="container md:start-20 absolute z-10 px-4 text-start flex flex-col gap-5">
        <img
          className="hidden md:block w-80"
          src="PlanoraYellowTypo.png"
          alt="LogoPLanora"
        />

        <div className="lg:text-5xl flex flex-col items-start text-3xl font-bold mb-4 leading-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-violet">
          <span className="text-foreground">{t("hero.slogan")}</span>{" "}
          <FlipWords
            words={t("hero.flipWords").split(" ")}
            duration={1500}
            dir="ltr"
            className="dark:text-amber text-amber-dark font-semibold drop-shadow-2xl lg:text-6xl py-2"
          />
        </div>

        <SplittingText
          className="lg:text-2xl text-lg mb-4 font-semibold drop-shadow-6xl text-foreground leading-relaxed md:w-[75%]"
          text={[t("hero.description")]}
          type="lines"
          inView
          motionVariants={{
            initial: { y: 50, opacity: 0, x: 0 },
            animate: { y: 0, opacity: 1, x: 0 },
            transition: { duration: 0.4 },
          }}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={"./host/create-event"} >
            <Button
              className={`${buttonVariants({
                variant: "primary",
                size: "CTA",
              })} text-background font-bold transition-all duration-300`}
            >
              {t("common.buttons.getStarted")}
            </Button>
          </Link>
          <Link to={"/events"}>
            <Button
              className={buttonVariants({
                variant: "glass",
                size: "CTA",
              })}
            >
              {t("common.buttons.contactUs")}
            </Button>
          </Link>
        </div>
      </div>

      {/* الدائرة المتحركة */}
      <CircularText
        text={t("hero.rotating")}
        onHover="speedUp"
        spinDuration={15}
        className="hidden z-10 md:block h-[400px] w-[400px] end-[-250px] bg-secondary/10 backdrop-blur-xs text-accent hover:text-amber-dark border border-secondary/30 hover:bg-primary/40 tracking-widest transition-colors duration-300"
      />
    </section>
  );
}

export default HeroSection;
