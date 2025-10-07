import React from "react";
import AutoFadeCarousel from "./AutoFadeCarousel";
import { Button, buttonVariants } from "./ui/button";
import { SplittingText } from "./ui/shadcn-io/splitting-text/index";
import { FlipWords } from "./ui/shadcn-io/flip-words";
import CircularText from "./ui/shadcn-io/circular-text/index";

function HeroSection() {
    return (
        <section className=' relative h-[100vh] overflow-hidden flex items-center justify-start text-white'>
            <AutoFadeCarousel />
            <div className=' h-[inherit] absolute inset-0  bg-[linear-gradient(to_top,var(--color-violet)_0%,var(--color-violet)_15%,#B9B9B9_100%)] opacity-50 '></div>

            <div className=' md:start-20 absolute z-10 max-w-5xl px-4 sm:px-8 text-start flex flex-col gap-12'>
                <img
                    className=' hidden md:block w-100'
                    src='PlanoraYellowTypo.png'
                    alt='LogoPLanora'
                />
                <div className='lg:text-5xl text-3xl font-bold mb-4 leading-tight drop-shadow-2xl text-violet '>
                    WHERE ALL GREAT EVENTS BEGIN,{" "}
                    <FlipWords
                        words={[
                            "Events",
                            "Meetups",
                            "Conference",
                            "Workshops",
                            "Festivals",
                            "Exhibitions",
                            "Weddings",
                        ]}
                        duration={1500}
                        className='text-amber font-semibold drop-shadow-2xl lg:text-6xl'
                    />
                    {""}
                </div>
                <SplittingText
                    className='lg:text-2xl text-lg mb-4 font-semibold drop-shadow-6xl text-secondary leading-relaxed'
                    text={[
                        "Organize, Discover, and Manage your awesome events effortlessly - one smart platform that connects ideas, people, and events.",
                    ]}
                    type='lines'
                    inView
                    motionVariants={{
                        initial: { y: 50, opacity: 0, x: 0 },
                        animate: { y: 0, opacity: 1, x: 0 },
                        transition: { duration: 0.4 },
                    }}
                />

                <div className='flex flex-col sm:flex-row justify-start gap-3 sm:gap-4'>
                    <Button
                        className={buttonVariants({
                            variant: "primary",
                            size: "CTA",
                        })}
                    >
                        Get Started
                    </Button>
                    <Button
                        className={buttonVariants({
                            variant: "glass",
                            size: "CTA",
                        })}
                    >
                        Contact
                    </Button>
                </div>
                <CircularText
                    text=' PLANORA • EVENTS •'
                    onHover='goBonkers'
                    spinDuration={15}
                    className='hidden md:block bottom-0 end-[-30%] bg-secondary/10 backdrop-blur-xs text-secondary border border-secondary/30 hover:bg-violet/40   tracking-widest'
                />
            </div>
        </section>
    );
}

export default HeroSection;
