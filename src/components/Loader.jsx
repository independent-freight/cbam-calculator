import { LoaderCircle } from "lucide-react";
export function Loader({ className, size }) {
    return (
        <div
            className={`flex justify-center items-center min-h-screen min-w-full ${className}`}>
            <LoaderCircle
                className='animate-spin text-blue-500'
                size={size ?? 48}
            />
        </div>
    );
}
