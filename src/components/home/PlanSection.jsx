import React from "react";
import { CalendarDays } from "lucide-react";
import { Search } from "lucide-react";
import { Store } from "lucide-react";
import { BellRing } from "lucide-react";
import { BrainCircuit } from "lucide-react";
import { StarHalf } from "lucide-react";
import { t } from "i18next";

export default function PlanSection() {
    const handlePlan = [
        {
            id: 1,
            title: t("feats.1.title"),
            description: t("feats.1.subtitle"),
            icon: (
                <CalendarDays
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 2,
            title: t("feats.2.title"),
            description: t("feats.2.subtitle"),
            icon: (
                <Search
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 3,
            title: t("feats.3.title"),
            description: t("feats.3.subtitle"),
            icon: (
                <Store
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 4,
            title: t("feats.4.title"),
            description: t("feats.4.subtitle"),
            icon: (
                <BellRing
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 5,
            title: t("feats.5.title"),
            description: t("feats.5.subtitle"),
            icon: (
                <BrainCircuit
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 6,
            title: t("feats.6.title"),
            description: t("feats.6.subtitle"),
            icon: (
                <StarHalf
                    size={72}
                    strokeWidth={1.7}
                    className='text-amber-400 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
    ];

    const handleRounded = (id) => {
        switch (id) {
            case 1:
                return "rounded-sm md:rounded-tl-sm md:rounded-tr-none md:rounded-bl-none md:rounded-br-none";
            case 2:
                return "rounded-sm md:rounded-tr-sm md:rounded-tl-none md:rounded-bl-none md:rounded-br-none lg:rounded-none";
            case 3:
                return "rounded-sm md:rounded-none lg:rounded-tr-sm";
            case 4:
                return "rounded-sm md:rounded-none lg:rounded-bl-sm";
            case 5:
                return "rounded-sm md:rounded-bl-sm md:rounded-tr-none md:rounded-tl-none md:rounded-br-none lg:rounded-none";
            case 6:
                return "rounded-sm md:rounded-br-sm md:rounded-tr-none md:rounded-tl-none md:rounded-bl-none";
            default:
                return "";
        }
    };

    return (
        <section className='py-16 bg-[linear-gradient(to_right,#99248D_0%,var(--color-violet-dark)_100%)]'>
            <div className='container'>
                <div className='plan__header text-center'>
                    <h2 className='font-bold text-4xl text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
                        {t("plan.title")}
                    </h2>
                    <p className='font-medium text-xl mt-6 text-amber'>
                        {t("plan.subtitle")}
                    </p>
                </div>
                <div className='plan__content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-6 md:gap-0'>
                    {handlePlan.map((el) => (
                        <div
                            key={el.id}
                            className={`group flex flex-col text-center justify-center ${handleRounded(
                                el.id
                            )} items-center gap-5 p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out  hover:shadow-[0_0_35px_rgba(251,188,4,0.3)] hover:border-amber-400/50`}
                        >
                            {el.icon}

                            <h4 className='font-semibold text-[28px] text-white group-hover:text-amber-300 transition-colors duration-300'>
                                {el.title}
                            </h4>

                            <p className='text-lg text-gray-200 group-hover:text-gray-100 transition-colors duration-300'>
                                {el.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
