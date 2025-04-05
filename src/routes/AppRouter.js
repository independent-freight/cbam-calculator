import AppLayout from "layout/AppLayout";
import { ProductCBAM } from "pages/ProductCBAM";
import { Home } from "pages/Home";
import { Profile } from "pages/Profile";
import { Signin } from "pages/Signin";
import { Signup } from "pages/Signup";
import { Routes, Route } from "react-router-dom";
import { AddProductCBAM } from "pages/AddProductCBAM";
import { ProductCBAMDetails } from "pages/ProductCBAMDetails";
import { ResetPassword } from "pages/ResetPassword";
import {
    APP_HOME_URL,
    APP_PROFILE_URL,
    APP_REGISTER_URL,
    APP_RESET_PASSWORD_URL,
    APP_SIGNIN_URL,
    CALCULATE_PRODUCT_CBAM_URL,
    PRODUCT_CBAM_URL,
} from "assets/appUrls";

export function AppRouter({ loggedIn, onLogout }) {
    return (
        <Routes>
            <Route
                element={<AppLayout loggedIn={loggedIn} onLogout={onLogout} />}>
                {loggedIn && (
                    <>
                        <Route
                            path={PRODUCT_CBAM_URL}
                            element={<ProductCBAM />}
                        />
                        <Route path={APP_PROFILE_URL} element={<Profile />} />
                        <Route
                            path={CALCULATE_PRODUCT_CBAM_URL}
                            element={<AddProductCBAM />}
                        />
                        <Route
                            path={`${PRODUCT_CBAM_URL}/:id`}
                            element={<ProductCBAMDetails />}
                        />
                    </>
                )}
                <Route path={APP_HOME_URL} element={<Home />} />
                <Route path={APP_REGISTER_URL} element={<Signup />} />
                <Route path={APP_SIGNIN_URL} element={<Signin />} />
                <Route
                    path={APP_RESET_PASSWORD_URL}
                    element={<ResetPassword />}
                />
            </Route>
        </Routes>
    );
}
