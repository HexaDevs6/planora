import { Ticket } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { createTicket } from "@/store/tickets/clientTicketsSlice";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import StyledQR from "../qrcode";
import TicketFrame from "../TicketFrame";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../modelpayment.jsx";
import { Card } from "../ui/card";

const EventCountdown = ({ details, eventId, hostId, user, lang = "en" }) => {
   const dispatch = useDispatch();
   // Function to calculate time left and event status

   const [isTicketBooked, setIsTicketBooked] = useState(false);
   const [ticket, setTicket] = useState(null);
   const [host, setHost] = useState(null);
   const navigate = useNavigate();

   const eventData = useMemo(() => details, [details.id]);

   useEffect(() => {
      const checkExistingTicket = async () => {
         const client = await user;

         const { data: existingTicket } = await supabase
            .from("tickets")
            .select("*")
            .eq("event_id", eventId)
            .eq("client_id", client?.id)
            .single();

         if (existingTicket) {
            setIsTicketBooked(true);
            setTicket(existingTicket);
         }
      };

      checkExistingTicket();
   }, [eventId, user?.id]);

   useEffect(() => {
      const fetchHost = async () => {
         if (!hostId) return;

         const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", hostId)
            .single();

         if (!error && data) {
            setHost(data);
         }
      };

      fetchHost();
   }, [hostId]);

   const handlePaidTicket = useCallback(async () => {
      try {
         if (!user?.id) {
            toast.error("User not logged in");
            return;
         }

         const tic = await dispatch(
            createTicket({ eventId, clientId: user.id, payStatus: "paid" })
         ).unwrap();
         if (tic) {
            toast.success("Ticket booked successfully");
            setIsTicketBooked(true);
            setTicket(tic);
            console.log(tic);
         }
      } catch (err) {
         console.error("SUPABASE ERROR:", err);
         toast.error("Payment done but ticket failed to save.");
      }
   }, [eventId, user?.id]);

   const handleCreateTicket = async () => {
      if (!user) {
         Swal.fire({
            title:
               lang === "ar"
                  ? "يرجى تسجيل الدخول لتتمكن من الحجز"
                  : "Please login to book a ticket",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "var(--secondary)",
            confirmButtonText: lang === "ar" ? "تسجيل الدخول" : "Login",
         }).then((result) => {
            if (result.isConfirmed) {
               navigate("/signin");
            }
         });
      }

      if (user.role === "host") {
         toast.error(
            lang === "ar"
               ? "لا يمكنك حجز التذاكر للمستضيفين"
               : "You can't book tickets for hosts"
         );
         return;
      }

      try {
         const client = await user;
         const tic = await dispatch(
            createTicket({ eventId, clientId: client.id, payStatus: "paid" })
         ).unwrap();
         if (tic) {
            toast.success(
               lang === "ar"
                  ? "تذكرة الدخول حجزت بنجاح"
                  : "Ticket booked successfully",
               { duration: 5000, icon: "🎉" }
            );
            setIsTicketBooked(true);
            setTicket(tic);
            console.log(tic);
         }
      } catch (error) {
         toast.error(
            lang === "ar" ? "فشل حجز التذكرة" : "Failed to book ticket",
            { duration: 5000, icon: "❌" }
         );
         console.error(error);
      }
   };
   // const [eventStatus, setEventStatus] = useState("upcoming");
   const [countdown, setCountdown] = useState(() => calculateTimeLeft());

   // Calculates only the remaining time until the event starts
   function calculateTimeLeft() {
      const now = Date.now();
      const start = new Date(details.date).getTime();

      const diff = start - now;

      if (diff <= 0) {
         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
         days: Math.floor(diff / (1000 * 60 * 60 * 24)),
         hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
         minutes: Math.floor((diff / (1000 * 60)) % 60),
         seconds: Math.floor((diff / 1000) % 60),
      };
   }

   // Memoized event status, recalculated only when the dates change
   const eventStatus = useMemo(() => {
      const now = Date.now();
      const start = new Date(details.date).getTime();
      const end = new Date(details.end_date).getTime();

      if (now >= start && now <= end) return "ongoing";
      if (now > end) return "ended";
      return "upcoming";
   }, [details.date, details.end_date]);

   // Updates the countdown every second
   useEffect(() => {
      const timer = setInterval(() => {
         setCountdown(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
   }, [details.date]);

   const formatNumber = (num) => num.toString().padStart(2, "0");

   const renderStatus = () => {
      switch (eventStatus) {
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
         className={`gradient-card rounded-xl p-4 xl:p-6 ${lang === "ar" ? "text-right font-[Cairo]" : "text-left"
            }`}
      >
         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {lang === "ar" ? "العد التنازلي للحدث" : "Event Countdown"}
         </h4>

         {renderStatus()}

         {eventStatus === "upcoming" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
               <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                  <p className="text-2xl xl:text-4xl font-bold text-gradient-amber ">
                     {formatNumber(countdown.days)}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-foreground mt-1">
                     {lang === "ar" ? "يوم" : "Days"}
                  </p>
               </div>
               <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                  <p className="text-2xl xl:text-4xl font-bold text-gradient-amber ">
                     {formatNumber(countdown.hours)}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-foreground mt-1">
                     {lang === "ar" ? "ساعة" : "Hours"}
                  </p>
               </div>
               <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                  <p className="text-2xl xl:text-4xl font-bold text-gradient-amber ">
                     {formatNumber(countdown.minutes)}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-foreground mt-1">
                     {lang === "ar" ? "دقيقة" : "Minutes"}
                  </p>
               </div>
               <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                  <p className="text-2xl xl:text-4xl font-bold text-gradient-amber ">
                     {formatNumber(countdown.seconds)}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-foreground mt-1">
                     {lang === "ar" ? "ثانية" : "Seconds"}
                  </p>
               </div>
            </div>
         ) : (
            <div className="text-center text-gray-600 dark:text-gray-300 mt-4">
               {eventStatus === "ongoing"
                  ? lang === "ar"
                     ? "الحدث جاري حالياً."
                     : "The event is live now."
                  : lang === "ar"
                     ? "تابعنا لمزيد من الأحداث القادمة."
                     : "Stay tuned for upcoming events."}
            </div>
         )}

         {isTicketBooked && ticket ? (
            <Card className={'rounded-xl overflow-hidden mt-4'}>
               <TicketFrame
                  ticketData={{
                     event: details,
                     client: user,
                     host: host,
                     ticket: ticket,
                     qrCode: ticket.qr_code,
                  }}
               >
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
            </Card>
         ) :
            eventStatus !== "ended" && !details.is_free && !details.is_full ? (
               <PaymentModal
                  event={eventData}
                  user={user}
                  onPaymentSuccess={handlePaidTicket}
               />
            ) : (
               <Button
                  className="mt-6 w-full"
                  variant="default"
                  size="CTA"
                  onClick={handleCreateTicket}
                  disabled={eventStatus === "ended" || details.is_full}
               >
                  <Ticket className="size-4" />
                  {lang === "ar" ? "أحجز الان" : "Book Now"}
               </Button>
            )}
      </div>
   );
};

export default EventCountdown;
