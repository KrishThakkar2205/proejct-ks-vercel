import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { Instagram } from 'lucide-react';
import api from '../../utils/api';

const PlatformMetrics = () => {
    const [instaData, setInstaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsConnection, setNeedsConnection] = useState(false);
    const [error, setError] = useState(null);

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
                </>
            )}
        </Card>
    );
};

export default PlatformMetrics;
