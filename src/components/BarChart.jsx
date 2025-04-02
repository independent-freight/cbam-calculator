import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export function BarChart({ data, bars }) {
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <RechartsBarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                {bars.map((b, key) => (
                    <Bar
                        key={`${key}-${b.key}`}
                        dataKey={b?.key}
                        name={b?.name}
                        fill={b?.color}
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
