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
import { Loader2 } from "lucide-react";

const AdminServices = () => {
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
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <RadialProgressComponent
                    title="Total Services"
                    value={totalServices?.data || 0}
                    color="var(--chart-1)"
                    footer="All services"
                />
                <RadialProgressComponent
                    title="Active Services"
                    value={activeServices?.data || 0}
                    color="var(--chart-2)"
                    footer="Currently active"
                />
                <RadialProgressComponent
                    title="Verified Services"
                    value={verifiedServices?.data || 0}
                    color="var(--chart-3)"
                    footer="Verified by admin"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <BarChartComponent
                    title="Services per Category"
                    data={servicesPerCategory?.data || []}
                    xKey="category"
                    yKey="count"
                />
                <DonutChartComponent
                    title="Service Status"
                    data={servicesStatusStats?.data || []}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <BarChartComponent
                    title="Top Service Providers"
                    data={topServiceProviders?.data || []}
                    xKey="provider_name"
                    yKey="service_count"
                    layout="vertical"
                />
                <BarChartComponent
                    title="Top Rated Services"
                    data={topServices?.data || []}
                    xKey="service_name"
                    yKey="rating"
                />
            </div>
        </div>
    );
};

export default AdminServices;
