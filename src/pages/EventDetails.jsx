import EventHero from "@/components/events/EventHero";
import Details from "@/components/events/Details";

import React from "react";
import WhyAttend from "@/components/events/WhyAttend";
import Highlights from "@/components/events/Highlights";
import Speakers from "@/components/events/Speakers";
import Location from "@/components/events/Location";
import EventCountdown from "@/components/events/EventCountdown";
import QuickInfo from "@/components/events/QuickInfo";
import { Facebook, Instagram, Twitter } from "lucide-react";

const EventDetails = () => {
   return (
      <main>
         <div className="container">
            {/* hero */}
            <EventHero />
            {/* details */}
            <Details />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-10">
                  <WhyAttend />
                  <section>
                     <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        About the Event
                     </h3>
                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Join us for the Tech Innovators Summit, a premier event
                        bringing together the brightest minds in technology.
                        Explore the latest trends, network with industry
                        leaders, and discover groundbreaking innovations shaping
                        the future. This summit features keynote speeches, panel
                        discussions, and interactive workshops designed to
                        inspire and empower tech professionals.
                     </p>
                  </section>
                  <Highlights />
                  <Speakers />
                  <Location />
                  <section className="bg-primary/5 dark:bg-primary/10 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                           Ready to Innovate?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                           Secure your spot at the summit today.
                        </p>
                     </div>
                     <div className="flex-shrink-0 flex gap-4">
                        <button className="px-6 py-3 rounded-lg bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105">
                           Book Now
                        </button>
                        <button className="px-6 py-3 rounded-lg bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 font-bold border border-primary/20 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                           Share
                        </button>
                     </div>
                  </section>
               </div>
               <div className="md:col-span-1 space-y-8">
                  <EventCountdown />
                  <QuickInfo />
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                     <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Share This Event
                     </h4>
                     <div className="flex justify-center gap-4">
                        <button className="p-3 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform">
                           <Facebook />
                        </button>
                        <button className="p-3 rounded-full bg-blue-400 text-white hover:scale-110 transition-transform">
                           <Twitter />
                        </button>
                        <button className="p-3 rounded-full bg-red-600 text-white hover:scale-110 transition-transform">
                           <Instagram />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
};

export default EventDetails;
