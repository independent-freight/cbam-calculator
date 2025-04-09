import React from "react";
import { Button } from "./Button";
import { Text } from "./Text";

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) {
    return isOpen ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn'>
                <Text type='semiBold-subHeader' className='mb-2'>
                    {title}
                </Text>
                <Text type='body-faded' className='mb-4'>
                    {message}
                </Text>
                <div className='flex justify-around gap-3'>
                    <Button
                        onClick={onClose}
                        label='Cancel'
                        style='px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300'
                    />
                    <Button
                        onClick={onConfirm}
                        label='Confirm'
                        style='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
                    />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
