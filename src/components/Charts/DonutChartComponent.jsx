import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

export default function DonutChartComponent({ title, subtitle, data }) {
    const COLORS = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    return (
        <ChartCard title={title} subtitle={subtitle}>
            <div className='flex-center w-full  h-[300px]'>
                <PieChart width={320} height={260}>
                    <Pie
                        data={data}
                        dataKey='value'
                        nameKey='name'
                        innerRadius={55}
                        outerRadius={100}
                        paddingAngle={3}
                        labelLine={false}
                        label={true}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                                className='transition-all duration-300 hover:opacity-80'
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                        }}
                        labelStyle={{ color: "var(--foreground)" }}
                        itemStyle={{ color: "var(--foreground)" }}
                    />
                </PieChart>
            </div>
        </ChartCard>
    );
}
