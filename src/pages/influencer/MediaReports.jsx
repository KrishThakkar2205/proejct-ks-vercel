import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
    Instagram, Eye, Heart, MessageCircle, Share2, Copy, Check, 
    ExternalLink, Loader2, X, ChevronLeft, ChevronRight, BarChart2,
    Calendar, TrendingUp, AlertCircle, Bookmark, Percent, Clock, SkipForward,
    Play, Pause, Volume2, VolumeX
} from 'lucide-react';
import api, { API_BASE_URL } from '../../utils/api';

const MediaReports = () => {
    const authUser = useSelector(state => state.auth.user);
    const influencerId = authUser?.influencer_id || authUser?.id || authUser?.email_id;

    // Loading & Error States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [needsConnection, setNeedsConnection] = useState(false);

    // Media & Metric States
    const [instaMedia, setInstaMedia] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedMediaMetrics, setSelectedMediaMetrics] = useState(null);
    const [mediaMetricsLoading, setMediaMetricsLoading] = useState(false);
    
    // Copy feedback states
    const [copiedId, setCopiedId] = useState(null);
    const [modalCopied, setModalCopied] = useState(false);

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

    // Reset video player states when selectedMedia changes
    useEffect(() => {
        setIsPlaying(true);
        setIsMuted(false);
        setVideoProgress(0);
    }, [selectedMedia]);

    // Fetch Recent 20 Instagram Media
    const fetchMedia = useCallback(async () => {
        if (!influencerId) return;
        try {
            setLoading(true);
            setError(null);
            setNeedsConnection(false);

            // Fetch the media posts for the logged-in influencer
            const response = await api.get(`/api/insta-portfolio-media-metric?influencer_id=${influencerId}`);
            
            if (Array.isArray(response.data)) {
                // Keep the recent 20 medias
                setInstaMedia(response.data.slice(0, 20));
            } else {
                setInstaMedia([]);
            }
        } catch (err) {
            console.error("Error fetching Instagram media for dashboard:", err);
            if (err.response?.status === 404) {
                setNeedsConnection(true);
            } else {
                setError("Failed to fetch Instagram media. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [influencerId]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    // Fetch individual media metrics when a post is clicked
    useEffect(() => {
        const fetchMediaMetrics = async () => {
            if (!selectedMedia || !selectedMedia.id || !influencerId) return;

            try {
                setMediaMetricsLoading(true);
                const mediaType = selectedMedia.media_type === 'VIDEO' ? 'REELS' : 'POST';
                const response = await api.get(`/api/insta-metric-per-media?influencer_id=${influencerId}&media_id=${selectedMedia.id}&media_type=${mediaType}`);
                setSelectedMediaMetrics(response.data);
            } catch (err) {
                console.error("Failed to fetch specific media metrics:", err);
                setSelectedMediaMetrics(null);
            } finally {
                setMediaMetricsLoading(false);
            }
        };

        fetchMediaMetrics();
    }, [selectedMedia, influencerId]);

    // Copy public share link to clipboard
    const getShareUrl = (mediaId) => {
        return `${window.location.origin}/media-report/${influencerId}/${mediaId}`;
    };

    const handleCopyLink = (e, mediaId, isModal = false) => {
        if (e) e.stopPropagation();
        const url = getShareUrl(mediaId);
        
        navigator.clipboard.writeText(url).then(() => {
            if (isModal) {
                setModalCopied(true);
                setTimeout(() => setModalCopied(false), 2000);
            } else {
                setCopiedId(mediaId);
                setTimeout(() => setCopiedId(null), 2000);
            }
        });
    };

    // Instagram Connect integration
    const handleConnectInstagram = async () => {
        try {
            const response = await api.get('/api/social-media/connect/instagram');
            if (response.data?.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            console.error("Error connecting Instagram:", err);
            alert("Failed to connect Instagram. Please check your credentials and try again.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Instagram Reports</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        View performance analytics of your recent 20 posts and generate shareable metric reports for brands.
                    </p>
                </div>
                {!needsConnection && !loading && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchMedia}
                        className="self-start sm:self-center"
                    >
                        Refresh Feed
                    </Button>
                )}
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-orange mb-4" />
                    <p className="font-medium animate-pulse">Fetching Instagram feed...</p>
                </div>
            ) : needsConnection ? (
                /* Connect Instagram View */
                <Card className="p-8 max-w-xl mx-auto text-center border-2 border-dashed border-pink-200 bg-gradient-to-br from-pink-50/50 via-white to-orange-50/50 my-10 shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-md shadow-pink-500/20">
                        <Instagram size={40} />
                    </div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black mb-3">Link Your Instagram Business Account</h2>
                    <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        To analyze content performance and share individual post reports with brands, connect your professional or creator Instagram account.
                    </p>
                    <button
                        onClick={handleConnectInstagram}
                        className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mx-auto text-sm tracking-wide"
                    >
                        <Instagram size={18} className="mr-2.5" />
                        Connect Instagram Professional Account
                    </button>
                </Card>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-10 h-10 mb-4" />
                    <p className="font-medium">{error}</p>
                    <Button
                        variant="outline"
                        onClick={fetchMedia}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            ) : instaMedia.length === 0 ? (
                <Card className="p-12 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Instagram className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bebas tracking-wide text-gray-700 mb-2">No Content Found</h3>
                    <p className="text-gray-500 text-sm">We couldn't retrieve any media posts from your Instagram account. Try creating some posts or reconnecting.</p>
                    <Button variant="primary" className="mt-6" onClick={fetchMedia}>
                        Retry Fetch
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
                    {instaMedia.map((media) => (
                        <div 
                            key={media.id} 
                            className="group relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden border border-gray-100 hover:border-pink-300 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer select-none"
                            onClick={() => setSelectedMedia(media)}
                        >
                            {media.thumbnail_url || media.media_url ? (
                                <img 
                                    src={media.thumbnail_url || media.media_url} 
                                    alt="Instagram content" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Instagram className="w-12 h-12 text-pink-200" />
                                </div>
                            )}

                            {/* Media Type Overlays */}
                            {media.media_type === 'VIDEO' && (
                                <div className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm shadow-md z-10">
                                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:via-black/50" />

                            {/* Caption & Details Overlay in Right Bottom Corner */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col items-end text-right text-white space-y-1 sm:space-y-1.5 z-10">
                                <p className="text-xs sm:text-sm font-semibold text-white/95 line-clamp-2 leading-snug drop-shadow-md max-w-[90%]">
                                    {media.caption || <span className="text-gray-300/80 italic">No caption</span>}
                                </p>
                                <div className="flex flex-col items-end gap-1.5 text-[10px] sm:text-xs text-white/80">
                                    <span className="flex items-center gap-1 font-medium bg-black/30 px-1.5 py-0.5 rounded-md backdrop-blur-[2px]">
                                        <Calendar size={11} className="text-white/70" />
                                        {media.timestamp ? new Date(media.timestamp).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Unknown Date'}
                                    </span>
                                    <span className="font-bold text-pink-400 bg-pink-950/70 px-1.5 py-0.5 rounded-md backdrop-blur-[2px] border border-pink-500/20 text-[9px] uppercase tracking-wider">
                                        {media.media_type || 'POST'}
                                    </span>
                                </div>
                            </div>

                            {/* Share Quick Button (on Hover) */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedMedia(media);
                                    }}
                                    className="p-2.5 bg-white text-deep-black hover:text-pink-600 rounded-xl shadow-md transition-all transform hover:scale-110 flex items-center gap-1.5 font-semibold text-xs"
                                    title="Analyze Metrics"
                                >
                                    <BarChart2 size={16} />
                                    Analyze
                                </button>
                                <button 
                                    onClick={(e) => handleCopyLink(e, media.id, false)}
                                    className="p-2.5 bg-white text-deep-black hover:text-orange-500 rounded-xl shadow-md transition-all transform hover:scale-110 flex items-center gap-1.5 font-semibold text-xs"
                                    title="Copy Public Link"
                                >
                                    {copiedId === media.id ? (
                                        <>
                                            <Check size={16} className="text-green-500" />
                                            <span className="text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Share Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Analysis Modal */}
            {selectedMedia && createPortal(
                <div 
                    className="fixed inset-0 z-[9999] overflow-y-auto backdrop-blur-sm bg-black/60 flex items-center justify-center p-4 transition-opacity duration-300"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div 
                        className="bg-[#121214] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-scaleUp border border-[#27272a]/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button - Absolute on mobile */}
                        <button 
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 z-20 md:hidden bg-black/60 text-white hover:bg-black/80 p-2 rounded-full backdrop-blur-sm transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Media Display Panel (Left) - Dark slate background */}
                        <div className="w-full md:w-1/2 bg-[#1b2234] flex flex-col justify-center p-6 relative min-h-[380px] md:min-h-0 border-r border-[#27272a]/20">
                            {/* Media Player Container */}
                            <div className="relative flex-1 flex items-center justify-center rounded-xl overflow-hidden bg-black/40 aspect-[3/4] md:aspect-auto md:max-h-[75vh]">
                                {selectedMedia.media_type === 'VIDEO' ? (
                                    <video 
                                        ref={videoRef}
                                        src={selectedMedia.media_url} 
                                        controls={false} 
                                        autoPlay 
                                        loop
                                        onTimeUpdate={handleTimeUpdate}
                                        onClick={togglePlay}
                                        className="w-full h-full object-contain cursor-pointer"
                                    />
                                ) : (
                                    <img 
                                        src={selectedMedia.media_url} 
                                        alt="Instagram post display" 
                                        className="w-full h-full object-contain"
                                    />
                                )}

                                {/* Custom Center Play/Pause Overlay Button */}
                                {selectedMedia.media_type === 'VIDEO' && (
                                    <button 
                                        onClick={togglePlay}
                                        className={`absolute inset-0 m-auto w-14 h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 transform backdrop-blur-[2px] z-10 ${isPlaying ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 shadow-lg'}`}
                                    >
                                        <Play size={24} className="fill-white translate-x-[2px]" />
                                    </button>
                                )}

                                {/* Custom Floating Volume/Speaker Control */}
                                {selectedMedia.media_type === 'VIDEO' && (
                                    <button 
                                        onClick={toggleMute}
                                        className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-md border border-white/10"
                                        title={isMuted ? "Unmute" : "Mute"}
                                    >
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>
                                )}

                                {/* Overlay Caption on the video on the left bottom corner */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 pb-7 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col justify-end text-left pointer-events-none select-none z-10">
                                    <span className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-extrabold block mb-1">Caption</span>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed line-clamp-3 select-text pointer-events-auto max-h-[120px] overflow-y-auto scrollbar-none">
                                        {selectedMedia.caption || <span className="italic text-gray-400">No caption.</span>}
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium mt-2.5">
                                        <Calendar size={13} className="text-gray-300" />
                                        <span>
                                            {selectedMedia.timestamp ? new Date(selectedMedia.timestamp).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Custom Progress Bar at the very bottom of the media player container */}
                                {selectedMedia.media_type === 'VIDEO' && (
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/25 cursor-pointer overflow-hidden backdrop-blur-[1px] hover:h-2 transition-all duration-200 z-10"
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

                        {/* Performance Details Panel (Right) - Lighter Dark Charcoal background */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-[#121214] text-white overflow-y-auto max-h-[55vh] md:max-h-[85vh] scrollbar-thin">
                            {/* Modal Header */}
                            <div className="hidden md:flex items-center justify-between pb-4 border-b border-[#27272a]/40 mb-5 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-500/10">
                                        <Instagram size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-white leading-tight">Post metrics</h3>
                                        <span className="text-xs text-gray-400">Instagram Insights</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-[#202024] transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Performance Grid */}
                            <div className="space-y-5">
                                {mediaMetricsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                        <Loader2 className="w-6 h-6 animate-spin text-pink-500 mb-2" />
                                        <p className="text-xs">Fetching real-time metrics...</p>
                                    </div>
                                ) : selectedMediaMetrics ? (
                                    <div className="space-y-6">
                                        {/* Reach & Views Section */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Reach & Views</h4>
                                            <div className="grid grid-cols-2 gap-3.5">
                                                {/* Reach */}
                                                <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                    <BarChart2 className="w-5 h-5 text-orange-500 mb-2 group-hover:scale-105 transition-transform" />
                                                    <span className="text-xs text-gray-400 font-medium">Reach</span>
                                                    <span className="text-xl font-bold text-orange-500 mt-1">{selectedMediaMetrics.reach?.toLocaleString() || '--'}</span>
                                                </div>
                                                {/* Impressions/Views */}
                                                <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                    <Eye className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-105 transition-transform" />
                                                    <span className="text-xs text-gray-400 font-medium">Views / Impressions</span>
                                                    <span className="text-xl font-bold text-blue-500 mt-1">{selectedMediaMetrics.views?.toLocaleString() || '--'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Engagement Section */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Engagement</h4>
                                            <div className="grid grid-cols-2 gap-3.5">
                                                {/* Interactions */}
                                                <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                    <Heart className="w-5 h-5 text-pink-500 mb-2 group-hover:scale-105 transition-transform" />
                                                    <span className="text-xs text-gray-400 font-medium">Interactions</span>
                                                    <span className="text-xl font-bold text-pink-500 mt-1">{selectedMediaMetrics.total_interactions?.toLocaleString() || '--'}</span>
                                                </div>
                                                {/* Shares */}
                                                <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                    <Share2 className="w-5 h-5 text-green-500 mb-2 group-hover:scale-105 transition-transform" />
                                                    <span className="text-xs text-gray-400 font-medium">Shares</span>
                                                    <span className="text-xl font-bold text-green-500 mt-1">{selectedMediaMetrics.shares?.toLocaleString() || '0'}</span>
                                                </div>
                                                {/* Saved */}
                                                {selectedMediaMetrics.saved !== undefined && (
                                                    <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                        <Bookmark className="w-5 h-5 text-purple-500 mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-xs text-gray-400 font-medium">Saved</span>
                                                        <span className="text-xl font-bold text-purple-500 mt-1">{selectedMediaMetrics.saved?.toLocaleString() ?? '0'}</span>
                                                    </div>
                                                )}
                                                {/* Reels Skip Rate */}
                                                {selectedMediaMetrics.reels_skip_rate !== undefined && (
                                                    <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                        <SkipForward className="w-5 h-5 text-rose-500 mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-xs text-gray-400 font-medium">Skip rate</span>
                                                        <span className="text-xl font-bold text-rose-500 mt-1">
                                                            {selectedMediaMetrics.reels_skip_rate !== null ? `${selectedMediaMetrics.reels_skip_rate}%` : '--'}
                                                        </span>
                                                        {selectedMediaMetrics.reels_skip_rate !== null && (
                                                            <div className="w-full h-1 bg-gray-700/60 rounded-full mt-2 overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-rose-500 rounded-full"
                                                                    style={{ width: `${Math.min(selectedMediaMetrics.reels_skip_rate, 100)}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Avg Watch Time */}
                                                {selectedMediaMetrics.ig_reels_avg_watch_time !== undefined && (
                                                    <div className="bg-[#1e1e22] border border-[#2e2e34]/30 rounded-xl p-4 flex flex-col justify-between hover:border-[#2e2e34]/60 transition-all duration-300 group">
                                                        <Clock className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-xs text-gray-400 font-medium">Avg Watch Time</span>
                                                        <span className="text-xl font-bold text-indigo-500 mt-1">
                                                            {selectedMediaMetrics.ig_reels_avg_watch_time !== null ? `${(selectedMediaMetrics.ig_reels_avg_watch_time / 1000).toFixed(2)}s` : '--'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Engagement Rate Card */}
                                        {selectedMediaMetrics.reach > 0 && (
                                            <div className="bg-[#1e1e22]/50 border border-[#2e2e34]/30 rounded-xl p-4 mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-pink-500 flex items-center gap-1.5">
                                                        <TrendingUp size={14} />
                                                        Engagement Rate
                                                    </span>
                                                    <span className="text-lg font-bold text-pink-500">
                                                        {((selectedMediaMetrics.total_interactions / selectedMediaMetrics.reach) * 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-[#2d2d34] rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                                                        style={{ width: `${Math.min(((selectedMediaMetrics.total_interactions / selectedMediaMetrics.reach) * 100) * 5, 100)}%` }} // Scaled visual representation
                                                    />
                                                </div>
                                                <p className="text-[9px] text-gray-500 mt-1.5">Calculated: Interactions / Reach * 100</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#1e1e22] p-4 rounded-xl text-center text-xs text-gray-400 border border-[#2e2e34]/30">
                                        Insights metrics are currently unavailable for this post. Make sure your business profile is synchronized.
                                    </div>
                                )}
                            </div>

                            {/* Share Report & Actions (Footer) */}
                            <div className="mt-8 pt-6 border-t border-[#27272a]/40 space-y-3 flex-shrink-0">
                                <button
                                    onClick={() => handleCopyLink(null, selectedMedia.id, true)}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-95 text-white font-semibold rounded-xl transition-all shadow-md shadow-pink-500/10 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                                >
                                    {modalCopied ? (
                                        <>
                                            <Check size={16} />
                                            Share Link Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Share2 size={16} />
                                            Copy Shareable Report Link
                                        </>
                                    )}
                                </button>
                                <a 
                                    href={getShareUrl(selectedMedia.id)} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-full py-2.5 px-4 bg-[#1e1e22] border border-[#2e2e34]/60 hover:bg-[#25252b] text-gray-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <ExternalLink size={15} />
                                    Open Public Report Page
                                </a>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MediaReports;
