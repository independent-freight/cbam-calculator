import { LoaderCircle } from "lucide-react";
export function Loader() {
    return (
        <div className='flex justify-center items-center min-h-screen min-w-full'>
            <LoaderCircle className='animate-spin text-blue-500' size={48} />
        </div>
    );
}
