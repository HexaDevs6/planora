import { Mic, Users, Utensils } from "lucide-react";
import React from "react";

const Highlights = () => {
   return (
      <section>
         <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Agenda Highlights
         </h3>
         <div className="flow-root">
            <ul className="-mb-8">
               <li>
                  <div className="relative pb-8">
                     <span
                        aria-hidden="true"
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-primary/20 dark:bg-primary/30"
                     />
                     <div className="relative flex items-start space-x-3">
                        <div>
                           <div className="relative px-1">
                              <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full ring-4 ring-background-light dark:ring-background-dark flex items-center justify-center">
                                 <Mic />
                              </div>
                           </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                           <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white">
                                 9:00 AM - 10:00 AM: Opening Keynote
                              </span>
                              <p className="text-xs mt-1">
                                 "The Future of AI" by Dr. Alex Turner
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </li>
               <li>
                  <div className="relative pb-8">
                     <span
                        aria-hidden="true"
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-primary/20 dark:bg-primary/30"
                     />
                     <div className="relative flex items-start space-x-3">
                        <div>
                           <div className="relative px-1">
                              <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full ring-4 ring-background-light dark:ring-background-dark flex items-center justify-center">
                                 <Users />
                              </div>
                           </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                           <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white">
                                 10:30 AM - 12:00 PM: Panel Discussion
                              </span>
                              <p className="text-xs mt-1">
                                 "Cybersecurity in the Quantum Age"
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </li>
               <li>
                  <div className="relative pb-8">
                     <div className="relative flex items-start space-x-3">
                        <div>
                           <div className="relative px-1">
                              <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full ring-4 ring-background-light dark:ring-background-dark flex items-center justify-center">
                                 <Utensils />
                              </div>
                           </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                           <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white">
                                 12:00 PM - 1:00 PM: Networking Lunch
                              </span>
                              <p className="text-xs mt-1">
                                 Opportunity to connect with speakers and
                                 attendees.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </li>
            </ul>
         </div>
         <a
            className="text-primary font-medium text-sm mt-4 inline-block hover:underline"
            href="#"
         >
            View Full Agenda
         </a>
      </section>
   );
};

export default Highlights;
