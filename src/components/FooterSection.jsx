import React from "react";
import { LucideUsers2, Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { t } from "i18next";
import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
    <footer className="py-16 overflow-hidden bg-background dark:bg-[var(--color-violet-dark)] text-content dark:text-foreground transition-colors duration-500">
      <div className="container">
        <div className="footer__content py-16 grid grid-cols-2 md:grid-cols-5 md:gap-0 gap-10">
          <div className="col-span-2 flex flex-col gap-7">
            <div className="relative w-48 h-auto">
              <img
                src="/LogoBasic.png"
                alt="Planora Logo Light"
                className="w-full h-auto dark:hidden transition-opacity duration-500"
              />
              <img
                src="/LogoBasicLight.png"
                alt="Planora Logo Dark"
                className="w-full h-auto hidden dark:block transition-opacity duration-500"
              />
            </div>

            <p className="font-medium text-content dark:text-foreground/80">
              {t("hero.slogan")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-primary dark:text-accent text-xl">
              {t("footer.platform")}
            </h4>
            <ul className="flex flex-col gap-4">
              {["services", "events", "register"].map((item) => (
                <li
                  key={item}
                  className="transition-all duration-500 hover:translate-x-2 hover:text-[var(--color-amber)] py-1 cursor-pointer"
                >
                  <Link to={`/${item}`} className="text-content dark:text-foreground/70" href="#">
                    {t(`footer.${item}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-semibold text-primary dark:text-accent text-xl">
              {t("footer.resources")}
            </h4>
            <ul className="flex flex-col gap-4">
              {["about", "blog", "qa"].map((item) => (
                <li
                  key={item}
                  className="transition-all duration-500 hover:translate-x-2 hover:text-[var(--color-amber)] py-1 cursor-pointer"
                >
                  <Link to={`/${item}`} className="text-content dark:text-foreground/70" href="#">
                    {t(`footer.${item}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-semibold text-primary dark:text-accent text-xl">
              {t("footer.contact")}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="transition-all duration-500 hover:translate-x-2 hover:text-[var(--color-amber)] py-1 cursor-pointer">
                <a
                  className="text-content dark:text-foreground/70 flex items-center gap-2"
                  href="mailto:hexadevs06@googlegroups.com"
                >
                  <Mail className="w-5 h-5 text-[var(--color-amber)]" />
                  hexadevs06@googlegroups.com
                </a>
              </li>
              <li className="transition-all duration-500 hover:translate-x-2 hover:text-[var(--color-amber)] py-1 cursor-pointer">
                <Link
                  className="text-content dark:text-foreground/70 flex items-center gap-2"
                  to ='https://discord.gg/8kG9zaUKwS'
>
                  <LucideUsers2 className="w-5 h-5 text-[var(--color-amber)]" />
                  Discord: HexaDevs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center border-t border-border pt-10">
        <p className="text-sm md:text-base text-content dark:text-foreground/70">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
