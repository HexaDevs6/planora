import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Facebook, Instagram } from "lucide-react";

const HostInfo = ({ lang = "en", hostId }) => {
   const [host, setHost] = useState(null);
   const getSubtitle = () => {
      if (!host.bio) {
         return host.email;
      } else if (host.bio.length > 50) {
         return host.bio.slice(0, 50) + "...";
      } else {
         return host.bio;
      }
   };
   useEffect(() => {
      const fetchHost = async () => {
         const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", hostId)
            .single();
         console.log(data);
         if (error) {
            console.error(error);
         }
         setHost(data);
      };
      fetchHost();
   }, [hostId]);
   return (
      <section>
         <div className="mb-6 text-muted-foreground">
            {lang === "en" ? "Host Info" : "معلومات المنظم"}
         </div>
         {host && (
            <div className="flex items-center gap-4">
               <Avatar className="size-18">
                  <AvatarImage src={host.avatar} className={"object-cover object-center"} />
                  <AvatarFallback>{host.full_name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div>
                  <h4 className="text-lg font-bold">{host.full_name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                        {getSubtitle()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                     {host.facebook_url && (
                        <a 
                        href={host.facebook_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="rounded-full p-2 aspect-square bg-foreground/30"
                        title="Facebook"
                        >
                           <Facebook className="w-4 h-4" />
                        </a>
                     )}
                     {host.instagram_url && (
                        <a 
                        href={host.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="rounded-full p-2 aspect-square bg-foreground/30"
                        title="Instagram"
                        >
                           <Instagram className="w-4 h-4" />
                        </a>
                     )}
                  </div>
               </div>
            </div>
         )}
      </section>
   );
};

export default HostInfo;
