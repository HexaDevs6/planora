import React from "react";
import { AnimatedTestimonials } from "../ui/shadcn-io/animated-testimonials";
import Royal_Halls from "@/assets/Royal_Halls.jpg";
import Catering from "@/assets/Catering.jpg";
import Dj from "@/assets/Dj.jpg";
import { t } from "i18next";
import { Link } from "react-router-dom";

export default function ProvidersSection() {
  const testimonials = [
    {
      quote: t("services.halls.desc"),
      name: t("services.halls.title"),
      designation: t("services.halls.subtitle"),
      src: Royal_Halls,
    },
    {
      quote: t("services.catering.desc"),
      name: t("services.catering.title"),
      designation: t("services.catering.subtitle"),
      src: Catering,
    },
    {
      quote: t("services.sound.desc"),
      name: t("services.sound.title"),
      designation: t("services.sound.subtitle"),
      src: Dj,
    },
  ];

  return (
    <section className="bg-[linear-gradient(to_left,#99248D_0%,var(--color-violet-dark)_100%)] py-16 overflow-hidden pb-0 md:pb-50">
      <div className="container">
        <div className="provider__header text-center">
          <Link
            to={"/services"}
            className="font-bold text-4xl text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          >
            {t("plan.services")}
          </Link>
        </div>
        <div className="provider__content">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
}
