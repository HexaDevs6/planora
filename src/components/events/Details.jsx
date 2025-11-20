import React from "react";
import {
   CalendarDays,
   Clock4,
   CreditCard,
   MapPin,
} from "lucide-react";

const Details = ({ details, lang = "en" }) => {
   // Convert to Date objects
   const start = new Date(details.date);
   const end = new Date(details.end_date);

   // Format Date (October 26, 2024) or (٢٦ أكتوبر ٢٠٢٤)
   const formattedDate = new Intl.DateTimeFormat(
      lang === "ar" ? "ar-EG" : "en-US",
      {
         year: "numeric",
         month: "long",
         day: "numeric",
      }
   ).format(start);

   // Format Time (9:00 AM - 5:00 PM)
   const formatTime = (date) =>
      new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
         hour: "numeric",
         minute: "2-digit",
         hour12: true,
      }).format(date);

   const formattedTime = `${formatTime(start)} - ${formatTime(end)}`;

   return (
      <div className="gradient-card rounded-xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow w-full">
            {/* Date */}
            <div className="flex items-center gap-2">
               <CalendarDays />
               <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                     {lang === "ar" ? "التاريخ" : "Date"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {formattedDate}
                  </p>
               </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2">
               <Clock4 />
               <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                     {lang === "ar" ? "الوقت" : "Time"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {formattedTime}
                  </p>
               </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
               <MapPin />
               <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                     {lang === "ar" ? "الموقع" : "Location"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {details.location}
                  </p>
               </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
               <CreditCard />
               <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                     {lang === "ar" ? "السعر" : "Price"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     {details.price} EGP
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Details;
