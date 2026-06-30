import React from 'react';
import Card from '../ui/Card';
import { Eye, Users, RefreshCw, BarChart2, Loader2, AlertCircle, Instagram, Linkedin, MessageCircle, Link as LinkIcon, Globe, Facebook, Youtube, Twitter } from 'lucide-react';
import usePortfolioAnalytics from '../../hooks/usePortfolioAnalytics';

const platformNames = {
    ig: 'Instagram',
    instagram: 'Instagram',
    wa: 'WhatsApp',
    whatsapp: 'WhatsApp',
    li: 'LinkedIn',
    linkedin: 'LinkedIn',
    fb: 'Facebook',
    facebook: 'Facebook',
    tw: 'Twitter',
    twitter: 'Twitter',
    yt: 'YouTube',
    youtube: 'YouTube',
    direct: 'Direct',
};

const getPlatformIcon = (source) => {
    const src = source?.trim().toLowerCase();
    if (src === 'instagram' || src === 'ig') return <Instagram size={13} className="text-pink-600" />;
    if (src === 'whatsapp' || src === 'wa') return <MessageCircle size={13} className="text-emerald-500" />;
    if (src === 'linkedin' || src === 'li') return <Linkedin size={13} className="text-blue-600" />;
    if (src === 'facebook' || src === 'fb') return <Facebook size={13} className="text-blue-700" />;
    if (src === 'youtube' || src === 'yt') return <Youtube size={13} className="text-red-500" />;
    if (src === 'twitter' || src === 'tw') return <Twitter size={13} className="text-sky-400" />;
    if (src === 'direct') return <LinkIcon size={13} className="text-gray-400" />;
    return <Globe size={13} className="text-gray-400" />;
};

const PortfolioAnalytics = ({ profileId, token }) => {
    const { summary, sources, loading, error } = usePortfolioAnalytics(profileId, token);

    // 5. Loading state — show skeleton loaders for both the stat cards and source list while fetching.
    if (loading) {
        return (
            <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="mb-6">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                </div>
                
                {/* Stats cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-4 bg-gray-200 rounded w-20" />
                                <div className="w-8 h-8 rounded-lg bg-gray-100" />
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-28" />
                        </Card>
                    ))}
                </div>

                {/* Source list skeleton */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between gap-4 py-2 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-24" />
                                <div className="flex-1 h-3 bg-gray-100 rounded-full" />
                                <div className="h-4 bg-gray-200 rounded w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    // 6. Error state — if either fetch fails, show: "Couldn't load analytics. Try refreshing."
    if (error) {
        return (
            <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[250px]">
                <div className="text-center flex flex-col items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                    <p className="text-gray-600 font-medium mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Couldn't load analytics. Try refreshing.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2 text-xs font-semibold text-white bg-[#E8500A] hover:bg-opacity-90 rounded-lg transition-all shadow-sm"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Refresh Dashboard
                    </button>
                </div>
            </Card>
        );
    }

    const totalViews = summary?.total_views ?? 0;
    const uniqueViews = summary?.unique_views ?? 0;
    const repeatViews = summary?.repeat_views ?? 0;

    // 4. Empty state — if summary.total_views is 0, show matching message. Do not render the source breakdown in this case.
    if (totalViews === 0) {
        return (
            <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#0E0E0E]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Portfolio Analytics
                    </h2>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Last 30 Days
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BarChart2 size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                    <p className="text-gray-600 font-semibold text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                        No views yet. Share your portfolio to start tracking!
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            {/* Header / Section Label */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0E0E0E]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Portfolio Analytics
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Last 30 Days
                </p>
            </div>

            {/* 2. Summary section — three stat cards in a row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Views Card */}
                <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Views</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E8500A] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Eye size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-[#0E0E0E] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {totalViews.toLocaleString()}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Total portfolio visits
                    </p>
                </Card>

                {/* Unique Visitors Card */}
                <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Unique Visitors</span>
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 text-[#FFD166] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-[#0E0E0E] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {uniqueViews.toLocaleString()}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Unique accounts visited
                    </p>
                </Card>

                {/* Repeat Visitors Card */}
                <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Repeat Visitors</span>
                        <div className="w-8 h-8 rounded-lg bg-[#F5F0EB] text-[#0E0E0E] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <RefreshCw size={16} />
                        </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-[#0E0E0E] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {repeatViews.toLocaleString()}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Returning visitors count
                    </p>
                </Card>
            </div>

            {/* 3. Source breakdown — horizontal bar list */}
            {sources && sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-[#0E0E0E] mb-4 uppercase tracking-wider text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Traffic Sources
                    </h3>
                    <div className="space-y-4">
                        {sources.map((item, index) => {
                            const cleanSource = item.source?.trim().toLowerCase();
                            const sourceName = platformNames[cleanSource] || (item.source 
                                ? item.source.charAt(0).toUpperCase() + item.source.slice(1) 
                                : 'Direct');
                            
                            return (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between gap-4 py-2 px-3 hover:bg-gray-50/80 rounded-xl transition-all duration-200 group/row" 
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    {/* Platform Name and Icon */}
                                    <div className="flex items-center gap-2.5 w-24 sm:w-28 flex-shrink-0">
                                        <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100/50 shadow-sm group-hover/row:scale-105 transition-transform">
                                            {getPlatformIcon(item.source)}
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold text-[#0E0E0E] truncate">
                                            {sourceName}
                                        </span>
                                    </div>
                                    
                                    {/* Horizontal progress bar container */}
                                    <div className="flex-1 h-3 bg-[#F5F0EB] rounded-full overflow-hidden border border-gray-100/30">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#E8500A] to-[#FFD166] rounded-full transition-all duration-500 shadow-[inset_-2px_0_4px_rgba(255,255,255,0.2)]" 
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    {/* View count and percentage on the right */}
                                    <span className="text-xs font-bold text-gray-500 w-24 text-right">
                                        {item.views.toLocaleString()} ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default PortfolioAnalytics;
