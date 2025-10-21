import React from "react";

const EventHero = ({
   lang,
   img = "https://placehold.co/800x400",
   title = { ar: "العنوان باللغة العربية", en: "This is english title" },
}) => {
   return (
      <div className="hero mt-28">
         <div
            className="relative aspect-[3/1] w-full rounded-xl overflow-hidden shadow-lg mb-8 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
         >
            <div className="flex h-full items-end p-8 text-white bg-gradient-to-t from-white dark:from-violet-light via-transparent to-transparent">
               <h2 className="text-4xl md:text-5xl text-foreground font-bold">
                  {title[lang]}
               </h2>
            </div>
         </div>
      </div>
   );
};

export default EventHero;
