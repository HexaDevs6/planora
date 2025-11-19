import React, {useEffect, useState } from "react";
import { useDirection } from "@/hooks/useDirection";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { fetchEvents } from "@/store/fetchEventsThunk";
import { motion } from "framer-motion";
import { t } from "i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TicketFrame from './../TicketFrame';
import StyledQR from "../qrcode";
import { Calendar, MapPin, StopCircle, Users } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from "@/components/ui/dialog"




export default function UserTickets() {
  const {user} = useSelector((state) => state.auth);
  const [userTickets, setUserTickets] =useState([]);
  const [openTicket, setOpenTicket] = useState(null); 
  const [filteredEvents, setFilteredEvents] = useState([]);
  const {lang} = useDirection();
  const dispatch = useDispatch();



  // get events from supabase
    const {
      items: eventsData,
      loading: eventsLoading,
      error,
    } = useSelector((state) => state.events);
  
    useEffect(() => {
      // Fetch only if data not loaded before
      if (!eventsData.length) dispatch(fetchEvents());
    
    }, [dispatch, eventsData.length]);

  useEffect(() => {

    async function fetchTickets() {
      const {data, error} = await supabase
        .from("tickets")
        .select("*")
        .eq("client_id", user.id);
      if (error) {
        console.error("Error fetching tickets:", error);
      } else {
        setUserTickets(data);
       
      }
    }
    fetchTickets();
    console.log("Fetched tickets:", userTickets);
  }, [user]);


  useEffect(() => {
    const mergedData = userTickets.map((ticket) => {
      const eventDetails = eventsData.find((event) => event.id === ticket.event_id);
      return {
        ...ticket,
        eventDetails,
      };
    });
    setFilteredEvents(mergedData);
    console.log("Merged ticket and event data:", filteredEvents);
    

  }, [userTickets, eventsData]);


  return (
    <>
      {/* Main Content */}
      <main className="container">
        {/* Header */}
        <header className="mb-16 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-primary drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
              {lang === "ar" ? "تذاكري" : "My Tickets"}
            </h1>
            <p className="text-lg text-content mt-3">
              Your personalized chronological feed of events.
            </p>
          </div>
        </header>

        {/* Upcoming Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
            Upcoming Events
          </h2>
          <div className="space-y-8">
            {/* Event 1 */}
            <div className="relative bg-card/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start gap-6 hover:bg-accent/10 transition-all duration-300 border border-border">
              <div className="flex-shrink-0 bg-accent/20 text-primary rounded-lg p-3 text-center w-20 sm:w-auto">
                <span className="block text-2xl sm:text-3xl font-extrabold">
                  24
                </span>
                <span className="block text-xs sm:text-sm">JUL</span>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  Summer Music Festival
                </h3>
                <p className="text-sm sm:text-base text-content mb-2">
                  Outdoor concert featuring local bands.
                </p>
                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  Central Park, New York
                </p>
                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  10:00 AM - 06:00 PM
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all text-sm font-semibold shadow-md">
                    <span className="material-symbols-outlined text-base mr-1">
                      confirmation_number
                    </span>
                    View Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="relative bg-card/80 backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start gap-6 hover:bg-accent/10 transition-all duration-300 border border-border">
              <div className="flex-shrink-0 bg-accent/20 text-primary rounded-lg p-3 text-center w-20 sm:w-auto">
                <span className="block text-2xl sm:text-3xl font-extrabold">
                  12
                </span>
                <span className="block text-xs sm:text-sm">AUG</span>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  Tech Innovation Summit
                </h3>
                <p className="text-sm sm:text-base text-content mb-2">
                  Conference on future technologies.
                </p>
                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  Convention Center, San Francisco
                </p>
                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  09:00 AM - 05:00 PM
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all text-sm font-semibold shadow-md">
                    <span className="material-symbols-outlined text-base mr-1">
                      confirmation_number
                    </span>
                    View Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
            Live Events
          </h2>
          <div className="space-y-8">
            <div className="relative bg-card backdrop-blur-md p-6 rounded-2xl shadow-lg flex items-start gap-6 border-2 border-accent">
              <div className="flex-shrink-0 bg-accent/20 text-primary rounded-lg p-3 text-center">
                <span className="block text-3xl font-extrabold">15</span>
                <span className="block text-sm">JUL</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  Online Marketing Masterclass{" "}
                  <span className="ml-2 inline-flex items-center rounded-full bg-destructive px-3 py-0.5 text-xs font-medium text-white shadow-md">
                    LIVE
                  </span>
                </h3>
                <p className="text-content mb-2">
                  Interactive webinar on digital marketing strategies.
                </p>
                <p className="text-sm text-content">
                  <span className="material-symbols-outlined text-base align-middle mr-1">
                    language
                  </span>
                  Online Event
                </p>
                <p className="text-sm text-content">
                  <span className="material-symbols-outlined text-base align-middle mr-1">
                    schedule
                  </span>
                  02:00 PM - 04:00 PM (Currently Active)
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all text-sm font-semibold shadow-md">
                    <span className="material-symbols-outlined text-base mr-2">
                      videocam
                    </span>
                    Join Live
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Past Events */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
            Past Events
          </h2>
          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start gap-6 hover:bg-accent/10 transition-all duration-300 border border-border">
              <div className="flex-shrink-0 bg-muted text-content rounded-lg p-3 text-center w-20 sm:w-auto">
                <span className="block text-2xl sm:text-3xl font-bold">01</span>
                <span className="block text-xs sm:text-sm">JUL</span>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  City Marathon 2024
                </h3>
                <p className="text-sm sm:text-base text-content mb-2">
                  Annual running event across the city.
                </p>

                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  Downtown Streets, Cityville
                </p>

                <p className="text-sm text-content flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  07:00 AM - 12:00 PM
                </p>
                <div className="mt-4">
                  <button className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 bg-primary/90 text-primary-foreground rounded-lg hover:bg-accent transition-all text-sm font-semibold shadow-md">
                    <span className="material-symbols-outlined text-base mr-1">
                      confirmation_number
                    </span>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Event */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
            {lang === "ar" ? " التذاكر القادمة" : "upcoming tickets"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
  {filteredEvents.map((el, i) => (
    <motion.div
      key={el.id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
    >
      <Card className="overflow-hidden rounded-xl shadow-sm hover:shadow-md p-0 hover:scale-[1.02] duration-300 transition-all">
        <div className="p-4 border-b">
          <div 
  className="cursor-pointer"
  onClick={() => setOpenTicket(el.id)}
>
  <TicketFrame>
    <h3 className="text-center text-lg font-semibold mb-4 text-amber">
      {lang === "ar" ? "لا تشارك هذه التذكرة مع احد" : "Don't share this ticket with anyone!"}
    </h3>

    <div className="flex justify-center mb-4">
      <StyledQR value={el?.qr_code} size={200} />
    </div>
  </TicketFrame>
</div>

        </div>

       
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">
              {lang === "ar" ? el.eventDetails?.name_ar : el.eventDetails?.name}
            </CardTitle>

            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {el.eventDetails.is_free ? t("eventsPage.free") : `$${el.eventDetails.price}`}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm pb-4">
          <p className="text-muted-foreground flex gap-2">
            <Calendar size={16} /> {el.eventDetails.date
              ? new Date(el.eventDetails.date).toLocaleDateString(lang)
              : "N/A"}
          </p>

          <p className="text-muted-foreground flex gap-2">
            <MapPin size={16} /> {el.eventDetails.location || "Unspecified"}
          </p>

          <p className="text-muted-foreground flex gap-2">
            <Users size={16} /> {el.eventDetails.capacity} attendees
          </p>
          <div className={`flex items-center pt-2 w-full`}>
          <Link className="w-full" to={`/events/${el.eventDetails.id}`}>
            <Button className="w-full" variant="amber" size="lg">
              {t('eventsPage.category.cards.viewDetails')}
            </Button>
          </Link>
        </div>
        </CardContent>

      </Card>
      <Dialog open={openTicket === el.id} onOpenChange={() => setOpenTicket(null)}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>
        {lang === "ar" ? "تفاصيل التذكرة" : "Ticket Details"}
      </DialogTitle>
    </DialogHeader>

    <div className="flex flex-col items-center py-4">
      <StyledQR value={el?.qr_code} size={260} />
      <p className="mt-4 text-sm text-muted-foreground">
        {lang === "ar" ? el.eventDetails?.name_ar : el.eventDetails?.name}
      </p>
    </div>
  </DialogContent>
</Dialog>
    </motion.div>
  ))}
</div>



        </section>
      </main>
    </>
  );
}
