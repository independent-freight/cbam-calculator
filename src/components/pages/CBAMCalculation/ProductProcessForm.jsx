import { WizardForm } from "components/WizardForm";
import productMaterials from "assets/product-materials.json";
import commodities from "assets/commodity-codes.json";
import { formatCommodityCodesDropdown } from "helpers/formatData";
import { productionSchema } from "assets/validation";
import fuelType from "assets/fuel-type.json";
import electrictySources from "assets/electricity-source.json";
import { useState } from "react";

export function ProductProcessForm({ initialValues, formikRef }) {
    const [materialCategory, setMaterialCategory] = useState(
        initialValues?.material_category ?? ""
    );

    const formData = [
        {
            name: "material_category",
            label: "Material Category",
            options: productMaterials,
            setField: (value) => setMaterialCategory(value),
            componentType: "dropdown",
            placeholder: "Select Material",
        },
        {
            name: "product_cn_code",
            label: "Product CN Code",
            options: formatCommodityCodesDropdown(
                commodities[materialCategory] ?? []
            ),
            componentType: "dropdown",
            placeholder: "Select Product CN Code",
        },
        {
            name: "annual_production",
            label: "Annual Production (tonnes)",
            type: "number",
            placeholder: "Annual production in tonnes",
        },
        {
            name: "material_yield",
            label: "Material Yield (%)",
            type: "number",
            placeholder: "Material yield in percentage",
        },
        {
            name: "fuel_type",
            label: "Fuel Type",
            options: fuelType,
            componentType: "dropdown",
            placeholder: "Select fuel used for production",
        },
        {
            name: "energy_used",
            label: "Energy Used (tonnes/year)",
            type: "number",
            placeholder: "Energy used in tonnes",
        },
        {
            name: "electricity_source",
            label: "Electricity Source",
            componentType: "dropdown",
            options: electrictySources,
            placeholder: "Select electricity source used for production",
        },
        {
            name: "electricity_used",
            label: "Electricity Used (kWh/year)",
            type: "number",
            placeholder: "Electricity used in kWh",
        },
    ];
    return (
        <WizardForm
            formikRef={formikRef}
            validation={productionSchema}
            initialValues={initialValues}
            formData={formData}
            formName='production_process'
        />
    );
}
