import React from "react";

const DetailsHero = ({
   lang,
   img = "https://placehold.co/800x400",
   title,
}) => {
   return (
      <div className="hero mt-28">
         <div
            className="relative aspect-[5/2] w-full rounded-xl overflow-hidden shadow-lg mb-8 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
         >
            <div className="flex h-full items-end p-4 md:p-8 text-white bg-gradient-to-t from-white dark:from-violet-light via-transparent to-transparent">
               <h2 className="text-2xl md:text-3xl lg:text-5xl text-foreground font-bold">
                  {title}
               </h2>
            </div>
         </div>
      </div>
   );
};

export default DetailsHero;
