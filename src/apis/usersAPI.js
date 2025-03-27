import {
    LOGIN_URL,
    REFRESH_TOKEN_URL,
    REGISTER_URL,
    USER_PROFILE_URL,
} from "assets/apis";
import { errorHandler, getApiCall, postApiCall } from "./apiCalls";
import { signOut } from "firebase/auth";
import { auth } from "config/firebase-config";

export const loginAsync = async (data) => {
    try {
        const response = await postApiCall(LOGIN_URL, data);
        if (response?.data) {
            return { message: "Successfully logged in.", ...response?.data };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? null,
            };
        }
    } catch (error) {
        return errorHandler(error, "LOGIN User");
    }
};

export const registerAsync = async (user) => {
    try {
        const response = await postApiCall(REGISTER_URL, user);

        if (response?.data) {
            return {
                message: "Successfully registered.",
                user: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "REGISTER User");
    }
};

export const refreshTokenAsync = async (token) => {
    try {
        const response = await postApiCall(REFRESH_TOKEN_URL, { token });

        if (response?.data) {
            return {
                message: "Sucessfully fetched token.",
                user: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {
        return errorHandler(error, "REGISTER User");
    }
};

export const logoutAsync = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        return errorHandler(error, "LOGOUT User");
    }
};

export const getUserAsync = async () => {
    try {
        let response = await getApiCall(USER_PROFILE_URL);
        if (response?.data) {
            return {
                message: "Sucessfully fetched user.",
                user: response?.data,
            };
        } else {
            return {
                error: response?.data?.message ?? "Something went wrong!",
                code: response?.data?.code ?? "UI_ERROR",
            };
        }
    } catch (error) {}
};
