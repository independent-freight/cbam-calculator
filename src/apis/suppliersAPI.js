import { SUPPLIER_EMISSION_RATE_URL } from "assets/apis";
import { errorHandler, getApiCall } from "./apiCalls";

export const getSupplierEmissionsAsync = async (
    material_type,
    country_code,
    name
) => {
    try {
        let response = await getApiCall(SUPPLIER_EMISSION_RATE_URL, {
            params: { material_type, country_code, name },
        });
        if (response?.data) {
            return {
                message: "Sucessfully fetched product CBAMs of user.",
                data: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "GET Product CBAM list");
    }
};
