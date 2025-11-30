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

        // Returns list of users with pagination support.
        // args: { page?: number, pageSize?: number, q?: string, order?: { column, ascending } }
        getUsersList: builder.query({
          async queryFn(arg = {}) {
           try {
            const { page = 1, pageSize = 10, q, order } = arg;
            const from = (page - 1) * pageSize;
            const to = page * pageSize - 1;

            // build base query
            let query = supabase
            .from("users")
            // include full count
            .select("*", { count: "exact" });

            // optional: simple search by full_name or email if q provided
            if (q) {
            // use ilike for case-insensitive partial match
            // adjust the columns you want to search
            query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
          }

          // optional ordering
          if (order && order.column) {
            query = query.order(order.column, { ascending: !!order.ascending });
          } else {
            // default order: newest first
            query = query.order("created_at", { ascending: false });
          }

          // apply range for pagination
          const { data: rows, error, count } = await query.range(from, to);

          if (error) return { error };

          // normalize response shape to { data: [...], total: number }
          return { 
            data: { 
              data: rows || [],
              total: typeof count === "number" ? count : (rows ? rows.length : 0) 
            } 
          };
        } catch (err) {
          return { error: err };
        }
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
        // getEventPerformance: fallback using RPC then client-side filter + paginate
getEventPerformance: builder.query({
  async queryFn(arg = {}) {
    try {
      const {
        page = 1,
        pageSize = 10,
        q,
        order = { column: "revenue", ascending: false },
      } = arg;

      // call the RPC that returns the full performance array
      const { data: allRows, error: rpcError } = await supabase.rpc("admin_event_performance");
      if (rpcError) return { error: rpcError };

      // ensure array
      const rows = Array.isArray(allRows) ? allRows : [];

      // client-side search (case-insensitive)
      let filtered = rows;
      if (q && q.trim() !== "") {
        const clean = q.trim().toLowerCase();
        filtered = filtered.filter((r) => {
          const name = (r.event_name || "").toString().toLowerCase();
          const host = (r.host_name || "").toString().toLowerCase();
          return name.includes(clean) || host.includes(clean);
        });
      }

      // client-side ordering (only allow known columns)
      const allowed = ["revenue", "total_tickets", "attendees", "created_at", "event_name"];
      if (order && order.column && allowed.includes(order.column)) {
        filtered.sort((a, b) => {
          const col = order.column;
          const A = a[col] ?? 0;
          const B = b[col] ?? 0;
          if (A === B) return 0;
          const asc = order.ascending ? 1 : -1;
          // numeric vs string
          if (typeof A === "number" && typeof B === "number") return (A - B) * asc;
          return String(A).localeCompare(String(B)) * asc;
        });
      } else {
        // default sort by revenue desc
        filtered.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
      }

      // total count after filter
      const total = filtered.length;

      // pagination (slice)
      const from = (page - 1) * pageSize;
      const to = page * pageSize; // slice end-exclusive
      const pageRows = filtered.slice(from, to);

      return {
        data: {
          data: pageRows,
          total,
        },
      };
    } catch (err) {
      return { error: err };
    }
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
