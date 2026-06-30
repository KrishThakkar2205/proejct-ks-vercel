import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Search, Briefcase, MessageSquare, Bell, LogOut } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/brand' },
        { icon: <Search size={20} />, label: 'Discover', path: '/brand/discover' },
        { icon: <Briefcase size={20} />, label: 'Previously Closed Deals', path: '/brand/closed-deals' },
        { icon: <Briefcase size={20} />, label: 'Active Deals', path: '/brand/deals' },
        { icon: <MessageSquare size={20} />, label: 'Messages', path: '/brand/messages' },
    ];

    return (
        <div className="flex h-screen bg-light-gray font-sans overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header - Fixed */}
                <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-40">
                    <div className="flex items-center gap-4 select-none">
                        <Link to="/brand" className="flex items-center cursor-pointer">
                            <span className="font-extrabold text-lg tracking-tight text-deep-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                INFLU<span className="text-primary-orange">RUNNER</span>
                            </span>
                        </Link>
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
                        <button
                            onClick={() => {
                                dispatch(logout());
                                navigate('/login');
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full border-l border-gray-100 pl-4"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 pb-28 bg-gray-50/50 pt-[88px]">
                    <Outlet />
                </main>

                {/* Floating iOS-Style Dark Navigation Dock */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[94%] bg-deep-black/95 backdrop-blur-lg border border-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.4)] z-50 px-3 py-2 flex items-center gap-3 rounded-full transition-all duration-300">
                    {navItems.map((item) => {
                        const isCurrentActive = isActive(item.path);
                        const displayLabel = 
                            item.label === 'Previously Closed Deals' ? 'Closed' : 
                            item.label === 'Active Deals' ? 'Active' : 
                            item.label;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`transition-all duration-300 ${
                                    isCurrentActive
                                        ? 'bg-primary-orange text-white px-4 py-2.5 rounded-full flex items-center gap-2 font-semibold scale-105 shadow-md shadow-orange-500/20'
                                        : 'w-10 h-10 rounded-full bg-neutral-800/40 text-gray-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center'
                                }`}
                                title={!isCurrentActive ? displayLabel : ''}
                            >
                                <div className="flex-shrink-0">
                                    {React.cloneElement(item.icon, { size: 18 })}
                                </div>
                                {isCurrentActive && (
                                    <span className="text-xs tracking-wide whitespace-nowrap animate-fadeIn font-semibold">
                                        {displayLabel}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
