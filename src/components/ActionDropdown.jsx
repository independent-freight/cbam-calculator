import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react"; // Optional icon
import { Text } from "./Text";

export function ActionDropdown({ options = [] }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='relative inline-block text-left' ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className='p-2 hover:bg-gray-100 rounded-full focus:outline-none'>
                <MoreVertical className='w-5 h-5' />
            </button>

            {open && (
                <div className='absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50'>
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                option.onClick();
                                setOpen(false);
                            }}
                            className='w-full text-left px-4 py-2 hover:bg-gray-100'>
                            <Text type={option?.labelType ?? "label-text"}>
                                {option.label}
                            </Text>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
