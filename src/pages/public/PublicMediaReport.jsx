import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { 
    Instagram, Eye, Heart, MessageCircle, Share2, 
    Calendar, TrendingUp, MapPin, Loader2, 
    Award, Bookmark, Percent, Clock, SkipForward, BarChart2,
    AlertCircle, Play, Volume2, VolumeX
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

    // Custom Video Player States & Refs
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().catch(err => console.log("Play interrupted:", err));
            setIsPlaying(true);
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (!videoRef.current) return;
        const newMuted = !isMuted;
        videoRef.current.muted = newMuted;
        setIsMuted(newMuted);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setVideoProgress(progress || 0);
    };

    const handleProgressClick = (e) => {
        if (e) e.stopPropagation();
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newPercentage = clickX / width;
        videoRef.current.currentTime = newPercentage * videoRef.current.duration;
        setVideoProgress(newPercentage * 100);
    };

    // Reset video player states when report loads or changes
    useEffect(() => {
        setIsPlaying(true);
        setIsMuted(false);
        setVideoProgress(0);
    }, [mediaId]);

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

                const [portfolioRes, mediaListRes] = await Promise.all([
                    portfolioPromise,
                    mediaListPromise
                ]);

                if (portfolioRes && portfolioRes.data) {
                    setPortfolio(portfolioRes.data);
                }

                let matchedMedia = null;
                if (mediaListRes && Array.isArray(mediaListRes.data)) {
                    matchedMedia = mediaListRes.data.find(
                        item => item.id?.toString() === mediaId.toString()
                    );
                    setMediaItem(matchedMedia || null);
                }

                // 3. Fetch specific media performance metrics with mediaType
                const mediaType = matchedMedia?.media_type === 'VIDEO' ? 'REELS' : 'POST';
                const metricsRes = await axios.get(`${API_BASE_URL}/api/insta-metric-per-media?influencer_id=${influencerId}&media_id=${mediaId}&media_type=${mediaType}`)
                    .catch(err => {
                        console.error("Failed to fetch media metrics:", err);
                        return null;
                    });

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
                    <p className="text-gray-600 text-sm">{error || "The requested Instagram media report does not exist or has been removed."}</p>
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
            {/* Main Content Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12 space-y-8 print:p-0 print:max-w-full print:w-full">

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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block">
                    {/* Left Column: Creator Profile (Span 3 on desktop) */}
                    <div className="lg:col-span-3 print:hidden">
                        {/* Creator Profile Summary Card */}
                        <Card className="!p-0 border border-gray-100 bg-white shadow-md relative overflow-hidden flex flex-col gap-4">
                            {/* Decorative Instagram Gradient Accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 z-10" />
                            
                            {/* Square Creator Image Container with Overlay Name */}
                            <div className="w-full aspect-square bg-orange-100 relative overflow-hidden">
                                {profilePicture ? (
                                    <img src={`${API_BASE_URL}/${profilePicture}`} alt={influencerName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary-orange text-6xl font-bold font-bebas bg-orange-50">
                                        {influencerName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Dark Gradient Overlay for overlay readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 text-left">
                                    <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-1.5 leading-tight">
                                        {influencerName}
                                        <Badge className="!bg-pink-500/20 !text-pink-300 border border-pink-500/30 font-sans flex items-center gap-0.5 font-semibold text-[9px] py-0.5 px-1.5 backdrop-blur-[2px]">
                                            <Award size={10} />
                                            Verified
                                        </Badge>
                                    </h2>
                                </div>
                            </div>

                            {/* Creator Details (Location, Categories, Bio) below image */}
                            <div className="px-5 pb-5 space-y-4">
                                <div className="flex flex-col gap-2.5 text-sm text-gray-500">
                                    {location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={15} className="text-gray-400" />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-1.5">
                                        {categoryList.map((cat, idx) => (
                                            <Badge key={idx} className="bg-gray-100 text-gray-600 border-none font-sans text-[11px] py-0.5 px-2.5">
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                {portfolio?.bio && (
                                    <div className="border-t border-gray-100 pt-3">
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            {portfolio.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Media Preview & Metrics (Span 9 on desktop) */}
                    <div className="lg:col-span-9 print:w-full print:p-0 print:m-0">
                        {/* Report Layout Grid (Media & Metrics) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm print:block print:border-none">
                            {/* Left Panel: Media Preview & Caption (Span 5) - Clean white background */}
                            <div className="md:col-span-5 bg-white flex flex-col justify-center p-6 relative rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-gray-100 min-h-[450px] md:min-h-0 print:bg-white print:text-black print:border-none print:p-0 print:m-0 print:min-h-0">
                                {/* Media Player Container */}
                                <div className="relative flex-1 flex items-center justify-center rounded-xl overflow-hidden bg-black/40 aspect-square md:aspect-auto md:max-h-[75vh] print:bg-none print:border print:border-gray-200">
                                    {mediaItem?.media_type === 'VIDEO' ? (
                                        <video 
                                            ref={videoRef}
                                            src={mediaItem.media_url} 
                                            controls={false}
                                            autoPlay
                                            loop
                                            onTimeUpdate={handleTimeUpdate}
                                            onClick={togglePlay}
                                            className="w-full h-full object-contain cursor-pointer"
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

                                    {/* Custom Center Play/Pause Overlay Button */}
                                    {mediaItem?.media_type === 'VIDEO' && (
                                        <button 
                                            onClick={togglePlay}
                                            className={`absolute inset-0 m-auto w-14 h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 transform backdrop-blur-[2px] z-10 print:hidden ${isPlaying ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 shadow-lg'}`}
                                        >
                                            <Play size={24} className="fill-white translate-x-[2px]" />
                                        </button>
                                    )}

                                    {/* Custom Floating Volume/Speaker Control */}
                                    {mediaItem?.media_type === 'VIDEO' && (
                                        <button 
                                            onClick={toggleMute}
                                            className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-md border border-white/10 print:hidden"
                                            title={isMuted ? "Unmute" : "Mute"}
                                        >
                                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                        </button>
                                    )}

                                    {/* Overlay Caption on the video on the left bottom corner */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-7 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col justify-end text-left pointer-events-none select-none z-10 print:bg-none print:text-black print:relative print:p-4">
                                        <span className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-extrabold block mb-1">Caption</span>
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white print:text-black tracking-wide leading-relaxed line-clamp-3 select-text pointer-events-auto max-h-[120px] overflow-y-auto scrollbar-none">
                                            {mediaItem?.caption || <span className="italic text-gray-400">No caption available for this post.</span>}
                                        </h2>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-300 print:text-gray-500 font-medium mt-2.5">
                                            <Calendar size={13} className="text-gray-300 print:text-gray-400" />
                                            <span>
                                                {mediaItem?.timestamp ? new Date(mediaItem.timestamp).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Custom Progress Bar at the very bottom of the media player container */}
                                    {mediaItem?.media_type === 'VIDEO' && (
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/25 cursor-pointer overflow-hidden backdrop-blur-[1px] hover:h-2 transition-all duration-200 z-10 print:hidden"
                                            onClick={handleProgressClick}
                                        >
                                            <div 
                                                className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 transition-all duration-75"
                                                style={{ width: `${videoProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel: Metrics (Span 7) - Clean white background */}
                            <div className="md:col-span-7 p-6 md:p-8 flex flex-col bg-white text-gray-800 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none justify-between border-t md:border-t-0 md:border-l border-gray-100 print:bg-white print:text-black print:p-0 print:border-none print:mt-6">
                                <div>
                                    {/* Header */}
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-5 print:border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-500/10 print:shadow-none">
                                            <Instagram size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-gray-900 print:text-black leading-tight">Post metrics</h3>
                                            <span className="text-xs text-gray-500 print:text-gray-500">Instagram Insights</span>
                                        </div>
                                    </div>

                                    {/* Performance Grid */}
                                    <div className="space-y-6">
                                        {mediaMetrics ? (
                                            <div className="space-y-6">
                                                {/* Reach & Views Section */}
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 print:text-gray-400">Reach & Views</h4>
                                                    <div className="grid grid-cols-2 gap-3.5">
                                                        {/* Reach */}
                                                        <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                            <BarChart2 className="w-5 h-5 text-orange-500 mb-2 group-hover:scale-105 transition-transform" />
                                                            <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Reach</span>
                                                            <span className="text-xl font-bold text-orange-500 mt-1">{mediaMetrics.reach?.toLocaleString() || '--'}</span>
                                                        </div>
                                                        {/* Impressions/Views */}
                                                        <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                            <Eye className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-105 transition-transform" />
                                                            <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Views / Impressions</span>
                                                            <span className="text-xl font-bold text-blue-500 mt-1">{mediaMetrics.views?.toLocaleString() || '--'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Engagement Section */}
                                                <div className="space-y-3">
                                                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 print:text-gray-400">Engagement</h4>
                                                    <div className="grid grid-cols-2 gap-3.5">
                                                        {/* Interactions */}
                                                        <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                            <Heart className="w-5 h-5 text-pink-500 mb-2 group-hover:scale-105 transition-transform" />
                                                            <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Interactions</span>
                                                            <span className="text-xl font-bold text-pink-500 mt-1">{mediaMetrics.total_interactions?.toLocaleString() || '--'}</span>
                                                        </div>
                                                        {/* Shares */}
                                                        <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                            <Share2 className="w-5 h-5 text-green-500 mb-2 group-hover:scale-105 transition-transform" />
                                                            <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Shares</span>
                                                            <span className="text-xl font-bold text-green-600 mt-1">{mediaMetrics.shares?.toLocaleString() || '0'}</span>
                                                        </div>
                                                        {/* Saved */}
                                                        {mediaMetrics.saved !== undefined && (
                                                            <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                                <Bookmark className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-105 transition-transform" />
                                                                <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Saved</span>
                                                                <span className="text-xl font-bold text-purple-500 mt-1">{mediaMetrics.saved?.toLocaleString() ?? '0'}</span>
                                                            </div>
                                                        )}
                                                        {/* Reels Skip Rate */}
                                                        {mediaMetrics.reels_skip_rate !== undefined && (
                                                            <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                                <SkipForward className="w-5 h-5 text-rose-500 mb-2 group-hover:scale-105 transition-transform" />
                                                                <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Skip rate</span>
                                                                <span className="text-xl font-bold text-rose-500 mt-1">
                                                                    {mediaMetrics.reels_skip_rate !== null ? `${mediaMetrics.reels_skip_rate}%` : '--'}
                                                                </span>
                                                                {mediaMetrics.reels_skip_rate !== null && (
                                                                    <div className="w-full h-1 bg-gray-200 print:bg-gray-200 rounded-full mt-2 overflow-hidden">
                                                                        <div 
                                                                            className="h-full bg-rose-500 rounded-full"
                                                                            style={{ width: `${Math.min(mediaMetrics.reels_skip_rate, 100)}%` }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Avg Watch Time */}
                                                        {mediaMetrics.ig_reels_avg_watch_time !== undefined && (
                                                            <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 hover:shadow-sm transition-all duration-300 group">
                                                                <Clock className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-105 transition-transform" />
                                                                <span className="text-xs text-gray-500 print:text-gray-600 font-medium">Avg Watch Time</span>
                                                                <span className="text-xl font-bold text-indigo-500 mt-1">
                                                                    {mediaMetrics.ig_reels_avg_watch_time !== null ? `${(mediaMetrics.ig_reels_avg_watch_time / 1000).toFixed(2)}s` : '--'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Engagement Rate Card */}
                                                {engagementRate && (
                                                    <div className="bg-gray-50 print:bg-gray-50 border border-gray-100 print:border-gray-200 rounded-xl p-4 mt-3">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-pink-500 flex items-center gap-1.5">
                                                                <TrendingUp size={14} />
                                                                Engagement Rate
                                                            </span>
                                                            <span className="text-lg font-bold text-pink-500">
                                                                {engagementRate}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 print:bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                                                                style={{ width: `${Math.min(parseFloat(engagementRate) * 5, 100)}%` }} // Scaled visual representation
                                                            />
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 mt-1.5">Calculated: Interactions / Reach * 100</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-4 rounded-xl text-center text-xs text-gray-500 border border-gray-100">
                                                Insights metrics are currently unavailable for this post. Make sure your business profile is synchronized.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
