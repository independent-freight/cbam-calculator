import {
    PieChart as RechartsPieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white p-4 border border-gray-200 rounded shadow'>
                <p className='font-semibold'>{`${
                    label ? label : payload[0].name
                }`}</p>
                <p className='text-sm'>{`Emissions: ${payload[0].value.toFixed(
                    2
                )} tonnes CO2e`}</p>
            </div>
        );
    }
    return null;
};
export function PieChart({ data }) {
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                    }>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
