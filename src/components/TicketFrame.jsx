import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Globe, Loader2, MapPin } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import StyledQR from "./qrcode";

const TicketFrame = ({ children, ticketData = null }) => {
   const ticketRef = useRef(null);
   const [downloading, setDownloading] = useState(false);
   const { t } = useTranslation();

   const handleDownload = async () => {
      if (!ticketRef.current || !ticketData) return;

      setDownloading(true);
      try {
         // Wait a bit for QR code to render
         await new Promise((resolve) => setTimeout(resolve, 100));

         // Generate image with better quality
         const dataUrl = await toPng(ticketRef.current, {
            quality: 1,
            pixelRatio: 3,
            // backgroundColor: "transparent",
            cacheBust: true,
         });

         // Download the image
         const link = document.createElement("a");
         link.download = `planora-ticket-${
            ticketData.event?.name?.replace(/\s+/g, "-") || "event"
         }-${Date.now()}.png`;
         link.href = dataUrl;
         link.click();

         toast.success(
            t("ticket.downloadSuccess") || "Ticket downloaded successfully!"
         );
      } catch (error) {
         console.error("Error downloading ticket:", error);
         toast.error(
            t("ticket.downloadError") ||
               "Failed to download ticket. Please try again."
         );
      } finally {
         setDownloading(false);
      }
   };

   // Default render for backward compatibility
   return (
      <Card
         className="
			relative 
			overflow-hidden 
			rounded-none 
			border-0
			mx-auto
			bg-[var(--card)]
			text-[var(--card-foreground)]
			w-full
			"
      >
         <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border" />
         <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border" />

         <CardContent className="pt-6 px-6 mb-0">{children}</CardContent>

         {/* Download Button - Only show if we have ticket data */}
         {ticketData && (
            <div className="flex justify-center pb-4">
               <Button
                  id="ticket-download-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                  variant="amber"
                  className="gap-2"
               >
                  {downloading ? (
                     <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("ticket.downloading") || "Downloading..."}
                     </>
                  ) : (
                     <>
                        <Download className="w-4 h-4" />
                        {t("ticket.download") || "Download Ticket"}
                     </>
                  )}
               </Button>
            </div>
         )}

         {/* the ticket that will be downloaded - Only render if we have ticket data */}
         {ticketData && (
            <div className="fixed top-0 right-0 -z-50 text-[16px] opacity-0">
               <Card
                  ref={ticketRef}
                  className="relative overflow-hidden ticket-bg text-violet grid grid-cols-3 items-center"
                  style={{
                     width: "80em",
                     borderRadius: "1em",
                     columnGap: "2em",
                     rowGap: "0em",
                  }}
               >
                  <span className="z-10 absolute h-[200%] w-[10em] bg-gradient-to-b from-white/10 to-transparent top-1/2 -translate-y-1/2 rtl:left-[60%] ltr:left-[40%] -translate-x-1/2 rtl:rotate-12 ltr:-rotate-45" />
                  <span className="z-10 absolute h-[200%] w-[5em] bg-gradient-to-b from-white/10 to-transparent top-1/2 -translate-y-1/2 rtl:left-[75%] ltr:left-[25%] -translate-x-1/2 rtl:rotate-12 ltr:-rotate-45" />
                  <div className="col-span-2 relative z-20">
                     {/* Header with gradient background */}
                     <div style={{ padding: "2em" }}>
                        <div
                           className="flex items-center justify-between"
                           style={{ marginBottom: "1.5em" }}
                        >
                           <img
                              src="/LogoBasic.png"
                              alt="Planora"
                              className="object-contain"
                              style={{ width: "15em", height: "auto" }}
                           />
                           <div
                              className="text-white font-medium bg-white/20 rounded-full"
                              style={{
                                 fontSize: "0.75em",
                                 padding: "0.5em 1em",
                              }}
                           >
                              {t("ticket.label") || "EVENT TICKET"}
                           </div>
                        </div>
                        <p className="italic" style={{ fontSize: "0.875em" }}>
                           {t("hero.slogan") ||
                              "Plan Your Event, Create Your Story"}
                        </p>
                     </div>

                     <div style={{ padding: "0 2em 2em 2em" }}>
                        {/* Event Information */}
                        <div
                           className="border-b"
                           style={{
                              paddingBottom: "1.5em",
                              marginBottom: "1.5em",
                           }}
                        >
                           <h3
                              className="font-bold"
                              style={{
                                 fontSize: "2.25em",
                              }}
                           >
                              {ticketData.event?.name ||
                                 ticketData.event?.name_ar ||
                                 "Event Name"}
                           </h3>
                           <div
                              style={{
                                 display: "flex",
                                 gap: "0.75em",
                                 fontSize: "0.875em",
                              }}
                           >
                              <div
                                 className="flex items-center"
                                 style={{ gap: "0.5em" }}
                              >
                                 <Calendar />
                                 <span className="font-medium">
                                    {ticketData.event?.date
                                       ? new Date(
                                            ticketData.event.date
                                         ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                         })
                                       : "Date TBD"}
                                 </span>
                              </div>
                              <div
                                 className="flex items-center"
                                 style={{ gap: "0.5em" }}
                              >
                                 <MapPin />
                                 <span>
                                    {ticketData.event?.location ||
                                       "Location TBD"}
                                 </span>
                              </div>
                           </div>
                        </div>

                        <div
                           className="grid grid-cols-2"
                           style={{ gap: "2em" }}
                        >
                           {/* Client Information */}
                           <div
                              className="border-b"
                              style={{
                                 paddingBottom: "1.5em",
                                 marginBottom: "1.5em",
                              }}
                           >
                              <h4
                                 className="font-bold uppercase"
                                 style={{
                                    fontSize: "1em",
                                    marginBottom: "1em",
                                 }}
                              >
                                 {t("ticket.attendee") ||
                                    "Attendee Information"}
                              </h4>
                              <div
                                 style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5em",
                                 }}
                              >
                                 <p
                                    className="font-semibold"
                                    style={{ fontSize: "1em" }}
                                 >
                                    {ticketData.client?.full_name ||
                                       ticketData.client?.email?.split(
                                          "@"
                                       )[0] ||
                                       "Guest"}
                                 </p>
                                 <p className="" style={{ fontSize: "1em" }}>
                                    {ticketData.client?.email || "N/A"}
                                 </p>
                              </div>
                           </div>

                           {/* Host Information */}
                           {ticketData.host && (
                              <div
                                 className="border-b"
                                 style={{
                                    paddingBottom: "1.5em",
                                    marginBottom: "1.5em",
                                 }}
                              >
                                 <h4
                                    className="font-bold uppercase"
                                    style={{
                                       fontSize: "1em",
                                       marginBottom: "1em",
                                    }}
                                 >
                                    {t("ticket.organizer") || "Event Organizer"}
                                 </h4>
                                 <p
                                    className="font-medium"
                                    style={{ fontSize: "1em" }}
                                 >
                                    {ticketData.host?.full_name ||
                                       ticketData.host?.email?.split("@")[0] ||
                                       "Organizer"}
                                 </p>
                              </div>
                           )}
                        </div>

                        {/* Ticket Details */}
                        <div>
                           <div className="flex justify-between items-center">
                              <div className="flex gap-[0.5em] items-center">
                                 <h4
                                    className="font-semibold uppercase"
                                    style={{
                                       fontSize: "0.75em",
                                    }}
                                 >
                                    {t("ticket.ticketId") || "Ticket ID"}
                                 </h4>
                                 <p className="font-mono">
                                    #
                                    {ticketData.ticket?.id
                                       ?.toString()
                                       .padStart(6, "0") || "N/A"}
                                 </p>
                              </div>
                              {ticketData.ticket?.price > 0 && (
                                 <div className="text-right">
                                    <h4
                                       className="font-semibold uppercase"
                                       style={{
                                          fontSize: "0.75em",
                                          marginBottom: "0.5em",
                                       }}
                                    >
                                       {t("ticket.price") || "Price"}
                                    </h4>
                                    <p
                                       className="font-bold text-amber-600"
                                       style={{ fontSize: "1.125em" }}
                                    >
                                       {ticketData.ticket?.price} EGP
                                    </p>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div
                     className="relative z-20"
                     style={{
                        padding: "2em",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2em",
                     }}
                  >
                     {/* QR Code */}
                     <div className="flex flex-col items-center">
                        <div
                           className="bg-white rounded-lg border-gray-200"
                           style={{
                              padding: "1em",
                              border: "0.125em solid rgb(229, 231, 235)",
                           }}
                        >
                           <div>
                              <StyledQR value={ticketData.qrCode} size={300} />
                           </div>
                        </div>
                        <p
                           className="text-center"
                           style={{ fontSize: "0.75em", marginTop: "1em" }}
                        >
                           {t("ticket.scanInstructions") ||
                              "Scan this QR code at the event entrance"}
                        </p>
                     </div>
                  </div>
                  {/* Footer note */}
                  <div
                     className="text-center col-span-3 border-t relative z-20"
                     style={{ padding: "1em" }}
                  >
                     <p className="" style={{ fontSize: "0.75em" }}>
                        {t("ticket.footer")}
                        <span
                           className="flex items-center mx-auto justify-center gap-2"
                           dir="ltr"
                        >
                           <Globe />
                           https://planora-app.netlify.app/
                        </span>
                     </p>
                  </div>
               </Card>
            </div>
         )}
      </Card>
   );
};

export default TicketFrame;
