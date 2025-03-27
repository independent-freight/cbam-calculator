import navigationList from "assets/navigation-list.json";
import { Text } from "components/Text";
import { NavLink } from "react-router-dom";

export function SideNavigationBar({ onLogout, setHeader }) {
    return (
        <nav className='mt-[50px]'>
            <ul>
                {navigationList.map(({ href, title, header }) => (
                    <li className='m-[20px]' key={title}>
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
                                    isActive
                                        ? "text-blue-500 bg-gray-100" // Active state styles
                                        : "text-white-700 hover:text-blue-500"
                                }>
                                <Text type='semiBold-text-label'>{title}</Text>
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
