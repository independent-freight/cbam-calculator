import React from "react";
import {
    LineChart as RechartLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export function LineChart({ data, lines, customTooltip, hideXAxis = false }) {
    return (
        <div className='w-full h-80 md:h-96 p-4'>
            <ResponsiveContainer width='100%' height='100%'>
                <RechartLineChart data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    {!hideXAxis && <XAxis dataKey='name' />}
                    <YAxis />
                    <Tooltip content={customTooltip} />
                    <Legend />
                    {lines.map((l, key) => (
                        <Line
                            key={`${key}-${l?.key}`}
                            type='monotone'
                            dataKey={l?.key}
                            stroke={l?.color}
                            strokeWidth={2}
                            name={l?.name}
                        />
                    ))}
                </RechartLineChart>
            </ResponsiveContainer>
        </div>
    );
}
