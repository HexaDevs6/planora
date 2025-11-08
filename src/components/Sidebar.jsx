import React, { useState, useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    X,
    LogOut,
    Home,
    UserCircle2Icon,
    User2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { handleSignOut } from "@/components/auth/handleSignOut";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";

export default function Sidebar({ sideLinks, lang }) {
    // 🔹 Sidebar state (open/close)
    const [isOpen, setIsOpen] = useState(false);

    // 🔹 Redux + router hooks
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // 🔹 Toggle sidebar open/close
    const toggleSidebar = () => setIsOpen(!isOpen);

    // 🔹 Extract user data
    const userName = user?.full_name || user?.email?.split("@")[0];
    //capitalize role
    const userRole = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

    const userAvatar = user?.avatar || avatarPlaceholderImg  ;

    // 🔹 Memoized data to avoid unnecessary re-renders
    const links = useMemo(() => sideLinks.map((item) => ({
        ...item,
        label: lang === "ar" ? item.label.ar : item.label.en,
    })), [sideLinks, lang]);

    // 🔹 Handle logout safely
    const handleLogout = useCallback(() => {
        handleSignOut(dispatch, navigate, t);
    }, [dispatch, navigate, t]);

    return (
        <>
            {/* 🟣 Overlay for small screens when sidebar is open */}
            {/* <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className='fixed inset-0 bg-black/40 z-10 md:hidden'
                        onClick={toggleSidebar}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence> */}

            {/* 🟣 Sidebar container with width animation */}
            <motion.aside
                animate={{ width: isOpen ? 208 : 64 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className='bg-violet h-screen p-3 flex flex-col justify-between shadow-md z-20'
            >
                {/* 🔹 Top section: toggle button, user info, and navigation links */}
                <div>
                    {/* Toggle button */}
                    <button
                        onClick={toggleSidebar}
                        aria-label='Toggle sidebar'
                        aria-expanded={isOpen}
                        className={`text-amber-light mb-6 flex items-center transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    >
                        {isOpen ? <X size={24} /> : <ArrowRight size={24} />}
                    </button>

                    {/* User information */}
                    <div className='flex flex-col items-center mb-6 space-y-1'>
                        <motion.img
                            src={userAvatar}
                            onError={(e) => {
                                e.target.src = avatarPlaceholderImg;
                            }}
                            alt='User Avatar'
                            className={`rounded-full border-2 border-violet-light transition-all duration-300 ${
                                isOpen ? "w-16 h-16 mb-2" : "w-10 h-10"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />

                        {/* Animate username & role */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    key='userinfo'
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className='text-center'
                                >
                                    <h3 className='text-sm font-semibold text-amber'>
                                        {userName}
                                    </h3>
                                    <p className='text-xs text-gray-200'>
                                        {userRole}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation links */}
                    <ul className='space-y-2 border-t border-gray-700 pt-4'>
                        {links.map((item, index) => (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 cursor-pointer p-2 rounded-sm transition-colors duration-200
                    ${
                        isActive
                            ? "bg-violet-light text-white"
                            : "text-text hover:bg-violet-light"
                    }`
                                    }
                                >
                                    {/* Animate each icon with subtle entrance */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.05,
                                        }}
                                    >
                                        {item.icon}
                                    </motion.div>

                                    {/* Animate label only when sidebar is open */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.span
                                                key={item.label}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.25 }}
                                                className='text-sm font-medium'
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 🔹 Bottom section: language, theme, home, logout */}
                <div className='mt-auto border-t border-gray-700 pt-4 space-y-4'>
                    {/* Language and theme buttons */}
                    <div className={`gap-2 flex ${!isOpen && "flex-col"}`}>
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    {/* Home link */}
                    <NavLink
                        to='/'
                        className={({ isActive }) =>
                            `flex items-center gap-3 cursor-pointer p-2 rounded-sm transition-colors duration-200
              ${
                  isActive
                      ? "bg-violet-light text-white"
                      : "text-amber hover:bg-violet-light"
              }`
                        }
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Home size={20} />
                        </motion.div>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    key='home'
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className='text-sm font-medium'
                                >
                                    {t("Home")}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className='flex items-center gap-3 cursor-pointer p-2 rounded-sm text-amber hover:bg-violet-light w-full transition-colors duration-200'
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <LogOut size={20} />
                        </motion.div>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    key='logout'
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className='text-sm font-medium'
                                >
                                    {t("Logout")}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
