"use client";

import * as React from "react";

export default function AutoFadeCarousel({
    images = [],
    delay = 3000,
    className = "",
}) {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (images.length === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, delay);

        return () => clearInterval(interval);
    }, [images, delay]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {images.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <img
                        src={src}
                        alt={`slide-${index}`}
                        className='object-cover w-full h-full'
                    />
                </div>
            ))}
        </div>
    );
}
