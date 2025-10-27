import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Calendar, LayoutDashboard, MessageSquareTextIcon, Plus, Settings } from "lucide-react";

export default function HostLayout() {
    const sideLinks = [
        {
            icon: <LayoutDashboard size={20} />,
            label: "Overview",
            path: "/host/overview",
        },
        {
            icon: <Calendar size={20} />,
            label: "Events",
            path: "/host/events",
        },
        {
            icon: <MessageSquareTextIcon size={20} />,
            label: "Messages",
            path: "/host/messages",
        },
        {
            icon: <Plus size={20} />,
            label: "New Event",
            path: "/host/create-event",
        },

        {
            icon: <Settings size={20} />,
            label: "Settings",
            path: "/host/settings",
        },

    ];

    return (
        <div className=' h-screen flex overflow-hidden'>
            {/* Sidebar column (fixed width on md+) */}
            <div className='flex-shrink-0'>
                <Sidebar sideLinks={sideLinks} />
            </div>
            {/* Content area */}
            <main className='flex-1 overflow-y-auto p-2 md:p-6 transition-all duration-300 bg-background '>
                <Outlet />
            </main>
        </div>
    );
}
