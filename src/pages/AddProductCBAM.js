import { WizardForm } from "components/WizardForm";
import productMaterials from "assets/product-materials.json";
import commodities from "assets/commodity-codes.json";
import { useMemo, useState } from "react";
import { formatCommodityCodesDropdown } from "helpers/formatData";
import {
    productionSchema,
    subcontractorSchema,
    supplierSchema,
} from "assets/validation";
import productMaterialTypes from "assets/product-material-type.json";
import fuelType from "assets/fuel-type.json";
import { CBAMSummary } from "components/CBAMSummary";

export function AddProductCBAM() {
    const [productMaterial, setProductMaterial] = useState(null);
    const [annualProduction, setAnnualProduction] = useState(null);
    const [cbamState, setCBAMState] = useState(null);
    const [customStep, setCustomStep] = useState(0);
    const [initialFormData, setInitialFormData] = useState({
        production_process: {
            energy_used: null,
            material_category: null,
            product_cn_code: null,
            annual_production: null,
            material_yield: null,
            fuel_type: null,
        },
        subcontractors: [
            { name: null, indirect_emissions: null, direct_emissions: null },
        ],
        suppliers: [
            {
                name: null,
                indirect_emissions: null,
                direct_emissions: null,
                material_type: null,
                quantity: null,
                country: null,
            },
        ],
    });

    const getCBAMFormLabels = () => {
        let valuePairs = {};
        formSteps.forEach((item) => {
            valuePairs = { ...valuePairs, [item?.name]: item?.title };
            item?.fields?.forEach((field) => {
                valuePairs = { ...valuePairs, [field?.name]: field?.label };
            });
        });

        return valuePairs;
    };
    const formSteps = useMemo(
        () => [
            {
                id: "step1",
                title: "Production Process",
                name: "production_process",
                fields: [
                    {
                        name: "annual_production",
                        label: "Annual Production (tonnes)",
                        type: "number",
                        setField: (value) => setAnnualProduction(value),
                        placeholder: "Annual production in tonnes",
                    },
                    {
                        name: "material_yield",
                        label: "Material Yield (%)",
                        type: "number",
                        placeholder: "Material yield in percentage",
                    },
                    {
                        name: "energy_used",
                        label: "Energy Used (tonnes)",
                        type: "number",
                        placeholder: "Energy used in tonnes",
                    },
                    {
                        name: "fuel_type",
                        label: "Fuel Type",
                        options: fuelType,
                        componentType: "dropdown",
                    },
                    {
                        name: "material_category",
                        label: "Material Category",
                        options: productMaterials,
                        setField: (value) => setProductMaterial(value),
                        componentType: "dropdown",
                    },
                    {
                        name: "product_cn_code",
                        label: "Product CN Code",
                        options: formatCommodityCodesDropdown(
                            commodities[productMaterial] ?? []
                        ),
                        componentType: "dropdown",
                    },
                ],
                validationSchema: productionSchema,
            },
            {
                id: "step2",
                title: "Subcontractor Details",
                name: "subcontractors",
                fields: [
                    {
                        name: "name",
                        label: "Subcontractor Name",
                        type: "text",
                    },
                    {
                        name: "direct_emissions",
                        label: "Direct Emissions (tCO2e/t)",
                        type: "text",
                    },
                    {
                        name: "indirect_emissions",
                        label: "Indirect Emissions (tCO2e/t)",
                        type: "text",
                    },
                ],
                componentType: "fieldArray",
                validationSchema: subcontractorSchema,
            },
            {
                id: "step3",
                title: "Supplier Details",
                name: "suppliers",
                componentType: "fieldArray",
                fields: [
                    { name: "name", label: "Supplier Name", type: "text" },
                    {
                        name: "country",
                        label: "Country",
                        type: "text",
                    },
                    {
                        componentType: "dropdown",
                        name: "material_type",
                        placeholder: "Select material type",
                        label: "Material Type",
                        options: productMaterialTypes[productMaterial] ?? [],
                    },
                    {
                        name: "quantity",
                        label: "Quantity (tonnes)",
                        type: "text",
                    },
                    {
                        name: "indirect_emissions",
                        label: "Indirect Emissions (tCO2e/t)",
                        type: "text",
                    },
                    {
                        name: "direct_emissions",
                        label: "Direct Emissions (tCO2e/t)",
                        type: "text",
                    },
                    {
                        name: "total_emissions",
                        label: "Total Emissions (tCO2e/t)",
                        type: "text",
                    },
                ],
                validationSchema: supplierSchema(annualProduction),
            },
        ],
        [productMaterial, annualProduction]
    );
    const handleAddProduct = async (formData) => {};

    const handleGoBack = (data) => {
        setInitialFormData(data);
        setCustomStep(formSteps?.length - 1);
        setCBAMState(null);
    };
    return (
        <div className='max-w-full m-[auto] my-[50px]'>
            {cbamState ? (
                <CBAMSummary
                    data={cbamState}
                    cbamKeys={getCBAMFormLabels(formSteps)}
                    onSubmit={handleAddProduct}
                    goBack={handleGoBack}
                />
            ) : (
                <WizardForm
                    formSteps={formSteps}
                    onSubmit={(data) => setCBAMState({ ...data })}
                    initialValues={initialFormData}
                    customStep={customStep}
                />
            )}
        </div>
    );
}
