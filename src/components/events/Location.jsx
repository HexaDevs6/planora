import React from "react";
import { MapPin } from "lucide-react";

const Location = ({
   lang = "en",
   address = "Egypt",
}) => {
   if (!address || address.trim() === "") {
      return null;
   }

   const encodedAddress = encodeURIComponent(address);
   const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
   const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

   return (
      <section>
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Location" : "الموقع"}
         </h3>
         <div className="rounded-xl overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <iframe
               src={mapEmbedUrl}
               loading="lazy"
               allowFullScreen
               referrerPolicy="no-referrer-when-downgrade"
               className="w-full h-full border-0 rounded-xl"
               title={`Map of ${address}`}
            ></iframe>
         </div>
         <div className="flex items-start gap-2 mt-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-400">
               {address}
            </p>
         </div>
         <a
            className="text-primary font-medium text-sm mt-2 inline-flex items-center gap-1 hover:underline"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
         >
            {lang === "en" ? "Get Directions" : "الحصول على الاتجاهات"} →
         </a>
      </section>
   );
};

export default Location;
