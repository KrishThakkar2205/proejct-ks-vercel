import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Instagram, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const PlatformMetrics = () => {
    const [instaData, setInstaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [credentialsNotFound, setCredentialsNotFound] = useState(false);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        const fetchInstaData = async () => {
            try {
                const response = await api.get('/api/dashboard-insta-metric');
                setInstaData(response.data);
            } catch (error) {
                if (
                    error.response?.status === 404 &&
                    error.response?.data?.detail === 'Credentials not found'
                ) {
                    setCredentialsNotFound(true);
                } else {
                    console.error("Error fetching instagram metrics:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInstaData();
    }, []);

    const handleConnectInstagram = async () => {
        try {
            setConnecting(true);
            const response = await api.get('/api/social-media/connect/instagram');
            if (response.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            console.error("Error connecting Instagram:", err);
            alert(err.response?.data?.detail || 'Failed to connect Instagram. Please try again.');
        } finally {
            setConnecting(false);
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

    // Show Connect Instagram card when credentials are not found
    if (credentialsNotFound) {
        return (
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Instagram Metrics</h2>
                        <p className="text-sm text-gray-600 mt-1">Track your performance on Instagram</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-pink-50 via-orange-50 to-white rounded-2xl border border-dashed border-orange-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Instagram size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-deep-black mb-2">Connect Your Instagram</h3>
                    <p className="text-sm text-gray-500 text-center max-w-sm mb-5">
                        Link your Instagram account to view follower count, reach, engagement, and more — all in one place.
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleConnectInstagram}
                        disabled={connecting}
                        className="px-8"
                        style={{
                            background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
                            boxShadow: '0 4px 20px rgba(225,48,108,0.35)',
                        }}
                    >
                        {connecting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Connecting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Instagram size={18} />
                                Connect Instagram
                            </span>
                        )}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Instagram Metrics</h2>
                    <p className="text-sm text-gray-600 mt-1">Track your performance on Instagram</p>
                </div>
            </div>

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
                        {loading ? '...' : formatNumber(data.followers)}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">Reach</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {loading ? '...' : formatNumber(data.reach)}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">Accounts Engaged</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {loading ? '...' : formatNumber(data.accountsEngaged)}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                </div>

                <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="text-sm text-gray-500 mb-1">Total Interactions</p>
                    <h3 className="text-2xl font-bebas tracking-wide text-deep-black">
                        {loading ? '...' : formatNumber(data.totalInteractions)}
                    </h3>
                    <span className="text-xs text-gray-600 mt-1 inline-block">Total</span>
                </div>
            </div>
        </Card>
    );
};

export default PlatformMetrics;
