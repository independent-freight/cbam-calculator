import { Outlet, useLocation } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { SideNavigationBar } from "./SideNavigationBar";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MobileSideNavigation } from "./MobileSideNavigation";
import { useSelector } from "react-redux";

export default function AppLayout({ loggedIn, onLogout }) {
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState("");

    useEffect(() => {
        if (selectedHeader.includes("Welcome")) {
            setSelectedHeader(`Welcome ${user?.full_name},`);
        }
    }, [selectedHeader]);
    useEffect(() => {
        if (location.pathname === "/" && !selectedHeader && loggedIn)
            setSelectedHeader(`Welcome ${user?.full_name},`);
    }, [loggedIn, location.pathname]);

    const handleLogout = () => {
        setSelectedHeader("");
        onLogout();
    };
    return (
        <div className='min-h-screen flex flex-col'>
            <div className='flex flex-col md:flex-row flex-1'>
                {loggedIn && (
                    <aside className='hidden md:flex flex-col w-64 min-h-screen bg-gray-800 text-white p-4 bg-gray-100 w-full md:w-60'>
                        <SideNavigationBar
                            onLogout={handleLogout}
                            setHeader={setSelectedHeader}
                        />
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
                        setHeader={setSelectedHeader}
                    />
                )}

                <main
                    className={`flex-1 transition-opacity duration-300 ${
                        selectedHeader && "mt-[20px] mx-[50px]"
                    } ${isOpen ? "opacity-50" : "opacity-100"}`}>
                    <AppHeader header={selectedHeader} />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
