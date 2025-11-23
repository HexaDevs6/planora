import NavMain from "./nav-main";
import NavUser from "./nav-user";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import {
   LayoutDashboard,
   Settings,
   Calendar,
   MessageSquareTextIcon,
   BriefcaseBusiness,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useSelector } from "react-redux";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import { useDirection } from "@/hooks/useDirection";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const hostNavMain = [
   {
      icon: LayoutDashboard,
      label: { en: "Overview", ar: "الملخص" },
      url: "/host/overview",
   },
   {
      icon: Calendar,
      label: { en: "Events", ar: "الفعاليات" },
      url: "/host/events",
   },
   {
      icon: MessageSquareTextIcon,
      label: { en: "Messages", ar: "الرسائل" },
      url: "/host/messages",
   },
   {
      icon: Settings,
      label: { en: "Settings", ar: "الإعدادات" },
      url: "/host/settings",
   },
];

const userNavMain = [
   {
      icon: LayoutDashboard,
      label: { en: "Overview", ar: "الملخص" },
      url: "/user/overview",
   },
   {
      icon: Calendar,
      label: { en: "Events & Tickets", ar: "الفعاليات والتذاكر" },
      url: "/user/tickets",
   },
   {
      icon: MessageSquareTextIcon,
      label: { en: "Messages", ar: "الرسائل" },
      url: "/user/messages",
   },
   {
      icon: BriefcaseBusiness,
      label: { en: "Services", ar: "الخدمات" },
      url: "/user/services",
   },
   {
      icon: Settings,
      label: { en: "Settings", ar: "الإعدادات" },
      url: "/user/settings",
   },
];

export default function Aside({ ...props }) {
   const { user } = useSelector((state) => state.auth);
   const { lang } = useDirection();
   const { open, setOpenMobile } = useSidebar();
   const navigate = useNavigate();
   const data = {
      user: {
         name: user?.full_name || user?.email?.split("@")[0],
         email: user?.email,
         avatar: user?.avatar || avatarPlaceholderImg,
      },
      navMain: user.role === "host" ? hostNavMain : userNavMain,
   };
   useEffect(() => {
      setOpenMobile(false);
   }, [navigate]);
   return (
      <Sidebar
         collapsible="icon"
         {...props}
         side={lang === "ar" ? "right" : "left"}
      >
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                     <Link to="/">
                        <img
                           src={open ? "/LogoBasic.png" : "/favPlanora.svg"}
                           alt="logo"
                           className="w-full h-full object-contain dark:hidden"
                        />
                        <img
                           src={
                              open ? "/LogoBasicLight.png" : "/favPlanora.svg"
                           }
                           alt="logo"
                           className="w-full h-full object-contain hidden dark:block"
                        />
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} lang={lang} userRole={user.role} />
            <div className={`flex gap-4 flex-col px-2`}>
               <ThemeToggle />
               <LanguageSwitcher />
            </div>
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
      </Sidebar>
   );
}
