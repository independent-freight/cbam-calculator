import { logoutAsync } from "apis/usersAPI";
import { APP_SIGNIN_URL } from "assets/appUrls";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { AppHeader } from "layout/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutReset } from "state/storeUtils";

export function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const handleLogout = async () => {
        let response = await logoutAsync();
        if (response?.error) {
            alert("Failed to logout. Try again after some time.");
        } else {
            dispatch(logoutReset());
            sessionStorage.clear();
            navigate(APP_SIGNIN_URL);
        }
    };
    return (
        <div className='flex flex-col h-[100%]'>
            <AppHeader header='User Profile' />
            <div className='flex justify-center items-center'>
                <div className=' max-h-[500px] flex-1 p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg '>
                    <div className='mb-4 flex items-end '>
                        <Text type='semiBold-subHeader'>Name: </Text>{" "}
                        <Text type='body' className='ml-[10px]'>
                            {user.full_name}
                        </Text>
                    </div>{" "}
                    <div className='mb-4 flex items-end '>
                        <Text type='semiBold-subHeader'>Email: </Text>{" "}
                        <Text type='body' className='ml-[10px]'>
                            {user.email}
                        </Text>
                    </div>
                    <Button
                        label='Logout'
                        style='w-[180px] mx-[auto]'
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}
