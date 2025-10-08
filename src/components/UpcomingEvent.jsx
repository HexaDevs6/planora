import React from "react";
import AutoFadeCarousel from "./AutoFadeCarousel";
import AnimatedCountdown from "./AnimatedCountdown";

function UpcomingEvent() {
    let upcomingEventImgs = [
        "https://cdn.wamda.com/feature-images/8314b8e51d761e3.jpeg",
        "https://www.startupreporter.eu/wp-content/uploads/2021/09/Techne-Summit-2021-in-Mediterranean.jpg",
        "https://fortecloud.com/wp-content/uploads/elementor/thumbs/untitled-373-pwhjdcj7b0kykegw91e1sn5z0a3xon4gf0z8tqz1bk.jpg",
        "https://www.bi-technologies.net/wp-content/uploads/2024/01/WhatsApp-Image-2023-12-26-at-11.11.12-AM-2.jpeg",
    ];

    const eventDate = "2025-11-31T08:00:00";

    return (
        <>
            <div className='upcoming-event container py-16 flex items-center flex-col gap-16'>
                <div className='upcoming-event__head flex flex-col lg:flex-row justify-between gap-5 w-full'>
                    <h3 className='px-4 cta-section-title text-4xl font-bold text-violet dark:text-foreground drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] lg:w-[38%] leading-normal'>
                        Biggest Upcoming event Starts In
                    </h3>
                    <AnimatedCountdown targetDate={eventDate} />
                </div>
                <div className='upcoming-event__preview container w-full h-[75vh] relative'>
                    <AutoFadeCarousel images={upcomingEventImgs} delay={3000} />
                </div>
            </div>
        </>
    );
}

export default UpcomingEvent;
