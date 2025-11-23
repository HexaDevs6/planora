import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import ChartCard from "./ChartCard";

export default function BarChartComponent({
    title,
    subtitle,
    data,
    xKey,
    yKey,
}) {
    return (
        <ChartCard title={title} subtitle={subtitle}>
            <ChartContainer
                config={{
                    [yKey]: {
                        label: yKey,
                        color: "var(--chart-3)",
                    },
                }}
                className='w-full h-[300px]'
            >
                <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray='4 4'
                        className='opacity-30'
                    />

                    <XAxis
                        dataKey={xKey}
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip content={<ChartTooltipContent />} />

                    <Bar
                        dataKey={yKey}
                        fill='var(--chart-3)'
                        radius={[8, 8, 0, 0]}
                        className='transition-all duration-300 hover:opacity-90'
                    />
                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
}
