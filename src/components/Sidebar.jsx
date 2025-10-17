import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/user/overview", label: "Overview", icon: "🏠" },
  { to: "/user/settings", label: "Settings", icon: "⚙️" },
  { to: "/user/tickets", label: "Evens & Tickets", icon: "🔐" },
  { to: "/user/messages", label: "Messages", icon: "🔐" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false); // for mobile

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">👤 Profile</span>
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md focus:outline-none focus:ring"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar panel */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } md:block bg-gray-900 text-white md:min-h-screen md:sticky md:top-0`}
      >
        <div className="p-5 md:p-6">
          <h2 className="text-xl font-semibold mb-6">👤 My Profile</h2>

          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)} // close on mobile after click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-700 font-medium"
                      : "hover:bg-gray-800/80"
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.label}</span>
              </NavLink>
            ))}

            <div className="mt-6 border-t border-gray-800 pt-4 text-sm">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800/80">
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
