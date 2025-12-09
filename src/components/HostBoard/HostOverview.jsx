import React, { useEffect, useState } from "react";
// import Stats from "./StatsSection";
import EventCard from "../Cards/EventCard";
// import RecentMessages from "./RecentMessagesSec";
// import ReviewsSection from "../Reviews";
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
import loremImg from "@/assets/lorem.jfif";
import { 
    Calendar, 
    TrendingUp, 
    Users, 
    BarChart3, 
    Sparkles 
} from "lucide-react";

// Empty State Placeholder Component with gradient and animations
const EmptyStatePlaceholder = ({ icon: Icon, title, subtitle }) => (
    <div className="relative bg-background flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border min-h-[300px] overflow-hidden">        
        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-5">
                <Icon className="w-14 h-14 text-muted-foreground drop-shadow-lg shadow-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                {subtitle}
            </p>
        </div>
    </div>
);

export default function UserOverview() {
    const [events, setEvents] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const { lang } = useDirection();
    const { data } = useSelector((state) => state.categories);;

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

    const handleThumbnail = (el) => {
        if (!el) return loremImg;
        if (typeof el === "string" && el.startsWith("http")) return el;
        if (typeof el === "string") return getPublicUrl("events", el);
        return loremImg;
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

    const { data: eventPerfomance } = useGetEventPerformanceQuery({
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
        // <div className='container'>
            <div className='container flex flex-col gap-4 transition-all duration-300 ease-in-out '>
                <div className='host-stats'>
                    <div className=' host-stats__header flex justify-between'>
                        <h2 className='text-2xl font-bold text-primary mb-2 '>
                            {lang === "en" ? "Overview" : "النظرة عامة"}
                        </h2>
                    </div>
                    <div className='host-stats__content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {hostStats.some(stat => stat.value !== undefined && stat.value !== null) ? (
                            hostStats.map((item, i) => (
                                <RadialProgressComponent
                                    key={i}
                                    title={lang === "en" ? item.label : item.label_ar}
                                    value={item.value}
                                />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <EmptyStatePlaceholder
                                    icon={Users}
                                    title={lang === "en" ? "No Statistics Available" : "لا توجد إحصائيات متاحة"}
                                    subtitle={lang === "en" 
                                        ? "Your event statistics will appear here once you create events and start getting bookings" 
                                        : "ستظهر إحصاءات الحدث هنا بمجرد إنشاء الأحداث وبدء الحجوزات"}
                                    gradient="bg-gradient-to-br from-violet-500 to-purple-500"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="">
                    <h2 className='text-2xl font-bold text-primary mb-2 '>
                        {lang === "en" ? "Insights" : "الإحصائيات"}
                    </h2>
                    <div className='highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='col-span-2 space-y-4'>
                            {bookingsOverTime && bookingsOverTime.length > 0 ? (
                                <AreaChartComponent
                                    title={lang === "en" ? "Bookings Over Time" : "الحجوزات على الوقت"}
                                    data={bookingsOverTime}
                                    xKey='day'
                                    yKey='bookings'
                                />
                            ) : (
                                <div>
                                    <EmptyStatePlaceholder
                                        icon={TrendingUp}
                                        title={lang === "en" ? "No Booking Data Yet" : "لا توجد بيانات حجز بعد"}
                                        subtitle={lang === "en" 
                                            ? "Start creating events to see your booking trends over time" 
                                            : "ابدأ في إنشاء الأحداث لمشاهدة اتجاهات الحجز بمرور الوقت"}
                                        gradient="bg-gradient-to-br from-blue-500 to-purple-500"
                                    />
                                </div>
                            )}
                            
                            {popularEvents && popularEvents.length > 0 ? (
                                <BarChartComponent
                                    title={lang === "en" ? "Popular Events" : "الفعاليات الشائعة"}
                                    data={popularEvents}
                                    xKey="event_name"
                                    yKey='total_tickets'
                                />
                            ) : (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        {lang === "en" ? "Popular Events" : "الفعاليات الشائعة"}
                                    </h3>
                                    <EmptyStatePlaceholder
                                        icon={BarChart3}
                                        title={lang === "en" ? "No Popular Events Yet" : "لا توجد فعاليات شائعة بعد"}
                                        subtitle={lang === "en" 
                                            ? "Your most popular events will appear here once you start getting bookings" 
                                            : "ستظهر الأحداث الأكثر شعبية هنا بمجرد بدء الحجوزات"}
                                        gradient="bg-gradient-to-br from-green-500 to-teal-500"
                                    />
                                </div>
                            )}
                            
                            {eventPerfomance && eventPerfomance.length > 0 ? (
                                <GroupedBarChart
                                    title={lang === "en" ? "Event Performance" : "تحليل الفعاليات "}
                                    data={eventPerfomance}
                                    xKey="event_name"
                                    keys={["total_tickets", "attendees", "revenue"]}
                                />
                            ) : (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        {lang === "en" ? "Event Performance" : "تحليل الفعاليات"}
                                    </h3>
                                    <EmptyStatePlaceholder
                                        icon={Sparkles}
                                        title={lang === "en" ? "No Performance Data" : "لا توجد بيانات أداء"}
                                        subtitle={lang === "en" 
                                            ? "Create and manage events to track their performance metrics" 
                                            : "قم بإنشاء وإدارة الأحداث لتتبع مقاييس الأداء"}
                                        gradient="bg-gradient-to-br from-orange-500 to-pink-500"
                                    />
                                </div>
                            )}

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
                                    <EmptyStatePlaceholder
                                        icon={Calendar}
                                        title={lang === "en" ? "No Upcoming Events" : "لا توجد أحداث قادمة"}
                                        subtitle={lang === "en" 
                                            ? "Create your first event to start welcoming attendees" 
                                            : "قم بإنشاء حدثك الأول لبدء استقبال الحضور"}
                                        gradient="bg-gradient-to-br from-indigo-500 to-blue-500"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    );
}
