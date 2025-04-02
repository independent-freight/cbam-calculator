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
            <div className='flex flex-col md:flex-row flex-1 min-h-screen'>
                {loggedIn && (
                    <aside className='hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 bg-gray-100'>
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
                <div className={`flex flex-col h-screen w-[100%] `}>
                    <main
                        className={`flex-1 transition-opacity duration-300 ${
                            isOpen ? "opacity-50" : "opacity-100"
                        } overflow-y-auto min-h-screen`}>
                        {" "}
                        <AppHeader header={selectedHeader} />
                        <Outlet className='mx-[50px]' />
                    </main>
                </div>
            </div>
        </div>
    );
}
