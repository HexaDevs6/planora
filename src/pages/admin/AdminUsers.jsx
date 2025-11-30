import React, { useEffect, useRef, useState } from "react";
import {
    useGetTotalUsersQuery,
    useGetTotalHostsQuery,
    useGetCategoryUsageQuery,
    useGetMonthlyUserGrowthQuery,
    useGetUsersListQuery,
} from "@/features/adminDashboard/adminDashboard.api";
import {
    DonutChartComponent,
    LineChartComponent,
    BarChartComponent,
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

const AdminUsers = () => {
    const { lang } = useDirection();
    
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceMs = 400;
    const debounceRef = useRef(null);

    const { data: totalUsers, isLoading: loadingTotalUsers } =
        useGetTotalUsersQuery();
    const { data: totalHosts, isLoading: loadingTotalHosts } =
        useGetTotalHostsQuery();
    const { data: categoryUsage, isLoading: loadingCategoryUsage } =
        useGetCategoryUsageQuery();
    const { data: monthlyUserGrowth, isLoading: loadingUserGrowth } =
        useGetMonthlyUserGrowthQuery();
    const {
        data: usersListResult,
        isLoading: loadingUsersList,
        isFetching: fetchingUsersList,
    } = useGetUsersListQuery({ page, pageSize,q: debouncedSearch});

     const usersList = usersListResult?.data ?? [];
    const usersTotal = usersListResult?.total ?? 0;
    const totalPages = usersTotal ? Math.max(1, Math.ceil(usersTotal / pageSize)) : undefined;

    const isLoading =
        loadingTotalUsers ||
        loadingTotalHosts ||
        loadingCategoryUsage ||
        loadingUserGrowth ||
        loadingUsersList;

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchInput.trim());
            setPage(1);
        }, debounceMs);

        return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchInput]);

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

    const userRolesData = [
        { name: "Users", value: totalUsers - totalHosts },
        { name: "Hosts", value: totalHosts },
    ];

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

   if (isLoading) {
        return <Spinner />;
    }


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
                    {lang === "ar" ? "للحصول على تجربة أفضل، يرجى استخدام لوحة التحكم على جهاز أكبر." : "For better experience, please use dashboard on a larger screen device."}
                </p>
            </motion.div>
            <motion.div
                variants={containerVariants}
                className="grid gap-4 grid-cols-2 md:grid-cols-5"
            >
                <motion.div variants={itemVariants} className="col-span-2">
                    <DonutChartComponent title={lang === "ar" ? "نسبة المضيفين إلي المستخدمين" : "Users by Role"} data={userRolesData} />
                </motion.div>
                <motion.div variants={itemVariants} className="col-span-3">
                    <LineChartComponent
                        title={lang === "ar" ? "نمو المستخدمين شهرياً" : "Monthly User Growth"}
                        data={monthlyUserGrowth}
                        xKey="month"
                        yKey="total"
                    />
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 grid-cols-1">
                <BarChartComponent
                    title={lang === "ar" ? "الأقسام الأكثر اهتماماً" : "Most Interested Categories"}
                    data={categoryUsage || []}
                    xKey="category"
                    yKey="total_users"
                    subtitle={lang === "ar" ? "الأقسام" : "Categories"}
                />
            </motion.div>

            <motion.div variants={itemVariants} >
                <Card className='py-5'>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle >{lang === "ar" ? "جميع المستخدمين" : "All Users"}</CardTitle>
                        <Input 
                            className='w-1/2'
                            type="search" 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") flushSearchNow();
                            }}
                            placeholder={lang === "ar" ? "ابحث باسم المستخدم أو البريد الإلكتروني..." : "Search by user name or email..."}
                            aria-label={lang === "ar" ? "بحث" : "Search"}
                        />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{lang === "ar" ? "مسلسل" : "No."}</TableHead>
                                    <TableHead>{lang === "ar" ? "الاسم" : "Name"}</TableHead>
                                    <TableHead>{lang === "ar" ? "البريد الالكتروني" : "Email"}</TableHead>
                                    <TableHead>{lang === "ar" ? "الدور" : "Role"}</TableHead>
                                    <TableHead>{lang === "ar" ? "تاريخ التسجيل" : "Created At"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usersList?.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{index + 1 + (page - 1) * pageSize}</TableCell>

                                        <TableCell>
                                            {user.full_name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="my-4">
                            <Pagination
                                page={page}
                                pageSize={pageSize}
                                total={usersTotal}
                                onPageChange={(p) => setPage(p)}
                                onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                                dir={lang === "ar" ? "rtl" : "ltr"}
                                labels={{
                                previous: lang === "ar" ? "السابق" : "Previous",
                                next: lang === "ar" ? "التالي" : "Next",
                                perPage: lang === "ar" ? "لكل صفحة" : "Per page",
                                morePages: lang === "ar" ? "المزيد" : "More pages",
                                }}
                                isLoading={fetchingUsersList}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AdminUsers;
