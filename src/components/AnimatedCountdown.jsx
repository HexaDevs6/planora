"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedCountdown({ targetDate }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft)
        return (
            <div className='text-green-500 font-semibold text-2xl bg-gradient-to-r from-violet-700 to-violet-500'>
                Event Started 🎉
            </div>
        );

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    return (
        <div className='flex justify-center items-center gap-4 flex-wrap'>
            {timeUnits.map(({ label, value }) => (
                <div
                    key={label}
                    className='flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-sm shadow-md px-6 py-4 min-w-[90px]'
                >
                    <div className='relative h-12 w-full text-center overflow-hidden'>
                        <AnimatePresence mode='popLayout'>
                            <motion.span
                                key={value}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className='absolute inset-0 text-4xl font-bold text-amber'
                            >
                                {value}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <span className='text-2xl font-semibold text-violet dark:text-foreground mt-1'>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}
