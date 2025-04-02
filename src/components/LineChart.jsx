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

const LineChart = ({ data, lines }) => {
    return (
        <div className='w-full h-80 md:h-96 p-4'>
            <ResponsiveContainer width='100%' height='100%'>
                <RechartLineChart data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
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
};

export default LineChart;
