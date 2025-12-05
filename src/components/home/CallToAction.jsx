import React from "react";
import WhiteTicketCTA from "/WhiteTicketCTA.png";
import YellowTicketCTA from "/YellowTicketCTA.png";
import { Calendar } from "lucide-react";
import { QrCode } from "lucide-react";
import { MessageSquareText } from "lucide-react";
import { t } from "i18next";

function CallToAction() {
  return (
    <>
      <div className="cta-section py-16 flex items-center flex-col gap-16 bg-gradient-violet">
        <h3 className="px-4 cta-section-title text-4xl font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]  text-center">
          {t("cta.title")}
        </h3>
        <div className=" container cta-section-content flex flex-col md:flex-row gap-6 justify-evenly items-center">
          <div
            className="cta-section-content__card flex h-57 w-47 flex-col justify-start pt-12 items-center text-violet text-md font-semibold gap-3 transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)]"
            style={{
              backgroundImage: `url(${WhiteTicketCTA})`,
              backgroundSize: "cover",
            }}
          >
            <span>1.</span>
            <span>{t("cta.add")}</span>
            <Calendar size={40} className="text-violet" strokeWidth={1.7} />
          </div>
          <div
            className="cta-section-content__card flex h-57 w-47 flex-col justify-start pt-12 items-center text-white text-md font-semibold gap-3 transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)]"
            style={{
              backgroundImage: `url(${YellowTicketCTA})`,
              backgroundSize: "cover",
            }}
          >
            <span>2.</span>
            <span>{t("cta.share")}</span>
            <QrCode size={40} className="text-white" strokeWidth={1.7} />
          </div>
          <div
            className="cta-section-content__card flex h-57 w-47 flex-col justify-start pt-12 items-center text-violet text-sm  text-center font-semibold gap-3 transition-all duration-500 hover:translate-y-[-15px] hover:drop-shadow-[0px_16px_16px_rgba(0,0,0,0.25)] "
            style={{
              backgroundImage: `url(${WhiteTicketCTA})`,
              backgroundSize: "cover",
            }}
          >
            <span>3.</span>
            <span>{t("cta.enjoy")}</span>
            <MessageSquareText
              size={40}
              className="text-violet"
              strokeWidth={1.7}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CallToAction;
