import { SEND_CALCULATION_EMAIL_URL } from "assets/apis";
import { errorHandler, postApiCall } from "./apiCalls";

export const sendCalculationEmailAsync = async (product, calculations) => {
    try {
        let response = await postApiCall(SEND_CALCULATION_EMAIL_URL, {
            product,
            calculations,
        });
        if (response?.data) {
            return { message: "Successfully send the calculation email." };
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
