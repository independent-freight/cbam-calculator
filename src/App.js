import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { useEffect, useState } from "react";
import { setSignin } from "state/userSlice";
import { getUserAsync, logoutAsync } from "apis/usersAPI";
import { useNavigate } from "react-router-dom";
import { Loader } from "components/Loader";
import { logoutReset } from "state/storeUtils";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            navigate("/sign-in");
        }
    };

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
