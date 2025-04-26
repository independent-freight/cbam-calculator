import { Text } from "./Text";
import { Tooltip } from "./Tooltip";

export function Input({
    label,
    value,
    placeholder,
    onChange,
    error,
    postIcon,
    className,
    type,
    tooltip,
    ...props
}) {
    return (
        <div className={`${className} flex flex-col items-start`}>
            <div className='flex items-center pb-4'>
                <Text className='mr-[10px]' type='label-text-semiBold'>
                    {label}
                </Text>
                {tooltip && <Tooltip content={tooltip} />}
            </div>
            <div className='flex justify-between items-center w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                <input
                    className='focus:outline-none focus:ring-0 focus:border-transparent w-full'
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
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
