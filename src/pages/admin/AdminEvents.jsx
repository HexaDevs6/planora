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
import { Loader2 } from "lucide-react";

const AdminEvents = () => {
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
                    title="Total Events"
                    value={totalEvents?.data || 0}
                    color="var(--chart-1)"
                    footer="Events created"
                />
                <RadialProgressComponent
                    title="Total Tickets"
                    value={totalTickets?.data || 0}
                    color="var(--chart-2)"
                    footer="Tickets sold"
                />
                <RadialProgressComponent
                    title="Total Attendees"
                    value={totalAttendees?.data || 0}
                    color="var(--chart-3)"
                    footer="Checked-in attendees"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <BarChartComponent
                    title="Popular Events"
                    data={popularEvents?.data || []}
                    xKey="event_name"
                    yKey="ticket_sales"
                    layout="vertical"
                />
                <LineChartComponent
                    title="Monthly Bookings"
                    data={monthlyBookings?.data || []}
                    xKey="month"
                    yKey="count"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Performance metrics for events.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Tickets Sold</TableHead>
                                <TableHead>Attendees</TableHead>
                                <TableHead>Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventPerformance?.data?.map((event, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {event.event_name}
                                    </TableCell>
                                    <TableCell>{event.tickets_sold}</TableCell>
                                    <TableCell>{event.attendees_count}</TableCell>
                                    <TableCell>${event.revenue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEvents;
