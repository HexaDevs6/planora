import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";

export default function NotFoundPage() {
    const {lang} = useDirection();
    return (
        <div className='min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background relative overflow-hidden gap-3'>
            {/* Background Aurora Animation */}
            <div className='absolute inset-0 -z-10 animate-aurora bg-[radial-gradient(circle_at_center,var(--color-violet-light)_0%,transparent_60%),radial-gradient(circle_at_center,var(--color-amber-light)_0%,transparent_50%)] opacity-20 blur-3xl'></div>

            {/* Error Number */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='text-7xl md:text-9xl font-bold text-gradient-amber drop-shadow-lg'
            >
                404
            </motion.h1>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className='text-2xl md:text-3xl font-semibold text-foreground mt-4'
            >
                {lang === "ar" ? "صفحة غير موجودة" : "Page Not Found"}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className='mt-3 text-content max-w-md'
            >
                {lang === "ar" ? "الصفحة التي تبحث عنها غير موجودة" : "The page you are looking for is not found"}
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className='mt-6'
            >
                <Link
                    to='/'
                    className='px-6 py-3 rounded-lg bg-amber hover:bg-amber-dark text-primary-foreground font-medium shadow-lg transition-all duration-300'
                >
                    {lang === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
                </Link>
            </motion.div>

            {/* Decorative line */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 220 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className='h-[3px] mt-10 bg-gradient-to-r from-amber to-violet rounded-full'
            ></motion.div>
        </div>
    );
}
