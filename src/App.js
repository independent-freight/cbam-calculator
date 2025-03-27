import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { useEffect, useState } from "react";
import { setSignin } from "state/userSlice";
import { getUserAsync, logoutAsync } from "apis/usersAPI";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [loggedIn, setLoggedIn] = useState(
        user?.uid || window.sessionStorage.getItem("token") ? true : false
    );
    const [appLoading, setAppLoading] = useState(false);

    const setUpUserToken = async () => {
        setAppLoading(true);
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
            sessionStorage.clear();
            setLoggedIn(false);
            navigate("/sign-in");
        }
    };

    useEffect(() => {
        const token = window.sessionStorage.getItem("token");
        if (!user?.uid && token) setUpUserToken(token);
        else if (user?.uid && token) setLoggedIn(true);
        else handleLogout();
    }, [user]);

    return (
        <div className='App'>
            {appLoading ? (
                <div className='flex justify-center items-center min-h-screen min-w-full'>
                    <LoaderCircle
                        className='animate-spin text-blue-500'
                        size={48}
                    />
                </div>
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
