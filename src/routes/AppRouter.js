import AppLayout from "layout/AppLayout";
import { Home } from "pages/Home";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

export function AppRouter({}) {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
