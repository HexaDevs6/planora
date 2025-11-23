import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import ChartCard from "./ChartCard";

export default function AreaChartComponent({
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
                        color: "var(--chart-1)",
                    },
                }}
                className='w-full h-[280px]'
            >
                <AreaChart data={data}>
                    <CartesianGrid
                        strokeDasharray='4 4'
                        className='opacity-40'
                    />

                    <XAxis
                        dataKey={xKey}
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                    />

                    <YAxis
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip content={<ChartTooltipContent />} />

                    <Area
                        type='monotone'
                        dataKey={yKey}
                        stroke='var(--chart-1)'
                        fill='var(--chart-1)'
                        fillOpacity={0.25}
                        strokeWidth={3}
                    />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
}
