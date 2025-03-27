import AppLayout from "layout/AppLayout";
import { ProductCBAM } from "pages/ProductCBAM";
import { Home } from "pages/Home";
import { Profile } from "pages/Profile";
import { Reports } from "pages/Reports";
import { Signin } from "pages/Signin";
import { Signup } from "pages/Signup";
import { Routes, Route } from "react-router-dom";

export function AppRouter({ loggedIn, onLogout }) {
    return (
        <Routes>
            <Route
                element={<AppLayout loggedIn={loggedIn} onLogout={onLogout} />}>
                <Route path='/' element={<Home />} />
                <Route path='/register' element={<Signup />} />
                <Route path='/sign-in' element={<Signin />} />
                <Route path='/reports' element={<Reports />} />
                <Route path='/cbam' element={<ProductCBAM />} />
                <Route path='/profile' element={<Profile />} />
            </Route>
        </Routes>
    );
}
