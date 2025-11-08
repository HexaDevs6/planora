import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import {
    BriefcaseBusiness,
    Calendar,
    LayoutDashboard,
    MessageSquareTextIcon,
    Settings,
} from "lucide-react";
import { useDirection } from "@/hooks/useDirection";

export default function UserLayout() {
    const { lang } = useDirection();
    const sideLinks = [
        {
            icon: <LayoutDashboard size={20} />,
            label: {en: "Overview", ar: "الملخص"},
            path: "/user/overview",
        },
        {
            icon: <Calendar size={20} />,
            label: {en: "Events & Tickets", ar: "الفعاليات والتذاكر"},
            path: "/user/tickets",
        },
        {
            icon: <MessageSquareTextIcon size={20} />,
            label: {en: "Messages", ar: "الرسائل"},
            path: "/user/messages",
        },
        {
            icon: <BriefcaseBusiness size={20} />,
            label: {en: "Services", ar: "الخدمات"},
            path: "/user/services",
        },
        {
            icon: <Settings size={20} />,
            label: {en: "Settings", ar: "الإعدادات"},
            path: "/user/settings",
        },
    ];

    return (
        <div className=' h-screen flex overflow-hidden'>
            {/* Sidebar column (fixed width on md+) */}
            <div className='flex-shrink-0'>
                <Sidebar sideLinks={sideLinks} lang={lang} />
            </div>
            {/* Content area */}
            <main
                className="flex-1 overflow-y-auto p-2 md:p-6 transition-all duration-300 bg-background "
            >
                <Outlet />
            </main>
        </div>
    );
}
