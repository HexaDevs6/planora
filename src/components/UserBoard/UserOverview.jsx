import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BoardCard from "../BoardCard";
import { ArrowUpRightFromSquareIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { fetchEvents } from "@/store/fetchEventsThunk";
import { useDirection } from "@/hooks/useDirection";
import TicketFrame from "./../TicketFrame";
import StyledQR from "../qrcode";

import { motion } from "framer-motion";
import { t } from "i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UserOverview() {
  const dispatch = useDispatch();
  const { lang } = useDirection();
  const [userCats, setUserCats] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [openTicket, setOpenTicket] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const {
    items: eventsDataRaw,
    loading: eventsLoading,
    error,
  } = useSelector((state) => state.events);

  // safe fallback
  const eventsData = eventsDataRaw || [];

  // Fetch events once if not loaded
  useEffect(() => {
    if (!eventsData || !eventsData.length) {
      dispatch(fetchEvents());
    }
  }, [dispatch, eventsData]);

  // get user categories (only when user id exists)
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    async function getUserCategories() {
      const { data, error } = await supabase
        .from("user_categories")
        .select("category_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user categories:", error);
        return;
      }
      if (!cancelled && data) {
        setUserCats(data.map((c) => c.category_id));
      }
    }
    getUserCategories();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // get tickets (only when user id exists)
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    async function fetchTickets() {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("client_id", user.id);
      if (error) {
        console.error("Error fetching tickets:", error);
      } else if (!cancelled) {
        setUserTickets(data || []);
      }
    }
    fetchTickets();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // userEvents derived from eventsData + userCats
  const userEvents = useMemo(() => {
    if (!userCats || !userCats.length || !eventsData.length) return [];
    return eventsData.filter((event) => userCats.includes(event.category_id));
  }, [userCats, eventsData]);

  // merged ticket + event info (memoized)
  const filteredEvents = useMemo(() => {
    if (!userTickets.length) return [];
    return userTickets.map((ticket) => {
      const eventDetails =
        eventsData.find((ev) => ev.id === ticket.event_id) || null;
      return { ...ticket, eventDetails };
    });
  }, [userTickets, eventsData]);

  const locale = lang === "ar" ? "ar-EG" : "en-US";

  return (
    <div className="overview flex flex-col gap-12 container">
      {/* Upcoming Events */}
      <div className="upcoming-events">
        <div className="upcoming-events__header flex flex-col items-start md:flex-row md:items-center gap-2 justify-between">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {lang === "en" ? "Upcoming Events" : "الفعاليات القادمة"}
          </h2>
          <Link to="/events">
            <Button variant="outline">
              {lang === "en" ? "View All" : "عرض الكل"}{" "}
              <ArrowUpRightFromSquareIcon />
            </Button>
          </Link>
        </div>

        <div className="upcoming-events__cards flex items-start flex-nowrap overflow-x-auto gap-4 py-4">
          {userEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0 min-w-[300px]">
              <BoardCard
                title={event.name}
                image={event.thumbnail}
                location={event.location}
                date={event.date}
                eventId={event.id}
                host={event.host_id}
              />
            </div>
          ))}
          {!userEvents.length && (
            <p className="text-muted-foreground px-4">
              {lang === "ar"
                ? "لا فعاليات قادمة متاحة"
                : "No upcoming events found"}
            </p>
          )}
        </div>
      </div>

      {/* Upcoming Tickets */}
      <div className="user-highlights">
        <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
          {lang === "ar" ? " التذاكر القادمة" : "upcoming tickets"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((el, i) => {
            const rawName =
              lang === "ar"
                ? el.eventDetails?.name_ar ?? el.eventDetails?.name ?? "N/A"
                : el.eventDetails?.name ?? el.eventDetails?.name_ar ?? "N/A";

            const shortName =
              rawName === "N/A"
                ? "N/A"
                : rawName.split(" ").slice(0, 2).join(" ") + "...";

            return (
              <motion.div
                key={el.id} // ticket id is fine
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
                          {lang === "ar"
                            ? "لا تشارك هذه التذكرة مع احد"
                            : "Don't share this ticket with anyone!"}
                        </h3>

                        <div className="flex justify-center mb-4">
                          <StyledQR value={el?.qr_code ?? ""} size={200} />
                        </div>
                      </TicketFrame>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold">
                        {shortName}
                      </CardTitle>

                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {el.eventDetails?.is_free
                          ? t("eventsPage.free")
                          : `$${el.eventDetails?.price ?? "N/A"}`}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm pb-4">
                    <p className="text-muted-foreground flex gap-2">
                      <Calendar size={16} />{" "}
                      {el.eventDetails?.date
                        ? new Date(el.eventDetails.date).toLocaleDateString(
                            locale
                          )
                        : "N/A"}
                    </p>

                    <p className="text-muted-foreground flex gap-2 truncate">
                      <MapPin size={16} />{" "}
                      {el.eventDetails?.location ?? "Unspecified"}
                    </p>

                    <p className="text-muted-foreground flex gap-2">
                      <Users size={16} /> {el.eventDetails?.capacity ?? "N/A"}{" "}
                      attendees
                    </p>
                    <div className={`flex items-center pt-2 w-full`}>
                      <Link
                        className="w-full"
                        to={`/events/${el.eventDetails?.id ?? ""}`}
                      >
                        <Button className="w-full" variant="amber" size="lg">
                          {t("eventsPage.category.cards.viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Dialog
                  open={openTicket === el.id}
                  onOpenChange={() => setOpenTicket(null)}
                >
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {lang === "ar" ? "تفاصيل التذكرة" : "Ticket Details"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center py-4">
                      <StyledQR value={el?.qr_code ?? ""} size={260} />
                      <p className="mt-4 text-sm text-muted-foreground">
                        {lang === "ar"
                          ? el.eventDetails?.name_ar ??
                            el.eventDetails?.name ??
                            "N/A"
                          : el.eventDetails?.name ??
                            el.eventDetails?.name_ar ??
                            "N/A"}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}

          {!filteredEvents.length && (
            <p className="text-muted-foreground col-span-full">
              {lang === "ar" ? "لا توجد تذاكر حالياً" : "No tickets available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
