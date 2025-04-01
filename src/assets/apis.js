export const LOGIN_URL = "/users/login";
export const REGISTER_URL = "/users/register";
export const REFRESH_TOKEN_URL = "/users/refresh-token";
export const USER_PROFILE_URL = "/users/profile";
export const productCBAMListUrl = (page, limit) =>
    `/product-cbam/list?page=${page}&limit=${limit}`;
export const CBAM_URL = "/product-cbam/";

export const authorizedApis = [USER_PROFILE_URL, CBAM_URL];

export const authorizedDynamicApis = ["^/product-cbam/list?page=d+&limit=d+$"];
