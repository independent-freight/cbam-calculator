import { WizardForm } from "components/WizardForm";
import productMaterials from "assets/product-materials.json";
import commodities from "assets/commodity-codes.json";
import { useEffect, useMemo, useState } from "react";
import { formatCommodityCodesDropdown } from "helpers/formatData";
import {
    productionSchema,
    subcontractorSchema,
    supplierSchema,
} from "assets/validation";
import productMaterialTypes from "assets/product-material-type.json";
import fuelType from "assets/fuel-type.json";
import electrictySources from "assets/electricity-source.json";
import { CBAMSummary } from "components/CBAMSummary";
import { calculateProductCBAMAsync } from "apis/productsAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "layout/AppHeader";
import { getSupplierEmissionsAsync } from "apis/suppliersAPI";
import {
    addProductionProcessTemplate,
    addSubcontractorsTemplate,
    addSupplierTemplate,
} from "assets/formTemplates";
import { PRODUCT_CBAM_URL } from "assets/appUrls";

export function AddProductCBAM() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [productMaterial, setProductMaterial] = useState(null);
    const [annualProduction, setAnnualProduction] = useState(null);
    const [cbamState, setCBAMState] = useState(null);
    const [customStep, setCustomStep] = useState(0);
    const [submitError, setSubmitError] = useState("");
    const [initialFormData, setInitialFormData] = useState({
        production_process: {
            ...addProductionProcessTemplate,
        },
        subcontractors: [{ ...addSubcontractorsTemplate }],
        suppliers: [{ ...addSupplierTemplate }],
    });
    // CHECKPOINT
    // const [initialSupplier, setInitialSupplier] = useState();

    const handleSupplierFieldChange = async (index, field, value, prevData) => {
        const updatedSuppliers = initialFormData?.suppliers.map((item, i) =>
            i === index ? { ...item, ...prevData?.suppliers[index] } : item
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

            setInitialFormData({ ...prevData, suppliers: updatedSuppliers });
        } else {
            setInitialFormData({ ...prevData, suppliers: updatedSuppliers });
        }
    };

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

    const handleFieldArrayPush = (template, fieldName) => {
        setInitialFormData((prevState) => {
            let newState = {
                ...prevState,
                [fieldName]: [...prevState[fieldName], { ...template }],
            };
            return newState;
        });
    };
    const handleFieldArrayRemove = (index, fieldName) => {
        setInitialFormData((prevState) => {
            let newState = {
                ...prevState,
                [fieldName]: prevState[fieldName].filter((_, i) => i !== index),
            };

            return newState;
        });
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
                        placeholder:
                            "Select electricity source used for production",
                    },
                    {
                        name: "electricity_used",
                        label: "Electricity Used (kWh/year)",
                        type: "number",
                        placeholder: "Electricity used in kWh",
                    },
                    {
                        name: "material_category",
                        label: "Material Category",
                        options: productMaterials,
                        setField: (value) => setProductMaterial(value),
                        componentType: "dropdown",
                        placeholder: "Select Material",
                    },
                    {
                        name: "product_cn_code",
                        label: "Product CN Code",
                        options: formatCommodityCodesDropdown(
                            commodities[productMaterial] ?? []
                        ),
                        componentType: "dropdown",
                        placeholder: "Select Product CN Code",
                    },
                ],
                validationSchema: productionSchema,
            },
            {
                id: "step2",
                title: "Subcontractor Details",
                name: "subcontractors",
                template: addSubcontractorsTemplate,
                fields: [
                    {
                        name: "name",
                        label: "Subcontractor Name",
                        type: "text",
                        placholder: "Subcontractor Name",
                    },
                    {
                        name: "direct_emissions",
                        label: "Direct Emissions (tCO2e/t)",
                        type: "number",
                        placholder: "Direct Emissions in tCO2e/t",
                    },
                    {
                        name: "indirect_emissions",
                        label: "Indirect Emissions (tCO2e/t)",
                        type: "number",
                        placholder: "Indirect Emissions in tCO2e/t",
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
                template: addSupplierTemplate,
                fields: [
                    {
                        name: "name",
                        label: "Supplier Name",
                        type: "text",
                        setField: (value, fieldName, prevData) => {
                            const index = parseInt(fieldName.match(/\d+/)[0]);
                            handleSupplierFieldChange(
                                index,
                                "name",
                                value,
                                prevData
                            );
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
                        options: productMaterialTypes[productMaterial] ?? [],
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
                            handleSupplierFieldChange(
                                index,
                                "quantity",
                                value,
                                prevData
                            );
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
                ],
                validationSchema: supplierSchema(annualProduction),
            },
        ],
        [productMaterial, annualProduction, initialFormData]
    );
    const handleAddProduct = async (formData) => {
        let response = await calculateProductCBAMAsync(formData);
        if (response?.error) {
            setSubmitError(
                "Failed to calculate Product's CBAM. Please try again after some time."
            );
        } else {
            navigate(`${PRODUCT_CBAM_URL}/${response?._id}`);
        }
    };

    const handleGoBack = (data) => {
        setInitialFormData(data);
        setCustomStep(formSteps?.length - 1);
        setCBAMState(null);
    };
    const handleExit = () => navigate(state?.from ?? PRODUCT_CBAM_URL);
    return (
        <div>
            <AppHeader
                header='Calculate Product CBAM'
                showBack
                onBackClick={handleExit}
            />
            <div className='max-w-full m-[auto]'>
                {cbamState ? (
                    <CBAMSummary
                        data={cbamState}
                        cbamKeys={getCBAMFormLabels(formSteps)}
                        onSubmit={handleAddProduct}
                        goBack={handleGoBack}
                        error={submitError}
                    />
                ) : (
                    <WizardForm
                        formSteps={formSteps}
                        onSubmit={(data) => {
                            setCBAMState({ ...data });
                        }}
                        initialValues={initialFormData}
                        customStep={customStep}
                        onFieldArrayPush={handleFieldArrayPush}
                        onFieldArrayRemove={handleFieldArrayRemove}
                    />
                )}
            </div>
        </div>
    );
}
