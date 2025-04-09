import { useState, useRef } from "react";
import { CBAMSummary } from "components/pages/CBAMCalculation/CBAMSummary";
import { updateCBAMCalculation } from "apis/productsAPI";
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
import { useDispatch } from "react-redux";
import { updateCBAMDetails } from "state/productCBAMSlice";

export function UpdateProductCBAM() {
    const dispatch = useDispatch();
    const productRef = useRef();
    const subcontractorRef = useRef();
    const supplierRef = useRef();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { cbamDetails, from = null } = state;
    const [submitError, setSubmitError] = useState("");
    const [cbamFormData, setCBAMFormData] = useState({
        production_process: { ...cbamDetails?.production_process },
        subcontractors: [...cbamDetails?.subcontractors],
        suppliers: [...cbamDetails?.suppliers],
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
        let response = await updateCBAMCalculation(formData, cbamDetails?._id);
        if (response?.error) {
            setSubmitError(
                "Failed to update Product's CBAM calculation. Please try again after some time."
            );
        } else {
            dispatch(
                updateCBAMDetails({
                    id: cbamDetails?._id,
                    data: response?.data,
                })
            );
            navigate(`${PRODUCT_CBAM_URL}/${cbamDetails?._id}`);
        }
    };

    const handleExit = () => navigate(from ?? PRODUCT_CBAM_URL);
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
                <CBAMSummary data={cbamFormData} cbamKeys={cbamSummaryKeys} />
            ),

            onSubmit: () => handleFormSubmit("cbam_summary"),
        },
    ];

    return (
        <div>
            <AppHeader
                header='Update Product CBAM Calculation'
                showBack
                onBackClick={handleExit}
            />
            <div className='max-w-full m-[auto]'>
                <Wizard steps={productCBAMSteps} submitError={submitError} />
            </div>
        </div>
    );
}
