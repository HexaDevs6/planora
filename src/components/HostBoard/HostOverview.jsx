import React, { useEffect, useState } from "react";
import Stats from "./StatsSection";
import EventCard from "../Cards/EventCard";
import RecentMessages from "./RecentMessagesSec";
import ReviewsSection from "../Reviews";
import { supabase } from "@/lib/supabaseClient";
import { useSelector } from "react-redux";
import { useDirection } from "@/hooks/useDirection";
import { getPublicUrl } from "@/lib/storage";
import {
    useGetBookingsOverTimeQuery,
    useGetEventPerformanceQuery,
    useGetPopularEventsQuery,
    useGetTotalAttendeesQuery,
    useGetTotalEventsQuery,
    useGetTotalRevenueQuery,
    useGetTotalTicketsQuery,
    useGetUpcomingEventsCountQuery,
} from "@/features/hostDashboard/hostDashboard.api";
import AreaChartComponent from "../Charts/AreaChartComponent";
import RadialProgressComponent from "../Charts/RadialProgressComponent";
import BarChartComponent from "../Charts/BarChartComponent";
import GroupedBarChart from "../Charts/GroupedBarChart";

export default function UserOverview() {
    const [events, setEvents] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const { lang } = useDirection();
    const { data } = useSelector((state) => state.categories);

    const hostMessages = [
        {
            name: "Jane Smith",
            message:
                "Hey, just wanted to follow up on the catering for the upcoming conference...",
            time: "2 hours ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnbAc-zfMaWNls3igWd_omvAutzQjCRkZV1tT36pc3fKNSQHyxXFIaSb6HZrw66xnxlunJVL754nbAZmUWvTPPKSxPfM_O6dqaBGQ307jbc24jQQseqbRElKN5R97TRmiwZbky2S-33HPkxElL0itdScaJLR6RFB-JcLv8UkLLR-BMJM-e98dCi0kSs7eeO1iDYD_6qCKOwyx9AG7XGQxamuAQgdIXXH8qPuHYM8pNd3pVVO4cjTTOCkSrXJ5Ol9T_XPPtDd3dgFwv",
        },
        {
            name: "Mike Johnson",
            message:
                "Can you send over the final attendee list for the workshop?",
            time: "5 hours ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk_uf3J5ghz33duXR6BenmRrIwMTOtg1OYFLUiWsEVq8915HCuOjw_4VHMYu2txwG5Ek01iCS4TwxmpEQSBcEz4l4iExSLL2RaElsXw5FlKvJFBDfYsuxs7bBAmuNOqJH7VWFzYTKhir9cqEqUagwWo2l4yMVvmeWcCMTv7IXWBKVFyjBeMn44XW-MFh5tbOPUoIwlInasOzfgKTcyxb2NxArEluWfXTe_LzLuHu3YF54wjtw2q5UjG9AYVAjxbD0s3VVRdgDqsCw2",
        },
        {
            name: "Sarah Chen",
            message:
                "Great job on the event last week! Everyone had a fantastic time.",
            time: "1 day ago",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACkJ9rSPCWZeYfhlkAQJLIRctiwGXNsiZmoi7cx7ZhGzsPKmc-vaSvQHgU-mrxEiSM0yK0rq40IUE2KHzv6LS8x2xK8lHvQA9cEh1VjvcPmBN6g91N9KDosWgV9PBCzN6uVvyP8qPgDBFdpqUvTPPhfeD3fD9Ji3eR4qMwThXUzHR18LT2lBHDlRd0E6rtTDeWtjp80VPuAkdrtt5IdiBNae2om3qacE_gNlMwwPEkaa-o4F5JZ14z7P8xtEqGk8BtdegP4NIiyiFf",
        },
    ];

    const sampleReviews = [
        {
            id: 1,
            title: "Absolutely fantastic!",
            content:
                "The tech conference was incredibly well-organized. The speakers were top-notch and the networking opportunities were priceless.",
            rating: 5,
            author: "Sarah Johnson",
            date: "Oct 15, 2025",
        },
        {
            id: 2,
            title: "Great content, minor issues.",
            content:
                "Enjoyed the workshop content. However, the venue was a bit crowded and the lunch options could have been better.",
            rating: 4,
            author: "Ahmed N.",
        },
        {
            id: 3,
            title: "Loved it!",
            content: "Perfect event! Looking forward to next year!",
            rating: 5,
            author: "Lina M.",
        },
    ];

    useEffect(() => {
        if (!user?.id) return;

        const fetchUserEvents = async () => {
            const { data: fetched, error } = await supabase
                .from("events")
                .select("*")
                .eq("host_id", user.id);
            if (error) {
                console.error(error);
                return;
            } else {
                setEvents(fetched || []);
            }
        };
        fetchUserEvents();
    }, [user?.id]);

    const handleThumbnail = function (el) {
        if (el) {
            if (typeof el === "string" && el.startsWith("http")) {
                return el;
            } else {
                return getPublicUrl("events", el);
            }
        }
        return undefined;
    };

    const interestOptions = (data || [])
        .filter((category) => category.type === "event")
        .map((category) => ({
            ...category,
            displayName: lang === "ar" ? category.name_ar : category.name,
        }));

    const { data: totalEvents } = useGetTotalEventsQuery({
        hostId: user?.id,
    });

    const { data: totalTickets } = useGetTotalTicketsQuery({
        hostId: user?.id,
    });

    const { data: totalAttendees } = useGetTotalAttendeesQuery({
        hostId: user?.id,
    });

    const { data: totalRevenue } = useGetTotalRevenueQuery({
        hostId: user?.id,
    });

    const { data: totalUpcomingEvents } = useGetUpcomingEventsCountQuery({
        hostId: user?.id,
    });

    const { data: bookingsOverTime } = useGetBookingsOverTimeQuery({
        hostId: user?.id,
    });

    const { data: popularEvents } = useGetPopularEventsQuery({
        hostId: user?.id,
    });

    const{data:eventPerfomance} = useGetEventPerformanceQuery({
        hostId: user?.id,
    })

    const hostStats = [
        {
            label: "Total Events",
            label_ar: "الأحداث",
            value: totalEvents,
            change: "+5%",
            trend: "up",
        },
        {
            label: "Total Tickets Sold",
            label_ar: "التذاكر المباعة",
            value: totalTickets,
            change: "+12%",
            trend: "up",
        },
        { label: "Revenue", label_ar: "إجمالي العوائد", value: totalRevenue, change: "+8%", trend: "up" },
        {
            label: "Total Attendees",
            label_ar: "إجمالي الحضور",
            value: totalAttendees,
            change: "+3%",
            trend: "up",
        },
        {
            label: "Upcoming Events",
            label_ar: "الأحداث القادمة",
            value: totalUpcomingEvents,
            change: "-2%",
            trend: "down",
        },
    ];

    return (
        <div className='container'>
            <div className='overview flex flex-col gap-2 transition-all duration-300 ease-in-out '>
                <div className='host-stats'>
                    <div className=' host-stats__header flex justify-between'>
                        <h2 className='text-2xl font-bold text-primary mb-2 '>
                            {lang === "en" ? "Overview" : "النظرة عامة"}
                        </h2>
                    </div>
                    <div className='host-stats__content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {hostStats.map((item, i) => (
                          <RadialProgressComponent
                            key={i}
                            title={lang === "en" ? item.label : item.label_ar}
                            value={item.value}
                        />
                        ))}
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-primary mb-2 '>
                    {lang === "en" ? "Insights" : "الإحصائيات"}
                </h2>
                <div className='highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='col-span-2 space-y-4'>
                        <AreaChartComponent
                            title={lang === "en" ? "Bookings Over Time" : "الحجوزات على الوقت"}
                            data={bookingsOverTime}
                            xKey='day'
                            yKey='bookings'
                        />
                        <BarChartComponent
                            title={lang === "en" ? "Popular Events" : "الفعاليات الشائعة"}
                            data={popularEvents}
                            xKey='event_name'
                            yKey='total_tickets'
                        />
                        <GroupedBarChart
                            title={lang === "en" ? "Event Performance" : "تحليل الفعاليات "}
                            data={eventPerfomance}
                            xKey="event_name"
                            keys={["total_tickets", "attendees", "revenue"]}
                        />
                            
                        {/* <RecentMessages messages={hostMessages} /> */}
                        {/* <ReviewsSection reviews={sampleReviews} /> */}
                    </div>
                    <div className='host__next-event space-y-2'>
                        <div>
                            {events.length > 0 ? (
                                <EventCard
                                    id={events[0]?.id}
                                    title={
                                        lang === "en"
                                            ? events[0]?.name
                                            : events[0]?.name_ar
                                    }
                                    image={handleThumbnail(
                                        events[0]?.thumbnail
                                    )}
                                    date={events[0]?.date.split("T")[0]}
                                    location={events[0]?.location}
                                    category={
                                        interestOptions.find(
                                            (item) =>
                                                item.id ===
                                                events[0]?.category_id
                                        )?.displayName
                                    }
                                    price={
                                        events[0]?.price === 0
                                            ? lang === "en"
                                                ? "Free"
                                                : "مجانا"
                                            : events[0]?.price
                                    }
                                    attendees={events[0]?.capacity}
                                />
                            ) : (
                                <div className='p-4 text-muted-foreground'>
                                    No upcoming event
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
