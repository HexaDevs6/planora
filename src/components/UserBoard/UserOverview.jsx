import React, { useEffect, useState } from "react";
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

const userEventsData = {
  past: [
    {
      title: "Midnight Art Gala",
      date: "June 15, 2023",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvG42OiJ8sAIVM9_pzhCEhZw7XUVkPsIY-IFtql4nsEJku_AdBp2J9fZE4H-8RBqiKaY7GEYi5hOt5MID19HvbSboOKO2EiYIQ26ygw6Au_G1vzakQ0Dm-uZiKnuqCy0-Nm58G4y78Xm-jxhTb1QZ2tj8_0aT_Hr5iAIRRoBFwM02vBgdw8SzOxGky2qhMqIyztvXOhTXngjhsZDdTFpYM74GgDKALQ0uFCwvntPKuQoqto8CIiZcQT7OTj3gHisBN6Mgs1i3mQPKe",
    },
    {
      title: "Run for Hope Charity 5K",
      date: "Oct 02, 2023",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmC70nqMguBCRUYKgKaZwZg2XhQc1eTybnhjxYdQhW7iQAFN_bOcS7je6-MM4ITFG55bTG6fTgvAq9ZUIt22F37muEK_KWZf-SaNdI4n402uL8O0HtEK5hrdXZuJ8IlVqN5ZF3W2kPO0NEXhNLKEyZKqRNjcbXxlgMofPDHjKVb1oFo6kIc-xi8jr24Zje8p6GrCsHGRD5Ae5hbM82oGEc7aqIGCsHnOwQ12LhehXURQbt3qZwiVDoGrQnwdPgw-7J2cOrq1ho50hD",
    },
  ],
  saved: [
    {
      title: "The Lumineers Live",
      date: "Jan 25, 2025",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLAlmqWfkz4NFpHytbo55OEsIEg6kEiwAkxYzqwpqoAOpcuWdyQIExGBpxaRlRYvEMIf64f7lWUrowjOus1FyuYjKSx0qe9W4Upuxhmvqdssu4ieGoqnYyr7FiB2mYguEOAbLnW2BZZ3V_COHweL8LZW9H2thXBChhq8G0N5FKCY4vrGkb4STHAZPUnbPsUf0xWfaOfakUehp3NSQgKEHiEp408j8k5_fzrWW5dxctvpcP2WMdrX2tN7HfkqA40NkHq2TCmAo0jsZ-",
    },
  ],
};

export default function UserOverview() {
  const dispatch = useDispatch();
  const { lang } = useDirection();
  const [userCats, setUserCats] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [userEvents, setUserEvents] = useState([]);
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

  //get user upcoming events from supabase (based on user categories)
  useEffect(() => {
    //get user categories
    async function getUserCategories() {
      const { data, error } = await supabase
        .from("user_categories")
        .select("category_id")
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      }
      if (data) {
        setUserCats(data.map((c) => c.category_id));
      }
    }

    getUserCategories();
  }, [user?.id]);

  // 3) Filter events based on user categories
  useEffect(() => {
    if (!userCats.length || !eventsData.length) {
      setUserEvents([]); // empty state
      return;
    }

    const filtered = eventsData.filter((event) =>
      userCats.includes(event.category_id)
    );

    setUserEvents(filtered);
  }, [userCats, eventsData]);

  useEffect(() => {
    async function fetchTickets() {
      const { data, error } = await supabase
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
  }, [user]);

  useEffect(() => {
    const mergedData = userTickets.map((ticket) => {
      const eventDetails = eventsData.find(
        (event) => event.id === ticket.event_id
      );
      return {
        ...ticket,
        eventDetails,
      };
    });
    setFilteredEvents(mergedData);
  }, [userTickets, eventsData]);

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
          {userEvents.map((event, index) => (
            <div key={index} className="flex-shrink-0 min-w-[300px]">
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
        </div>
      </div>

      {/* Past & Saved Events */}
      <div className="user-highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="user-highlights__events space-y-4 col-span-2">
          {/* Past Events */}
          {userEventsData > 0 ? (
            <div className="past-events space-y-2">
              <h3 className="text-2xl font-bold text-primary">Past Events</h3>
              <div className="bg-background rounded-xl p-4 soft-shadow space-y-4 border">
                {userEventsData.past.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-sm hover:bg-amber-light dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row text-center md:text-start items-center gap-4">
                      <img
                        src={event.img}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-sm"
                      />
                      <div>
                        <h4 className="font-bold text-primary">
                          {event.title}
                        </h4>
                        <p className="text-sm text-text">{event.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost">
                      <ArrowUpRightFromSquareIcon />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-3 rounded-sm hover:bg-amber-light dark:hover:bg-gray-800 transition-colors">
              <h4 className="font-bold text-primary">No Past Events</h4>
            </div>
          )}

          {/* Saved Events */}
          {/* <div className='saved-events space-y-2'>
                        <h3 className='text-2xl font-bold text-primary'>
                            Saved Events
                        </h3>
                        <div className='bg-background rounded-xl p-4 soft-shadow space-y-4 border'>
                            {userEventsData.saved.map((event, idx) => (
                                <div
                                    key={idx}
                                    className='flex text-center md:text-start items-center justify-between p-3 rounded-sm hover:bg-amber-light dark:hover:bg-gray-800 transition-colors'
                                >
                                    <div className='flex flex-col md:flex-row items-center gap-4'>
                                        <img
                                            src={event.img}
                                            alt={event.title}
                                            className='w-16 h-16 object-cover rounded-sm'
                                        />
                                        <div>
                                            <h4 className='font-bold text-primary'>
                                                {event.title}
                                            </h4>
                                            <p className='text-sm text-text'>
                                                {event.date}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant='ghost'>
                                        <ArrowUpRightFromSquareIcon />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div> */}
        </div>

        {/* Next Ticket */}
        <div className="user__next-ticket space-y-2">
          <h3 className="text-2xl font-bold text-primary">Next Ticket</h3>
          <div className="bg-background rounded-xl p-6 shadow-sm text-center border">
            <h3 className="text-lg font-bold text-primary">
              {filteredEvents[0]?.eventDetails.name}
            </h3>
            <p className="text-sm text-content">Main Stage Access</p>

            <div className="ticket-image my-6">
              <TicketFrame>
                <div className="flex justify-center mb-4">
                  <div className="flex justify-center mb-4">
                    {filteredEvents[0]?.qr_code ? (
                      <StyledQR value={filteredEvents[0].qr_code} size={200} />
                    ) : (
                      <p className="text-sm text-muted">Loading QR...</p>
                    )}
                  </div>
                </div>
              </TicketFrame>
            </div>

            <div className="ticket-info border-t border-dashed border-border pt-4 text-left">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-content">Name</p>
                  <p className="font-semibold text-primary">{filteredEvents[0]?.eventDetails.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-content">Date</p>
                  <p className="font-semibold text-primary">{filteredEvents[0]?.eventDetails.date.split("T")[0]}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-xs text-content">Seat</p>
                  <p className="font-semibold text-primary">{filteredEvents[0]?.eventDetails.capacity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-content">Time</p>
                  <p className="font-semibold text-primary">{filteredEvents[0]?.eventDetails.date.split("T")[1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
