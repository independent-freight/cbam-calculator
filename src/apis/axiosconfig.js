import { authorizedApis, authorizedDynamicApis } from "assets/apis";
import axios from "axios";

export const apiCall = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const requiresAuth = (url, method) => {
    // Check if the URL is in the static list
    if (authorizedApis.includes(url)) {
        return true;
    }

    return authorizedDynamicApis.some((pattern) => {
        return Object.keys(pattern)?.length > 0
            ? pattern?.url?.test(url) &&
                  String(method).toLowerCase() ===
                      String(pattern.method).toLowerCase()
            : pattern.test(url);
    });
};

const getToken = () => window.sessionStorage.getItem("token");

apiCall.interceptors.request.use(
    async (config) => {
        if (requiresAuth(config.url, config.method)) {
            config.headers.Authorization = `Bearer ${getToken()}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiCall.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        return Promise.reject(error);
    }
);
