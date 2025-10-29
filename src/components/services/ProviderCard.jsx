import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, MessageCircle } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
const ProviderCard = ({ provider }) => {
   const navigate = useNavigate();
   const { lang } = useDirection();
   const handleMessageClick = (e) => {
      e.preventDefault();
      navigate(`/messages/new?to=${provider.id}`);
   };

   return (
      <Link to={`/user/${provider.id}`}>
         <div className="group gradient-card rounded-xl p-4 flex  md:flex-col gap-4 items-center text-center">
            <img
               src={provider.image || "https://placehold.co/200"}
               alt={provider.name}
               className="md:w-24 h-full md:h-auto aspect-square object-cover rounded-full"
            />
            <div className="text-start md:text-center flex flex-col gap-2 items-start md:items-center w-full">
               <h3 className="text-lg font-bold group-hover:underline">
                  {provider.name}
               </h3>
               <p className="text-sm text-foreground">
                  {provider.bio?.slice(0, 50) + "..." || "Has no bio yet!"}
               </p>
               <div className="flex items-center gap-2">
                  <Star
                     className="w-4 h-4 text-amber"
                     fill={provider.rating >= 1 ? "currentColor" : "none"}
                  />
                  <span className="text-sm text-foreground">
                     {provider.rating}
                  </span>
               </div>
               <button
                  onClick={handleMessageClick}
                  className="mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet text-white font-semibold hover:bg-violet/80 transition-colors"
                  type="button"
               >
                  <MessageCircle className="w-4 h-4" />
                  {lang === "en" ? "Message" : "مراسله"}
               </button>
            </div>
         </div>
      </Link>
   );
};

export default ProviderCard;
