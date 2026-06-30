import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LayoutDashboard, Calendar, ClipboardList, Star, Bell, LogOut, Instagram } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL } from '../utils/api';

const InfluencerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/influencer' },
        { icon: <Instagram size={20} />, label: 'Instagram Reports', path: '/influencer/media-reports' },
        { icon: <Calendar size={20} />, label: 'Calendar', path: '/influencer/calendar' },
        { icon: <ClipboardList size={20} />, label: 'Work Tracker', path: '/influencer/schedule' },
        { icon: <Star size={20} />, label: 'Reviews', path: '/influencer/reviews' },
    ];

    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="flex h-screen bg-light-gray font-sans overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-40 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <Link to="/influencer" className="flex items-center">
                            <img src="/logo.png" alt="InfluRunner Logo" className="h-8 w-auto" />
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/influencer/notifications"
                            className={`p-2 transition-colors relative rounded-full ${isActive('/influencer/notifications') ? 'text-primary-orange bg-orange-50' : 'text-gray-400 hover:text-primary-orange hover:bg-gray-50'}`}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                        </Link>
                        <Link to="/influencer/profile">
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-deep-black">{currentUser?.name || 'Influencer'}</div>
                                    <div className="text-xs text-gray-500">Influencer Account</div>
                                </div>
                                {currentUser?.profile_photo_location ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                        <img
                                            src={currentUser.profile_photo_location.startsWith('http')
                                                ? currentUser.profile_photo_location
                                                : `${API_BASE_URL}${currentUser.profile_photo_location.startsWith('/') ? '' : '/'}${currentUser.profile_photo_location}`}
                                            alt={currentUser?.name || 'Profile'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.parentElement.innerHTML = `<div class="w-full h-full bg-orange-100 flex items-center justify-center text-primary-orange font-bold text-sm">${(currentUser?.name || 'I').charAt(0).toUpperCase()}</div>`;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-primary-orange font-bold border-2 border-white shadow-sm">
                                        {(currentUser?.name || 'I').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </Link>
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
                <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-6 md:pb-28 bg-gray-50/50">
                    <Outlet />
                </main>

                {/* Floating iOS-Style Dark Navigation Dock */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max max-w-[94%] bg-deep-black/95 backdrop-blur-lg border border-neutral-800 shadow-[0_12px_40px_rgba(0,0,0,0.4)] z-50 px-3 py-2 flex items-center gap-3 rounded-full transition-all duration-300">
                    {navItems.map((item) => {
                        const isCurrentActive = isActive(item.path);
                        const displayLabel = 
                            item.label === 'Instagram Reports' ? 'Reports' : 
                            item.label === 'Work Tracker' ? 'Tracker' : 
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

export default InfluencerLayout;
