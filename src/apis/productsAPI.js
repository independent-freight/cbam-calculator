import {
    CBAM_URL,
    CBAM_LIST_URL,
    cbamDetailsUrl,
    CBAM_KPI_URL,
} from "assets/apis";
import { errorHandler, getApiCall, postApiCall } from "./apiCalls";

export const getProductCBAMListAsync = async (page = 1, limit = 5) => {
    try {
        let response = await getApiCall(CBAM_LIST_URL, {
            params: { page: page, limit: limit },
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

export const calculateProductCBAMAsync = async (data) => {
    try {
        let response = await postApiCall(CBAM_URL, { ...data });
        if (response?.data) {
            return {
                message: "Sucessfully calculated CBAM result.",
                ...response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "CALCULATE Product CBAM list");
    }
};

export const getCBAMDetailsAsync = async (id) => {
    try {
        let response = await getApiCall(cbamDetailsUrl(id));
        if (response?.data) {
            return {
                message: "Sucessfully fetched CBAM data.",
                data: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "GET CBAM Details");
    }
};

export const getProductKPIAsync = async () => {
    try {
        let response = await getApiCall(CBAM_KPI_URL);
        if (response?.data) {
            return {
                message: "Sucessfully fetched KPI data.",
                data: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "GET KPI Details");
    }
};
