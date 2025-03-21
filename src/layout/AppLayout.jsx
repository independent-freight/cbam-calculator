import { NavLink, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import navigationList from "assets/navigation-list.json";

export default function AppLayout() {
    return (
        <div className='min-h-screen flex flex-col'>
            <AppHeader />
            <div className='flex flex-col md:flex-row flex-1'>
                <aside className='bg-gray-100 w-full md:w-60'>
                    <nav>
                        <ul>
                            {navigationList.map(({ href, title }) => (
                                <li className='m-2' key={title}>
                                    <NavLink to={href}>
                                        <p className={"text-black"}>{title}</p>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main className={"flex-1"}>{/* <Outlet /> */}</main>
            </div>
        </div>
    );
}
