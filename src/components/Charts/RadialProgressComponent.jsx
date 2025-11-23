import React from "react";
import { RadialBarChart, RadialBar } from "recharts";
import ChartCard from "./ChartCard";

export default function RadialProgressComponent({
    title,
    subtitle,
    value = 0,
    color,
}) {
    const chartColor = color || "var(--chart-1)";

    const data = [
        {
            name: "Progress",
            value,
            fill: chartColor,
        },
    ];

    return (
        <ChartCard title={title} subtitle={subtitle}>
            <div className='flex-center w-full  relative'>
                <RadialBarChart
                    width={120}
                    height={120}
                    innerRadius='75%'
                    outerRadius='100%'
                    barSize={22}
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar dataKey='value' cornerRadius={20} />
                </RadialBarChart>

                {/* Percentage Label in Center */}
                <div
                    className='
            absolute 
            text-foreground 
            text-xl 
            font-semibold
            flex-center
            tracking-wide
          '
                    style={{
                        fontFamily: "var(--font-cairo)",
                    }}
                >
                    {value}
                </div>
            </div>
        </ChartCard>
    );
}
