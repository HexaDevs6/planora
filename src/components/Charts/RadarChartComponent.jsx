import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts";

import ChartCard from "./ChartCard";

export default function RadarChartComponent({
    title,
    subtitle,
    data,
    xKey,
    yKey,
}) {
    return (
        <ChartCard title={title} subtitle={subtitle}>
            <div className='flex-center w-full h-[320px]'>
                <RadarChart
                    cx={170}
                    cy={150}
                    outerRadius={110}
                    width={340}
                    height={300}
                    data={data}
                >
                    <PolarGrid stroke='var(--border)' />

                    <PolarAngleAxis
                        dataKey={xKey}
                        tick={{ fill: "var(--content)", fontSize: "12px" }}
                    />

                    <PolarRadiusAxis
                        tick={{ fill: "var(--content)" }}
                        axisLine={false}
                    />

                    <Radar
                        name={yKey}
                        dataKey={yKey}
                        stroke='var(--chart-2)'
                        fill='var(--chart-2)'
                        fillOpacity={0.35}
                        strokeWidth={2.5}
                    />
                </RadarChart>
            </div>
        </ChartCard>
    );
}
