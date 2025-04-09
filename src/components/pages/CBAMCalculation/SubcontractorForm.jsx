import { WizardForm } from "components/WizardForm";
import { subcontractorSchema } from "assets/validation";

export function SubcontractorForm({
    initialValues,
    onSubmit,
    formikRef,
    template,
}) {
    const formData = [
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
    ];
    return (
        <WizardForm
            formikRef={formikRef}
            validation={subcontractorSchema}
            initialValues={{ subcontractors: initialValues }}
            formData={formData}
            onSubmit={onSubmit}
            isFieldArray
            dataTemplate={template}
            formName='subcontractors'
        />
    );
}
