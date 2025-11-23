import { useDirection } from "@/hooks/useDirection";
import React from "react";

export default function Spinner({ message }) {
    const { lang } = useDirection();

    const finalMessage =
        message ||
        (lang === "ar"
            ? "جاري تحميل البيانات، برجاء الانتظار..."
            : "Loading… Please wait.");

    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm'>
            <div className='bg-white dark:bg-neutral-900 shadow-xl rounded-2xl px-10 py-8 flex flex-col items-center gap-6 animate-fade-in'>
                {/* Spinner + Logo inside */}
                <div className='relative flex items-center justify-center'>
                    {/* Spinner circle */}
                    <div className='w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin'></div>

                    {/* Logo inside spinner */}
                    <img
                        src='/favPlanora.svg'
                        alt='Planora Logo'
                        className='absolute w-10 h-10 opacity-90 animate-bounce mt-3'
                    />
                </div>

                {/* Message */}
                <p className='text-primary text-sm font-medium text-center leading-relaxed'>
                    {finalMessage}
                </p>
            </div>
        </div>
    );
}
