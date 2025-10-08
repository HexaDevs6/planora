"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
    HouseIcon,
    InboxIcon,
    SparklesIcon,
    ZapIcon,
    ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Simple logo component for the navbar
const Logo = () => {
    return (
        <div className='w-45 bg-[linear-gradient(to_top,rgba(169,158,173,0.3)_0%,rgba(51,12,47,0.3)_100%)] px-3 py-4 '>
            <img
                src='../../public/logoBasic.png'
                alt=''
                className='w-full h-full object-cover'
            />
        </div>
    );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }) => (
    <svg
        className={cn("pointer-events-none", className)}
        width={16}
        height={16}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
    >
        <path
            d='M4 12L20 12'
            className='origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
        />
        <path
            d='M4 12H20'
            className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
        />
        <path
            d='M4 12H20'
            className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
        />
    </svg>
);

// User Menu Component
const UserMenu = ({
    userName = "Mustafa Hawash",
    userEmail = "Hawash@example.com",
    userAvatar,
    onItemClick,
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant='ghost'
                className='h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground'
            >
                <Avatar className='h-7 w-7'>
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className='text-xs'>
                        {userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className='h-3 w-3 ml-1' />
                <span className='sr-only'>User menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>
                <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                        {userName}
                    </p>
                    <p className='text-xs leading-none text-muted-foreground'>
                        {userEmail}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onItemClick?.("profile")}>
                Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClick?.("settings")}>
                Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onItemClick?.("billing")}>
                Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onItemClick?.("logout")}>
                Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// Default navigation links with icons
const defaultNavigationLinks = [
    { href: "#", label: "Services", icon: HouseIcon, active: true },
    { href: "#", label: "Contact", icon: InboxIcon },
    { href: "#", label: "Events", icon: ZapIcon },
];

export const Navbar10 = React.forwardRef(
    (
        {
            className,
            logo = <Logo />,
            logoHref = "#",
            navigationLinks = defaultNavigationLinks,
            upgradeText = "Upgrade",
            userName = "John Doe",
            userEmail = "john@example.com",
            userAvatar,
            onNavItemClick,
            onUpgradeClick,
            onUserItemClick,
            ...props
        },
        ref
    ) => {
        const [isMobile, setIsMobile] = useState(false);
        const containerRef = useRef(null);

        useEffect(() => {
            const checkWidth = () => {
                if (containerRef.current) {
                    const width = containerRef.current.offsetWidth;
                    setIsMobile(width < 768); // 768px is md breakpoint
                }
            };

            checkWidth();

            const resizeObserver = new ResizeObserver(checkWidth);
            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }

            return () => {
                resizeObserver.disconnect();
            };
        }, []);

        // Combine refs
        const combinedRef = React.useCallback(
            (node) => {
                containerRef.current = node;
                if (typeof ref === "function") {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            },
            [ref]
        );

        return (
            <header
                ref={combinedRef}
                className={cn(
                    "fixed top-0 z-50 w-full border-b bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4  md:px-6 [&_*]:no-underline",
                    className
                )}
                {...props}
            >
                <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-10'>
                    {/* Left side */}
                    <div className='flex flex-1 justify-end items-center gap-2'>
                        {/* Mobile menu trigger */}
                        {isMobile && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className='group h-8 w-8 hover:bg-accent hover:text-accent-foreground'
                                        variant='ghost'
                                        size='icon'
                                    >
                                        <HamburgerIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align='start'
                                    className='w-64 p-1'
                                >
                                    <NavigationMenu className='max-w-none'>
                                        <NavigationMenuList className='flex-col items-start gap-0'>
                                            {navigationLinks.map(
                                                (link, index) => {
                                                    const Icon = link.icon;
                                                    return (
                                                        <NavigationMenuItem
                                                            key={index}
                                                            className='w-full'
                                                        >
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    if (
                                                                        onNavItemClick &&
                                                                        link.href
                                                                    )
                                                                        onNavItemClick(
                                                                            link.href
                                                                        );
                                                                }}
                                                                className={cn(
                                                                    "flex w-full gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                                                                    link.active &&
                                                                        "bg-accent text-accent-foreground"
                                                                )}
                                                            >
                                                                <Icon
                                                                    size={16}
                                                                    className='text-muted-foreground/80'
                                                                    aria-hidden={
                                                                        true
                                                                    }
                                                                />
                                                                <span>
                                                                    {link.label}
                                                                </span>
                                                            </button>
                                                        </NavigationMenuItem>
                                                    );
                                                }
                                            )}
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                </PopoverContent>
                            </Popover>
                        )}

                        {!isMobile && (
                            <NavigationMenu className='flex'>
                                <NavigationMenuList className='gap-7'>
                                    {navigationLinks.map((link, index) => {
                                        const Icon = link.icon;
                                        return (
                                            <NavigationMenuItem key={index}>
                                                <NavigationMenuLink
                                                    href={link.href}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (
                                                            onNavItemClick &&
                                                            link.href
                                                        )
                                                            onNavItemClick(
                                                                link.href
                                                            );
                                                    }}
                                                    className={cn(
                                                        "text-violet hover:text-primary flex justify-center items-center gap-2 py-1.5 font-medium transition-colors cursor-pointer group  h-10 w-max  rounded-md  px-4 text-md focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                                                        link.active &&
                                                            "text-primary"
                                                    )}
                                                    data-active={link.active}
                                                >
                                                    <Icon
                                                        size={16}
                                                        className='text-muted-foreground/80'
                                                        aria-hidden={true}
                                                    />
                                                    <span>{link.label}</span>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        );
                                    })}
                                </NavigationMenuList>
                            </NavigationMenu>
                        )}
                    </div>

                    {/* Middle side: Logo */}
                    <div className='flex items-center'>
                        <button
                            onClick={(e) => e.preventDefault()}
                            className='text-primary hover:text-primary/90 transition-colors cursor-pointer'
                        >
                            {logo}
                        </button>
                    </div>

                    {/* Right side: Actions */}
                    <div className='flex flex-1 items-center justify-start gap-4'>
                        {/* User menu */}
                        <UserMenu
                            userName={userName}
                            userEmail={userEmail}
                            userAvatar={userAvatar}
                            onItemClick={onUserItemClick}
                        />
                        {/* Upgrade button */}
                        <Button
                            size='sm'
                            className='text-sm'
                            onClick={(e) => {
                                e.preventDefault();
                                if (onUpgradeClick) onUpgradeClick();
                            }}
                        >
                            <SparklesIcon
                                className='opacity-60 mr-1'
                                size={16}
                                aria-hidden={true}
                            />
                            <span className='hidden sm:inline'>
                                {upgradeText}
                            </span>
                            <span className='sm:hidden sr-only'>
                                {upgradeText}
                            </span>
                        </Button>
                    </div>
                </div>
            </header>
        );
    }
);

Navbar10.displayName = "Navbar10";

export { Logo, HamburgerIcon, UserMenu };
