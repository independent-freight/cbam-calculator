import { CBAMCalculator } from "cbam-calculator";
import { useSelector } from "react-redux";
import { AppHeader } from "layout/AppHeader";
import { KPISection } from "./KPISection";
import { TrendingUp, Factory, Package } from "lucide-react";
import { ResponsiveContainer } from "recharts";
import { BarChart } from "components/BarChart";
import { Treemap } from "recharts";
import { LineChart } from "components/LineChart";

export function Home() {
    const user = useSelector((state) => state.user);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF"];

    // Sample Data
    const barChartData = [
        { name: "Product A", direct: 400, indirect: 300 },
        { name: "Product B", direct: 200, indirect: 500 },
        { name: "Product C", direct: 300, indirect: 400 },
        { name: "Product A", direct: 400, indirect: 300 },
        { name: "Product B", direct: 200, indirect: 500 },
        { name: "Product C", direct: 300, indirect: 400 },
        { name: "Product A", direct: 320, indirect: 300 },
        { name: "Product B", direct: 530, indirect: 500 },
        { name: "Product C", direct: 560, indirect: 400 },
        { name: "Product A", direct: 400, indirect: 300 },
        { name: "Product B", direct: 240, indirect: 500 },
        { name: "Product C", direct: 780, indirect: 400 },
        { name: "Product A", direct: 450, indirect: 300 },
        { name: "Product B", direct: 456, indirect: 500 },
        { name: "Product C", direct: 948, indirect: 400 },
    ];

    const bars = [
        { name: "Indirect Emissions", key: "indirect", color: "#FFBB28" },
        { name: "Direct Emissions", key: "direct", color: "#FF8042" },
    ];

    const pieChartData = [
        { name: "Supplier 1", value: 400 },
        { name: "Supplier 2", value: 300 },
        { name: "Supplier 3", value: 200 },
        { name: "Supplier 4", value: 100 },
    ];

    const treemapData = [
        { name: "Iron", size: 800 },
        { name: "Steel", size: 600 },
        { name: "Copper", size: 500 },
        { name: "Aluminum", size: 300 },
    ];
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white p-2 border rounded shadow-md'>
                    <p className='font-semibold'>{payload[0]?.payload?.name}</p>
                    <p className='text-blue-500'>
                        Direct: {payload[0].value} tCO₂e
                    </p>
                    <p className='text-green-500'>
                        Indirect: {payload[1].value} tCO₂e
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <AppHeader header={`Welcome ${user?.full_name ?? ""},`} />

            <KPISection
                sections={[
                    {
                        title: "Total CBAM Emissions",
                        value: "",
                        icon: TrendingUp,
                        bgColor: "bg-red-500",
                    },
                    {
                        title: "Top Emitting Product",
                        value: "",
                        icon: Factory,
                        bgColor: "bg-blue-500",
                    },
                    {
                        title: "Total Supplier Quantity",
                        value: "",
                        icon: Package,
                        bgColor: "bg-green-500",
                    },
                ]}
            />
            <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold mb-2 text-center'>
                    Direct vs Indirect Emissions per Product
                </h3>
                <LineChart
                    data={barChartData}
                    lines={bars}
                    customTooltip={CustomTooltip}
                    hideXAxis
                />
            </div>
            <div className='bg-white p-4 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold mb-2'>
                    Material Categories & Emissions
                </h3>
                <ResponsiveContainer width='100%' height={300}>
                    <Treemap
                        data={treemapData}
                        dataKey='size'
                        stroke='#fff'
                        fill='#8884d8'
                    />
                </ResponsiveContainer>
            </div>
        </div>
    );
}
