import { CalendarCheck, Hash, Headset, Users } from "lucide-react";
import React from "react";

const QuickInfo = () => {
   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
         <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Info
         </h4>
         <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
               <Users />
               <p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                     Attendees:
                  </span>{" "}
                  500+ Professionals
               </p>
            </li>
            <li className="flex items-center gap-3">
               <Hash />
               <p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                     Hashtag:
                  </span>
                  #TechInnovators2024
               </p>
            </li>
            <li className="flex items-center gap-3">
               <CalendarCheck />
               <p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                     Registration:
                  </span>
                  Open until Oct 20
               </p>
            </li>
            <li className="flex items-center gap-3">
               <Headset />
               <p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                     Contact:
                  </span>
                  info@techsummit.com
               </p>
            </li>
         </ul>
      </div>
   );
};

export default QuickInfo;
