import { resetPasswordAsync } from "apis/usersAPI";
import { APP_SIGNIN_URL } from "assets/appUrls";
import { Button } from "components/Button";
import { Card } from "components/Card";
import { Input } from "components/Input";
import { Text } from "components/Text";
import { AppHeader } from "layout/AppHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (!email) setError("Please provide an email to reset password.");
        else {
            let response = await resetPasswordAsync(email);
            if (response?.error) {
                setError(
                    "Error sending password reset email. Please try again."
                );
                setMessage("");
            } else {
                setMessage(
                    response?.message ??
                        "Password reset email sent! Please check your inbox."
                );
                setError("");
                setTimeout(() => navigate(APP_SIGNIN_URL), 1000);
            }
        }
    };

    return (
        <div className='min-w-screen h-screen flex items-center justify-center bg-blue-50'>
            <Card className='w-[500px]'>
                <AppHeader header='Reset Password' />
                <Input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                />
                <Button
                    label='Send Reset Link'
                    onClick={handleResetPassword}
                    error={error}
                    className='mt-[20px]'
                />

                {message && (
                    <Text type='success-semiBold-label'>{message}</Text>
                )}
            </Card>
        </div>
    );
}
