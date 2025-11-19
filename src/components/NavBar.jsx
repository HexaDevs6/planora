import React from "react";
import { Search, Menu, X, User2Icon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { handleSignOut } from "@/components/auth/handleSignOut";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);
    return (
        <>
            <nav className='navbar navbar-expand-lg  fixed top-0 z-50 w-full drop-shadow-lg  backdrop-blur supports-[backdrop-filter]:bg-background/25 [&_*]:no-underline'>
                <div className='flex justify-evenly items-center text-foreground '>
                    {/* Menu icon for mobile */}
                    <button
                        onClick={toggleMenu}
                        className='md:hidden cursor-pointer rounded-sm p-2 transition-all ease-in-out duration-300'
                    >
                        {isOpen ? <X size={28} color="#FFA704" /> : <Menu size={28} color="#FFA704" />}
                    </button>
                    <Button
                        variant='glass'
                        className='hidden md:flex gap-2 items-center text-foreground'
                    >
                        <Search />
                    </Button>

                    <ul className='navbar-links__left text-violet dark:text-foreground  justify-center lg:gap-8 text-md lg:text-lg font-medium hidden md:flex '>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <Link to='/'>{t("nav.home")}</Link>
                        </li>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <Link to='/about'>{t("nav.about")}</Link>
                        </li>
                        <li className='navbar-link__left px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <Link to='/events'>{t("nav.events")}</Link>
                        </li>
                    </ul>
                    <Link
                        to='/'
                        className='navbar-logo w-55 md:bg-[linear-gradient(to_right,rgba(169,158,173,0.4)_0%,rgba(51,12,47,0.4)_100%)] px-3 md:px-8 py-5 md:supports-[backdrop-filter]:bg-background/25 md:[clip-path:polygon(0_1%,100%_0,85%_100%,16%_99%)]'
                    >
                        <img
                            src='/LogoBasic.png'
                            alt='Planora'
                            className='w-full h-full object-cover dark:hidden'
                        />
                        <img
                            src='/LogoBasicLight.png'
                            alt='Planora'
                            className='w-full h-full object-cover hidden dark:block'
                        />
                    </Link>
                    <ul className='navbar-links__right  text-violet dark:text-foreground justify-center lg:gap-8 text-md lg:text-lg font-medium hidden md:flex  '>
                        <li className='navbar-link__right px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <Link to='/services'>{t("nav.services")}</Link>
                        </li>
                        <li className='navbar-link__right px-3 py-2 rounded-sm hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                            <Link to='/contact'>{t("nav.contact")}</Link>
                        </li>
                    </ul>
                    <div className='navbar-link__right px-3 py-2 rounded-sm  text-violet dark:text-foreground hover:bg-violet/10 transition-all ease-in-out duration-300 cursor-pointer'>
                        <div className='nav__toggles flex gap-2'>
                            {!user ? (
                                // المستخدم مش داخل 👇
                                <Link to='/signin'>
                                <Button
                                    variant='glass'
                                    size='sm'
                                    className='text-foreground'
                                >
                                        <User2Icon />
                                </Button>
                                    </Link>
                            ) : (
                                // المستخدم داخل ✅
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className='cursor-pointer'>
                                            <AvatarImage
                                                src={
                                                    user.avatar ||
                                                    avatarPlaceholderImg
                                                }
                                                alt={user.full_name || ""}
                                                className='object-cover'
                                            />
                                            <AvatarFallback>
                                                {user.avatar
                                                    ? user.full_name.toUpperCase()
                                                    : user.email
                                                    ? user.email[0].toUpperCase()
                                                    : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-fit">
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          user.role === "host"
                            ? `/host/overview`
                            : `/user/overview`
                        }
                      >
                        {user?.full_name.split(" ")[0]}'s Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={
                          user.role === "host"
                            ? `/host/settings`
                            : `/user/settings`
                        }>Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleSignOut(dispatch, navigate, t)}
                      className="text-amper focus:text-amper/80 hover:bg-red-600/10"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="md:hidden backdrop-blur-sm text-center py-4 space-y-3 text-lg font-medium text-violet dark:text-foreground animate-slideDown">
              <a href="#" className="block py-2 hover:bg-violet/10">
                {t("nav.home")}
              </a>
              <a href="#" className="block py-2 hover:bg-violet/10">
                {t("nav.about")}
              </a>
              <a href="#" className="block py-2 hover:bg-violet/10">
                {t("nav.events")}
              </a>
              <a href="#" className="block py-2 hover:bg-violet/10">
                {t("nav.services")}
              </a>
              <a href="#" className="block py-2 hover:bg-violet/10">
                {t("nav.contact")}
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}

export default NavBar;
