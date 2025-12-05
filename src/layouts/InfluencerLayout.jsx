import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, ClipboardList, MessageSquare, Star, Bell, LogOut, Menu, X } from 'lucide-react';

const InfluencerLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/influencer' },
        { icon: <User size={20} />, label: 'Profile', path: '/influencer/profile' },
        { icon: <Calendar size={20} />, label: 'Calendar', path: '/influencer/calendar' },
        { icon: <ClipboardList size={20} />, label: 'Schedule', path: '/influencer/schedule' },
        { icon: <Star size={20} />, label: 'Reviews', path: '/influencer/reviews' },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-gray-100">
                <Link to="/" className="text-2xl flex items-center gap-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-bebas text-3xl tracking-wide text-deep-black">SYNC</span>
                    <span className="font-bebas text-3xl tracking-wide text-primary-orange">KONNECTSPHERE</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                            ? 'bg-orange-50 text-primary-orange'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </>
    );

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    return (
        <div className="flex h-screen bg-light-gray font-sans">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <SidebarContent />
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
                <SidebarContent />
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

                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-40 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/influencer/profile" className="md:pointer-events-none">
                            <h1 className="flex items-center gap-1 cursor-pointer md:cursor-default">
                                <span className="md:hidden font-bebas text-2xl tracking-wide text-deep-black">SYNC</span>
                                <span className="md:hidden font-bebas text-2xl tracking-wide text-primary-orange">KONNECTSPHERE</span>
                                <span className="hidden md:inline text-2xl font-bebas tracking-wide text-deep-black">
                                    {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                                </span>
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-primary-orange transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <Link to="/influencer/profile" className="md:pointer-events-none">
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer md:cursor-default">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-deep-black">{currentUser.name || 'Influencer'}</div>
                                    <div className="text-xs text-gray-500">Influencer Account</div>
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-primary-orange font-bold border-2 border-white shadow-sm">
                                    {(currentUser.name || 'I').charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </Link>
                        {/* Placeholder to maintain spacing */}
                        <div className="w-6 h-6 ml-2 md:hidden"></div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default InfluencerLayout;
