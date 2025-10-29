import React from "react";
import AutoFadeCarousel from "../AutoFadeCarousel";
import { Button, buttonVariants } from "../ui/button";
import { SplittingText } from "../ui/shadcn-io/splitting-text/index";
import { FlipWords } from "../ui/shadcn-io/flip-words";
import CircularText from "../ui/shadcn-io/circular-text/index";
import { t } from "i18next";

function HeroSection() {
  const heroImages = [
    "https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg",
    "https://images.pexels.com/photos/705792/pexels-photo-705792.jpeg",
    "https://images.pexels.com/photos/15777271/pexels-photo-15777271.jpeg",
    "https://images.pexels.com/photos/159213/hall-congress-architecture-building-159213.jpeg",
    "https://images.pexels.com/photos/2623869/pexels-photo-2623869.jpeg",
  ];
  return (
    <section className=" relative h-[100vh] overflow-hidden flex items-center justify-start text-white">
      <AutoFadeCarousel images={heroImages} delay={5000} />
      <div className=" h-[inherit] absolute inset-0  bg-[linear-gradient(to_top,var(--color-violet)_0%,var(--color-violet)_15%,#B9B9B9_100%)] opacity-50 "></div>

      <div className=" md:start-20 absolute z-10 max-w-5xl px-4 sm:px-8 text-start flex flex-col gap-7">
        <img
          className=" hidden md:block w-100"
          src="PlanoraYellowTypo.png"
          alt="LogoPLanora"
        />
        <div className="lg:text-5xl flex flex-col items-start text-3xl font-bold mb-4 leading-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-violet ">
          {t("hero.slogan")}{" "}
          <FlipWords
            words={t("hero.flipWords").split(" ")}
            duration={1500}
            dir="ltr"
            className="text-amber font-semibold drop-shadow-2xl lg:text-6xl py-2"
          />
          {""}
        </div>
        <SplittingText
          className="lg:text-2xl text-lg mb-4 font-semibold drop-shadow-6xl text-secondary dark:text-foreground leading-relaxed md:w-[75%]"
          text={[t("hero.description")]}
          type="lines"
          inView
          motionVariants={{
            initial: { y: 50, opacity: 0, x: 0 },
            animate: { y: 0, opacity: 1, x: 0 },
            transition: { duration: 0.4 },
          }}
        />

        <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4">
          <Button
            className={`${buttonVariants({
              variant: "primary",
              size: "CTA",
            })} text-background font-bold hover:text-primary transition-all duration-300`}
          >
            {t("button.getStarted")}
          </Button>

          <Button
            className={buttonVariants({
              variant: "glass",
              size: "CTA",
            })}
          >
            {t("button.contactUs")}
          </Button>
        </div>
      </div>

      <CircularText
        text={t("hero.rotating")}
        onHover="speedUp"
        spinDuration={15}
        className="hidden md:block h-[400px] w-[400px] end-[-250px] bg-secondary/10 backdrop-blur-xs text-accent hover:text-amber-dark border border-secondary/30 hover:bg-primary/40 tracking-widest transition-colors duration-300"
      />
    </section>
  );
}

export default HeroSection;
