import React from "react";
import {
    useGetTotalUsersQuery,
    useGetTotalHostsQuery,
    useGetTotalEventsQuery,
    useGetTotalServicesQuery,
    useGetTotalTicketsQuery,
    useGetTotalRevenueQuery,
    useGetMonthlyUserGrowthQuery,
    useGetMonthlyBookingsQuery,
    useGetMonthlyServiceGrowthQuery,
    useGetPopularEventsQuery,
} from "@/features/adminDashboard/adminDashboard.api";
import {
    RadialProgressComponent,
    LineChartComponent,
    BarChartComponent,
} from "@/components/Charts/chartsIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";

import { motion } from "framer-motion";
import Spinner from "@/components/SpinnerLoader";

const AdminOverview = () => {
    const { lang } = useDirection();

    // Fetching KPIs
    const { data: totalUsers, isLoading: loadingUsers } = useGetTotalUsersQuery();
    const { data: totalHosts, isLoading: loadingHosts } = useGetTotalHostsQuery();
    const { data: totalEvents, isLoading: loadingEvents } =
        useGetTotalEventsQuery();
    const { data: totalServices, isLoading: loadingServices } =
        useGetTotalServicesQuery();
    const { data: totalTickets, isLoading: loadingTickets } =
        useGetTotalTicketsQuery();
    const { data: totalRevenue, isLoading: loadingRevenue } =
        useGetTotalRevenueQuery();

    // Fetching Charts Data
    const { data: monthlyUserGrowth, isLoading: loadingUserGrowth } =
        useGetMonthlyUserGrowthQuery();
    const { data: monthlyBookings, isLoading: loadingBookings } =
        useGetMonthlyBookingsQuery();
    const { data: monthlyServiceGrowth, isLoading: loadingServiceGrowth } =
        useGetMonthlyServiceGrowthQuery();
    const { data: popularEvents, isLoading: loadingPopularEvents } =
        useGetPopularEventsQuery();

    const isLoading =
        loadingUsers ||
        loadingHosts ||
        loadingEvents ||
        loadingServices ||
        loadingTickets ||
        loadingRevenue ||
        loadingUserGrowth ||
        loadingBookings ||
        loadingServiceGrowth ||
        loadingPopularEvents;

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
            className="space-y-6 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={itemVariants}
                className="sticky top-15 z-10 rounded-sm border border-yellow-400 bg-yellow-50/90 p-4 text-yellow-800 shadow-sm md:hidden"
            >
                <p className="text-sm font-medium">
                    {lang === "ar" ? "للحصول على تجربة أفضل، يرجى استخدام لوحة التحكم على جهاز أكبر." : "For better experience, please use dashboard on a larger screen device."}
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            >
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "المستخدمين" : "Total Users"}
                        value={totalUsers || 0}
                        color="var(--chart-1)"
                        footer="Total registered users"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "المضيفين" : "Total Hosts"}
                        value={totalHosts || 0}
                        color="var(--chart-2)"
                        footer="Active hosts"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "الفعاليات" : "Total Events"}
                        value={totalEvents || 0}
                        color="var(--chart-3)"
                        footer="Events created"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "الخدمات" : "Total Services"}
                        value={totalServices || 0}
                        color="var(--chart-4)"
                        footer="Services offered"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "عدد التذاكر" : "Total Tickets"}
                        value={totalTickets}
                        color="var(--chart-5)"
                        footer="Tickets sold"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "مجموع العوائد" : "Total Revenue"}
                        value={totalRevenue}
                        color="var(--chart-5)"
                        footer="Total revenue"
                    />
                </motion.div>
            </motion.div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <LineChartComponent
                        title={lang === "ar" ? "نمو المستخدمين شهرياً" : "Users Monthly Growth"}
                        data={monthlyUserGrowth || []}
                        xKey="month"
                        yKey="total"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <BarChartComponent
                        title={lang === "ar" ? "الفعاليات الأكثر شيوعاً" : "Top Events"}
                        data={popularEvents || []}
                        xKey="event_name"
                        yKey="total_tickets"
                        layout="horizontal"
                    />
                </motion.div>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <LineChartComponent
                        title={lang === "ar" ? "نمو الفعاليات شهرياً" : "Events Monthly Growth"}
                        data={monthlyBookings || []}
                        xKey="month"
                        yKey="total"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <LineChartComponent
                        title={lang === "ar" ? "نمو الخدمات شهرياً" : "Services Monthly Growth"}
                        data={monthlyServiceGrowth || []}
                        xKey="month"
                        yKey="total"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
