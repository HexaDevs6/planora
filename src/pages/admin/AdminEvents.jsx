import React from "react";
import {
    useGetTotalEventsQuery,
    useGetTotalTicketsQuery,
    useGetTotalAttendeesQuery,
    useGetPopularEventsQuery,
    useGetEventPerformanceQuery,
    useGetMonthlyBookingsQuery,
} from "@/features/adminDashboard/adminDashboard.api";
import {
    RadialProgressComponent,
    BarChartComponent,
    LineChartComponent,
} from "@/components/Charts/chartsIndex";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import Spinner from "@/components/SpinnerLoader";

const AdminEvents = () => {
    const { lang } = useDirection();
    const { data: totalEvents, isLoading: loadingTotalEvents } =
        useGetTotalEventsQuery();
    const { data: totalTickets, isLoading: loadingTotalTickets } =
        useGetTotalTicketsQuery();
    const { data: totalAttendees, isLoading: loadingTotalAttendees } =
        useGetTotalAttendeesQuery();
    const { data: popularEvents, isLoading: loadingPopularEvents } =
        useGetPopularEventsQuery();
    const { data: eventPerformance, isLoading: loadingEventPerformance } =
        useGetEventPerformanceQuery();
    const { data: monthlyBookings, isLoading: loadingMonthlyBookings } =
        useGetMonthlyBookingsQuery();

    const isLoading =
        loadingTotalEvents ||
        loadingTotalTickets ||
        loadingTotalAttendees ||
        loadingPopularEvents ||
        loadingEventPerformance ||
        loadingMonthlyBookings;

    if (isLoading) {
        return <Spinner />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <motion.div
            className="space-y-6 p-2 md:p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
                className="sticky top-15 z-10 rounded-sm border border-yellow-400 bg-yellow-50/90 p-4 text-yellow-800 shadow-sm md:hidden"
            >
                <p className="text-sm font-medium">
                    {lang === "ar"
                        ? "للحصول على تجربة أفضل، يرجى استخدام لوحة التحكم على جهاز أكبر."
                        : "For better experience, please use dashboard on a larger screen device."}
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                className="grid gap-4 md:grid-cols-3"
            >
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "إجمالي الفعاليات" : "Total Events"}
                        value={totalEvents || 0}
                        color="var(--chart-1)"
                        footer={lang === "ar" ? "الفعاليات التي تم إنشاؤها" : "Events created"}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "إجمالي التذاكر" : "Total Tickets"}
                        value={totalTickets || 0}
                        color="var(--chart-2)"
                        footer={lang === "ar" ? "التذاكر المباعة" : "Tickets sold"}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "إجمالي الحضور" : "Total Attendees"}
                        value={totalAttendees || 0}
                        color="var(--chart-3)"
                        footer={lang === "ar" ? "الحضور المسجلين" : "Checked-in attendees"}
                    />
                </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <BarChartComponent
                        title={lang === "ar" ? "الفعاليات الشائعة" : "Popular Events"}
                        data={popularEvents || []}
                        xKey="event_name"
                        yKey="total_tickets"
                        layout="vertical"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <LineChartComponent
                        title={lang === "ar" ? "الحجوزات الشهرية" : "Monthly Bookings"}
                        data={monthlyBookings || []}
                        xKey="month"
                        yKey="total"
                    />
                </motion.div>
            </div>

            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="pt-3" >{lang === "ar" ? "أداء الفعاليات" : "Events Performance"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>{lang === "ar" ? "مقاييس الأداء للفعاليات." : "Performance metrics for events."}</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{lang === "ar" ? "مسلسل" : "No."}</TableHead>
                                    <TableHead>{lang === "ar" ? "اسم الفعالية" : "Event Name"}</TableHead>
                                    <TableHead>{lang === "ar" ? "اسم المضيف" : "Host Name"}</TableHead>
                                    <TableHead>{lang === "ar" ? "التذاكر " : "Tickets "}</TableHead>
                                    <TableHead>{lang === "ar" ? "الحضور" : "Attendees"}</TableHead>
                                    <TableHead>{lang === "ar" ? "الإيرادات" : "Revenue"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventPerformance?.map((event, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            {event.event_name}
                                        </TableCell>
                                        <TableCell>{event.host_name}</TableCell>
                                        <TableCell>{event.total_tickets}</TableCell>
                                        <TableCell>{event.attendees}</TableCell>
                                        <TableCell>${event.revenue || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AdminEvents;
