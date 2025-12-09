import React from "react";
import { MapPin } from "lucide-react";
import MapViewer from "@/components/map/MapViewer";
import DirectionsButton from "@/components/map/DirectionsButton";

const Location = ({
   lang = "en",
   address = "Egypt",
   latitude,
   longitude,
}) => {
   if (!address || address.trim() === "") {
      return null;
   }

   return (
      <section>
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Location" : "الموقع"}
         </h3>
         
         {/* Interactive Map using Leaflet */}
         <MapViewer 
            location={address}
            latitude={latitude}
            longitude={longitude}
            lang={lang}
         />
         
         {/* Address Display */}
         <div className="flex items-start gap-2 mt-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-400">
               {address}
            </p>
         </div>
         
         {/* Get Directions Button */}
         <DirectionsButton
            latitude={latitude}
            longitude={longitude}
            label={address}
            lang={lang}
         />
      </section>
   );
};

export default Location;
