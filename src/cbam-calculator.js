import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/Card.jsx";
import { Alert, AlertDescription } from "components/Alert.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/Tabs.jsx";
import { Button } from "components/Button.jsx";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import CBAM_CODES from "assets/commodity-codes.json";
// import { Plus, Trash, AlertCircle, Info } from "lucide-react";

export const CBAMCalculator = () => {
    // Material categories
    const MATERIAL_CATEGORIES = [
        { id: "iron_steel", name: "Iron and Steel" },
        { id: "aluminium", name: "Aluminium" },
        { id: "cement", name: "Cement" },
        { id: "fertilisers", name: "Fertilisers" },
        { id: "hydrogen", name: "Hydrogen" },
    ];

    // CBAM commodity codes by category

    // Constants for emissions calculations
    // ENV_VARIABLES
    const ELECTRICITY_EF_UK = 0.193; // kg CO2e per kWh (UK, 2024 estimate)
    const NATURAL_GAS_EF = 0.202; // kg CO2e per kWh (based on 56.1 tCO2/TJ from IPCC 2006 GL)
    const NATURAL_GAS_NCV = 48.0; // Net Calorific Value in GJ/t (from IPCC 2006 GL)
    const CBAM_CERTIFICATE_PRICE = 85; // € per tonne CO2 (estimated 2024 EU ETS price)
    const GBP_TO_EUR = 1.18; // Exchange rate estimation

    // State management
    const [selectedMaterialCategory, setSelectedMaterialCategory] =
        useState("iron_steel");
    const [selectedCommodityCode, setSelectedCommodityCode] = useState("7208");
    const [electricitySource, setElectricitySource] = useState("D.4(b)");
    const [countryCode, setCountryCode] = useState("GB");

    // Default emission factors by material type
    const DEFAULT_EMISSION_FACTORS = {
        iron_steel: {
            "BF-BOF Steel": { direct: 1.6, indirect: 0.2, total: 1.8 },
            "EAF Steel": { direct: 0.4, indirect: 0.2, total: 0.6 },
            "Stainless Steel": { direct: 2.5, indirect: 0.4, total: 2.9 },
            "Low Carbon Steel": { direct: 0.3, indirect: 0.1, total: 0.4 },
        },
        aluminium: {
            "Primary Aluminium": { direct: 7.0, indirect: 5.0, total: 12.0 },
            "Secondary Aluminium": { direct: 0.3, indirect: 0.2, total: 0.5 },
            "Aluminium Alloy": { direct: 5.0, indirect: 3.0, total: 8.0 },
            "Low Carbon Aluminium": { direct: 2.0, indirect: 2.0, total: 4.0 },
        },
    };

    const getMaterialTypeOptions = () => {
        if (selectedMaterialCategory === "iron_steel") {
            return [
                "BF-BOF Steel",
                "EAF Steel",
                "Stainless Steel",
                "Low Carbon Steel",
            ];
        } else if (selectedMaterialCategory === "aluminium") {
            return [
                "Primary Aluminium",
                "Secondary Aluminium",
                "Aluminium Alloy",
                "Low Carbon Aluminium",
            ];
        }
        return ["Generic Material"];
    };

    const [suppliers, setSuppliers] = useState([
        {
            id: 1,
            name: "Supplier A",
            country: "DE",
            steelType: "BF-BOF Steel",
            quantity: 500,
            directEmissions: 1.6,
            indirectEmissions: 0.2,
            totalEmissions: 1.8,
        },
        {
            id: 2,
            name: "Supplier B",
            country: "FR",
            steelType: "EAF Steel",
            quantity: 300,
            directEmissions: 0.4,
            indirectEmissions: 0.2,
            totalEmissions: 0.6,
        },
    ]);

    const [subcontractors, setSubcontractors] = useState([
        {
            id: 1,
            name: "SubCo Ltd",
            process: "Heat Treatment",
            quantity: 200,
            emissionsFactor: 0.3,
        },
    ]);

    const [energyUse, setEnergyUse] = useState({
        electricity: 500000, // kWh per year
        naturalGas: 800000, // kWh per year
    });

    const [production, setProduction] = useState({
        quantity: 750, // tonnes of finished products
        yield: 0.95, // material efficiency (output/input)
    });

    // Calculation functions
    const calculateSupplierEmissions = () => {
        return suppliers.map((supplier) => ({
            ...supplier,
            directEmissionsTotal: supplier.quantity * supplier.directEmissions,
            indirectEmissionsTotal:
                supplier.quantity * supplier.indirectEmissions,
            emissionsTotal: supplier.quantity * supplier.totalEmissions,
        }));
    };

    const calculateDirectEmissions = () => {
        return {
            electricity: (energyUse.electricity * ELECTRICITY_EF_UK) / 1000, // Convert to tonnes CO2e
            naturalGas: (energyUse.naturalGas * NATURAL_GAS_EF) / 1000,
        };
    };

    const calculateSubcontractorEmissions = () => {
        return subcontractors.map((subcontractor) => ({
            ...subcontractor,
            directEmissionsTotal:
                subcontractor.quantity * subcontractor.emissionsFactor,
            indirectEmissionsTotal: 0,
            emissionsTotal:
                subcontractor.quantity * subcontractor.emissionsFactor,
        }));
    };

    // Calculate total emissions and CBAM impact
    const calculateTotalEmissions = () => {
        const directEmissions = calculateDirectEmissions();
        const supplierEmissionsData = calculateSupplierEmissions();
        const subcontractorEmissionsData = calculateSubcontractorEmissions();

        const totalDirectEmissions =
            directEmissions.electricity + directEmissions.naturalGas;
        const totalSupplierDirectEmissions = supplierEmissionsData.reduce(
            (sum, s) => sum + s.directEmissionsTotal,
            0
        );
        const totalSupplierIndirectEmissions = supplierEmissionsData.reduce(
            (sum, s) => sum + s.indirectEmissionsTotal,
            0
        );
        const totalSupplierEmissions = supplierEmissionsData.reduce(
            (sum, s) => sum + s.emissionsTotal,
            0
        );
        const totalSubcontractorEmissions = subcontractorEmissionsData.reduce(
            (sum, s) => sum + s.emissionsTotal,
            0
        );

        return {
            direct: totalDirectEmissions + totalSupplierDirectEmissions,
            indirect: totalSupplierIndirectEmissions,
            suppliers: totalSupplierEmissions,
            subcontractors: totalSubcontractorEmissions,
            total:
                totalDirectEmissions +
                totalSupplierEmissions +
                totalSubcontractorEmissions,
        };
    };

    const calculateCBAMCertificates = () => {
        const emissions = calculateTotalEmissions();
        const certificatesRequired = emissions.total; // 1 certificate per tonne of CO2e
        const costEUR = certificatesRequired * CBAM_CERTIFICATE_PRICE;
        const costGBP = costEUR / GBP_TO_EUR;

        return {
            certificates: certificatesRequired,
            costEUR,
            costGBP,
            perTonneProductGBP: costGBP / production.quantity,
        };
    };

    // Prepare data for charts
    const prepareEmissionsBreakdownData = () => {
        const emissions = calculateTotalEmissions();
        return [
            {
                name: "Direct (Gas)",
                value: calculateDirectEmissions().naturalGas,
                fill: "#FF8042",
            },
            {
                name: "Direct (Electricity)",
                value: calculateDirectEmissions().electricity,
                fill: "#FFBB28",
            },
            {
                name: "Steel Suppliers (Direct)",
                value: calculateSupplierEmissions().reduce(
                    (sum, s) => sum + s.directEmissionsTotal,
                    0
                ),
                fill: "#0088FE",
            },
            {
                name: "Steel Suppliers (Indirect)",
                value: calculateSupplierEmissions().reduce(
                    (sum, s) => sum + s.indirectEmissionsTotal,
                    0
                ),
                fill: "#8884d8",
            },
            {
                name: "Subcontractors",
                value: emissions.subcontractors,
                fill: "#00C49F",
            },
        ];
    };

    const prepareSuppliersEmissionsData = () => {
        return calculateSupplierEmissions().map((supplier) => ({
            name: supplier.name,
            emissionsTotal: supplier.emissionsTotal,
            // directEmissionsTotal: supplier.directEmissionsTotal,
            // indirectEmissionsTotal: supplier.indirectEmissionsTotal,
            quantity: supplier.quantity,
            intensity: supplier.totalEmissions,
        }));
    };

    // Update the total emissions calculation for supplier type changes
    const updateSupplierTypeEmissions = (supplierId, newType) => {
        if (
            DEFAULT_EMISSION_FACTORS[selectedMaterialCategory] &&
            DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][newType]
        ) {
            const emissionFactors =
                DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][newType];

            updateSupplier(
                supplierId,
                "directEmissions",
                emissionFactors.direct
            );
            updateSupplier(
                supplierId,
                "indirectEmissions",
                emissionFactors.indirect
            );
            updateSupplier(supplierId, "totalEmissions", emissionFactors.total);
        }
    };

    // Handle when total emissions are directly entered
    const updateTotalEmissionsDirectly = (supplierId, newTotal) => {
        const supplier = suppliers.find((s) => s.id === supplierId);
        if (!supplier) return;

        // If direct and indirect are both 0, assign all to direct
        if (
            supplier.directEmissions === 0 &&
            supplier.indirectEmissions === 0
        ) {
            updateSupplier(supplierId, "directEmissions", newTotal);
        }
        // Otherwise, maintain the proportion between direct and indirect
        else if (supplier.totalEmissions > 0) {
            const directProportion =
                supplier.directEmissions / supplier.totalEmissions;
            const newDirect = newTotal * directProportion;
            const newIndirect = newTotal - newDirect;

            updateSupplier(supplierId, "directEmissions", newDirect);
            updateSupplier(supplierId, "indirectEmissions", newIndirect);
        }
    };

    // Handler for adding a new supplier
    const addSupplier = () => {
        const newId =
            suppliers.length > 0
                ? Math.max(...suppliers.map((s) => s.id)) + 1
                : 1;

        setSuppliers([
            ...suppliers,
            {
                id: newId,
                name: "",
                country: countryCode,
                steelType: "",
                quantity: 0,
                directEmissions: 0,
                indirectEmissions: 0,
                totalEmissions: 0,
            },
        ]);
    };

    // Handler for removing a supplier
    const removeSupplier = (id) => {
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    };

    // Handler for updating supplier data
    const updateSupplier = (id, field, value) => {
        setSuppliers(
            suppliers.map((supplier) => {
                if (supplier.id !== id) return supplier;

                // Create updated supplier object
                const updatedSupplier = {
                    ...supplier,
                    [field]:
                        field === "quantity" ||
                        field === "directEmissions" ||
                        field === "indirectEmissions" ||
                        field === "totalEmissions"
                            ? parseFloat(value) || 0
                            : value,
                };

                // If selecting a new material type from dropdown, update emission factors
                if (
                    field === "steelType" &&
                    DEFAULT_EMISSION_FACTORS[selectedMaterialCategory] &&
                    DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][value]
                ) {
                    updatedSupplier.directEmissions =
                        DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][
                            value
                        ].direct;
                    updatedSupplier.indirectEmissions =
                        DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][
                            value
                        ].indirect;
                    updatedSupplier.totalEmissions =
                        DEFAULT_EMISSION_FACTORS[selectedMaterialCategory][
                            value
                        ].total;
                }

                // If updating direct or indirect emissions, recalculate total
                if (
                    field === "directEmissions" ||
                    field === "indirectEmissions"
                ) {
                    const directVal =
                        field === "directEmissions"
                            ? parseFloat(value) || 0
                            : supplier.directEmissions || 0;
                    const indirectVal =
                        field === "indirectEmissions"
                            ? parseFloat(value) || 0
                            : supplier.indirectEmissions || 0;
                    updatedSupplier.totalEmissions = directVal + indirectVal;
                }

                // If updating total emissions directly, distribute between direct and indirect
                if (field === "totalEmissions") {
                    const newTotal = parseFloat(value) || 0;

                    // If direct and indirect are both 0, assign all to direct
                    if (
                        (supplier.directEmissions === 0 ||
                            isNaN(supplier.directEmissions)) &&
                        (supplier.indirectEmissions === 0 ||
                            isNaN(supplier.indirectEmissions))
                    ) {
                        updatedSupplier.directEmissions = newTotal;
                        updatedSupplier.indirectEmissions = 0;
                    }
                    // Otherwise, maintain the proportion between direct and indirect
                    else if (supplier.totalEmissions > 0) {
                        const prevTotal =
                            supplier.directEmissions +
                            supplier.indirectEmissions;
                        const directProportion =
                            supplier.directEmissions / prevTotal;
                        updatedSupplier.directEmissions =
                            newTotal * directProportion;
                        updatedSupplier.indirectEmissions =
                            newTotal - newTotal * directProportion;
                    }
                }

                return updatedSupplier;
            })
        );
    };

    // Handler for updating energy use
    const updateEnergyUse = (field, value) => {
        setEnergyUse({ ...energyUse, [field]: parseFloat(value) });
    };

    // Custom tooltip for charts
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

    // Render the calculator interface
    return (
        <div className='flex flex-col space-y-6 w-full max-w-6xl mx-auto p-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        CBAM Impact Calculator
                    </h1>
                    <p className='text-gray-500'>
                        For UK Steel Products Manufacturers Exporting to the EU
                    </p>
                    asjdhki
                </div>
                <div className='flex items-center px-4 py-2 bg-blue-50 rounded text-blue-700'>
                    {/* <Info className='w-5 h-5 mr-2' /> */}
                    <span>
                        CBAM Certificate: €{CBAM_CERTIFICATE_PRICE}/tonne CO2e
                    </span>
                </div>
            </div>

            <Card>
                <CardContent className='pt-6'>
                    <div className='mb-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Material Category:
                                </label>
                                <select
                                    value={selectedMaterialCategory}
                                    onChange={(e) => {
                                        const newCategory = e.target.value;
                                        setSelectedMaterialCategory(
                                            newCategory
                                        );
                                        // Reset commodity code to the first one in the new category
                                        if (
                                            CBAM_CODES[newCategory] &&
                                            CBAM_CODES[newCategory].length > 0
                                        ) {
                                            setSelectedCommodityCode(
                                                CBAM_CODES[newCategory][0].code
                                            );
                                        }
                                        // Update suppliers with appropriate material types if switching between iron and aluminum
                                        if (
                                            (newCategory === "iron_steel" ||
                                                newCategory === "aluminium") &&
                                            (selectedMaterialCategory ===
                                                "iron_steel" ||
                                                selectedMaterialCategory ===
                                                    "aluminium") &&
                                            newCategory !==
                                                selectedMaterialCategory
                                        ) {
                                            const defaultType =
                                                newCategory === "iron_steel"
                                                    ? "BF-BOF Steel"
                                                    : "Primary Aluminium";
                                            const defaultEmissions =
                                                DEFAULT_EMISSION_FACTORS[
                                                    newCategory
                                                ][defaultType];
                                            setSuppliers(
                                                suppliers.map((s) => ({
                                                    ...s,
                                                    steelType: defaultType,
                                                    directEmissions:
                                                        defaultEmissions.direct,
                                                    indirectEmissions:
                                                        defaultEmissions.indirect,
                                                    totalEmissions:
                                                        defaultEmissions.total,
                                                }))
                                            );
                                        }
                                    }}
                                    className='w-full p-2 border rounded'>
                                    {MATERIAL_CATEGORIES.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    CBAM Certificate Price:
                                </label>
                                <div className='p-2 bg-blue-50 rounded flex items-center'>
                                    {/* <Info className='w-5 h-5 mr-2 text-blue-600' /> */}
                                    <span className='text-sm'>
                                        Current ETS Price:{" "}
                                        <strong>
                                            €{CBAM_CERTIFICATE_PRICE}
                                        </strong>
                                        /tonne CO₂e
                                    </span>
                                </div>
                            </div>
                        </div>

                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Select Product CN Code:
                        </label>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <select
                                value={selectedCommodityCode}
                                onChange={(e) =>
                                    setSelectedCommodityCode(e.target.value)
                                }
                                className='w-full p-2 border rounded'>
                                {CBAM_CODES[selectedMaterialCategory]?.map(
                                    (item) => (
                                        <option
                                            key={item.code}
                                            value={item.code}>
                                            {item.code} - {item.description}
                                        </option>
                                    )
                                )}
                            </select>
                            <div className='p-2 bg-gray-50 rounded flex items-center'>
                                {/* <Info className='w-5 h-5 mr-2 text-blue-600' /> */}
                                <span className='text-sm'>
                                    Selected CN Code:{" "}
                                    <strong>{selectedCommodityCode}</strong> -{" "}
                                    {
                                        CBAM_CODES[
                                            selectedMaterialCategory
                                        ]?.find(
                                            (c) =>
                                                c.code === selectedCommodityCode
                                        )?.description
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Alert className='bg-yellow-50 border-yellow-200'>
                {/* <AlertCircle className='h-4 w-4 text-yellow-800' /> */}
                <AlertDescription className='text-yellow-800'>
                    The EU CBAM reporting phase is active. Financial obligations
                    begin January 2026.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue='dashboard'>
                <TabsList className='mb-4'>
                    <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
                    <TabsTrigger value='suppliers'>Steel Suppliers</TabsTrigger>
                    <TabsTrigger value='operations'>Operations</TabsTrigger>
                    <TabsTrigger value='cbam'>CBAM Impact</TabsTrigger>
                    <TabsTrigger value='eu-report'>EU Report</TabsTrigger>
                </TabsList>

                <TabsContent value='dashboard' className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Emissions Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='h-64'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'>
                                        <PieChart>
                                            <Pie
                                                data={prepareEmissionsBreakdownData()}
                                                cx='50%'
                                                cy='50%'
                                                labelLine={false}
                                                outerRadius={80}
                                                fill='#8884d8'
                                                dataKey='value'
                                                label={({ name, percent }) =>
                                                    `${name}: ${(
                                                        percent * 100
                                                    ).toFixed(1)}%`
                                                }>
                                                {prepareEmissionsBreakdownData().map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.fill}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                content={<CustomTooltip />}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className='mt-4 p-4 bg-gray-50 rounded'>
                                    <h3 className='font-semibold mb-2'>
                                        Carbon Footprint Summary
                                    </h3>
                                    <p className='text-lg font-bold'>
                                        {calculateTotalEmissions().total.toFixed(
                                            2
                                        )}{" "}
                                        tonnes CO2e
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Carbon intensity:{" "}
                                        {(
                                            calculateTotalEmissions().total /
                                            production.quantity
                                        ).toFixed(2)}{" "}
                                        tonnes CO2e per tonne of product
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>CBAM Impact</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='h-64'>
                                    <ResponsiveContainer
                                        width='100%'
                                        height='100%'>
                                        <BarChart
                                            data={[
                                                {
                                                    name: "Supplier Emissions",
                                                    cost:
                                                        calculateCBAMCertificates()
                                                            .costGBP *
                                                        (calculateTotalEmissions()
                                                            .suppliers /
                                                            calculateTotalEmissions()
                                                                .total),
                                                },
                                                {
                                                    name: "Direct Emissions",
                                                    cost:
                                                        calculateCBAMCertificates()
                                                            .costGBP *
                                                        (calculateTotalEmissions()
                                                            .direct /
                                                            calculateTotalEmissions()
                                                                .total),
                                                },
                                                {
                                                    name: "Subcontractor",
                                                    cost:
                                                        calculateCBAMCertificates()
                                                            .costGBP *
                                                        (calculateTotalEmissions()
                                                            .subcontractors /
                                                            calculateTotalEmissions()
                                                                .total),
                                                },
                                            ]}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}>
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='name' />
                                            <YAxis
                                                label={{
                                                    value: "Cost (£)",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                }}
                                            />
                                            <Tooltip
                                                formatter={(value) =>
                                                    `£${value.toFixed(2)}`
                                                }
                                            />
                                            <Bar
                                                dataKey='cost'
                                                fill='#8884d8'
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className='mt-4 p-4 bg-gray-50 rounded'>
                                    <h3 className='font-semibold mb-2'>
                                        CBAM Financial Impact
                                    </h3>
                                    <p className='text-lg font-bold'>
                                        £
                                        {calculateCBAMCertificates().costGBP.toFixed(
                                            2
                                        )}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        Added cost: £
                                        {calculateCBAMCertificates().perTonneProductGBP.toFixed(
                                            2
                                        )}{" "}
                                        per tonne of product
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Supply Chain Carbon Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='h-64'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart
                                        data={prepareSuppliersEmissionsData()}
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
                                        <Bar
                                            dataKey='emissionsTotal'
                                            name='Emissions (tonnes CO2e)'
                                            fill='#8884d8'
                                        />
                                        <Bar
                                            dataKey='quantity'
                                            name='Quantity (tonnes)'
                                            fill='#82ca9d'
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='suppliers' className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-semibold'>
                            {selectedMaterialCategory === "iron_steel"
                                ? "Steel"
                                : selectedMaterialCategory === "aluminium"
                                ? "Aluminium"
                                : "Material"}{" "}
                            Suppliers
                        </h2>
                        <Button
                            onClick={addSupplier}
                            className='flex items-center'>
                            {/* <Plus className='w-4 h-4 mr-2' /> */}
                            Add Supplier
                        </Button>
                    </div>

                    <div className='space-y-4'>
                        {suppliers.map((supplier) => (
                            <Card key={supplier.id}>
                                <CardContent className='pt-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Supplier Name
                                            </label>
                                            <input
                                                type='text'
                                                value={supplier.name}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                placeholder='Enter supplier name'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Country
                                            </label>
                                            <input
                                                type='text'
                                                value={supplier.country}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "country",
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                maxLength={2}
                                                placeholder='Country code (e.g. DE, FR)'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Material Type
                                            </label>
                                            <select
                                                value={supplier.steelType}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "steelType",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'>
                                                <option value=''>
                                                    Select material type
                                                </option>
                                                {getMaterialTypeOptions().map(
                                                    (type) => (
                                                        <option
                                                            key={type}
                                                            value={type}>
                                                            {type}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Quantity (tonnes)
                                            </label>
                                            <input
                                                type='number'
                                                value={supplier.quantity}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                placeholder='Enter quantity'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Direct Emissions (tCO2e/t)
                                            </label>
                                            <input
                                                type='number'
                                                step='0.001'
                                                value={supplier.directEmissions}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "directEmissions",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                placeholder='Direct emissions factor'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Indirect Emissions (tCO2e/t)
                                            </label>
                                            <input
                                                type='number'
                                                step='0.001'
                                                value={
                                                    supplier.indirectEmissions
                                                }
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "indirectEmissions",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                placeholder='Indirect emissions factor'
                                            />
                                        </div>
                                        <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Total Emissions (tCO2e/t)
                                            </label>
                                            <input
                                                type='number'
                                                step='0.001'
                                                value={supplier.totalEmissions}
                                                onChange={(e) =>
                                                    updateSupplier(
                                                        supplier.id,
                                                        "totalEmissions",
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-2 border rounded'
                                                placeholder='Total emissions factor'
                                            />
                                        </div>
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        <div className='p-3 bg-gray-50 rounded flex flex-col sm:flex-row sm:space-x-6'>
                                            <div>
                                                <span className='font-semibold text-sm'>
                                                    Total Direct:{" "}
                                                </span>
                                                <span className='text-sm'>
                                                    {isNaN(
                                                        supplier.quantity *
                                                            supplier.directEmissions
                                                    )
                                                        ? "-"
                                                        : (
                                                              supplier.quantity *
                                                              supplier.directEmissions
                                                          ).toFixed(2)}{" "}
                                                    tCO2e
                                                </span>
                                            </div>
                                            <div>
                                                <span className='font-semibold text-sm'>
                                                    Total Indirect:{" "}
                                                </span>
                                                <span className='text-sm'>
                                                    {isNaN(
                                                        supplier.quantity *
                                                            supplier.indirectEmissions
                                                    )
                                                        ? "-"
                                                        : (
                                                              supplier.quantity *
                                                              supplier.indirectEmissions
                                                          ).toFixed(2)}{" "}
                                                    tCO2e
                                                </span>
                                            </div>
                                            <div>
                                                <span className='font-semibold text-sm'>
                                                    CBAM Cost:{" "}
                                                </span>
                                                <span className='text-sm'>
                                                    £
                                                    {isNaN(
                                                        supplier.quantity *
                                                            supplier.totalEmissions
                                                    )
                                                        ? "-"
                                                        : (
                                                              (supplier.quantity *
                                                                  supplier.totalEmissions *
                                                                  CBAM_CERTIFICATE_PRICE) /
                                                              GBP_TO_EUR
                                                          ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            variant='destructive'
                                            onClick={() =>
                                                removeSupplier(supplier.id)
                                            }
                                            disabled={suppliers.length <= 1}
                                            className='shrink-0'>
                                            {/* <Trash className='w-4 h-4 mr-2' /> */}
                                            Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value='operations' className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Direct Operations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Electricity Use (kWh/year)
                                    </label>
                                    <input
                                        type='number'
                                        value={energyUse.electricity}
                                        onChange={(e) =>
                                            updateEnergyUse(
                                                "electricity",
                                                e.target.value
                                            )
                                        }
                                        className='w-full p-2 border rounded'
                                    />
                                    <p className='mt-2 text-sm text-gray-500'>
                                        UK Grid Emissions Factor:{" "}
                                        {ELECTRICITY_EF_UK} kg CO2e/kWh
                                    </p>
                                    <p className='mt-1 font-medium'>
                                        Total:{" "}
                                        {(
                                            (energyUse.electricity *
                                                ELECTRICITY_EF_UK) /
                                            1000
                                        ).toFixed(2)}{" "}
                                        tonnes CO2e
                                    </p>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Natural Gas Use (kWh/year)
                                    </label>
                                    <input
                                        type='number'
                                        value={energyUse.naturalGas}
                                        onChange={(e) =>
                                            updateEnergyUse(
                                                "naturalGas",
                                                e.target.value
                                            )
                                        }
                                        className='w-full p-2 border rounded'
                                    />
                                    <p className='mt-2 text-sm text-gray-500'>
                                        Natural Gas Emissions Factor:{" "}
                                        {NATURAL_GAS_EF} kg CO2e/kWh (based on
                                        IPCC 2006 GL)
                                    </p>
                                    <p className='mt-1 text-sm text-gray-500'>
                                        Natural Gas NCV: {NATURAL_GAS_NCV} GJ/t
                                        (from IPCC 2006 GL)
                                    </p>
                                    <p className='mt-1 font-medium'>
                                        Total:{" "}
                                        {(
                                            (energyUse.naturalGas *
                                                NATURAL_GAS_EF) /
                                            1000
                                        ).toFixed(2)}{" "}
                                        tonnes CO2e
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Production Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Annual Production (tonnes)
                                    </label>
                                    <input
                                        type='number'
                                        value={production.quantity}
                                        onChange={(e) =>
                                            setProduction({
                                                ...production,
                                                quantity: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className='w-full p-2 border rounded'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Material Yield (%)
                                    </label>
                                    <input
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        max='1'
                                        value={production.yield}
                                        onChange={(e) =>
                                            setProduction({
                                                ...production,
                                                yield: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className='w-full p-2 border rounded'
                                    />
                                    <p className='mt-2 text-sm text-gray-500'>
                                        Material efficiency ratio between output
                                        and input
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='cbam' className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>CBAM Certificate Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='p-4 bg-blue-50 rounded border border-blue-100'>
                                    <h3 className='text-lg font-semibold mb-2'>
                                        Certificate Summary
                                    </h3>
                                    <p className='mb-2'>
                                        <span className='font-medium'>
                                            Total Emissions:
                                        </span>{" "}
                                        {calculateTotalEmissions().total.toFixed(
                                            2
                                        )}{" "}
                                        tonnes CO2e
                                    </p>
                                    <p className='mb-2'>
                                        <span className='font-medium'>
                                            CBAM Certificates Required:
                                        </span>{" "}
                                        {calculateCBAMCertificates().certificates.toFixed(
                                            2
                                        )}
                                    </p>
                                    <p className='mb-2'>
                                        <span className='font-medium'>
                                            Cost (EUR):
                                        </span>{" "}
                                        €
                                        {calculateCBAMCertificates().costEUR.toFixed(
                                            2
                                        )}
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            Cost (GBP):
                                        </span>{" "}
                                        £
                                        {calculateCBAMCertificates().costGBP.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>

                                <div className='p-4 rounded border'>
                                    <h3 className='text-lg font-semibold mb-2'>
                                        Product Impact
                                    </h3>
                                    <p className='mb-2'>
                                        <span className='font-medium'>
                                            Added Cost per Tonne:
                                        </span>{" "}
                                        £
                                        {calculateCBAMCertificates().perTonneProductGBP.toFixed(
                                            2
                                        )}
                                    </p>
                                    <p className='mb-2'>
                                        <span className='font-medium'>
                                            Added Cost per Tonne:
                                        </span>{" "}
                                        €
                                        {(
                                            calculateCBAMCertificates()
                                                .perTonneProductGBP * GBP_TO_EUR
                                        ).toFixed(2)}
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            Carbon Intensity:
                                        </span>{" "}
                                        {(
                                            calculateTotalEmissions().total /
                                            production.quantity
                                        ).toFixed(2)}{" "}
                                        tonnes CO2e/tonne product
                                    </p>
                                </div>
                            </div>

                            <div className='mt-6 p-4 bg-yellow-50 rounded border border-yellow-100'>
                                <h3 className='text-lg font-semibold mb-2'>
                                    CBAM Timeline
                                </h3>
                                <div className='space-y-2'>
                                    <p>
                                        <span className='font-medium'>
                                            Oct 1, 2023 - Dec 31, 2025:
                                        </span>{" "}
                                        Transitional phase (reporting only)
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            Jan 1, 2026:
                                        </span>{" "}
                                        Financial adjustment begins (phased
                                        implementation)
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            2026 - 2034:
                                        </span>{" "}
                                        Gradual phase-in of CBAM as EU ETS free
                                        allowances phase out
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            2034:
                                        </span>{" "}
                                        Full implementation with 100% of
                                        embedded emissions subject to CBAM
                                    </p>
                                </div>
                            </div>

                            <div className='mt-6'>
                                <h3 className='text-lg font-semibold mb-4'>
                                    CBAM Optimization Opportunities
                                </h3>

                                <div className='space-y-3'>
                                    <div className='p-3 bg-green-50 rounded border border-green-100'>
                                        <p className='font-medium'>
                                            Switch to lower-carbon steel
                                            suppliers
                                        </p>
                                        <p className='text-sm'>
                                            Potential savings: £
                                            {(
                                                ((calculateSupplierEmissions().find(
                                                    (s) =>
                                                        s.totalEmissions ===
                                                        Math.max(
                                                            ...suppliers.map(
                                                                (s) =>
                                                                    s.totalEmissions
                                                            )
                                                        )
                                                )?.emissionsTotal -
                                                    calculateSupplierEmissions().find(
                                                        (s) =>
                                                            s.totalEmissions ===
                                                            Math.min(
                                                                ...suppliers.map(
                                                                    (s) =>
                                                                        s.totalEmissions
                                                                )
                                                            )
                                                    )?.emissionsTotal || 0) *
                                                    CBAM_CERTIFICATE_PRICE) /
                                                GBP_TO_EUR
                                            ).toFixed(2)}{" "}
                                            by switching to EAF steel
                                        </p>
                                    </div>

                                    <div className='p-3 bg-green-50 rounded border border-green-100'>
                                        <p className='font-medium'>
                                            Improve energy efficiency
                                        </p>
                                        <p className='text-sm'>
                                            10% reduction in energy use would
                                            save £
                                            {(
                                                ((calculateDirectEmissions()
                                                    .electricity +
                                                    calculateDirectEmissions()
                                                        .naturalGas) *
                                                    0.1 *
                                                    CBAM_CERTIFICATE_PRICE) /
                                                GBP_TO_EUR
                                            ).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className='p-3 bg-green-50 rounded border border-green-100'>
                                        <p className='font-medium'>
                                            Improve material yield
                                        </p>
                                        <p className='text-sm'>
                                            5% improvement in material
                                            efficiency could reduce embedded
                                            emissions by approximately{" "}
                                            {(
                                                calculateTotalEmissions()
                                                    .suppliers * 0.05
                                            ).toFixed(2)}{" "}
                                            tonnes CO2e
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='eu-report' className='space-y-6'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle>EU CBAM Report</CardTitle>
                            <div className='flex space-x-2'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Electricity Source:
                                    </label>
                                    <select
                                        value={electricitySource}
                                        onChange={(e) =>
                                            setElectricitySource(e.target.value)
                                        }
                                        className='p-2 border rounded text-sm'>
                                        <option value='D.4(a)'>
                                            D.4(a) - EF based on IEA data
                                        </option>
                                        <option value='D.4(b)'>
                                            D.4(b) - EF based on other publicly
                                            available data
                                        </option>
                                        <option value='D.4.1'>
                                            D.4.1 - EF of electricity produced
                                            in installation (no cogeneration)
                                        </option>
                                        <option value='D.4.2'>
                                            D.4.2 - EF of electricity produced
                                            by cogeneration
                                        </option>
                                        <option value='Mix'>
                                            Mix - Determined as mix of methods
                                            above
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Country Code:
                                    </label>
                                    <input
                                        type='text'
                                        value={countryCode}
                                        onChange={(e) =>
                                            setCountryCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        maxLength={2}
                                        className='p-2 border rounded text-sm w-16 text-center'
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='overflow-x-auto'>
                                <Alert className='mb-4 bg-blue-50 border-blue-200'>
                                    {/* <Info className='h-4 w-4 text-blue-800' /> */}
                                    <AlertDescription className='text-blue-800'>
                                        This report follows the exact format
                                        required by the EU CBAM reporting
                                        template.
                                    </AlertDescription>
                                </Alert>

                                <table className='w-full border-collapse text-sm'>
                                    <thead>
                                        <tr className='bg-gray-100'>
                                            <th
                                                colSpan='2'
                                                className='border p-2 text-left bg-gray-200'>
                                                Product Information
                                            </th>
                                            <th className='border p-2 text-center'>
                                                Mass share
                                                <br />
                                                t/t
                                            </th>
                                            <th className='border p-2 text-center'>
                                                (Share of)
                                                <br />
                                                Default value
                                            </th>
                                            <th className='border p-2 text-center'>
                                                SEE (direct)
                                                <br />
                                                tCO2e/t
                                            </th>
                                            <th className='border p-2 text-center'>
                                                SEE
                                                <br />
                                                (indirect)
                                                <br />
                                                tCO2e/t
                                            </th>
                                            <th className='border p-2 text-center'>
                                                SEE (total)
                                                <br />
                                                tCO2e/t
                                            </th>
                                            <th className='border p-2 text-center'>
                                                EmbEm
                                                <br />
                                                (direct)
                                                <br />
                                                tCO2e
                                            </th>
                                            <th className='border p-2 text-center'>
                                                EmbEm
                                                <br />
                                                (indirect)
                                                <br />
                                                tCO2e
                                            </th>
                                            <th className='border p-2 text-center'>
                                                EmbEm
                                                <br />
                                                (total)
                                                <br />
                                                tCO2e
                                            </th>
                                            <th className='border p-2 text-center'>
                                                Source of
                                                <br />
                                                electricity
                                                <br />
                                                EF
                                            </th>
                                            <th className='border p-2 text-center'>
                                                Embedded
                                                <br />
                                                electricity
                                                <br />
                                                MWh/t
                                            </th>
                                            <th className='border p-2 text-center'>
                                                Country
                                                <br />
                                                code
                                            </th>
                                            <th className='border p-2 text-center'>
                                                CP due
                                                <br />
                                                (per produced t<br />
                                                or MWh)
                                            </th>
                                            <th className='border p-2 text-center'>
                                                Rebate
                                                <br />
                                                (per produced t<br />
                                                or MWh)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Main product row */}
                                        <tr className='font-medium bg-gray-50'>
                                            <td
                                                colSpan='2'
                                                className='border p-2'>
                                                {selectedMaterialCategory ===
                                                "iron_steel"
                                                    ? "Iron or steel products"
                                                    : selectedMaterialCategory ===
                                                      "aluminium"
                                                    ? "Aluminium products"
                                                    : selectedMaterialCategory ===
                                                      "cement"
                                                    ? "Cement"
                                                    : selectedMaterialCategory ===
                                                      "fertilisers"
                                                    ? "Fertilisers"
                                                    : "Hydrogen"}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                -
                                            </td>
                                            <td className='border p-2 text-center'>
                                                0%
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {(
                                                    calculateDirectEmissions()
                                                        .naturalGas /
                                                    production.quantity
                                                ).toFixed(3)}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {(
                                                    calculateDirectEmissions()
                                                        .electricity /
                                                    production.quantity
                                                ).toFixed(3)}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {(
                                                    calculateTotalEmissions()
                                                        .total /
                                                    production.quantity
                                                ).toFixed(3)}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {calculateDirectEmissions().naturalGas.toFixed(
                                                    3
                                                )}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {calculateDirectEmissions().electricity.toFixed(
                                                    3
                                                )}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {calculateTotalEmissions().total.toFixed(
                                                    3
                                                )}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {electricitySource}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {(
                                                    energyUse.electricity /
                                                    1000 /
                                                    production.quantity
                                                ).toFixed(3)}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                {countryCode}
                                            </td>
                                            <td className='border p-2 text-center'>
                                                0.00
                                            </td>
                                            <td className='border p-2 text-center'>
                                                0.00
                                            </td>
                                        </tr>
                                        {/* TO DO:  Need to enter user's production emissions */}
                                        {/* Material type breakdown rows */}
                                        {suppliers.map((supplier, index) => (
                                            <tr key={supplier.id}>
                                                <td className='border p-2'>
                                                    {supplier.name || "-"}
                                                </td>
                                                <td className='border p-2'>
                                                    {selectedMaterialCategory ===
                                                    "iron_steel"
                                                        ? "Iron or steel products"
                                                        : selectedMaterialCategory ===
                                                          "aluminium"
                                                        ? "Aluminium products"
                                                        : selectedMaterialCategory ===
                                                          "cement"
                                                        ? "Cement"
                                                        : selectedMaterialCategory ===
                                                          "fertilisers"
                                                        ? "Fertilisers"
                                                        : "Hydrogen"}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {(
                                                        supplier.quantity /
                                                            suppliers.reduce(
                                                                (sum, s) =>
                                                                    sum +
                                                                    (s.quantity ||
                                                                        0),
                                                                0
                                                            ) || 0
                                                    ).toFixed(3)}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    FALSE
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {supplier.directEmissions
                                                        ? supplier.directEmissions.toFixed(
                                                              3
                                                          )
                                                        : "0.000"}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {supplier.indirectEmissions
                                                        ? supplier.indirectEmissions.toFixed(
                                                              3
                                                          )
                                                        : "0.000"}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {supplier.totalEmissions
                                                        ? supplier.totalEmissions.toFixed(
                                                              3
                                                          )
                                                        : "0.000"}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {(
                                                        supplier.quantity *
                                                            supplier.directEmissions ||
                                                        0
                                                    ).toFixed(3)}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {(
                                                        supplier.quantity *
                                                            supplier.indirectEmissions ||
                                                        0
                                                    ).toFixed(3)}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {(
                                                        supplier.quantity *
                                                            supplier.totalEmissions ||
                                                        0
                                                    ).toFixed(3)}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {electricitySource}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {supplier.indirectEmissions
                                                        ? (
                                                              (supplier.indirectEmissions /
                                                                  ELECTRICITY_EF_UK) *
                                                              1000
                                                          ).toFixed(3)
                                                        : "0.000"}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    {supplier.country ||
                                                        countryCode}
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    0.00
                                                </td>
                                                <td className='border p-2 text-center'>
                                                    0.00
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='mt-6 p-4 bg-yellow-50 rounded border border-yellow-100'>
                                <h3 className='text-lg font-semibold mb-2'>
                                    Guide to Key Fields
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                    <div>
                                        <p className='font-medium'>
                                            SEE (direct)
                                        </p>
                                        <p className='text-gray-600'>
                                            Specific direct emissions from
                                            processes at your facility
                                        </p>
                                    </div>
                                    <div>
                                        <p className='font-medium'>
                                            SEE (indirect)
                                        </p>
                                        <p className='text-gray-600'>
                                            Specific indirect emissions from
                                            electricity use
                                        </p>
                                    </div>
                                    <div>
                                        <p className='font-medium'>
                                            EmbEm (direct)
                                        </p>
                                        <p className='text-gray-600'>
                                            Total embedded direct emissions (SEE
                                            direct × quantity)
                                        </p>
                                    </div>
                                    <div>
                                        <p className='font-medium'>
                                            EmbEm (indirect)
                                        </p>
                                        <p className='text-gray-600'>
                                            Total embedded indirect emissions
                                            (SEE indirect × quantity)
                                        </p>
                                    </div>
                                    <div>
                                        <p className='font-medium'>
                                            Source of electricity EF
                                        </p>
                                        <p className='text-gray-600'>
                                            The method used to determine
                                            electricity emissions factor
                                        </p>
                                    </div>
                                    <div>
                                        <p className='font-medium'>
                                            Embedded electricity
                                        </p>
                                        <p className='text-gray-600'>
                                            Amount of electricity consumed per
                                            tonne of product
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 p-4 bg-blue-50 rounded border border-blue-100'>
                                <h3 className='text-lg font-semibold mb-2'>
                                    References
                                </h3>
                                <div className='space-y-2 text-sm'>
                                    <p>
                                        <span className='font-medium'>
                                            Natural Gas Emissions Factor:
                                        </span>{" "}
                                        56.1 tCO2/TJ (converted to kg CO2e/kWh)
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            Natural Gas NCV:
                                        </span>{" "}
                                        48.0 GJ/t
                                    </p>
                                    <p>
                                        <span className='font-medium'>
                                            Source:
                                        </span>{" "}
                                        IPCC 2006 Guidelines for National
                                        Greenhouse Gas Inventories, as
                                        referenced in Annex VIII of EU CBAM
                                        regulations
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        IPCC 2006 GL refers to the
                                        Intergovernmental Panel on Climate
                                        Change's 2006 Guidelines for National
                                        Greenhouse Gas Inventories, which is the
                                        internationally recognized standard for
                                        emissions calculations.
                                    </p>
                                </div>
                            </div>

                            <div className='mt-6 flex justify-end'>
                                <Button className='flex items-center'>
                                    Export Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
