import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:flex">
        {/* Sidebar column (fixed width on md+) */}
        <div className="md:flex-shrink-0">
          <Sidebar />
        </div>
        {/* Content area */}
        <main className="flex-1 p-6 md:pl-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
