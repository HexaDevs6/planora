import React from "react";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <>
            <nav className='navbar navbar-expand-lg  fixed top-0 z-50 w-full drop-shadow-lg  backdrop-blur supports-[backdrop-filter]:bg-background/25 [&_*]:no-underline'>
                <div className='container flex justify-evenly lg:justify-center lg:gap-14 items-center dark:text-foreground '>
                    {/* Menu icon for mobile */}
                    <button
                        onClick={toggleMenu}
                        className='md:hidden text-violet dark:text-foreground cursor-pointer rounded-sm transition-all ease-in-out duration-300'
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>{" "}
                    <ul className='navbar-links__left  text-violet dark:text-foreground justify-center lg:gap-8 text-md lg:text-lg font-medium hidden md:flex '>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <a>Home</a>
                        </li>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <a>About us</a>
                        </li>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <a>Events</a>
                        </li>
                    </ul>
                    <div className='navbar-logo w-55 bg-[linear-gradient(to_right,rgba(169,158,173,0.4)_0%,rgba(51,12,47,0.4)_100%)] px-9 py-5 supports-[backdrop-filter]:bg-background/25 [clip-path:polygon(0_1%,100%_0,85%_100%,16%_99%)]'>
                        <img
                            src='../../public/logoBasic.png'
                            alt='Planora'
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <ul className='navbar-links__right  text-violet dark:text-foreground justify-center lg:gap-8 text-md lg:text-lg font-medium hidden md:flex  '>
                        <li className='navbar-link__right px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <a>Services</a>
                        </li>
                        <li className='navbar-link__right px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <a>Contact</a>
                        </li>
                    </ul>
                    <div className='navbar-link__right px-3 py-2 rounded-sm  text-violet dark:text-foreground hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                        <a className='flex gap-2 items-center'>
                            <Search />
                        </a>

                    </div>
                                            <ThemeToggle />

                </div>
                {/* Mobile dropdown menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className='md:hidden backdrop-blur-sm text-center py-4 space-y-3 text-lg font-medium text-violet dark:text-foreground animate-slideDown'>
                            <a
                                href='#'
                                className='block py-2 hover:bg-violet/10'
                            >
                                Home
                            </a>
                            <a
                                href='#'
                                className='block py-2 hover:bg-violet/10'
                            >
                                About us
                            </a>
                            <a
                                href='#'
                                className='block py-2 hover:bg-violet/10'
                            >
                                Events
                            </a>
                            <a
                                href='#'
                                className='block py-2 hover:bg-violet/10'
                            >
                                Services
                            </a>
                            <a
                                href='#'
                                className='block py-2 hover:bg-violet/10'
                            >
                                Contact
                            </a>
                        </div>
                    </motion.div>
                )}
            </nav>
        </>
    );
}

export default NavBar;
