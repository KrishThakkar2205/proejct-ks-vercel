import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Users, Briefcase, MessageSquare, Heart, Bell, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/brand' },
        { icon: <Search size={20} />, label: 'Discover', path: '/brand/discover' },
        { icon: <Briefcase size={20} />, label: 'Previously Closed Deals', path: '/brand/closed-deals' },
        { icon: <Briefcase size={20} />, label: 'Active Deals', path: '/brand/deals' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/brand/messages' },
    ];

    const SidebarContent = ({ showBrand = true, isCollapsed = false }) => (
        <>
            {showBrand && (
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-bebas text-3xl tracking-wide text-deep-black">INFLU</span>
                        <span className="font-bebas text-3xl tracking-wide text-primary-orange">RUNNER</span>
                    </Link>
                </div>
            )}

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                            ? 'bg-orange-50 text-primary-orange'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        title={isCollapsed ? item.label : ''}
                    >
                        {item.icon}
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/login';
                    }}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 w-full text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-light-gray font-sans">
            {/* Desktop Sidebar */}
            <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-300 relative`}>
                <SidebarContent showBrand={false} isCollapsed={isSidebarCollapsed} />
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-orange hover:border-primary-orange transition-colors shadow-sm z-10"
                    aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-50 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden z-[60] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent showBrand={true} />
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Fixed Mobile Toggle Button */}
                <button
                    className="fixed top-5 right-6 z-50 md:hidden text-deep-black hover:text-primary-orange focus:outline-none w-6 h-6"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`absolute inset-0 transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                        <Menu size={24} />
                    </div>
                    <div className={`absolute inset-0 transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                        <X size={24} />
                    </div>
                </button>

                {/* Top Header - Fixed */}
                <header className={`fixed top-0 left-0 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-40 transition-all duration-300`}>
                    <div className="flex items-center gap-4">
                        <h1 className="flex items-center gap-1">
                            <span className="md:hidden font-bebas text-2xl tracking-wide text-deep-black">INFLU</span>
                            <span className="md:hidden font-bebas text-2xl tracking-wide text-primary-orange">RUNNER</span>
                            <span className="hidden md:inline text-2xl font-bebas tracking-wide text-deep-black">{navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-primary-orange transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-deep-black">Acme Brand</div>
                                <div className="text-xs text-gray-500">Brand Account</div>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-primary-orange font-bold border-2 border-white shadow-sm">
                                AB
                            </div>
                        </div>
                        {/* Placeholder to maintain spacing */}
                        <div className="w-6 h-6 ml-2 md:hidden"></div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50 pt-[88px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
