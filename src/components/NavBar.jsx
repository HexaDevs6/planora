import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User2Icon } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import avatarPlaceholderImg from "@/assets/user_placeholder3.png";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { handleSignOut } from "@/components/auth/handleSignOut";
import { useDirection } from "@/hooks/useDirection";

export default function NavBar() {
   const [open, setOpen] = useState(false);
   const { lang, direction } = useDirection();
   const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
   const { pathname } = useLocation();
   const { user } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const navigate = useNavigate();

   const navLinksLeft = [
      { to: "/", label: t("nav.home") },
      { to: "/about", label: t("nav.about") },
      { to: "/events", label: t("nav.events") },
   ];

   const navLinksRight = [
      { to: "/services", label: t("nav.services") },
      { to: "/contact", label: t("nav.contact") },
   ];

   const linkClass = (to) =>
      `px-3 py-2 rounded-sm transition-all duration-300 cursor-pointer ${
         pathname === to ? "text-primary font-semibold" : "hover:bg-primary/10"
      }`;

   return (
      <nav className="fixed top-0 z-1001 w-full bg-background/60 backdrop-blur-md shadow-md">
         <div className="container grid grid-cols-2 lg:grid-cols-3 items-center py-2 lg:py-0">
            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
               <button
                  onClick={toggleMenu}
                  className="p-2 rounded-sm hover:bg-primary/10 transition"
                  aria-label="Toggle Menu"
               >
                  {open ? (
                     <X size={26} className="text-primary" />
                  ) : (
                     <Menu size={26} className="text-primary" />
                  )}
               </button>
               <Link
                  to="/"
                  className="navbar-logo w-55"
               >
                  <img
                     src="/LogoBasic.png"
                     alt="Planora"
                     className="w-full h-full object-cover dark:hidden"
                  />
                  <img
                     src="/LogoBasicLight.png"
                     alt="Planora"
                     className="w-full h-full object-cover hidden dark:block"
                  />
               </Link>
            </div>

            {/* Left Links */}
            <ul className="hidden lg:flex gap-6 text-foreground font-medium">
               {navLinksLeft.map((link) => (
                  <li key={link.to}>
                     <Link to={link.to} className={linkClass(link.to)}>
                        {link.label}
                     </Link>
                  </li>
               ))}
            </ul>

            {/* Logo */}
            <div className="hidden lg:flex justify-center items-center">
               <Link
                  to="/"
                  className="navbar-logo w-55 md:bg-[linear-gradient(to_right,rgba(169,158,173,0.4)_0%,rgba(51,12,47,0.4)_100%)] px-3 md:px-8 py-5 md:supports-[backdrop-filter]:bg-background/25 md:[clip-path:polygon(0_1%,100%_0,85%_100%,16%_99%)]"
               >
                  <img
                     src="/LogoBasic.png"
                     alt="Planora"
                     className="w-full h-full object-cover dark:hidden"
                  />
                  <img
                     src="/LogoBasicLight.png"
                     alt="Planora"
                     className="w-full h-full object-cover hidden dark:block"
                  />
               </Link>
            </div>

            {/* Right Links */}
            <div className="flex justify-end lg:justify-between gap-4">
               <ul className="hidden lg:flex gap-6 text-foreground font-medium">
                  {navLinksRight.map((link) => (
                     <li key={link.to}>
                        <Link to={link.to} className={linkClass(link.to)}>
                           {link.label}
                        </Link>
                     </li>
                  ))}
               </ul>

               {/* User + Theme + Language */}
               <div className="flex items-center gap-3">
                  {!user ? (
                     <Link to="/signin">
                        <Button
                           size="sm"
                           variant="glass"
                           className="text-primary"
                        >
                           <User2Icon />
                        </Button>
                     </Link>
                  ) : (
                     <DropdownMenu dir={direction}>
                        <DropdownMenuTrigger asChild>
                           <Avatar className="cursor-pointer">
                              <AvatarImage
                                 src={user.avatar || avatarPlaceholderImg}
                                 alt={user.full_name || "User"}
                                 className="object-cover"
                              />
                              <AvatarFallback>
                                 {user.full_name?.charAt(0).toUpperCase() ||
                                    "U"}
                              </AvatarFallback>
                           </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <Link
                                 to={
                                    user.role === "host"
                                       ? "/host/overview"
                                       : user.role === "admin"
                                       ? "/admin/overview"
                                       : "/user/overview"
                                 }
                              >
                                 {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                              </Link>
                           </DropdownMenuItem>

                           <DropdownMenuItem asChild>
                              <Link
                                 to={
                                    user.role === "host"
                                       ? "/host/settings"
                                       : "/user/settings"
                                 }
                              >
                                 {lang === "ar" ? "الإعدادات" : "Settings"}
                              </Link>
                           </DropdownMenuItem>

                           <DropdownMenuItem
                              className="text-red-600 hover:bg-red-600/10"
                              onSelect={() =>
                                 handleSignOut(dispatch, navigate, t)
                              }
                           >
                              {t("common.buttons.logout")}
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}

                  <ThemeToggle />
                  <LanguageSwitcher />
               </div>
            </div>
         </div>

         {/* MOBILE MENU */}
         {open && (
            <motion.div
               initial={{ opacity: 0, y: -15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -15 }}
               transition={{ duration: 0.35 }}
               className="lg:hidden bg-background/60 backdrop-blur-md"
            >
               <div className="flex flex-col text-center py-4 text-lg font-medium text-foreground space-y-3">
                  {[...navLinksLeft, ...navLinksRight].map((link) => (
                     <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`py-2 ${linkClass(link.to)}`}
                     >
                        {link.label}
                     </Link>
                  ))}
               </div>
            </motion.div>
         )}
      </nav>
   );
}
