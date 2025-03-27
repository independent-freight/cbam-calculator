import { apiCall } from "./axiosconfig";

export const getApiCall = async (url) => {
    return apiCall.get(url);
};

export const postApiCall = async (url, body = {}, headers = {}) => {
    return apiCall.post(url, body, { headers });
};

export const deleteApiCall = async (url, body = {}) => {
    return apiCall.delete(url, { data: { ...body } });
};

export const putApiCall = async (url, body = {}, headers = {}) => {
    return apiCall.put(url, body, { headers });
};

export const errorHandler = (error, location = "") => {
    if (error?.message === "User is not authorized!" || error?.canceled) {
        return {
            notAuthorized: true,
            status: error?.status ?? "N/A",
            message: error?.message ?? "Something went wrong!",
        };
    } else {
        console.error(
            `Logging ${location} Error: `,
            error?.response?.data?.message ??
                error?.response?.data?.detail ??
                error?.message
        );
        return {
            error:
                error?.response?.data?.message ??
                error?.response?.data?.detail ??
                error?.response?.data ??
                error?.message ??
                "Something went wrong!",
            data: error?.response?.data,
        };
    }
};
