import { useState, useRef } from "react";
import { CBAMSummary } from "components/pages/CBAMCalculation/CBAMSummary";
import { calculateProductCBAMAsync } from "apis/productsAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "layout/AppHeader";
import { PRODUCT_CBAM_URL } from "assets/appUrls";
import { Wizard } from "components/Wizard";
import { ProductProcessForm } from "components/pages/CBAMCalculation/ProductProcessForm";
import { SupplierForm } from "components/pages/CBAMCalculation/SuppliersForm";
import { SubcontractorForm } from "components/pages/CBAMCalculation/SubcontractorForm";
import {
    addProductionProcessTemplate,
    addSubcontractorsTemplate,
    addSupplierTemplate,
    cbamSummaryKeys,
} from "assets/formTemplates";

export function AddProductCBAM() {
    const productRef = useRef();
    const subcontractorRef = useRef();
    const supplierRef = useRef();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [submitError, setSubmitError] = useState("");
    const [cbamFormData, setCBAMFormData] = useState({
        production_process: { ...addProductionProcessTemplate },
        subcontractors: [{ ...addSubcontractorsTemplate }],
        suppliers: [{ ...addSupplierTemplate }],
    });

    const handleFormSubmit = async (stepName, formRef) => {
        if (stepName === "cbam_summary") {
            await handleAddProduct(cbamFormData);
            return true;
        }
        if (formRef?.current) {
            await formRef.current.submitForm();
            if (formRef?.current?.isValid) {
                let values =
                    formRef?.current?.values?.[stepName] ??
                    formRef?.current?.values;
                setCBAMFormData((prevState) => ({
                    ...prevState,
                    [stepName]: values,
                }));
                return true;
            } else {
                return false;
            }
        }
    };
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

    const handleExit = () => navigate(state?.from ?? PRODUCT_CBAM_URL);
    const productCBAMSteps = [
        {
            title: "Production Process",
            children: (
                <ProductProcessForm
                    formikRef={productRef}
                    initialValues={cbamFormData?.production_process}
                    template={addProductionProcessTemplate}
                />
            ),
            onSubmit: () => handleFormSubmit("production_process", productRef),
        },
        {
            title: "Subcontractor Details",
            children: (
                <SubcontractorForm
                    formikRef={subcontractorRef}
                    initialValues={cbamFormData?.subcontractors}
                    template={addSubcontractorsTemplate}
                />
            ),
            onSubmit: () =>
                handleFormSubmit("subcontractors", subcontractorRef),
        },
        {
            title: "Supplier Details",
            children: (
                <SupplierForm
                    formikRef={supplierRef}
                    initialValues={cbamFormData?.suppliers}
                    template={addSupplierTemplate}
                    materialCategory={
                        cbamFormData?.production_process?.material_category
                    }
                />
            ),
            onSubmit: () => handleFormSubmit("suppliers", supplierRef),
        },
        {
            title: "Product CBAM Summary",
            children: (
                <CBAMSummary
                    data={cbamFormData}
                    cbamKeys={cbamSummaryKeys}
                    onSubmit={handleAddProduct}
                    error={submitError}
                />
            ),

            onSubmit: () => handleFormSubmit("cbam_summary"),
        },
    ];

    return (
        <div>
            <AppHeader
                header='Calculate Product CBAM'
                showBack
                onBackClick={handleExit}
            />
            <div className='max-w-full m-[auto]'>
                <Wizard steps={productCBAMSteps} />
            </div>
        </div>
    );
}
