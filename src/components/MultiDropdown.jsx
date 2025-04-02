import { useState, useRef, useEffect } from "react";

export function MultiDropdown({
    options,
    error,
    label,
    onSelect,
    value,
    placeholder = "Select any option",
}) {
    const getLabelValue = (options, l_value) => {
        selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : "Select options";
        let opt = options.find((item) => item?.value === l_value);
        return opt?.label;
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [labelValue, setLabelValue] = useState(getLabelValue(options, value));
    const dropdownRef = useRef(null);

    // Toggle dropdown visibility
    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // Handle selecting or deselecting an option
    const handleSelect = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(
                selectedOptions.filter((item) => item !== option)
            );
        } else {
            onSelect(option?.value);
            setLabelValue(option?.label);
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='relative inline-block w-64' ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={toggleDropdown}
                className='w-full border border-gray-300 bg-white p-2 rounded-md flex justify-between items-center'>
                {}
                <span className='ml-2'>&#9662;</span>
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <ul className='absolute w-full border border-gray-300 bg-white mt-1 max-h-48 overflow-y-auto rounded-md shadow-lg'>
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`cursor-pointer p-2 hover:bg-gray-200 flex items-center ${
                                selectedOptions.includes(option)
                                    ? "bg-gray-300"
                                    : ""
                            }`}>
                            <input
                                type='checkbox'
                                checked={selectedOptions.includes(option)}
                                readOnly
                                className='mr-2'
                            />
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
