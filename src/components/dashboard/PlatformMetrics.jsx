import React, { useState } from 'react';
import Card from '../ui/Card';
import { Instagram, Facebook, Youtube, TrendingUp } from 'lucide-react';

const PlatformMetrics = () => {
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    // Mock data - in production, this would come from API
    const platformData = {
        instagram: {
            name: 'Instagram',
            icon: <Instagram className="w-5 h-5" />,
            color: 'from-purple-500 via-pink-500 to-orange-400',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-500',
            followers: 125000,
            engagementRate: 4.8,
            postsThisMonth: 12,
            avgLikes: 6500,
            growth: '+12%'
        },
        facebook: {
            name: 'Facebook',
            icon: <Facebook className="w-5 h-5" />,
            color: 'from-blue-600 to-blue-400',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            followers: 85000,
            engagementRate: 3.2,
            postsThisMonth: 8,
            avgLikes: 2800,
            growth: '+8%'
        },
        youtube: {
            name: 'YouTube',
            icon: <Youtube className="w-5 h-5" />,
            color: 'from-red-600 to-red-400',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            subscribers: 45000,
            engagementRate: 5.5,
            videosThisMonth: 4,
            avgViews: 15000,
            growth: '+15%'
        }
    };

    const getCombinedMetrics = () => {
        const totalFollowers = platformData.instagram.followers +
            platformData.facebook.followers +
            platformData.youtube.subscribers;
        const avgEngagement = (platformData.instagram.engagementRate +
            platformData.facebook.engagementRate +
            platformData.youtube.engagementRate) / 3;
        const totalContent = platformData.instagram.postsThisMonth +
            platformData.facebook.postsThisMonth +
            platformData.youtube.videosThisMonth;

        return {
            totalFollowers,
            avgEngagement: avgEngagement.toFixed(1),
            totalContent,
            avgGrowth: '+11.7%'
        };
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const platforms = [
        { id: 'all', label: 'All Platforms', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
        { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
        { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> }
    ];

    const renderPlatformMetrics = (platform) => {
        const data = platformData[platform];
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">
                        {platform === 'youtube' ? 'Subscribers' : 'Followers'}
                    </p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {formatNumber(platform === 'youtube' ? data.subscribers : data.followers)}
                    </h3>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {data.growth}
                    </span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">Engagement Rate</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {data.engagementRate}%
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Average</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">
                        {platform === 'youtube' ? 'Videos' : 'Posts'} This Month
                    </p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {platform === 'youtube' ? data.videosThisMonth : data.postsThisMonth}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Published</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">
                        Avg {platform === 'youtube' ? 'Views' : 'Likes'}
                    </p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {formatNumber(platform === 'youtube' ? data.avgViews : data.avgLikes)}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Per Post</span>
                </div>
            </div>
        );
    };

    const renderCombinedMetrics = () => {
        const combined = getCombinedMetrics();
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {formatNumber(combined.totalFollowers)}
                    </h3>
                    <span className="text-xs font-medium text-green-600 bg-white px-2 py-0.5 rounded-full mt-1 inline-block">
                        {combined.avgGrowth}
                    </span>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-600 mb-1">Avg Engagement</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {combined.avgEngagement}%
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Across All</span>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-600 mb-1">Total Content</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {combined.totalContent}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">This Month</span>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-600 mb-1">Active Platforms</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">3</h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Connected</span>
                </div>
            </div>
        );
    };

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Platform Metrics</h2>
                    <p className="text-sm text-gray-600 mt-1">Track your performance across social media</p>
                </div>

                {/* Platform Toggle */}
                <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                        <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                                ${selectedPlatform === platform.id
                                    ? 'bg-primary-orange text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                        >
                            {platform.icon}
                            <span className="hidden sm:inline">{platform.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Platform Header with Icon */}
            {selectedPlatform !== 'all' && (
                <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-r ${platformData[selectedPlatform].color}`}>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-white shadow-md">
                        <div className={platformData[selectedPlatform].textColor}>
                            {platformData[selectedPlatform].icon}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bebas tracking-wide text-white">
                            {platformData[selectedPlatform].name} Performance
                        </h3>
                        <p className="text-xs text-white/90">Last 30 days</p>
                    </div>
                </div>
            )}

            {/* Metrics Display */}
            {selectedPlatform === 'all'
                ? renderCombinedMetrics()
                : renderPlatformMetrics(selectedPlatform)
            }
        </Card>
    );
};

export default PlatformMetrics;
