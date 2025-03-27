import { Input } from "components/Input";
import { Card } from "components/Card";
import { Text } from "components/Text";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "components/Button";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { registerSchema } from "assets/validation";
import { registerAsync } from "apis/usersAPI";

export function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevState) => !prevState);

    const handleSubmit = async (values) => {
        const response = await registerAsync(values);
        if (response?.user) {
            handleSignin();
        } else {
            setSubmitError(
                response?.error ??
                    "Failed to register. Please try again after some time."
            );
        }
    };

    const handleSignin = () => {
        navigate("/sign-in");
    };
    return (
        <div className='min-w-screen h-screen flex items-center justify-center bg-blue-50'>
            <Card className='w-[500px]'>
                <Text className='pb-5' type='header-text-semiBold'>
                    Register
                </Text>
                <Formik
                    initialValues={{ email: "", password: "", full_name: "" }}
                    validationSchema={registerSchema}
                    onSubmit={(values) => {
                        handleSubmit(values);
                    }}>
                    {({ errors, handleChange, values, touched }) => (
                        <Form>
                            <Input
                                value={values?.full_name}
                                name='full_name'
                                label='Full Name'
                                onChange={handleChange}
                                placeholder={"Jane Doe"}
                                className='pb-5'
                                error={touched?.full_name && errors?.full_name}
                            />
                            <Input
                                value={values?.email}
                                name='email'
                                label='Email'
                                onChange={handleChange}
                                placeholder={"janedoe@mail.com"}
                                className='pb-5'
                                error={touched?.email && errors?.email}
                            />
                            <Input
                                value={values?.password}
                                type={showPassword ? "text" : "password"}
                                name='password'
                                label='Password'
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
                                className='pb-5'
                                error={touched?.password && errors?.password}
                            />
                            <Button
                                className='py-5'
                                label='Register'
                                type='submit'
                                error={submitError}
                            />
                        </Form>
                    )}
                </Formik>

                <Text className='flex justify-center' type='label-text'>
                    Already have an account?
                    <Text
                        className='pl-1'
                        type='link-label-semiBold'
                        onClick={handleSignin}>
                        Sign in
                    </Text>
                </Text>
            </Card>
        </div>
    );
}
