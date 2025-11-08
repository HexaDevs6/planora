import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Calendar, LayoutDashboard, MessageSquareTextIcon, Plus, Settings } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";

export default function HostLayout() {
    const { lang } = useDirection();
    const sideLinks = [
        {
            icon: <LayoutDashboard size={20} />,
            label: {en: "Overview", ar: "الملخص"},
            path: "/host/overview",
        },
        {
            icon: <Calendar size={20} />,
            label: {en: "Events", ar: "الفعاليات"},
            path: "/host/events",
        },
        {
            icon: <MessageSquareTextIcon size={20} />,
            label: {en: "Messages", ar: "الرسائل"},
            path: "/host/messages",
        },
        {
            icon: <Plus size={20} />,
            label: {en: "New Event", ar: "الفعالية الجديدة"},
            path: "/host/create-event",
        },

        {
            icon: <Settings size={20} />,
            label: {en: "Settings", ar: "الإعدادات"},
            path: "/host/settings",
        },

    ];

    return (
        <div className=' h-screen flex overflow-hidden'>
            {/* Sidebar column (fixed width on md+) */}
            <div className='flex-shrink-0'>
                <Sidebar sideLinks={sideLinks} lang={lang} />
            </div>
            {/* Content area */}
            <main className='flex-1 overflow-y-auto p-2 md:p-6 transition-all duration-300 bg-background '>
                <Outlet />
            </main>
        </div>
    );
}
