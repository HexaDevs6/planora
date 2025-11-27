import React from "react";
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
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import Spinner from "@/components/SpinnerLoader";

const AdminUsers = () => {
    const { lang } = useDirection();
    const { data: totalUsers, isLoading: loadingTotalUsers } =
        useGetTotalUsersQuery();
    const { data: totalHosts, isLoading: loadingTotalHosts } =
        useGetTotalHostsQuery();
    const { data: categoryUsage, isLoading: loadingCategoryUsage } =
        useGetCategoryUsageQuery();
    const { data: monthlyUserGrowth, isLoading: loadingUserGrowth } =
        useGetMonthlyUserGrowthQuery();
    const { data: usersList, isLoading: loadingUsersList } =
        useGetUsersListQuery();

    const isLoading =
        loadingTotalUsers ||
        loadingTotalHosts ||
        loadingCategoryUsage ||
        loadingUserGrowth ||
        loadingUsersList;

    if (isLoading) {
        return <Spinner />;
    }

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
                <Card>
                    <CardHeader>
                        <CardTitle className="pt-3">{lang === "ar" ? "جميع المستخدمين" : "All Users"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>{lang === "ar" ? "قائمة جميع المستخدمين." : "A list of all registered users."}</TableCaption>
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
                                        <TableCell>{index + 1}</TableCell>
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
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AdminUsers;
