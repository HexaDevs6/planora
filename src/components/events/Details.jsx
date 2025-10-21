import React from "react";
import {
   CalendarDays,
   CalendarPlus2,
   Clock4,
   CreditCard,
   MapPin,
} from "lucide-react";

const Details = () => {
   return (
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
               <div className="flex items-center gap-2">
                  <CalendarDays />
                  <div>
                     <p className="font-bold text-gray-900 dark:text-white">
                        Date
                     </p>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        October 26, 2024
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Clock4 />
                  <div>
                     <p className="font-bold text-gray-900 dark:text-white">
                        Time
                     </p>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        9:00 AM - 5:00 PM
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <MapPin />
                  <div>
                     <p className="font-bold text-gray-900 dark:text-white">
                        Location
                     </p>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        Innovation Center, SF
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <CreditCard />
                  <div>
                     <p className="font-bold text-gray-900 dark:text-white">
                        Price
                     </p>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        $199 (Early Bird)
                     </p>
                  </div>
               </div>
            </div>
            <button className="px-6 py-3 rounded-lg bg-amber text-white font-bold shadow-lg hover:bg-secondary-accent/90 flex items-center gap-2 flex-shrink-0 md:ml-auto">
               <CalendarPlus2 />
               Add to Calendar
            </button>
         </div>
   );
};

export default Details;
