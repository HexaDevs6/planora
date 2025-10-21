import { Map } from "lucide-react";
import React from "react";

const Location = () => {
   return (
      <section>
         <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Location
         </h3>
         <div className="rounded-xl overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <Map />
            <p className="text-lg ml-2">Map placeholder</p>
         </div>
         <p className="text-gray-600 dark:text-gray-400 mt-3">
            Innovation Center, 123 Tech Drive, San Francisco, CA
         </p>
         <a
            className="text-primary font-medium text-sm mt-2 inline-block hover:underline"
            href="#"
         >
            Get Directions
         </a>
      </section>
   );
};

export default Location;
