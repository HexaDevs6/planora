import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import ChartCard from "./ChartCard";

export default function GroupedBarChart({
    title,
    subtitle,
    data,
    xKey,
    keys = [],
}) {
    const chartColors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    return (
        <ChartCard title={title} subtitle={subtitle}>
            <ChartContainer
                config={keys.reduce((acc, key, index) => {
                    acc[key] = {
                        label: key,
                        color: chartColors[index % chartColors.length],
                    };
                    return acc;
                }, {})}
                className='w-full h-[340px]'
            >
                <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray='4 4'
                        className='opacity-30'
                    />

                    <XAxis
                        className='hidden md:block'
                        dataKey={xKey}
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-10}
                        textAnchor='end'
                        tickFormatter={(value) =>
                            value.length > 15
                                ? value.slice(0, 8) + "..."
                                : value
                        }
                    />

                    <YAxis
                        tick={{ fill: "var(--content)" }}
                        tickLine={false}
                        axisLine={false}
                    />

                    <Legend
                        formatter={(value) => (
                            <span className='text-sm text-foreground font-medium'>
                                {value}
                            </span>
                        )}
                    />

                    <ChartTooltip content={<ChartTooltipContent />} />

                    {keys.map((key, index) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={chartColors[index % chartColors.length]}
                            radius={[6, 6, 0, 0]}
                            className='transition-all duration-300 hover:opacity-90'
                        />
                    ))}
                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
}
