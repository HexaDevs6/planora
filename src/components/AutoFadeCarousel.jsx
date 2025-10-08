"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

export default function AutoFadeCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 8000, stopOnInteraction: false })
    );

    const images = [
        "https://images.pexels.com/photos/57980/pexels-photo-57980.jpeg",
        "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg",
        "https://images.pexels.com/photos/15777271/pexels-photo-15777271.jpeg",
    ];

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='relative w-[100%] mx-auto h-full overflow-hidden'>
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-2500 ${
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
