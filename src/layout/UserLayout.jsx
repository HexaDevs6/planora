import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Calendar, LayoutDashboard, MessageSquareTextIcon, Settings } from "lucide-react";

export default function UserLayout() {
      const  sideLinks = [
        {
            icon: <LayoutDashboard size={20} />,
            label: "Overview",
            path: "/user/overview",
        },
        {
            icon: <Calendar size={20} />,
            label: "Events & Tickets",
            path: "/user/tickets",
        },
        {
            icon: <MessageSquareTextIcon size={20} />,
            label: "Messages",
            path: "/user/messages",
        },
        {
            icon: <Settings size={20} />,
            label: "Settings",
            path: "/user/settings",
        },
    ];

  return (
    <div className=" h-screen flex overflow-hidden">
      {/* Sidebar column (fixed width on md+) */}
      <div className="flex-shrink-0">
        <Sidebar sideLinks={sideLinks} />
      </div>
      {/* Content area */}
      <main className="flex-1 overflow-y-auto ml-16 md:ml-0 p-2 md:p-6 transition-all duration-300 bg-background ">
        <Outlet />
      </main>
    </div>
  );
}
