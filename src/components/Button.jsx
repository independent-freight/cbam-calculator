import { Loader } from "./Loader";
import { Text } from "./Text";

export function Button({
    label,
    onClick,
    className,
    style = "",
    type,
    error,
    labelClass,
    loading = false,
}) {
    return (
        <div className={`${className} flex flex-col`}>
            {loading ? (
                <Loader size={30} className='!min-h-[10px]' />
            ) : (
                <button
                    type={type}
                    className={`${style} px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300`}
                    onClick={onClick}>
                    {label}
                </button>
            )}
            <Text
                type='error-label-semiBold'
                className={`m-[10px] ${labelClass ?? ""}`}>
                {error}
            </Text>
        </div>
    );
}
