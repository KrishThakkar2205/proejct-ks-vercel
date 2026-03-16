import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, User, Calendar, ClipboardList, CheckCircle, Star, LogOut, AlertTriangle, MoreHorizontal, X } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL } from '../utils/api';
import NotificationBanner from '../components/ui/NotificationBanner';

const InfluencerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/influencer' },
        { icon: <User size={20} />, label: 'Profile', path: '/influencer/profile' },
        { icon: <Calendar size={20} />, label: 'Calendar', path: '/influencer/calendar' },
        { icon: <ClipboardList size={20} />, label: 'Schedule', path: '/influencer/schedule' },
        { icon: <CheckCircle size={20} />, label: 'Completed Shoots', path: '/influencer/completed-shoots' },
        { icon: <AlertTriangle size={20} />, label: 'Delayed', path: '/influencer/delayed' },
        { icon: <Star size={20} />, label: 'Reviews', path: '/influencer/reviews' },
    ];

    // Bottom nav: Reviews, Schedule, Dashboard, Completed Shoots, Delayed
    const bottomNavItems = [
        navItems[6], // Reviews (replaces Profile)
        navItems[3], // Schedule
        navItems[0], // Dashboard
        navItems[4], // Completed Shoots
        navItems[5], // Delayed
    ];

    const SidebarContent = ({ showBrand = true, isCollapsed = false }) => (
        <>
            {showBrand && (
                <div className="p-6 border-b border-gray-100">
                    <Link to="/influencer" className="flex items-center">
                        <img src="/logo.png" alt="InfluRunner Logo" className="h-8 w-auto px-6 cursor-pointer" />
                    </Link>
                </div>
            )}

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                            ? 'bg-orange-50 text-primary-orange'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        title={isCollapsed ? item.label : ''}
                    >
                        <span className={!isCollapsed ? 'animate-icon-bounce' : ''}>
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className="animate-fade-in-slide whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                    }}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 w-full text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <span className={!isCollapsed ? 'animate-icon-bounce' : ''}>
                        <LogOut size={20} />
                    </span>
                    {!isCollapsed && (
                        <span className="animate-fade-in-slide whitespace-nowrap">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen w-full font-sans overflow-hidden relative flex bg-warm-cream">
            {/* --- Premium Mesh Background --- */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffffff,0%,#fffaf7_100%)]" />
                
                {/* Animated Mesh Blobs */}
                <div 
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-orange/10 blur-[100px] animate-mesh-1" 
                    style={{ mixBlendMode: 'multiply' }}
                />
                <div 
                    className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-200/20 blur-[110px] animate-mesh-2" 
                    style={{ mixBlendMode: 'multiply' }}
                />
                <div 
                    className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary-orange/5 blur-[90px] animate-mesh-3" 
                    style={{ mixBlendMode: 'multiply' }}
                />

                {/* Subtle Grain/Noise Overlay for Texture */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                />
            </div>


            {/* Desktop Sidebar (Glassmorphism) */}
            <aside
                className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white/70 backdrop-blur-2xl border-r border-white/50 hidden md:flex flex-col transition-all duration-300 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)]`}
                onMouseEnter={() => setIsSidebarCollapsed(false)}
                onMouseLeave={() => setIsSidebarCollapsed(true)}
            >
                <SidebarContent showBrand={false} isCollapsed={isSidebarCollapsed} />
            </aside>


            <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
                {/* In-app push notification banner */}
                <NotificationBanner />
                {/* Mobile Top Header - Floating Overlay */}
                <header 
                    className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 bg-white/60 backdrop-blur-[1px] border-b border-white/20 pointer-events-none"
                    style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))', paddingBottom: '0.75rem' }}
                >
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <span className="text-lg font-bold text-primary-orange tracking-tight drop-shadow-sm">InfluRunner</span>
                    </div>

                    {/* Actions on the Right: Calendar + Profile Photo */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <Link
                            to="/influencer/calendar"
                            className="flex items-center justify-center gap-1.5 px-3.5 h-11 bg-white/80 text-primary-orange rounded-full border border-orange-100 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                        >
                            <Calendar size={18} />
                            <span className="text-sm font-semibold pr-1">Calendar</span>
                        </Link>
                        
                        <Link to="/influencer/profile" className="block w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 bg-white transition-transform active:scale-95">
                            {user?.profile_photo_location ? (
                                <img
                                    src={user.profile_photo_location.startsWith('http') ? user.profile_photo_location : `${API_BASE_URL}/${user.profile_photo_location}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User size={22} />
                                </div>
                            )}
                        </Link>
                    </div>
                </header>

                {/* Main Content — Starts below header, scrolls behind it */}
                <main className="flex-1 overflow-y-auto p-6 pt-24 pb-24 md:pt-6 md:pb-6 bg-transparent w-full">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation - Tight Vignette */}
                <nav 
                    className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 pointer-events-none pt-1"
                    style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))' }}
                >
                    <div className="flex items-center justify-around h-12 px-1 pointer-events-auto">
                        {bottomNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${isActive(item.path)
                                    ? 'text-primary-orange'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <span className={`transition-transform ${isActive(item.path) ? 'scale-110' : ''}`}>
                                    {React.cloneElement(item.icon, { size: 18 })}
                                </span>
                                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default InfluencerLayout;

