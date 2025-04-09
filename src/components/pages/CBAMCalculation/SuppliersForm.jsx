import { WizardForm } from "components/WizardForm";
import { useState } from "react";
import { supplierSchema } from "assets/validation";
import productMaterialTypes from "assets/product-material-type.json";
import { getSupplierEmissionsAsync } from "apis/suppliersAPI";

export function SupplierForm({
    initialValues,
    onSubmit,
    materialCategory,
    formikRef,
    template,
}) {
    const [initialSupplierData, setInitialSupplierData] = useState({
        suppliers: initialValues,
    });

    const handleFieldArrayPush = () => {
        setInitialSupplierData((prevState) => {
            let newState = {
                suppliers: [...prevState.suppliers, { ...template }],
            };
            return newState;
        });
    };
    const handleFieldArrayRemove = (index) => {
        setInitialSupplierData((prevState) => {
            let newState = {
                suppliers: prevState.suppliers.filter((_, i) => i !== index),
            };

            return newState;
        });
    };

    const handleSupplierFieldChange = async (index, field, value, prevData) => {
        const updatedSuppliers = initialSupplierData?.suppliers.map((item, i) =>
            i === index ? { ...item, ...prevData?.suppliers?.[index] } : item
        );
        updatedSuppliers[index][field] = value;
        if (
            updatedSuppliers[index].name &&
            updatedSuppliers[index].material_type &&
            updatedSuppliers[index]?.name
        ) {
            const response = await getSupplierEmissionsAsync(
                updatedSuppliers[index].material_type,
                updatedSuppliers[index].country_code,
                updatedSuppliers[index].name
            );
            if (response?.data?.indirect_emissions) {
                updatedSuppliers[index].indirect_emissions =
                    response?.data.indirect_emissions;
                updatedSuppliers[index].direct_emissions =
                    response?.data.direct_emissions; // Set the prefetched value
            }

            setInitialSupplierData({ suppliers: [...updatedSuppliers] });
        } else {
            setInitialSupplierData({ suppliers: [...updatedSuppliers] });
        }
    };

    const formData = [
        {
            name: "name",
            label: "Supplier Name",
            type: "text",
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(index, "name", value, prevData);
            },
            placeholder: "Supplier Name",
        },
        {
            name: "country_code",
            label: "Country",
            type: "text",
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(
                    index,
                    "country_code",
                    value,
                    prevData
                );
            },
            placeholder: "Country Code",
        },
        {
            componentType: "dropdown",
            name: "material_type",
            placeholder: "Select material type",
            label: "Material Type",
            options: productMaterialTypes[materialCategory] ?? [],
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(
                    index,
                    "material_type",
                    value,
                    prevData
                );
            },
        },
        {
            name: "quantity",
            label: "Quantity (tonnes)",
            type: "number",
            placeholder: "Quantity in tonnes",
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(index, "quantity", value, prevData);
            },
        },
        {
            name: "indirect_emissions",
            label: "Indirect Emissions (tCO2e/t)",
            type: "number",
            placeholder: "Indirect Emissions in tCO2e/t",
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(
                    index,
                    "indirect_emissions",
                    value,
                    prevData
                );
            },
        },
        {
            name: "direct_emissions",
            label: "Direct Emissions (tCO2e/t)",
            type: "number",
            placeholder: "Direct Emissions in tCO2e/t",
            setField: (value, fieldName, prevData) => {
                const index = parseInt(fieldName.match(/\d+/)[0]);
                handleSupplierFieldChange(
                    index,
                    "direct_emissions",
                    value,
                    prevData
                );
            },
        },
    ];
    return (
        <WizardForm
            formikRef={formikRef}
            validation={supplierSchema}
            initialValues={initialSupplierData}
            formData={formData}
            onSubmit={onSubmit}
            isFieldArray
            dataTemplate={template}
            onFieldArrayPush={handleFieldArrayPush}
            onFieldArrayRemove={handleFieldArrayRemove}
            formName='suppliers'
        />
    );
}
