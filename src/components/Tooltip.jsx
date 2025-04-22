import { Info } from "lucide-react";
import { useState } from "react";

export function Tooltip({
    content = "Tooltip info",
    children,
    icon: Icon = Info,
    position = "top",
}) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
        <div className='relative inline-block'>
            <span
                className='cursor-pointer'
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}>
                {children || <Icon className='w-4 h-4 text-gray-500' />}
            </span>

            {isVisible && (
                <div
                    className={`absolute z-10 px-3 py-1 text-sm text-white bg-black rounded shadow-md whitespace-nowrap ${positionClasses[position]}`}>
                    {content}
                </div>
            )}
        </div>
    );
}
