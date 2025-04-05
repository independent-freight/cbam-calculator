import { Link, NavLink, Outlet } from "react-router-dom";
import { SideNavigationBar } from "./SideNavigationBar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileSideNavigation } from "./MobileSideNavigation";
import logo from "assets/icons/logo.png";
import { APP_HOME_URL } from "assets/appUrls";

export default function AppLayout({ loggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
    };
    return (
        <div className='min-h-screen flex flex-col'>
            <div className='flex flex-col md:flex-row flex-1 min-h-screen'>
                {loggedIn && (
                    <aside className='hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 bg-gray-100'>
                        <Link to={APP_HOME_URL}>
                            <div className='flex justify-center'>
                                <img
                                    src={logo}
                                    className='bg-white rounded-full w-[80px] h-[78px] p-[10px]'
                                />
                            </div>
                        </Link>
                        <SideNavigationBar onLogout={handleLogout} />
                    </aside>
                )}
                {/* Mobile Toggle Button */}
                <button
                    className='md:hidden p-2 bg-gray-800 text-white rounded rounded-t-none'
                    onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {/* Mobile Sidebar (Drawer) */}
                {loggedIn && (
                    <MobileSideNavigation
                        onClose={() => setIsOpen(false)}
                        isOpen={isOpen}
                        onLogout={handleLogout}
                    />
                )}
                <div className={`flex flex-col h-screen w-[100%] `}>
                    <main
                        className={`flex flex-1 flex-col transition-opacity duration-300 ${
                            isOpen ? "opacity-50" : "opacity-100"
                        } overflow-y-auto min-h-screen`}>
                        <Outlet className='mx-[50px]' />
                    </main>
                </div>
            </div>
        </div>
    );
}
