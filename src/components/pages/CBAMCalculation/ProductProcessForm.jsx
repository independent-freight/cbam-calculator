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
            label: "Annual Market Production (tonnes/year)",
            type: "number",
            placeholder: "Annual Market Production (tonnes/year)",
            tooltip: "Total annual production output for the market in tonnes.",
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
            tooltip:
                "Total amount of energy used to manufacture goods over the year",
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
            label: "Electricity Used (MWh/year)",
            tooltip:
                "Total amount of electricity used to manufacture goods over the year",
            type: "number",
            placeholder: "Electricity used in MWh",
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
