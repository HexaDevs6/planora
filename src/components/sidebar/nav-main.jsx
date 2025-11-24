"use client";

import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function NavMain({ items, lang = "en", userRole }) {
   const { pathname } = useLocation();
   const addButtonLabel =
      userRole === "host"
         ? lang === "ar"
            ? "حدث جديد"
            : "New Event"
         : lang === "ar"
         ? "إنشاء خدمة"
         : "Create Service";
   return (
      <SidebarGroup>
         <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
               <SidebarMenuItem className="flex items-center gap-2">
                  <SidebarMenuButton
                     asChild
                     tooltip={addButtonLabel}
                     className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                     <Link
                        to={
                           userRole === "host"
                              ? "/host/create-event"
                              : "/user/create-service"
                        }
                     >
                        <CirclePlus />
                        <span>{addButtonLabel}</span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
               {items.map((item, i) => {
                  const isActive = pathname === item.url;
                  return (<SidebarMenuItem key={i}>
                     <SidebarMenuButton tooltip={item.label[lang]} asChild isActive={isActive}>
                        <Link to={item.url}>
                           {item.icon && <item.icon />}
                           <span>{item.label[lang]}</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>)
               }
               )}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
