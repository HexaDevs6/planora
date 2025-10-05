import React from "react";
import AutoFadeCarousel from "./AutoFadeCarousel";
import { Button, buttonVariants } from "./ui/button";

function HeroSection() {
    return (
        <section className=' relative h-[50vh] md:h-[70vh] lg:h-[90vh] overflow-hidden flex items-center justify-center text-white'>
            {/* الخلفية المتغيرة */}
            <AutoFadeCarousel />
            <div className=' h-[inherit] absolute inset-0 bg-gradient-to-br from-purple-700/20  to-yellow-500/50 mix-blend-darken'></div>

            <div className=' absolute z-10 max-w-5xl px-4 sm:px-8 text-center'>
                <p className='lg:text-2xl text-lg mb-6 text-gray-100'></p>
                <h1 className='lg:text-8xl text-5xl font-extrabold mb-4 leading-tight text-[var(--color-amber)]'>
                    WHERE ALL GREAT EVENTS BEGIN
                </h1>
                <p className='lg:text-3xl text-lg mb-6 text-gray-100'>
                    Planora helps you organize, design, and manage every type of
                    event - from weddings to conferences - all in one simple
                    platform.
                </p>

                <div className='flex flex-col sm:flex-row justify-center gap-3 sm:gap-4'>
                    <Button
                        size='lg'
                        className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                    >
                        Get Started
                    </Button>
                    <Button
                        size='lg'
                        variant='outline'
                        className='text-white border-white hover:bg-white/10'
                    >
                        {" "}
                        Learn More{" "}
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
