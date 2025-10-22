import React from "react";
import { Drum } from "lucide-react";
import { Gem } from "lucide-react";
import { Theater } from "lucide-react";
import { t } from "i18next";
import Concert from "@/assets/Concerts.png";
import Wedding from "@/assets/Wedding.png";
import Theaters from "@/assets/Theaters.png";
export default function EventsCategoriesSection() {
    const handleCategories = [
        {
            id: 1,
            imgSrc: Concert,
            title: t("categories.concerts.title"),
            description: t("categories.concerts.subtitle"),
            icon: (
                <Drum
                    size={72}
                    strokeWidth={1.7}
                    className='text-white transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 2,
            imgSrc: Wedding,
            title: t("categories.wedding.title"),
            description: t("categories.wedding.subtitle"),
            icon: (
                <Gem
                    size={72}
                    strokeWidth={1.7}
                    className='text-white transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
        {
            id: 3,
            imgSrc: Theaters,
            title: t("categories.theaters.title"),
            description: t("categories.theaters.subtitle"),
            icon: (
                <Theater
                    size={72}
                    strokeWidth={1.7}
                    className='text-white transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-2'
                />
            ),
        },
    ];

    return (
        <section className='py-16 bg-secondary'>
            <div className='container'>
                <div className='eventsCategories__header text-center'>
                    <h2 className='font-bold text-4xl text-violet dark:text-foreground  text-shadow-lg drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]'>
                        {t("categories.title")}
                    </h2>
                </div>
                <div className='eventsCategories__content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-16 gap-6'>
                    {handleCategories.map((el) => (
                        <div
                            key={el.id}
                            className='relative shadow-lg group cursor-pointer overflow-hidden'
                        >
                            <img
                                src={el.imgSrc}
                                className='w-full'
                                alt='Concerts'
                            />
                            <div className='absolute flex justify-center items-center flex-col gap-4 p-6 bg-[linear-gradient(to_bottom,rgba(169,158,173,0.3)_0%,rgba(51,12,47,0.5)_100%)] h-full inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500  text-white text-center'>
                                {el.icon}
                                <h4 className='font-medium text-[32px] '>
                                    {el.title}
                                </h4>
                                <p className='font-medium text-xl'>
                                    {el.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
