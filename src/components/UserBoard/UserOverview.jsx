import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BoardCard from "../BoardCard";
import { ArrowUpRightFromSquareIcon } from "lucide-react";

export default function UserOverview() {
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

  return (
    <div className="overview flex flex-col gap-12 transition-all duration-300 ease-in-out">
      {/* Upcoming Events */}
      <div className="upcoming-events">
        <div className="upcoming-events__header flex flex-col items-start md:flex-row md:items-center gap-2 justify-between">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Upcoming Events
          </h2>
          <Link to="/events">
            <Button variant="outline">
              View All <ArrowUpRightFromSquareIcon />
            </Button>
          </Link>
        </div>

        <div className="upcoming-events__cards flex items-start flex-nowrap overflow-x-auto gap-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 min-w-[300px]">
              <BoardCard />
            </div>
          ))}
        </div>
      </div>

      {/* Past & Saved Events */}
      <div className="user-highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="user-highlights__events space-y-4 col-span-2">
          {/* Past Events */}
          <div className="past-events space-y-2">
            <h3 className="text-2xl font-bold text-primary">Past Events</h3>
            <div className="bg-card rounded-md p-4 soft-shadow space-y-4">
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
                      <h4 className="font-bold text-primary">{event.title}</h4>
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

          {/* Saved Events */}
          <div className="saved-events space-y-2">
            <h3 className="text-2xl font-bold text-primary">Saved Events</h3>
            <div className="bg-card rounded-md p-4 soft-shadow space-y-4">
              {userEventsData.saved.map((event, idx) => (
                <div
                  key={idx}
                  className="flex text-center md:text-start items-center justify-between p-3 rounded-sm hover:bg-amber-light dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                    <div>
                      <h4 className="font-bold text-primary">{event.title}</h4>
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
        </div>

        {/* Next Ticket */}
        <div className="user__next-ticket space-y-2">
          <h3 className="text-2xl font-bold text-primary">Next Ticket</h3>
          <div className="bg-card rounded-md p-6 shadow-sm text-center border border-border">
            <h3 className="text-lg font-bold text-primary">
              Vibrations Music Festival
            </h3>
            <p className="text-sm text-content">Main Stage Access</p>

            <div className="ticket-image my-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxE_bEHgOB6zMC9k9Dd0BvU0z_0yTVsLceuLP483W61bGYJ8D85TqwyjUrc8Jpr-CmNBPNoDsF46TGFkwB9jboovIT_RTixjagzp58fRNlH4pNB126qdZO4Zjzbzru70Gv0MteWw9N0-AvlwvLguAhtWllhH3ddH4zH5cX9PFTQj7M8eVME9WfyjslnS9VoPsUZHrHHuHWJzHzi5vwf7-ufd2DZdKDZr8xW15XRjjW82G3ZwrJxe-qNrH53NdwxqyJH6eNaXrmSYyr"
                alt="QR Code"
                className="mx-auto rounded-sm"
              />
            </div>

            <div className="ticket-info border-t border-dashed border-border pt-4 text-left">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-content">Name</p>
                  <p className="font-semibold text-primary">Jane Doe</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-content">Date</p>
                  <p className="font-semibold text-primary">Dec 12</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-xs text-content">Seat</p>
                  <p className="font-semibold text-primary">GA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-content">Time</p>
                  <p className="font-semibold text-primary">12:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
