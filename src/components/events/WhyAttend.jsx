import { CircleCheck, Lightbulb, PencilRuler, Users } from "lucide-react";
import React from "react";

const WhyAttend = ({lang = "en"}) => {
   return (
      <section className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 shadow-sm">
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Why Attend?" : "لماذا الحضور؟"}
         </h3>
         <ul className="list-none space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
               <CircleCheck />
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                     Insightful Keynotes:
                  </p>
                  <p className="text-sm">
                     Hear from leading innovators on future tech trends.
                  </p>
               </div>
            </li>
            <li className="flex items-start gap-3">
               <Users />
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                     Networking Opportunities:
                  </p>
                  <p className="text-sm">
                     Connect with industry peers and potential collaborators.
                  </p>
               </div>
            </li>
            <li className="flex items-start gap-3">
               <PencilRuler />
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                     Practical Workshops:
                  </p>
                  <p className="text-sm">
                     Gain hands-on experience with emerging technologies.
                  </p>
               </div>
            </li>
            <li className="flex items-start gap-3">
               <Lightbulb />
               <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                     Future-Proof Your Skills:
                  </p>
                  <p className="text-sm">
                     Stay ahead of the curve in a rapidly evolving industry.
                  </p>
               </div>
            </li>
         </ul>
      </section>
   );
};

export default WhyAttend;
