import React from "react";

const Location = ({
   lang= "en",
   src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3418.8272013926735!2d30.466650274469004!3d31.031063671155543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f66bd729891573%3A0x4f36bd676063305c!2sInternational%20Academy%20of%20Information%20Technology%20and%20Languages!5e0!3m2!1sen!2seg!4v1761057016093!5m2!1sen!2seg",
}) => {
   // Extract lat & lng from the src (using regex)
   const match = src.match(/!3d([\d.-]+)!4d([\d.-]+)/);
   const lat = match ? match[1] : "31.031063671155543";
   const lng = match ? match[2] : "30.466650274469004";

   const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

   return (
      <section>
         <h3 className="text-2xl font-bold mb-4 text-gradient-amber">
            {lang === "en" ? "Location" : "الموقع"}
         </h3>
         <div className="rounded-xl overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <iframe
               src={src}
               loading="lazy"
               allowFullScreen
               referrerPolicy="no-referrer-when-downgrade"
               className="w-full h-full border-0 rounded-xl"
            ></iframe>
         </div>
         <p className="text-gray-600 dark:text-gray-400 mt-3">
            {lang === "en" ? "Innovation Center, 123 Tech Drive, San Francisco, CA" : "مركز الابتكار، 123 تيك درايف، سان فرانسيسكو، كاليفورنيا"}
         </p>
         <a
            className="text-primary font-medium text-sm mt-2 inline-block hover:underline"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
         >
            {lang === "en" ? "Get Directions" : "الحصول على الاتجاهات"}
         </a>
      </section>
   );
};

export default Location;
