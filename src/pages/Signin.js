import { Input } from "components/Input";
import { Card } from "components/Card";
import { Text } from "components/Text";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "assets/validation";
import { auth } from "config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginAsync } from "apis/usersAPI";
import { setSignin } from "state/userSlice";
import { Formik, Form } from "formik";
import { APP_REGISTER_URL, APP_RESET_PASSWORD_URL } from "assets/appUrls";

export function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSubmitLoading, setSubmitLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleShowPassword = () => setShowPassword((prevState) => !prevState);

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const userResults = await signInWithEmailAndPassword(
                auth,
                values?.email,
                values?.password
            );
            const user = userResults?.user;

            const token = await user?.getIdToken();

            const response = await loginAsync({ idToken: token });

            if (response?.error || !response?.token) {
                setSubmitError(
                    response?.error ??
                        "Failed to login. Please try again after some time."
                );
            } else {
                window.sessionStorage.setItem("token", response?.token);
                dispatch(setSignin(response?.data));
                navigate("/");
            }
        } catch (err) {
            setSubmitError(err.message);
        }
        setSubmitLoading(false);
    };

    const handleRegister = () => {
        navigate(APP_REGISTER_URL);
    };
    const handleResetNavigation = () => {
        navigate(APP_RESET_PASSWORD_URL);
    };
    return (
        <div className='min-w-screen h-screen flex items-center justify-center bg-blue-50'>
            <Card className='w-[500px]'>
                <Text className='pb-5' type='header-text-semiBold'>
                    Sign In
                </Text>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={loginSchema}
                    onSubmit={(values) => {
                        handleSubmit(values);
                    }}>
                    {({ errors, handleChange, values, touched }) => (
                        <Form>
                            <Input
                                value={values?.email}
                                label='Email'
                                name='email'
                                onChange={handleChange}
                                placeholder={"janedoe@mail.com"}
                                className='py-1'
                                error={touched?.email && errors?.email}
                            />
                            <Input
                                value={values?.password}
                                type={showPassword ? "text" : "password"}
                                label='Password'
                                name='password'
                                onChange={handleChange}
                                postIcon={
                                    showPassword ? (
                                        <EyeClosed
                                            size={20}
                                            onClick={handleShowPassword}
                                        />
                                    ) : (
                                        <Eye
                                            size={20}
                                            onClick={handleShowPassword}
                                        />
                                    )
                                }
                                placeholder='***********'
                                className='py-1'
                                error={touched?.password && errors?.password}
                            />
                            <Button
                                className='py-5'
                                label='Sign in'
                                type='submit'
                                error={submitError}
                                loading={isSubmitLoading}
                            />
                        </Form>
                    )}
                </Formik>

                <Text
                    className='pl-1 flex justify-center'
                    type='link-label-semiBold'
                    onClick={handleResetNavigation}>
                    Forgot you password?
                </Text>

                <Text className='flex justify-center' type='label-text'>
                    Don't have an account?
                    <Text
                        className='pl-1'
                        type='link-label-semiBold'
                        onClick={handleRegister}>
                        Register here
                    </Text>
                </Text>
            </Card>
        </div>
    );
}
