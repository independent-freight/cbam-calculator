import { useState, useRef, useEffect } from "react";
import { Text } from "./Text";
import { ChevronDown, ChevronUp } from "lucide-react";

export function Dropdown({
    options,
    onSelect,
    label,
    error,
    value,
    placeholder = "Select an option",
}) {
    const getLabelValue = (options, l_value) => {
        let opt = options.find((item) => item?.value === l_value);
        return opt?.label;
    };

    const [isOpen, setIsOpen] = useState(false);
    const [labelValue, setLabelValue] = useState(getLabelValue(options, value));
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelection = (option) => {
        onSelect(option?.value);
        setLabelValue(option?.label);
        setIsOpen(false);
    };

    return (
        <div className='relative text-left' ref={dropdownRef}>
            <Text className='pb-4' type='label-text-semiBold'>
                {label}
            </Text>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex justify-between items-center w-full p-3 border border-gray-300 rounded-lg focus:outline-none '>
                <Text
                    type={`body-${labelValue ? "text" : "faded"}`}
                    className='w-[100%] overflow-hidden text-ellipsis truncate text-start'>
                    {labelValue ?? placeholder}
                </Text>
                {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {isOpen && (
                <ul className='absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelection(option)}
                            className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                            {option?.label}
                        </li>
                    ))}
                </ul>
            )}

            <Text className='pt-1' type='error-label'>
                {error}
            </Text>
        </div>
    );
}
