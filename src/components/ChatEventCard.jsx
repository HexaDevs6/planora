import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const ChatEventCard = ({ event, lang }) => {
   if (!event) return null;

   const eventName = lang === "ar" ? event.name_ar : event.name;

   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.2, delay: 0.1 }}
         className="mt-3"
      >
         <Link to={`/events/${event.id}`} className="block">
            {/* <div className="group relative ">           */}
            <div className="rounded-md text-foreground gradient-card px-4 py-2 cursor-pointer flex items-center justify-between gap-3">
               <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-violet transition-colors">
                  {eventName}
               </h4>

               <ArrowUpRight className="w-4 h-4" />
            </div>
            {/* </div> */}
         </Link>
      </motion.div>
   );
};

export default ChatEventCard;
