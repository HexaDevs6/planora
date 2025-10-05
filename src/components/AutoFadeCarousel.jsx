"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

export default function AutoFadeCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 2500, stopOnInteraction: false })
    );

    const images = [
        "https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    ];

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='relative w-[100%] mx-auto h-full overflow-hidden'>
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-2000 ${
                        index === current ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={src}
                        alt={`slide-${index}`}
                        fill = "cover"
                        className='object-cover h-full w-full'
                    />
                </div>
            ))}
        </div>
    );
}
