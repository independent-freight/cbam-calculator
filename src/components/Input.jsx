import { Text } from "./Text";

export function Input({
    label,
    value,
    placeholder,
    onChange,
    error,
    postIcon,
    className,
    ...props
}) {
    return (
        <div className={`${className} flex flex-col items-start`}>
            <Text className='pb-4' type='label-text-semiBold'>
                {label}
            </Text>
            <div className='flex justify-between items-center w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                <input
                    className='focus:outline-none focus:ring-0 focus:border-transparent w-full'
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
                {postIcon && postIcon}
            </div>
            <Text className='pt-1' type='error-label'>
                {error}
            </Text>
        </div>
    );
}
