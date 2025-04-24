import * as Yup from "yup";
export const registerSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    full_name: Yup.string().required("Name is required"),
});

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const productionSchema = Yup.object({
    annual_production: Yup.number().required(
        "Annual Market Production is required"
    ),
    energy_used: Yup.number("Energy used must be a number.")
        .required("Energy used is required")
        .min(1),
    material_category: Yup.string().required("Material Category is required"),
    fuel_type: Yup.string().required("Fuel type used is require"),
    product_cn_code: Yup.string().required("Product CN Code is required"),
    electricity_used: Yup.number().required("Electricity used is required."),
    electricity_source: Yup.string().required(
        "Electricity source is required."
    ),
});

export const subcontractorSchema = Yup.object({
    subcontractors: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .nullable()
                .test(
                    "at-least-one-filled",
                    "Subcontractor Name is required",
                    function (value) {
                        const { direct_emissions, indirect_emissions } =
                            this.parent;
                        return value || direct_emissions || indirect_emissions
                            ? !!value
                            : true;
                    }
                ),
            direct_emissions: Yup.number("Direct Emissions need to be a number")
                .nullable()
                .test(
                    "at-least-one-filled",
                    "Direct Emissions is required",
                    function (value) {
                        const { name, indirect_emissions } = this.parent;
                        const isValueProvided =
                            value !== null && value !== undefined;
                        return name || indirect_emissions !== null
                            ? isValueProvided
                            : true;
                    }
                ),
            indirect_emissions: Yup.number(
                "Indirect Emissions need to be a number"
            )
                .nullable()
                .test(
                    "at-least-one-filled",
                    "Indirect Emissions is required",
                    function (value) {
                        const { name, direct_emissions } = this.parent;
                        const isValueProvided =
                            value !== null && value !== undefined;
                        return name || direct_emissions !== null
                            ? isValueProvided
                            : true;
                    }
                ),
        })
    ),
});

export const supplierSchema = Yup.object({
    suppliers: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Name of supplier is required."),
            country_code: Yup.string().required(
                "Country of supplier is required"
            ),
            material_type: Yup.string().required("Material type is required."),
            quantity: Yup.number("Quantity needs to be a number").required(
                "Quantity is required"
            ),
            indirect_emissions: Yup.number(
                "Indirect Emissions need to be a number"
            ).required("Indirect Emissions is required"),
            direct_emissions: Yup.number(
                "Direct Emissions need to be a number"
            ).required("Direct Emissions is required"),
        })
    ),
});
