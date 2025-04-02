export const LOGIN_URL = "/users/login";
export const REGISTER_URL = "/users/register";
export const REFRESH_TOKEN_URL = "/users/refresh-token";
export const USER_PROFILE_URL = "/users/profile";
export const CBAM_LIST_URL = "/product-cbam/list";
export const productCBAMListUrl = (page, limit) =>
    `/product-cbam/list?page=${page}&limit=${limit}`;
export const CBAM_URL = "/product-cbam/create";
export const cbamDetailsUrl = (id) => `/product-cbam/${id}`;

export const authorizedApis = [USER_PROFILE_URL, CBAM_URL, CBAM_LIST_URL];

export const authorizedDynamicApis = [/^\/product-cbam\/[a-f0-9]{24}$/];
