import { ArrowDown, Mic, Users, Utensils } from "lucide-react";
import React from "react";

const Highlights = ({ lang = "en", highlights }) => {
   return (
      <section>
         <h3 className="text-2xl font-bold mb-6 text-gradient-amber">
            {lang === "en" ? "Agenda Highlights" : "أبرز ما في جدول الأعمال"}
         </h3>
         <ul className="mb-8 space-y-6">
            {highlights.map((item, i) => (
               <li>
                  <div className="relative flex items-start space-x-3">
                     <div>
                        <div className="relative px-1">
                           <div className="h-8 w-8 bg-amber/10 text-amber-dark dark:text-amber rounded-full ring-4 ring-amber-dark dark:ring-amber flex items-center justify-center">
                              {i + 1}
                           </div>
                        </div>
                     </div>
                     <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                           <span className="font-medium text-gray-900 dark:text-white">
                              {item.title[lang]}
                           </span>
                           <p className="text-xs mt-1">
                              {item.description[lang]}
                           </p>
                        </div>
                     </div>
                  </div>
               </li>
            ))}
         </ul>
      </section>
   );
};

export default Highlights;
