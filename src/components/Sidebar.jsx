import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Home,
    LayoutDashboard,
    Calendar,
    Settings,
    LogOut,
    ArrowRight,
    X,
    MessageSquareTextIcon,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function Sidebar({ sideLinks, subtitle }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const toggleSidebar = () => setIsOpen(!isOpen);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/signin");
            dispatch(clearUser());
            toast.success("Signed out successfully!");
        } catch (error) {
            console.error("Error during sign out:", error);
            toast.error("Failed to sign out. Please try again.");
        }
    };

    const userName = user.displayName || user.email.split("@")[0];
    const userRole = user.userRole;
    const userAvatar = user.photoURL || "https://i.pravatar.cc/100";

    const menuItems = sideLinks || [
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
        <div
            className={`${
                isOpen ? "w-52" : "w-16"
            } bg-violet  fixed md:static h-screen p-3 flex flex-col justify-between transition-all duration-300 z-5`}
        >
            {/* Top Section */}
            <div>
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={` text-amber-light mb-6 flex items-center transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    {isOpen ? <X size={24} /> : <ArrowRight size={24} />}
                </button>
                {/* User Info Section */}
                <div className='flex flex-col items-center mb-6 space-y-1'>
                    <img
                        src={userAvatar}
                        alt='User Avatar'
                        className={`rounded-full border-2 border-violet-light transition-all duration-300 ${
                            isOpen ? "w-16 h-16 mb-2" : "w-10 h-10"
                        }`}
                    />

                    {isOpen && (
                        <>
                            <h3 className=' text-sm font-semibold text-amber'>
                                {userName}
                            </h3>
                            <p className='text-xs text-gray-300'>{userRole}</p>
                        </>
                    )}
                </div>

                {/* Menu Items */}
                <ul className='space-y-2 border-t border-gray-700 pt-4 '>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 cursor-pointer p-2 rounded-sm 
                    ${
                        isActive
                            ? "bg-violet-light text-white"
                            : "text-text hover:bg-violet-light"
                    }`
                                }
                            >
                                {item.icon}
                                {isOpen && (
                                    <span className='text-sm font-medium '>
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bottom Section */}
            <div className=' mt-auto border-t border-gray-700 pt-4 space-y-4'>
                <div className={`gap-2 flex ${!isOpen && "flex-col"} `}>
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
                <NavLink
                    to='/'
                    className={({ isActive }) =>
                        `flex items-center gap-3 cursor-pointer p-2 rounded-sm
              ${
                  isActive
                      ? "bg-violet-light "
                      : "text-amber hover:bg-violet-light"
              }`
                    }
                >
                    <Home size={20} />
                    {isOpen && (
                        <span className='text-sm font-medium'>Home</span>
                    )}
                </NavLink>

                <button
                    to='/logout'
                    className='flex items-center gap-3 cursor-pointer p-2 rounded-sm text-amber hover:bg-violet-light w-full'
                    onClick={handleSignOut}
                >
                    <LogOut size={20} />
                    {isOpen && (
                        <span className='text-sm font-medium'>Logout</span>
                    )}
                </button>
            </div>
        </div>
    );
}
