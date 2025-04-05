import { Button } from "components/Button";
import { Text } from "components/Text";
import { AppHeader } from "layout/AppHeader";
import { useSelector } from "react-redux";

export function Profile() {
    const user = useSelector((state) => state.user);
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
                        label='Reset Password'
                        style='w-[180px] mx-[auto]'
                    />
                </div>
            </div>
        </div>
    );
}
