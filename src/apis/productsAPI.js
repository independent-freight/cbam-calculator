import { CBAM_URL, productCBAMListUrl } from "assets/apis";
import { errorHandler, getApiCall, postApiCall } from "./apiCalls";

export const getProductCBAMListAsync = async (page, limit) => {
    try {
        let response = await getApiCall(productCBAMListUrl(page, limit));
        if (response?.data) {
            return {
                message: "Sucessfully fetched product CBAMs of user.",
                user: response?.data,
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

export const calculateProductCBAMAsync = async (data) => {
    try {
        let response = await postApiCall(CBAM_URL, { ...data });
        if (response?.data) {
            return {
                message: "Sucessfully calculated CBAM result.",
                user: response?.data,
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
