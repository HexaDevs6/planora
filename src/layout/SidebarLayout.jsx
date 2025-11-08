import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Aside from "@/components/sidebar/Aside";
import Nav from "@/components/sidebar/Nav";
import { Outlet } from "react-router-dom";
import { useDirection } from "@/hooks/useDirection";
const SidebarLayout = () => {
   const { lang } = useDirection();
   return (
      <SidebarProvider>
         <Aside variant="inset" />
         <SidebarInset>
            <Nav lang={lang} />
            <div className="flex flex-1 flex-col">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 p-4 md:gap-6">
                     <Outlet />
                  </div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
};

export default SidebarLayout;
