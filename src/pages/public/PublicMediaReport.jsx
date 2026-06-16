import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { 
    Instagram, Eye, Heart, MessageCircle, Share2, Printer, 
    Calendar, TrendingUp, MapPin, Loader2, ArrowLeft, ExternalLink,
    Award
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const PublicMediaReport = () => {
    const { influencerId, mediaId } = useParams();

    // Data states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [mediaItem, setMediaItem] = useState(null);
    const [mediaMetrics, setMediaMetrics] = useState(null);

    useEffect(() => {
        const fetchReportData = async () => {
            if (!influencerId || !mediaId) return;
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch influencer public portfolio details
                const portfolioPromise = axios.get(`${API_BASE_URL}/api/portfolio/${influencerId}`)
                    .catch(err => {
                        console.error("Failed to fetch influencer portfolio:", err);
                        return null;
                    });

                // 2. Fetch influencer Instagram media list to locate the specific media metadata
                const mediaListPromise = axios.get(`${API_BASE_URL}/api/insta-portfolio-media-metric?influencer_id=${influencerId}`)
                    .catch(err => {
                        console.error("Failed to fetch media list:", err);
                        return null;
                    });

                // 3. Fetch specific media performance metrics
                const metricsPromise = axios.get(`${API_BASE_URL}/api/insta-metric-per-media?influencer_id=${influencerId}&media_id=${mediaId}`)
                    .catch(err => {
                        console.error("Failed to fetch media metrics:", err);
                        return null;
                    });

                const [portfolioRes, mediaListRes, metricsRes] = await Promise.all([
                    portfolioPromise,
                    mediaListPromise,
                    metricsPromise
                ]);

                if (portfolioRes && portfolioRes.data) {
                    setPortfolio(portfolioRes.data);
                }

                if (mediaListRes && Array.isArray(mediaListRes.data)) {
                    const matchedMedia = mediaListRes.data.find(
                        item => item.id?.toString() === mediaId.toString()
                    );
                    setMediaItem(matchedMedia || null);
                }

                if (metricsRes && metricsRes.data) {
                    setMediaMetrics(metricsRes.data);
                }

                // If both media metadata and metrics are missing, we consider it a fail
                if (!mediaListRes?.data && !metricsRes?.data) {
                    setError("Media report data could not be found. The media ID might be incorrect or deleted.");
                }

            } catch (err) {
                console.error("General error loading public media report:", err);
                setError("An error occurred while generating the report. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [influencerId, mediaId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 size={44} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600 font-medium animate-pulse">Generating performance report...</p>
                </div>
            </div>
        );
    }

    if (error || (!mediaItem && !mediaMetrics)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md shadow-lg border border-red-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <p className="text-red-600 font-bold text-lg mb-2">Failed to Load Report</p>
                    <p className="text-gray-600 text-sm mb-6">{error || "The requested Instagram media report does not exist or has been removed."}</p>
                    <Link to="/">
                        <button className="px-6 py-2.5 bg-gradient-to-r from-primary-orange to-orange-600 text-white rounded-xl shadow-md font-semibold hover:opacity-90 transition-opacity">
                            Return to Homepage
                        </button>
                    </Link>
                </Card>
            </div>
        );
    }

    // Extract influencer details
    const influencerName = portfolio?.name || 'Content Creator';
    const profilePicture = portfolio?.profile_picture || null;
    const location = portfolio?.location || '';
    const categories = portfolio?.categories || [];
    const categoryList = Array.isArray(categories) ? categories : (categories ? [categories] : []);

    // Calculate Engagement Rate
    const reach = mediaMetrics?.reach || 0;
    const interactions = mediaMetrics?.total_interactions || 0;
    const engagementRate = reach > 0 ? ((interactions / reach) * 100).toFixed(2) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex flex-col font-sans">
            {/* Report Header - Hidden when printing */}
            <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm print:hidden sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="InfluRunner Logo" className="h-8 w-auto" />
                    <span className="h-4 w-[1px] bg-gray-200 hidden sm:block"></span>
                    <span className="text-sm font-semibold text-gray-500 hidden sm:block">Post Analytics Report</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all shadow-sm"
                    >
                        <Printer size={16} />
                        <span className="hidden sm:inline">Print / Save PDF</span>
                    </button>
                    {portfolio && (
                        <Link to={`/portfolio/${influencerId}`}>
                            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary-orange to-orange-600 text-white rounded-xl hover:opacity-95 shadow-md shadow-orange-500/10 transition-all">
                                <ExternalLink size={14} />
                                View Portfolio
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content Body */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-8 print:p-0 print:max-w-full print:w-full">
                {/* Back button link - Hidden when printing */}
                {portfolio && (
                    <Link 
                        to={`/portfolio/${influencerId}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-orange transition-colors print:hidden"
                    >
                        <ArrowLeft size={16} />
                        Back to Portfolio
                    </Link>
                )}

                {/* Print Branded Header - Visible ONLY when printing */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-gray-200 pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Instagram Content Performance Report</h1>
                        <p className="text-sm text-gray-500 mt-1">Generated by InfluRunner • Verified Creator Insights</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-orange-500 tracking-wide">INFLURUNNER</h2>
                        <p className="text-xs text-gray-400">www.influrunner.com</p>
                    </div>
                </div>

                {/* Creator Profile Summary Card */}
                <Card className="p-6 md:p-8 border border-gray-100 bg-white shadow-md relative overflow-hidden">
                    {/* Decorative Instagram Gradient Border Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500" />
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Creator Avatar */}
                        <div className="w-20 h-20 bg-orange-100 rounded-full overflow-hidden shadow-inner flex-shrink-0 border-2 border-white">
                            {profilePicture ? (
                                <img src={`${API_BASE_URL}/${profilePicture}`} alt={influencerName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary-orange text-3xl font-bold font-bebas">
                                    {influencerName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Creator Meta Details */}
                        <div className="flex-1 text-center sm:text-left space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                                <h2 className="text-2xl font-bold text-deep-black flex items-center gap-2 justify-center sm:justify-start">
                                    {influencerName}
                                    <Badge className="bg-pink-50 text-pink-600 border-pink-100 font-sans flex items-center gap-1 font-semibold">
                                        <Award size={12} />
                                        Verified Influencer
                                    </Badge>
                                </h2>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                                {location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={15} className="text-gray-400" />
                                        <span>{location}</span>
                                    </div>
                                )}
                                <span className="hidden sm:inline text-gray-300">•</span>
                                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                                    {categoryList.map((cat, idx) => (
                                        <Badge key={idx} className="bg-gray-100 text-gray-600 border-none font-sans text-xs">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            
                            {portfolio?.bio && (
                                <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                                    {portfolio.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Report Layout Grid (Media & Metrics) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Panel: Media Preview (Span 5) */}
                    <div className="md:col-span-5 space-y-4">
                        <Card className="overflow-hidden bg-black aspect-square flex items-center justify-center shadow-lg border border-gray-100 select-none print:shadow-none print:border-gray-200">
                            {mediaItem?.media_type === 'VIDEO' ? (
                                <video 
                                    src={mediaItem.media_url} 
                                    controls 
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img 
                                    src={mediaItem?.media_url || mediaMetrics?.media_url} 
                                    alt="Instagram performance content" 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-media.png'; // Fallback
                                    }}
                                />
                            )}
                        </Card>
                        
                        {/* Publication Date Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 bg-white p-4 rounded-xl border border-gray-100 shadow-sm print:shadow-none">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                <strong>Published Date:</strong> 
                                {mediaItem?.timestamp ? new Date(mediaItem.timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </span>
                            <span className="font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                                {mediaItem?.media_type || 'POST'}
                            </span>
                        </div>
                    </div>

                    {/* Right Panel: Metrics & Caption (Span 7) */}
                    <div className="md:col-span-7 space-y-6">
                        
                        {/* Metrics Report Details */}
                        <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-md print:shadow-none print:border-gray-200">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                                <Instagram className="text-pink-500" size={22} />
                                <h3 className="text-xl font-bold text-deep-black">Verified Post Metrics</h3>
                            </div>

                            {mediaMetrics ? (
                                <div className="space-y-6">
                                    {/* 4 Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Reach */}
                                        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 flex items-start gap-3">
                                            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl mt-0.5">
                                                <TrendingUp size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 font-semibold">Total Reach</span>
                                                <span className="text-2xl font-bold text-orange-600 mt-1">
                                                    {mediaMetrics.reach?.toLocaleString() || '--'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Views */}
                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl mt-0.5">
                                                <Eye size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 font-semibold">Views / Impressions</span>
                                                <span className="text-2xl font-bold text-blue-600 mt-1">
                                                    {mediaMetrics.views?.toLocaleString() || '--'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Interactions */}
                                        <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50 flex items-start gap-3">
                                            <div className="p-2 bg-pink-100 text-pink-600 rounded-xl mt-0.5">
                                                <Heart size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 font-semibold">Interactions</span>
                                                <span className="text-2xl font-bold text-pink-600 mt-1">
                                                    {mediaMetrics.total_interactions?.toLocaleString() || '--'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Shares */}
                                        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 flex items-start gap-3">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-xl mt-0.5">
                                                <Share2 size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 font-semibold">Post Shares</span>
                                                <span className="text-2xl font-bold text-green-600 mt-1">
                                                    {mediaMetrics.shares?.toLocaleString() || '--'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Engagement Gauge */}
                                    {engagementRate && (
                                        <div className="bg-gradient-to-br from-pink-500/5 to-orange-500/5 border border-pink-500/10 rounded-2xl p-5">
                                            <div className="flex justify-between items-center mb-2.5">
                                                <span className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                                                    <TrendingUp size={16} />
                                                    Engagement Rate
                                                </span>
                                                <span className="text-xl font-bold text-pink-600">
                                                    {engagementRate}%
                                                </span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                {/* Engagement visual layout indicator */}
                                                <div 
                                                    className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(parseFloat(engagementRate) * 5, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
                                                <span>Calculated from total interactions / reach</span>
                                                <span className="font-semibold text-pink-500 bg-pink-50/50 px-2 py-0.5 rounded">Verified Stats</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-xl text-center text-xs text-gray-500 border border-gray-100">
                                    Insights metrics are currently unavailable for this post. Make sure your business profile is synchronized.
                                </div>
                            )}
                        </Card>

                        {/* Caption Text Card */}
                        <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-md print:shadow-none print:border-gray-200">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Post Caption</h4>
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap select-text">
                                {mediaItem?.caption || <span className="italic text-gray-400">No caption available for this post.</span>}
                            </p>
                        </Card>
                    </div>
                </div>

                {/* Collaboration CTA Banner - Hidden when printing */}
                {portfolio && (
                    <Card className="p-8 bg-gradient-to-r from-primary-orange to-orange-600 text-white text-center shadow-lg print:hidden">
                        <h3 className="text-2xl font-bebas tracking-wide mb-2">Interested in Collaborating with {influencerName}?</h3>
                        <p className="text-orange-100 text-sm mb-6 max-w-xl mx-auto">
                            Get in touch to check campaign availabilities, request custom content pricing, and start a partnership!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link to={`/portfolio/${influencerId}`}>
                                <button className="w-full sm:w-auto px-8 py-3 bg-white text-primary-orange font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-md text-sm">
                                    View Creator Portfolio
                                </button>
                            </Link>
                        </div>
                    </Card>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-deep-black text-white py-6 text-center text-xs text-gray-400 mt-auto border-t border-gray-950">
                <p>Powered by <span className="font-bebas text-primary-orange text-sm">INFLURUNNER</span></p>
                <p className="text-[10px] text-gray-500 mt-1 select-none">© {new Date().getFullYear()} InfluRunner Technologies LLP. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default PublicMediaReport;
