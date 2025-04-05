import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { useEffect, useState } from "react";
import { setSignin } from "state/userSlice";
import { getUserAsync, logoutAsync } from "apis/usersAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "components/Loader";
import { logoutReset } from "state/storeUtils";
import {
    APP_SIGNIN_URL,
    dynamicProtectedRoutes,
    protectedRoutes,
} from "assets/appUrls";
import navigationList from "assets/navigation-list.json";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const [loggedIn, setLoggedIn] = useState(
        user?.uid || window.sessionStorage.getItem("token") ? true : false
    );
    const [appLoading, setAppLoading] = useState(false);

    const setUpUserToken = async () => {
        let response = await getUserAsync();
        if (response?.user) {
            dispatch(setSignin(response?.user));
            setLoggedIn(true);
        } else {
            handleLogout();
        }
        setAppLoading(false);
    };
    // User logout handled here
    const handleLogout = async () => {
        let response = await logoutAsync();
        if (response?.error) {
            alert("Failed to logout. Try again after some time.");
        } else {
            dispatch(logoutReset());
            sessionStorage.clear();
            setLoggedIn(false);
            navigate(APP_SIGNIN_URL);
        }
    };

    const setupTitle = (link) => {
        let nav = navigationList.find((item) => item?.href === link);
        document.title = nav?.title ?? "CBAM Calculator";
    };

    useEffect(() => {
        setAppLoading(true);
        if (
            (protectedRoutes?.includes(location?.pathname) ||
                dynamicProtectedRoutes.some((pattern) => {
                    return pattern.test(location.pathname);
                })) &&
            !window.sessionStorage.getItem("token")
        ) {
            setLoggedIn(false);
            navigate(APP_SIGNIN_URL);
        }
        setupTitle(location?.pathname);
        setAppLoading(false);
    }, [location.pathname]);

    useEffect(() => {
        setAppLoading(true);
        const token = window.sessionStorage.getItem("token");
        if (!user?.uid && token) setUpUserToken(token);
        else if (user?.uid && token) setLoggedIn(true);
        else handleLogout();
        setAppLoading(false);
    }, [user]);

    return (
        <div className='App'>
            {appLoading ? (
                <Loader />
            ) : (
                <AppRouter
                    loggedIn={loggedIn}
                    isAppLoading={appLoading}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;
