import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import ChartCard from "./ChartCard";

export default function LineChartComponent({
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
                        color: "var(--chart-2)",
                    },
                }}
                className='w-full h-[280px]'
            >
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray='4 4'
                        className='opacity-30'
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

                    <Line
                        type='monotone'
                        dataKey={yKey}
                        stroke='var(--chart-2)'
                        strokeWidth={3}
                        dot={{ r: 4, fill: "var(--chart-2)" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ChartContainer>
        </ChartCard>
    );
}
