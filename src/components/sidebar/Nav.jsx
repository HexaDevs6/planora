import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bug } from "lucide-react";
import { Link } from "react-router-dom";

export default function Nav({ lang }) {
   return (
      <header className="sticky py-1 bg-background z-20 top-0 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
         <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
               orientation="vertical"
               className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-md font-semibold">{lang === "ar" ? "لوحة التحكم" : "My Dashboard"}</h1>
            <Button
               variant="link"
               asChild
               size="sm"
            >
               <Link
                  to="../contact"
                  target="_blank"
               >
                  <Bug />
                  <span className="hidden md:inline-block">{lang === "ar" ? "الإبلاغ عن مشكلة" : "Report a bug"}</span>
               </Link>
            </Button>

         </div>
      </header>
   );
}
