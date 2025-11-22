import { supabase } from "@/lib/supabaseClient";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const hostDashboardApi = createApi({
  reducerPath: "hostDashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    
    // ============================================================
    // 1) TOTAL EVENTS
    // ------------------------------------------------------------
    // What it does: Returns how many events the host has created.
    // Why needed: Used for KPI card "Total Events".
    // Returns: A single integer.
    // ============================================================
    getTotalEvents: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc("host_total_events", {
          host: hostId,
        });
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 2) TOTAL TICKETS SOLD
    // ------------------------------------------------------------
    // What it does: Counts all tickets across all events of the host.
    // Why needed: KPI card "Total Tickets Sold".
    // Returns: Integer (total tickets).
    // ============================================================
    getTotalTickets: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc("host_total_tickets", {
          host: hostId,
        });
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 3) TOTAL ATTENDEES
    // ------------------------------------------------------------
    // What it does: Counts used tickets (checked-in attendees).
    // Why needed: KPI card "Total Attendees".
    // Returns: Integer.
    // ============================================================
    getTotalAttendees: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc("host_total_attendees", {
          host: hostId,
        });
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 4) TOTAL REVENUE
    // ------------------------------------------------------------
    // What it does: Sum of all ticket prices except cancelled.
    // Why needed: KPI "Total Revenue".
    // Returns: Numeric value (decimal).
    // ============================================================
    getTotalRevenue: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc("host_total_revenue", {
          host: hostId,
        });
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 5) UPCOMING EVENTS COUNT
    // ------------------------------------------------------------
    // What it does: Counts all upcoming events for the host.
    // Why needed: KPI "Upcoming Events".
    // Returns: Integer.
    // ============================================================
    getUpcomingEventsCount: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc(
          "host_upcoming_events_count",
          { host: hostId }
        );
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 6) BOOKINGS OVER TIME (CHART)
    // ------------------------------------------------------------
    // What it does: Returns ticket bookings grouped by day.
    // Why needed: Line Chart "Bookings Over Time".
    // Returns: [{ day: '2025-01-10', bookings: 15 }, ...]
    // ============================================================
    getBookingsOverTime: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc(
          "host_bookings_over_time",
          { host: hostId }
        );
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 7) POPULAR EVENTS (CHART)
    // ------------------------------------------------------------
    // What it does: Returns top events sorted by ticket count.
    // Why needed: Bar Chart "Most Popular Events".
    // Returns: [{ event_id, event_name, total_tickets }]
    // ============================================================
    getPopularEvents: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc("host_popular_events", {
          host: hostId,
        });
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 8) RECENT RESERVATIONS TABLE
    // ------------------------------------------------------------
    // What it does: Returns last 10 reservations for the host.
    // Why needed: Table "Recent Reservations".
    // Returns: [{ ticket_id, event_name, client_name, price, ... }]
    // ============================================================
    getRecentReservations: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc(
          "host_recent_reservations",
          { host: hostId }
        );
        if (error) return { error };
        return { data };
      },
    }),


    // ============================================================
    // 9) EVENT PERFORMANCE TABLE
    // ------------------------------------------------------------
    // What it does: Returns tickets, attendees, revenue per event.
    // Why needed: Performance Dashboard Table.
    // Returns: [{ event_id, event_name, total_tickets, attendees, revenue }]
    // ============================================================
    getEventPerformance: builder.query({
      async queryFn({ hostId }) {
        const { data, error } = await supabase.rpc(
          "host_event_performance",
          { host: hostId }
        );
        if (error) return { error };
        return { data };
      },
    }),

  }),
});


// Export hooks
export const {
  useGetTotalEventsQuery,
  useGetTotalTicketsQuery,
  useGetTotalAttendeesQuery,
  useGetTotalRevenueQuery,
  useGetUpcomingEventsCountQuery,
  useGetBookingsOverTimeQuery,
  useGetPopularEventsQuery,
  useGetRecentReservationsQuery,
  useGetEventPerformanceQuery,
} = hostDashboardApi;
