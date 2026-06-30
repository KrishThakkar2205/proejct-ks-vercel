import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { Instagram, MapPin, Users } from 'lucide-react';
import api from '../../utils/api';

const PlatformMetrics = () => {
    const [instaData, setInstaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsConnection, setNeedsConnection] = useState(false);
    const [error, setError] = useState(null);
    const [activeDemographicsTab, setActiveDemographicsTab] = useState('cities');


    useEffect(() => {
        const fetchInstaData = async () => {
            try {
                setLoading(true);
                setError(null);
                setNeedsConnection(false);
                const response = await api.get('/api/dashboard-insta-metric');
                setInstaData(response.data);
            } catch (err) {
                console.error("Error fetching instagram metrics:", err);
                if (err.response?.status === 404) {
                    setNeedsConnection(true);
                } else {
                    setError("Failed to load metrics");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInstaData();
    }, []);

    const handleConnect = async () => {
        try {
            const response = await api.get('/api/social-media/connect/instagram');
            if (response.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            console.error("Error connecting instagram:", err);
            alert("Failed to connect Instagram. Please try again.");
        }
    };

    const data = {
        name: 'Instagram',
        icon: <Instagram className="w-5 h-5" />,
        color: 'from-purple-500 via-pink-500 to-orange-400',
        textColor: 'text-pink-600',
        followers: instaData ? instaData.followers_count : 0,
        reach: instaData ? instaData.reach : 0,
        accountsEngaged: instaData ? instaData.accounts_engaged : 0,
        totalInteractions: instaData ? instaData.total_interactions : 0,
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Instagram Metrics</h2>
                    <p className="text-sm text-gray-600 mt-1">Track your performance on Instagram</p>
                </div>
            </div>

            {loading ? (
                <div className="py-10 text-center text-gray-400">
                    <p>Loading metrics...</p>
                </div>
            ) : needsConnection ? (
                /* Connect Instagram View */
                <div className="py-10 px-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl text-center border border-pink-100 animate-fadeIn">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-pink-600">
                        <Instagram size={32} />
                    </div>
                    <h3 className="text-xl font-bebas tracking-wide text-deep-black mb-2">Connect Your Account</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
                        Link your Instagram professional account to see real-time insights and performance metrics.
                    </p>
                    <button
                        onClick={handleConnect}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mx-auto"
                    >
                        <Instagram size={18} className="mr-2" />
                        Connect Instagram
                    </button>
                </div>
            ) : error ? (
                <div className="py-10 text-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : (
                /* Metrics Grid */
                <>
                    <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-r ${data.color}`}>
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-white shadow-md">
                            <div className={data.textColor}>
                                {data.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bebas tracking-wide text-white">
                                {data.name} Performance
                            </h3>
                            <p className="text-xs text-white/90">Last 30 days</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">Followers</p>
                            <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                                {formatNumber(data.followers)}
                            </h3>
                            <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                        </div>

                        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">Reach</p>
                            <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                                {formatNumber(data.reach)}
                            </h3>
                            <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                        </div>

                        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">Accounts Engaged</p>
                            <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                                {formatNumber(data.accountsEngaged)}
                            </h3>
                            <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                        </div>

                        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <p className="text-sm text-gray-500 mb-1">Total Interactions</p>
                            <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                                {formatNumber(data.totalInteractions)}
                            </h3>
                            <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                        </div>
                    </div>

                    {/* Audience Demographics Section */}
                    {(instaData?.engaged_audience_demographics_city || instaData?.engaged_audience_age_demographics) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Audience Demographics</h4>
                                </div>
                                
                                {/* Tabs */}
                                <div className="flex bg-gray-100 p-0.5 rounded-lg self-start sm:self-auto">
                                    <button
                                        onClick={() => setActiveDemographicsTab('cities')}
                                        className={`px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition-all ${
                                            activeDemographicsTab === 'cities' 
                                                ? 'bg-white text-pink-600 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Top Cities
                                    </button>
                                    <button
                                        onClick={() => setActiveDemographicsTab('age')}
                                        className={`px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold transition-all ${
                                            activeDemographicsTab === 'age' 
                                                ? 'bg-white text-pink-600 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Age Groups
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content: Top Cities */}
                            {activeDemographicsTab === 'cities' && instaData?.engaged_audience_demographics_city && instaData.engaged_audience_demographics_city.length > 0 && (
                                <div className="animate-fadeIn">
                                    {/* Desktop View: Grid of 5 Cards */}
                                    <div className="hidden lg:grid grid-cols-5 gap-3">
                                        {instaData.engaged_audience_demographics_city.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className={`border rounded-xl p-4 flex flex-col justify-between hover:shadow-sm hover:border-pink-300 transition-all text-center relative overflow-hidden group ${
                                                    index === 0 
                                                        ? 'border-pink-200 bg-gradient-to-br from-pink-50/20 to-white' 
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                {/* Rank Number watermark */}
                                                <div className="text-[10px] font-bold text-gray-300 group-hover:text-pink-300 transition-colors text-left mb-1">
                                                    #{index + 1}
                                                </div>
                                                {/* City Name details */}
                                                <div className="flex-1 flex flex-col justify-center min-h-[44px]">
                                                    <div className="text-sm font-semibold text-deep-black truncate">
                                                        {item.city.split(',')[0]}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 truncate mt-0.5">
                                                        {item.city.split(',')[1] || ''}
                                                    </div>
                                                </div>
                                                {/* Percentage badge */}
                                                <div className={`text-base font-bebas tracking-wide font-bold rounded-lg py-1.5 mt-3 ${
                                                    index === 0 
                                                        ? 'bg-pink-100/60 text-pink-600' 
                                                        : 'bg-gray-50 text-pink-600 border border-gray-100'
                                                }`}>
                                                    {item.percentage}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile/Tablet View: Vertical Ranked List Items */}
                                    <div className="lg:hidden space-y-2">
                                        {instaData.engaged_audience_demographics_city.map((item, index) => (
                                            <div 
                                                key={index} 
                                                className={`flex items-center justify-between p-3 border rounded-xl hover:border-pink-200 transition-colors ${
                                                    index === 0 
                                                        ? 'border-pink-100 bg-pink-50/10' 
                                                        : 'border-gray-100 bg-gray-50/50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* Rank Circle */}
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        index === 0 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                    {/* City text details */}
                                                    <div className="min-w-0">
                                                        <span className="text-sm font-semibold text-deep-black block truncate">
                                                            {item.city.split(',')[0]}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 block truncate">
                                                            {item.city.split(',')[1] || ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Percentage Badge */}
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                    index === 0 ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {item.percentage}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab Content: Age Groups */}
                            {activeDemographicsTab === 'age' && instaData?.engaged_audience_age_demographics?.age_distribution && instaData.engaged_audience_age_demographics.age_distribution.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 animate-fadeIn">
                                    {instaData.engaged_audience_age_demographics.age_distribution.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow-sm hover:border-pink-300 transition-all text-center relative overflow-hidden group"
                                        >
                                            <div className="text-[10px] font-bold text-gray-400 mb-1">
                                                Age Group
                                            </div>
                                            <div className="text-sm font-semibold text-deep-black">
                                                {item.age}
                                            </div>
                                            <div className="text-xs font-bebas tracking-wide font-bold bg-pink-50 text-pink-600 rounded-lg py-1.5 mt-2 transition-colors group-hover:bg-pink-100/80">
                                                {item.percentage}%
                                            </div>
                                            <div className="text-[9px] text-gray-400 mt-1 animate-fadeIn">
                                                {item.count} views
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </Card>
    );
};

export default PlatformMetrics;
