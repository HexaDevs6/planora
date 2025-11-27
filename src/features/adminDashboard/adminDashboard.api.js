import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabaseClient";

export const adminDashboardApi = createApi({
    reducerPath: "adminDashboardApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        // ====================================================================
        // USERS & HOSTS KPIs
        // ====================================================================

        // Returns total number of users in the system.
        getTotalUsers: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc("admin_total_users");
                if (error) return { error };
                return { data };
            },
        }),

        // Returns total number of hosts (role = host).
        getTotalHosts: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc("admin_total_hosts");
                if (error) return { error };
                return { data };
            },
        }),

        // Returns list of all users.
        getUsersList: builder.query({
            async queryFn() {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) return { error };
                return { data };
            },
        }),

        // ====================================================================
        // EVENTS & BOOKINGS KPIs
        // ====================================================================

        // Returns total number of events in the system.
        getTotalEvents: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_events"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns total number of tickets booked across all events.
        getTotalTickets: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_tickets"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns total number of attendees (checked-in tickets).
        getTotalAttendees: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_attendees"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns total revenue from all tickets.
        getTotalRevenue: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_revenue"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // ====================================================================
        // CATEGORIES ANALYTICS
        // ====================================================================

        // Returns total number of categories (event + service).
        getTotalCategories: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_categories"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns number of service categories only.
        getServiceCategoriesCount: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_service_categories_count"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns number of event categories only.
        getEventCategoriesCount: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_event_categories_count"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns how many users follow/selected each category.
        getCategoryUsage: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_category_usage"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // ====================================================================
        // SERVICES ANALYTICS
        // ====================================================================

        // Returns total number of services on the platform.
        getTotalServices: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_total_services"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns number of active services only.
        getActiveServices: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_active_services"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns number of services per category.
        getServicesPerCategory: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_services_per_category"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns number of services by status (active, paused, pending, hidden).
        getServicesStatusStats: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_services_status_stats"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns count of verified services.
        getVerifiedServices: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_verified_services"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns top-rated services.
        getTopServices: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_top_services"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns top service providers (based on number of services).
        getTopServiceProviders: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_top_service_providers"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // ====================================================================
        // GROWTH ANALYTICS (MONTHLY CHARTS)
        // ====================================================================

        // Returns monthly user growth (YYYY-MM -> count).
        getMonthlyUserGrowth: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_monthly_user_growth"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns monthly bookings growth.
        getMonthlyBookings: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_monthly_bookings"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns monthly services growth.
        getMonthlyServiceGrowth: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_monthly_service_growth"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // ====================================================================
        // EVENTS PERFORMANCE
        // ====================================================================

        // Returns top 10 events by ticket sales.
        getPopularEvents: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_popular_events"
                );
                if (error) return { error };
                return { data };
            },
        }),

        // Returns top hosts by ticket sales.
        getTopHosts: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc("admin_top_hosts");
                if (error) return { error };
                return { data };
            },
        }),

        // Returns full event performance (tickets, attendees, revenue).
        getEventPerformance: builder.query({
            async queryFn() {
                const { data, error } = await supabase.rpc(
                    "admin_event_performance"
                );
                if (error) return { error };
                return { data };
            },
        }),
    }),
});

export const {
    useGetTotalUsersQuery,
    useGetTotalHostsQuery,
    useGetTotalEventsQuery,
    useGetTotalTicketsQuery,
    useGetTotalAttendeesQuery,
    useGetTotalRevenueQuery,
    useGetTotalCategoriesQuery,
    useGetServiceCategoriesCountQuery,
    useGetEventCategoriesCountQuery,
    useGetCategoryUsageQuery,
    useGetTotalServicesQuery,
    useGetActiveServicesQuery,
    useGetServicesPerCategoryQuery,
    useGetServicesStatusStatsQuery,
    useGetVerifiedServicesQuery,
    useGetTopServicesQuery,
    useGetTopServiceProvidersQuery,
    useGetMonthlyUserGrowthQuery,
    useGetMonthlyBookingsQuery,
    useGetMonthlyServiceGrowthQuery,
    useGetPopularEventsQuery,
    useGetTopHostsQuery,
    useGetEventPerformanceQuery,
    useGetUsersListQuery,
} = adminDashboardApi;
