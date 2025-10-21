import { Ticket } from "lucide-react";
import React from "react";

const EventCountdown = () => {
   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Event Countdown
         </h4>
         <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
               <p className="text-4xl font-black gradient-highlight">120</p>
               <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">
                  Days
               </p>
            </div>
            <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
               <p className="text-4xl font-black gradient-highlight">08</p>
               <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">
                  Hours
               </p>
            </div>
            <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
               <p className="text-4xl font-black gradient-highlight">30</p>
               <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">
                  Minutes
               </p>
            </div>
            <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
               <p className="text-4xl font-black gradient-highlight">15</p>
               <p className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-1">
                  Seconds
               </p>
            </div>
         </div>
         <button className="mt-6 w-full px-6 py-3 rounded-lg bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
            <Ticket />
            Get Tickets Now
         </button>
      </div>
   );
};

export default EventCountdown;
