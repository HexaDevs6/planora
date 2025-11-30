import React,  { useState, useEffect, useRef } from "react";
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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import Spinner from "@/components/SpinnerLoader";
import Pagination from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const AdminEvents = () => {
    const { lang } = useDirection();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceMs = 400;
    const debounceRef = useRef(null);

    const { data: totalEvents, isLoading: loadingTotalEvents} =
        useGetTotalEventsQuery();
    const { data: totalTickets, isLoading: loadingTotalTickets } =
        useGetTotalTicketsQuery();
    const { data: totalAttendees, isLoading: loadingTotalAttendees } =
        useGetTotalAttendeesQuery();
    const { data: popularEvents, isLoading: loadingPopularEvents } =
        useGetPopularEventsQuery();
    const { data: eventPerformance, isLoading: loadingEventPerformance, isFetching: fetchingEventPerformance } =
        useGetEventPerformanceQuery({ page, pageSize, q: debouncedSearch});  
    const { data: monthlyBookings, isLoading: loadingMonthlyBookings } =
        useGetMonthlyBookingsQuery();

        
    const eventsList = eventPerformance?.data ?? [];
    const eventsTotal = eventPerformance?.total ?? 0;
    const totalPages = eventsTotal ? Math.max(1, Math.ceil(eventsTotal / pageSize)) : undefined;

    const isLoading =
        loadingTotalEvents ||
        loadingTotalTickets ||
        loadingTotalAttendees ||
        loadingPopularEvents ||
        loadingEventPerformance ||
        loadingMonthlyBookings;

     // debounce effect for searchInput -> debouncedSearch
  // -----------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // -----------------------
  // clamp page when totalPages changes
  // -----------------------
  useEffect(() => {
    if (totalPages && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const flushSearchNow = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  };

  // -----------------------
  // animation variants
  // -----------------------
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

  // initial full-screen loading
  if (isLoading) return <Spinner />;

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

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
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
                <Card className='py-5'>
                    <CardHeader className={'flex justify-between items-center'}>
                        <CardTitle >{lang === "ar" ? "أداء الفعاليات" : "Events Performance"}</CardTitle>
                        <Input 
                            className='w-1/2'
                            type="search" 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") flushSearchNow();
                            }}
                            placeholder={lang === "ar" ? "ابحث باسم الفعالية أو اسم المضيف..." : "Search by event or host name..."}
                            aria-label={lang === "ar" ? "بحث" : "Search"}
                        />
                    </CardHeader>
                    <CardContent>
                        <Table>
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
                                {eventsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6">
                                    لا توجد نتائج لـ "الكلمة"
                                    </TableCell>
                                </TableRow>
                                ) : (eventsList?.map((event, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                        <TableCell className="font-medium">
                                            {event.event_name}
                                        </TableCell>
                                        <TableCell>{event.host_name}</TableCell>
                                        <TableCell>{event.total_tickets}</TableCell>
                                        <TableCell>{event.attendees}</TableCell>
                                        <TableCell>${event.revenue || 0}</TableCell>
                                    </TableRow>
                                )))}
                            </TableBody>
                        </Table>
                        <div className="my-4">
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                total={eventsTotal}
                                onPageChange={(p) => setPage(p)}
                                onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                                dir={lang === "ar" ? "rtl" : "ltr"}
                                isLoading={fetchingEventPerformance}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AdminEvents;
