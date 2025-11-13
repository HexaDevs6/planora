import React from "react";
import yourTicket from "../../assets/your-Ticket.jpeg";

export default function UserTickets() {
  return (
    <>
      {/* Main Content */}
      <main className="container">
        {/* Header */}
        <header className="mb-16 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-primary drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
              Up Coming Events & Tickets
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
        <section>
          <h2 className="text-3xl font-bold text-primary border-b border-border pb-4 mb-8">
            Featured Event
          </h2>
          <div className="relative bg-card backdrop-blur-md rounded-2xl shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden border border-border hover:scale-[1.02] transition-transform duration-300">
            <div
              className="md:w-1/3 bg-cover bg-center min-h-[200px]"
              style={{ backgroundImage: `url(${yourTicket})` }}
            ></div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-accent mb-1">
                  Upcoming
                </p>
                <h3 className="text-2xl font-bold text-primary">
                  Tech Summit 2024
                </h3>
                <p className="text-content mt-1 text-sm sm:text-base">
                  October 26, 2024 · 9:00 AM - 5:00 PM
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4 sm:gap-0">
                <div className="flex items-center gap-2 text-content">
                  <span className="material-symbols-outlined text-lg">
                    location_on
                  </span>
                  <span className="text-sm">Virtual Event</span>
                </div>

                <button className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-lg hover:bg-accent transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
                  <span>View Ticket</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="bg-card p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-border">
              <img
                alt="QR Code"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYSJJv8JyC7HXyTDZBtLL1WV47w40A2L9ls2NP2-gXsflxyeIbEiRmHlDqanKmUuD6USJCrsW8eJ-CiShgEtziIbmLhgybPvoLZNfag9F76j7LE0jZVD5qGjr0Oy0N30lQnpQ1ge5XG-VCCDrlWrKrvuwZih7DiLvx9-YIIifZGLWjLgAwiECT8Bb1rDwIY1ExO85gLjKtGcXJt2UPcXF4Q8kaxYRnUw8NMhOkl1vL4e2iqIIlxDXJOtAf8rF5UYd4k_6vkqEGVDWz"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
