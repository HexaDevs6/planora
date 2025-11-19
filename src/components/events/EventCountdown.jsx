import { Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { createTicket } from "@/store/tickets/clientTicketsSlice";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "react-qr-code";
import StyledQR from "../qrcode";
import TicketFrame from "../TicketFrame";

const EventCountdown = ({ details, eventId,user, lang = "en" }) => {

   const dispatch =useDispatch();
   // Function to calculate time left and event status

const [isTicketBooked, setIsTicketBooked] = useState(false);
const [ticket, setTicket] = useState(null);


useEffect(() => {
  const checkExistingTicket = async () => {
    const client = await user;

    const { data: existingTicket } = await supabase
      .from("tickets")
      .select("*")
      .eq("event_id", eventId)
      .eq("client_id", client.id)
      .single();

    if (existingTicket) {
      setIsTicketBooked(true);
      setTicket(existingTicket);
    }
  };

  checkExistingTicket();
}, [eventId, user]);

const handleCreateTicket = async () => {
   try {
      const client = await user;
      const tic =await dispatch(createTicket({ eventId, clientId: client.id})).unwrap();
      if (tic) {
         toast.success("Ticket booked successfully");
         setIsTicketBooked(true);
         setTicket(tic);
         console.log(tic);
      }
   } catch (error) {
      console.error(error);
   }
}
   const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(details.start_date).getTime();
      const end = new Date(details.end_date).getTime();

      const diff = start - now;
      const eventEnded = now > end;
      const eventOngoing = now >= start && now <= end;

      let status = "upcoming";
      if (eventOngoing) status = "ongoing";
      if (eventEnded) status = "ended";

      const timeLeft =
         diff > 0
            ? {
                 days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                 hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                 minutes: Math.floor((diff / (1000 * 60)) % 60),
                 seconds: Math.floor((diff / 1000) % 60),
              }
            : { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return { ...timeLeft, status };
   };

   const [countdown, setCountdown] = useState(calculateTimeLeft());

   useEffect(() => {
      const timer = setInterval(() => {
         setCountdown(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
   }, [details.start_date, details.end_date]);

   const formatNumber = (num) => num.toString().padStart(2, "0");

   const renderStatus = () => {
      switch (countdown.status) {
         case "upcoming":
            return (
               <p className="text-sm font-medium text-blue-600 dark:text-blue-400 text-center mb-4">
                  {lang === "ar"
                     ? "الحدث سيبدأ قريباً"
                     : "Event will start soon"}
               </p>
            );
         case "ongoing":
            return (
               <p className="text-sm font-medium text-green-600 dark:text-green-400 text-center mb-4">
                  {lang === "ar" ? "الحدث جاري الآن" : "Event is happening now"}
               </p>
            );
         case "ended":
            return (
               <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center mb-4">
                  {lang === "ar" ? "الحدث انتهى" : "Event has ended"}
               </p>
            );
         default:
            return null;
      }
   };

   return (
     <div
       className={`gradient-card rounded-xl p-6 ${
         lang === "ar" ? "text-right font-[Cairo]" : "text-left"
       }`}
     >
       <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
         {lang === "ar" ? "العد التنازلي للحدث" : "Event Countdown"}
       </h4>

       {renderStatus()}

       {countdown.status === "upcoming" ? (
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
           <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
             <p className="text-4xl font-bold text-gradient-amber ">
               {formatNumber(countdown.days)}
             </p>
             <p className="text-xs uppercase tracking-wider text-foreground mt-1">
               {lang === "ar" ? "يوم" : "Days"}
             </p>
           </div>
           <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
             <p className="text-4xl font-bold text-gradient-amber ">
               {formatNumber(countdown.hours)}
             </p>
             <p className="text-xs uppercase tracking-wider text-foreground mt-1">
               {lang === "ar" ? "ساعة" : "Hours"}
             </p>
           </div>
           <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
             <p className="text-4xl font-bold text-gradient-amber ">
               {formatNumber(countdown.minutes)}
             </p>
             <p className="text-xs uppercase tracking-wider text-foreground mt-1">
               {lang === "ar" ? "دقيقة" : "Minutes"}
             </p>
           </div>
           <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
             <p className="text-4xl font-bold text-gradient-amber ">
               {formatNumber(countdown.seconds)}
             </p>
             <p className="text-xs uppercase tracking-wider text-foreground mt-1">
               {lang === "ar" ? "ثانية" : "Seconds"}
             </p>
           </div>
         </div>
       ) : (
         <div className="text-center text-gray-600 dark:text-gray-300 mt-4">
           {countdown.status === "ongoing"
             ? lang === "ar"
               ? "الحدث جاري حالياً."
               : "The event is live now."
             : lang === "ar"
             ? "تابعنا لمزيد من الأحداث القادمة."
             : "Stay tuned for upcoming events."}
         </div>
       )}

       {isTicketBooked && ticket ? (
         <TicketFrame>
           <h3 className="text-center text-lg font-semibold mb-4">
             {lang === "ar" ? "تذكرة الدخول" : "Your Event Ticket"}
           </h3>

           <div className="flex justify-center mb-4">
             <StyledQR value={ticket.qr_code} size={260} />
           </div>

           <div className="text-center text-sm text-muted-foreground mt-4">
             Ticket ID: {ticket.id}
           </div>
         </TicketFrame>
       ) : (
         <Button
           className="mt-6 w-full"
           variant="default"
           size="CTA"
           onClick={handleCreateTicket}
           disabled={countdown.status === "ended"}
         >
           <Ticket className="size-4" />
           {lang === "ar" ? "أحجز الان" : "Book Now"}
         </Button>
       )}
     </div>
   );
};

export default EventCountdown;
