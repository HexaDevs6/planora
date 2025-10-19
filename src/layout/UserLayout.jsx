import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function UserLayout() {
  return (
    <div className=" h-screen flex overflow-hidden">
      {/* Sidebar column (fixed width on md+) */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      {/* Content area */}
      <main className="flex-1 overflow-y-auto ml-16 md:ml-0 p-2 md:p-6 transition-all duration-300 bg-background ">
        <Outlet />
      </main>
    </div>
  );
}
