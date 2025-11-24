import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { getPublicUrl } from "@/lib/storage";
import loremImg from "@/assets/lorem.jfif";
import { supabase } from "@/lib/supabaseClient";
import hostPlaceHolder from "@/assets/user_placeholder1.png";

export default function BoardCard({
    image,
    title,
    location,
    date,
    eventId,
    hostId,
}) {
    const [hostName, setHostName] = useState(null);
    const { lang } = useDirection();
    const handleThumbnail = (el, bucket = "events") => {
        if (!el) return loremImg;
        if (typeof el === "string" && el.startsWith("http")) return el;
        if (typeof el === "string") return getPublicUrl(bucket, el);
        return loremImg;
    };


    return (
        <>
            <div className='bg-background flex flex-col gap-5 justify-between rounded-xl border overflow-hidden group w-80 '>
                <img
                    alt='Music Festival'
                    className='w-full h-48 object-cover'
                    src={handleThumbnail(image)}
                />
                <div className='p-3 space-y-2'>
                    <p className='text-sm font-semibold text-amber-dark flex items-center gap-2'>
                        <Calendar size={16} /> {date.split("T")[0]}
                    </p>
                    <h3 className='text-xl font-bold text-foreground mt-2 truncate'>
                        {title}
                    </h3>
                    <p className='text-gray-500 truncate'>
                        <MapPin size={16} className=" inline mr-2 my-auto "  />
                        {location}
                    </p>
                    <div className='mt-4 flex items-center justify-between'>

                        <Button variant='amber' size='sm'>
                            <Link to={`/events/${eventId}`}>
                                {lang === "en"
                                    ? "View Details"
                                    : "عرض التفاصيل"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
