import navigationList from "assets/navigation-list.json";
import { Text } from "components/Text";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export function MobileSideNavigation({ isOpen, onClose, onLogout, setHeader }) {
    return (
        <div
            className={`fixed top-0 left-0 w-64 h-[100%] bg-gray-800 text-white p-4 z-50 transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
            <button
                className='absolute top-4 right-4 text-white'
                onClick={() => onClose(false)}>
                <X size={24} />
            </button>

            <ul className='mt-[50px] space-y-2'>
                {navigationList.map(({ href, title, header }) => (
                    <li className='p-[10px]' key={title}>
                        {href === "/logout" ? (
                            <Text
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-blue-500 bg-gray-100" // Active state styles
                                        : "text-white-700 hover:text-blue-500"
                                }
                                onClick={onLogout}
                                type='semiBold-text-label'>
                                {title}
                            </Text>
                        ) : (
                            <NavLink
                                onClick={() => setHeader(header)}
                                to={href}
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? "text-blue-500 bg-gray-100" // Active state styles
                                            : "text-white-700 hover:text-blue-500"
                                    }`
                                }>
                                <Text type='semiBold-text-body'>{title}</Text>
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
