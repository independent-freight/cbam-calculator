export const PRODUCT_CBAM_URL = "/product-cbam";
export const CALCULATE_PRODUCT_CBAM_URL = "/product-cbam/calculate";
export const APP_REGISTER_URL = "/register";
export const APP_HOME_URL = "/";
export const APP_SIGNIN_URL = "/sign-in";
export const APP_RESET_PASSWORD_URL = "/reset-password";
export const APP_PROFILE_URL = "/profile";
export const UPDATE_CALCULATE_PRODUCT_CBAM_URL =
    "/product-cbam/update-calculation";
export const protectedRoutes = [
    PRODUCT_CBAM_URL,
    CALCULATE_PRODUCT_CBAM_URL,
    APP_HOME_URL,
    APP_PROFILE_URL,
];

export const dynamicProtectedRoutes = [/^\/product-cbam\/[a-f0-9]{24}$/];
