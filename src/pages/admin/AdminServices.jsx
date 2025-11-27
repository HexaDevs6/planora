import React from "react";
import {
    useGetTotalServicesQuery,
    useGetActiveServicesQuery,
    useGetVerifiedServicesQuery,
    useGetServicesPerCategoryQuery,
    useGetServicesStatusStatsQuery,
    useGetTopServicesQuery,
    useGetTopServiceProvidersQuery,
} from "@/features/adminDashboard/adminDashboard.api";
import {
    RadialProgressComponent,
    BarChartComponent,
    DonutChartComponent,
} from "@/components/Charts/chartsIndex";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import Spinner from "@/components/SpinnerLoader";

const AdminServices = () => {
    const { lang } = useDirection();
    const { data: totalServices, isLoading: loadingTotalServices } =
        useGetTotalServicesQuery();
    const { data: activeServices, isLoading: loadingActiveServices } =
        useGetActiveServicesQuery();
    const { data: verifiedServices, isLoading: loadingVerifiedServices } =
        useGetVerifiedServicesQuery();
    const { data: servicesPerCategory, isLoading: loadingServicesPerCategory } =
        useGetServicesPerCategoryQuery();
    const { data: servicesStatusStats, isLoading: loadingServicesStatusStats } =
        useGetServicesStatusStatsQuery();
    const { data: topServices, isLoading: loadingTopServices } =
        useGetTopServicesQuery();
    const { data: topServiceProviders, isLoading: loadingTopServiceProviders } =
        useGetTopServiceProvidersQuery();

    const isLoading =
        loadingTotalServices ||
        loadingActiveServices ||
        loadingVerifiedServices ||
        loadingServicesPerCategory ||
        loadingServicesStatusStats ||
        loadingTopServices ||
        loadingTopServiceProviders;

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
                        title={lang === "ar" ? "إجمالي الخدمات" : "Total Services"}
                        value={totalServices || 0}
                        color="var(--chart-1)"
                        footer={lang === "ar" ? "كل الخدمات" : "All services"}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "الخدمات النشطة" : "Active Services"}
                        value={activeServices || 0}
                        color="var(--chart-2)"
                        footer={lang === "ar" ? "نشطة حالياً" : "Currently active"}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <RadialProgressComponent
                        title={lang === "ar" ? "الخدمات الموثقة" : "Verified Services"}
                        value={verifiedServices || 0}
                        color="var(--chart-3)"
                        footer={lang === "ar" ? "موثقة من قبل المشرف" : "Verified by admin"}
                    />
                </motion.div>
            </motion.div>

            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <BarChartComponent
                        title={lang === "ar" ? "الخدمات حسب الفئة" : "Services per Category"}
                        data={servicesPerCategory || []}
                        xKey="category"
                        yKey="total"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <DonutChartComponent
                        title={lang === "ar" ? "حالة الخدمات" : "Service Status"}
                        data={servicesStatusStats.map((item) => ({
                            name: item.status,
                            value: item.total,
                        }))}
                    />
                </motion.div>
            </div>

            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <BarChartComponent
                        title={lang === "ar" ? "أفضل مزودي الخدمات" : "Top Service Providers"}
                        data={topServiceProviders || []}
                        xKey="provider_name"
                        yKey="total_services"
                        layout="vertical"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <BarChartComponent
                        title={lang === "ar" ? "الخدمات الأعلى تقييماً" : "Top Rated Services"}
                        data={topServices || []}
                        xKey="service_name"
                        yKey="rating"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminServices;
