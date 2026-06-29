import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import { MapPin, Star, Loader2, Calendar, X, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight, Instagram, Play, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';
import Lightbox from '../../components/ui/Lightbox';

const PublicPortfolio = () => {
    const { influencerId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [isProfilePicLightboxOpen, setIsProfilePicLightboxOpen] = useState(false);
    const [instaMetrics, setInstaMetrics] = useState(null);
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [instaMedia, setInstaMedia] = useState([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedMediaMetrics, setSelectedMediaMetrics] = useState(null);
    const [mediaMetricsLoading, setMediaMetricsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [collaborationModalOpen, setCollaborationModalOpen] = useState(false);
    const [collaborationModalVisible, setCollaborationModalVisible] = useState(false);
    const [submittingCollaboration, setSubmittingCollaboration] = useState(false);
    const [collaborationFormData, setCollaborationFormData] = useState({
        brandName: '',
        contactPersonName: '',
        personEmail: '',
        personPhoneNumber: '',
        businessInfo: '',
        notes: '',
        budget: ''
    });
    const [slideDirection, setSlideDirection] = useState(''); // 'slide-left', 'slide-right', or ''
    const modalTimeoutRef = useRef(null);
    const trackedIdRef = useRef(null);

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

    // Swipe and Navigation state
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const currentIndex = selectedMedia ? instaMedia.findIndex(m => m.id === selectedMedia.id) : -1;

    const handlePrevMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        if (currentIndex > 0) {
            setSlideDirection('slide-right');
            setTimeout(() => {
                setSelectedMedia(instaMedia[currentIndex - 1]);
                setSlideDirection('');
            }, 300); // 300ms matches the CSS transition duration
        }
    }, [currentIndex, instaMedia]);

    const handleNextMedia = useCallback((e) => {
        if (e) e.stopPropagation();
        if (currentIndex > -1 && currentIndex < instaMedia.length - 1) {
            setSlideDirection('slide-left');
            setTimeout(() => {
                setSelectedMedia(instaMedia[currentIndex + 1]);
                setSlideDirection('');
            }, 300);
        }
    }, [currentIndex, instaMedia]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentIndex > -1 && currentIndex < instaMedia.length - 1) {
            handleNextMedia();
        }
        if (isRightSwipe && currentIndex > 0) {
            handlePrevMedia();
        }
    };

    // Animate modal in when selectedMedia is set
    useEffect(() => {
        if (selectedMedia) {
            requestAnimationFrame(() => setModalVisible(true));
        }
        return () => {
            if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
        };
    }, [selectedMedia]);

    const closeModal = useCallback(() => {
        if (videoRef.current) {
            try {
                videoRef.current.pause();
            } catch (err) {
                console.error("Error pausing video on modal close:", err);
            }
        }
        setModalVisible(false);
        modalTimeoutRef.current = setTimeout(() => {
            setSelectedMedia(null);
        }, 200);
    }, []);

    const openCollaborationModal = () => {
        setCollaborationModalOpen(true);
        requestAnimationFrame(() => setCollaborationModalVisible(true));
    };

    const closeCollaborationModal = () => {
        setCollaborationModalVisible(false);
        setTimeout(() => {
            setCollaborationModalOpen(false);
            setCollaborationFormData({
                brandName: '',
                contactPersonName: '',
                personEmail: '',
                personPhoneNumber: '',
                businessInfo: '',
                notes: '',
                budget: ''
            });
        }, 200);
    };

    const handleCollaborationInputChange = (e) => {
        const { name, value } = e.target;
        setCollaborationFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCollaborationSubmit = async (e) => {
        e.preventDefault();
        setSubmittingCollaboration(true);
        try {
            const payload = {
                brand_name: collaborationFormData.brandName,
                contact_person_name: collaborationFormData.contactPersonName,
                person_email: collaborationFormData.personEmail,
                person_phone_number: collaborationFormData.personPhoneNumber,
                business_info: collaborationFormData.businessInfo,
                budget: collaborationFormData.budget,
                notes: collaborationFormData.notes,
                influencer_id: influencerId
            };
            
            await axios.post(`${API_BASE_URL}/api/collab-notification`, payload);
            
            alert('Collaboration request sent successfully!');
            closeCollaborationModal();
        } catch (err) {
            console.error('Failed to send collaboration request:', err);
            const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Failed to send request. Please try again.';
            alert(errorMessage);
        } finally {
            setSubmittingCollaboration(false);
        }
    };

    // Track portfolio view
    useEffect(() => {
        const trackView = async () => {
            if (!influencerId || trackedIdRef.current === influencerId) return;
            trackedIdRef.current = influencerId;
            try {
                // Collect signals safely
                const rawString = `${window.screen.width}x${window.screen.height}|${navigator.language}|${navigator.userAgent}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
                let fingerprintHash = '';
                try {
                    fingerprintHash = btoa(unescape(encodeURIComponent(rawString))).substring(0, 32);
                } catch (e) {
                    fingerprintHash = 'fallback_' + influencerId.substring(0, 10);
                }

                const searchParams = new URLSearchParams(window.location.search);
                const utmSource = searchParams.get('utm_source') || 'direct';
                const referrer = document.referrer || 'direct';
                const deviceType = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

                const payload = {
                    portfolio_id: influencerId,
                    fingerprint_hash: fingerprintHash,
                    utm_source: utmSource,
                    referrer: referrer,
                    device_type: deviceType
                };

                // POST view tracking data silently
                await axios.post(`${API_BASE_URL}/portfolio/trackView`, payload);
            } catch (err) {
                // Fail silently
                console.warn('Tracking view failed silently', err);
            }
        };

        trackView();
    }, [influencerId]);

    // Fetch portfolio data (public endpoint, no auth)
    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/api/portfolio/${influencerId}`);
                setPortfolio(response.data);
            } catch (err) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Portfolio not found.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        if (influencerId) {
            fetchPortfolio();
        }
    }, [influencerId]);

    // Fetch Instagram Metrics
    useEffect(() => {
        const fetchInstaMetrics = async () => {
            try {
                setMetricsLoading(true);
                // We useaxios here directly as it's a public endpoint or auth isn't strict. 
                // But you might need standard `api.get` if it requires backend interceptors.
                // According to prompt, URL is api.influrunner.com/api/insta-portfolio-metric?influencer_id=...
                const response = await axios.get(`${API_BASE_URL}/api/insta-portfolio-metric?influencer_id=${influencerId}`);
                setInstaMetrics(response.data);
            } catch (err) {
                console.error("Failed to fetch Instagram metrics:", err);
                setInstaMetrics(null);
            } finally {
                setMetricsLoading(false);
            }
        };

        if (influencerId) {
            fetchInstaMetrics();
        }
    }, [influencerId]);

    // Fetch Instagram Media
    useEffect(() => {
        const fetchInstaMedia = async () => {
            try {
                setMediaLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/insta-portfolio-media-metric?influencer_id=${influencerId}`);
                if (Array.isArray(response.data)) {
                    setInstaMedia(response.data);
                } else {
                    setInstaMedia([]);
                }
            } catch (err) {
                console.error("Failed to fetch Instagram media:", err);
                setInstaMedia([]);
            } finally {
                setMediaLoading(false);
            }
        };

        if (influencerId) {
            fetchInstaMedia();
        }
    }, [influencerId]);

    // Fetch individual media metrics when a media item is selected
    useEffect(() => {
        const fetchMediaMetrics = async () => {
            if (!selectedMedia || !selectedMedia.id || !influencerId) return;

            try {
                setMediaMetricsLoading(true);
                const mediaType = selectedMedia?.media_type === 'VIDEO' ? 'REELS' : 'POST';
                const response = await axios.get(`${API_BASE_URL}/api/insta-metric-per-media?influencer_id=${influencerId}&media_id=${selectedMedia.id}&media_type=${mediaType}`);
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !portfolio) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-2">Oops!</p>
                    <p className="text-gray-600 text-sm mb-4">{typeof error === 'string' ? error : 'Portfolio not found.'}</p>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </Card>
            </div>
        );
    }

    // Extract data from portfolio response (flat structure)
    const name = portfolio.name || 'Influencer';
    const location = portfolio.location || '';
    const bio = portfolio.bio || '';
    const categories = portfolio.categories || [];
    const categoryList = Array.isArray(categories) ? categories : (categories ? [categories] : []);
    const profilePicture = portfolio.profile_picture || null;
    const reviews = portfolio.reviews || [];

    // Use server-provided stats
    const averageRating = portfolio.avg_rating || 0;
    const totalReviews = portfolio.total_reviews || reviews.length;

    return (
        <div className="min-h-screen bg-[#fafafc] relative overflow-hidden pb-16">
            {/* Ambient Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-orange-300/10 to-pink-300/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[35%] right-[-10%] w-[45%] aspect-square rounded-full bg-gradient-to-br from-pink-300/10 to-purple-300/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[40%] aspect-square rounded-full bg-gradient-to-br from-blue-300/5 to-orange-300/5 blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-6 pt-8 relative z-10">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-xl bg-gradient-to-r from-deep-black via-gray-900 to-deep-black text-white p-8 md:p-12">
                    {/* Background image overlay */}
                    {profilePicture ? (
                        <div
                            className="absolute inset-0 scale-105 opacity-25 pointer-events-none"
                            style={{
                                backgroundImage: `url(${API_BASE_URL}/${profilePicture})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(30px)',
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-orange/20 to-pink-500/20 opacity-30 pointer-events-none" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-85" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        {/* Profile Image with animated gradient ring */}
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-orange via-pink-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div 
                                className={`relative w-36 h-36 bg-gray-950 rounded-full flex items-center justify-center text-primary-orange text-5xl font-bold shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-300`}
                                onClick={() => profilePicture && setIsProfilePicLightboxOpen(true)}
                            >
                                {profilePicture ? (
                                    <img src={`${API_BASE_URL}/${profilePicture}`} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    name.charAt(0)
                                )}
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1 text-center md:text-left flex flex-col justify-between h-full space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                    {categoryList.map((cat, idx) => (
                                        <Badge key={idx} className="bg-white/10 text-white border-white/20 uppercase tracking-widest text-[9px] font-bold px-2.5 py-0.5">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bebas tracking-wide text-white mb-2 leading-none">{name}</h1>
                                
                                {location && (
                                    <div className="flex items-center justify-center md:justify-start gap-1.5 text-gray-300 text-sm mb-3">
                                        <MapPin size={15} className="text-primary-orange" />
                                        <span>{location}</span>
                                    </div>
                                )}
                                
                                {bio && <p className="text-gray-300 text-sm md:text-base max-w-2xl font-light leading-relaxed">{bio}</p>}
                            </div>

                            {/* Direct Connect in Hero */}
                            <div className="pt-2 flex justify-center md:justify-start">
                                <Button
                                    variant="primary"
                                    onClick={openCollaborationModal}
                                    className="px-6 py-2.5 bg-gradient-to-r from-primary-orange to-pink-500 hover:from-orange-500 hover:to-pink-600 border-none text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center gap-2 group text-xs sm:text-sm"
                                >
                                    <span>Let's Collaborate</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative z-10">

                {/* Social Performance & Highlights */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-3xl font-bebas tracking-wide text-deep-black">Social Reach & Highlights</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Key Instagram account stats for the last 30 days</p>
                        </div>
                        {instaMetrics && (
                            <Badge variant="outline" className="bg-pink-50/50 text-pink-600 border-pink-100/60 flex items-center gap-1.5 px-3 py-1 font-semibold text-xs self-start sm:self-auto">
                                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                                @{instaMetrics.username}
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {/* Followers Card */}
                        <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Followers</span>
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-primary-orange flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-deep-black leading-none">
                                {metricsLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : (instaMetrics ? instaMetrics.followers_count.toLocaleString() : '--')}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium">Total active audience size</p>
                        </Card>

                        {/* Total Reach Card */}
                        <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-pink-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reach</span>
                                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-deep-black leading-none">
                                {metricsLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : (instaMetrics ? instaMetrics.reach.toLocaleString() : '--')}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium">Unique accounts reached</p>
                        </Card>

                        {/* Avg Engagement Rate */}
                        <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-purple-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Engagement</span>
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-deep-black leading-none">
                                {metricsLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : (
                                    instaMetrics && instaMetrics.reach > 0
                                        ? ((instaMetrics.total_interactions / instaMetrics.reach) * 100).toFixed(2) + '%'
                                        : '--'
                                )}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium">Interactions/Reach ratio</p>
                        </Card>

                        {/* Total Views */}
                        <Card className="p-4 sm:p-5 bg-white border border-gray-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Views</span>
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold font-bebas text-deep-black leading-none">
                                {metricsLoading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : (instaMetrics ? instaMetrics.views.toLocaleString() : '--')}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 font-medium">Video content plays</p>
                        </Card>
                    </div>
                </div>

                {/* Audience Demographics */}
                {instaMetrics?.engaged_audience_demographics_city && instaMetrics.engaged_audience_demographics_city.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Audience Demographics</h2>
                        <Card className="p-6 md:p-8 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-tr from-primary-orange to-pink-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/10">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bebas tracking-wide text-deep-black text-xl leading-tight">Top Engaged Cities</h3>
                                    <p className="text-xs text-gray-500">Distribution of engaged audience by city location</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                                {instaMetrics.engaged_audience_demographics_city.map((item, idx) => {
                                    const gradients = [
                                        'from-orange-500 to-amber-500',
                                        'from-pink-500 to-rose-500',
                                        'from-purple-500 to-indigo-500',
                                        'from-blue-500 to-cyan-500',
                                        'from-teal-500 to-emerald-500'
                                    ];
                                    const gradClass = gradients[idx % gradients.length];
                                    
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                                                    <span className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r ${gradClass}`}></span>
                                                    {item.city}
                                                </span>
                                                <span className="font-bold text-gray-800">{item.percentage}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${gradClass} rounded-full transition-all duration-1000 ease-out`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Recent Content Performance */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Recent Content Performance</h2>
                    <Card className="p-6 border border-gray-100 bg-white rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                            <h3 className="font-bebas tracking-wide text-deep-black text-lg">Instagram Posts</h3>
                        </div>
                        {mediaLoading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
                            </div>
                        ) : instaMedia.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    {instaMedia.slice(0, visibleCount).map((media) => (
                                        <div
                                            key={media.id}
                                            className="group relative aspect-[3/4] bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-300 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer select-none"
                                            onClick={() => setSelectedMedia(media)}
                                        >
                                            {media.thumbnail_url || media.media_url ? (
                                                <img
                                                    src={media.thumbnail_url || media.media_url}
                                                    alt="Instagram content"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-90 group-hover:blur-[1px]"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Instagram className="w-10 h-10 text-pink-200" />
                                                </div>
                                            )}

                                            {/* Hover Center Indicator */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                                                    <Eye size={20} className="text-white" />
                                                </div>
                                            </div>

                                            {/* Media Type Overlay */}
                                            {media.media_type === 'VIDEO' && (
                                                <div className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm shadow-md z-10">
                                                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Overlay for text readability - desktop hover only */}
                                            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Caption & Details glass block - desktop hover only */}
                                            <div className="hidden sm:flex absolute bottom-3 left-3 right-3 p-3 bg-black/45 backdrop-blur-md rounded-xl border border-white/10 text-white flex-col items-start gap-1 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-left">
                                                <p className="text-xs font-semibold text-white/95 line-clamp-2 leading-snug drop-shadow-md w-full">
                                                    {media.caption || <span className="text-gray-300/80 italic">No caption</span>}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[9px] text-white/70">
                                                    <Calendar size={10} className="text-white/60" />
                                                    <span>{media.timestamp ? new Date(media.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'N/A'}</span>
                                                    <span className="text-white/30">•</span>
                                                    <span className="font-bold text-pink-400 tracking-wider uppercase text-[8px]">
                                                        {media.media_type || 'POST'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {visibleCount < instaMedia.length && (
                                    <div className="flex justify-center mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => setVisibleCount(prev => prev + 6)}
                                            className="px-8 py-2.5 border border-gray-200 hover:border-orange-300 hover:text-primary-orange transition-all duration-300 font-semibold text-xs uppercase tracking-wider bg-white rounded-xl shadow-sm hover:shadow"
                                        >
                                            Load More Content
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-4 p-6 bg-pink-50/50 rounded-xl border border-pink-100/55 text-left">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 text-pink-500 shadow-sm">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">No media found</p>
                                    <p className="text-xs text-gray-500">Instagram portfolio posts are currently empty.</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black">Client Reviews</h2>

                        {/* Reviews Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-transparent border border-orange-100 hover:shadow-md transition-shadow rounded-2xl flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Average Rating</p>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-5xl font-bebas tracking-wide text-deep-black">
                                            {averageRating.toFixed(1)}
                                        </h3>
                                        <div className="space-y-1">
                                            <StarRating rating={averageRating} size="sm" />
                                            <p className="text-[10px] text-gray-500">Based on {totalReviews} reviews</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-150 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-primary-orange">
                                        <Star size={16} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600">Top-rated collaboration partner</span>
                                </div>
                            </Card>

                            <Card className="p-6 md:col-span-2 border border-gray-100 bg-white rounded-2xl shadow-sm">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                                    Rating Distribution
                                </h3>
                                <div className="space-y-2.5">
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = reviews.filter(r => r.rating === stars).length;
                                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                                        return (
                                            <div key={stars} className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 w-14">
                                                    <span className="text-xs font-bold text-gray-700">{stars}</span>
                                                    <Star className="text-primary-orange" size={13} fill="currentColor" />
                                                </div>
                                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary-orange to-orange-500 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 w-8 text-right font-medium">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        {/* Recent Reviews List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews
                                .sort((a, b) => new Date(b.created_at || b.submitted_at || 0) - new Date(a.created_at || a.submitted_at || 0))
                                .map((review, idx) => (
                                    <Card key={review.id || idx} className="p-6 border border-gray-100 bg-white hover:shadow-md transition-shadow rounded-2xl flex flex-col justify-between text-left relative overflow-hidden">
                                        {/* Decorative quote mark */}
                                        <span className="absolute top-2 right-4 text-7xl font-serif text-gray-100 pointer-events-none select-none">“</span>
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h4 className="font-bold text-deep-black text-sm mb-0.5">
                                                        {review.reviewer_name || 'Anonymous'}
                                                    </h4>
                                                    <StarRating rating={review.rating || 0} size="xs" showNumber />
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                    <Calendar size={11} />
                                                    {new Date(review.created_at || review.submitted_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic pr-4">
                                                "{review.review || ''}"
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )}

                {/* Empty Reviews State */}
                {reviews.length === 0 && (
                    <div>
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Client Reviews</h2>
                        <Card className="p-12 text-center border border-gray-100 bg-white rounded-2xl shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-300">
                                <Star size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-1">No Reviews Yet</h3>
                            <p className="text-gray-400 text-xs sm:text-sm max-w-sm mx-auto">Reviews will appear here once clients submit feedback for completed campaigns.</p>
                        </Card>
                    </div>
                )}

                {/* CTA Section */}
                <Card className="p-8 md:p-12 bg-gradient-to-r from-deep-black via-gray-900 to-deep-black text-white text-center rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-orange/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-pink-500/5 rounded-full blur-[60px] pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bebas tracking-wide leading-none">Interested in Collaborating?</h2>
                        <p className="text-gray-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-light">
                            I'm always open to exciting brand partnerships, content creations, and creative collaborations. Let's build a spectacular campaign together!
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={openCollaborationModal}
                                className="inline-flex bg-gradient-to-r from-primary-orange to-pink-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] transition-all text-xs sm:text-sm uppercase tracking-wider"
                            >
                                Get in Touch Now
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Footer */}
            <div className="bg-deep-black text-white py-10 border-t border-white/5 relative z-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500">
                        Powered by <span className="font-bebas text-primary-orange text-sm tracking-widest ml-1">INFLURUNNER</span>
                    </p>
                </div>
            </div>
            {/* Media Detail Modal */}
            {
                selectedMedia && createPortal(
                    <div
                        className={`fixed inset-0 z-[9999] overflow-y-auto backdrop-blur-sm transition-all duration-200 ease-out ${modalVisible ? 'bg-black/60' : 'bg-black/0'
                            }`}
                        onClick={closeModal}
                    >
                        <div className="flex items-center justify-center min-h-full p-4">
                            <div
                                className={`bg-white rounded-xl shadow-2xl w-auto min-w-[320px] max-w-[95vw] overflow-hidden transition-all duration-200 ease-out flex flex-col ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header - always on top */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                        </svg>
                                        <h3 className="font-bebas tracking-wide text-lg text-deep-black">Instagram Post</h3>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Body: side-by-side on desktop, stacked on mobile */}
                                <div
                                    className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto"
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    {/* Media Preview */}
                                    <div className="w-full md:w-[500px] lg:w-[600px] bg-black flex items-center justify-center relative aspect-square md:aspect-auto md:max-h-[85vh] group/media shrink-0 overflow-hidden">
                                        {/* Navigation Buttons (Large Screen) */}
                                        {currentIndex > 0 && (
                                            <button
                                                onClick={handlePrevMedia}
                                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm"
                                                aria-label="Previous Media"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                        {currentIndex > -1 && currentIndex < instaMedia.length - 1 && (
                                            <button
                                                onClick={handleNextMedia}
                                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm"
                                                aria-label="Next Media"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        )}

                                        {/* Animation wrapper for media */}
                                        <div
                                            className={`w-full h-full flex items-center justify-center transition-all duration-300 ease-out transform ${slideDirection === 'slide-left' ? '-translate-x-full opacity-0' :
                                                slideDirection === 'slide-right' ? 'translate-x-full opacity-0' :
                                                    'translate-x-0 opacity-100'
                                                }`}
                                        >
                                            {selectedMedia?.media_type === 'VIDEO' ? (
                                                <video
                                                    key={`video-${selectedMedia.id}`}
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
                                                    key={`img-${selectedMedia?.id || 'none'}`}
                                                    src={selectedMedia?.media_url}
                                                    alt="Instagram post"
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>

                                        {/* Custom Center Play/Pause Overlay Button */}
                                        {selectedMedia?.media_type === 'VIDEO' && (
                                            <button 
                                                onClick={togglePlay}
                                                className={`absolute inset-0 m-auto w-14 h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-300 transform backdrop-blur-[2px] z-10 ${isPlaying ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100 shadow-lg'}`}
                                            >
                                                <Play size={24} className="fill-white translate-x-[2px]" />
                                            </button>
                                        )}

                                        {/* Custom Floating Volume/Speaker Control */}
                                        {selectedMedia?.media_type === 'VIDEO' && (
                                            <button 
                                                onClick={toggleMute}
                                                className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-md border border-white/10"
                                                title={isMuted ? "Unmute" : "Mute"}
                                            >
                                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                            </button>
                                        )}

                                        {/* Overlay Caption on the media on the left bottom corner */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 pb-7 bg-gradient-to-t from-black/95 via-black/65 to-transparent flex flex-col justify-end text-left pointer-events-none select-none z-10">
                                            <span className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-extrabold block mb-1">Caption</span>
                                            <h2 className="text-sm font-bold text-white tracking-wide leading-relaxed line-clamp-3 select-text pointer-events-auto max-h-[100px] overflow-y-auto scrollbar-none">
                                                {selectedMedia?.caption || <span className="italic text-gray-400">No caption available for this post.</span>}
                                            </h2>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium mt-2">
                                                <Calendar size={13} className="text-gray-300" />
                                                <span>
                                                    {selectedMedia?.timestamp ? new Date(selectedMedia.timestamp).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Custom Progress Bar at the very bottom of the media player container */}
                                        {selectedMedia?.media_type === 'VIDEO' && (
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

                                    {/* Content Panel */}
                                    <div className="w-full md:w-80 lg:w-96 p-4 md:p-6 flex flex-col bg-white shrink-0 border-t md:border-t-0 md:border-l border-gray-100 relative min-w-0">
                                        <div className="flex-1">
                                            {selectedMedia?.timestamp && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Published Date</p>
                                                    <p className="text-sm font-medium text-deep-black">
                                                        {new Date(selectedMedia.timestamp).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Media Metrics Display */}
                                            <div className="mb-6">
                                                <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Performance Metrics</p>
                                                {mediaMetricsLoading ? (
                                                    <div className="flex justify-center items-center py-4">
                                                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                                    </div>
                                                ) : selectedMediaMetrics ? (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <Eye size={14} className="text-blue-500" />
                                                                <span className="text-xs text-gray-500">Views</span>
                                                            </div>
                                                            <p className="font-semibold text-deep-black">{selectedMediaMetrics.views?.toLocaleString() || '--'}</p>
                                                        </div>
                                                        <div className="bg-pink-50 p-3 rounded-lg text-center">
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <Heart size={14} className="text-pink-500" />
                                                                <span className="text-xs text-gray-500">Interactions</span>
                                                            </div>
                                                            <p className="font-semibold text-deep-black">{selectedMediaMetrics.total_interactions?.toLocaleString() || '--'}</p>
                                                        </div>
                                                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <MessageCircle size={14} className="text-primary-orange" />
                                                                <span className="text-xs text-gray-500">Shares</span>
                                                            </div>
                                                            <p className="font-semibold text-deep-black">{selectedMediaMetrics.shares?.toLocaleString() || '--'}</p>
                                                        </div>
                                                        <div className="bg-green-50 p-3 rounded-lg text-center">
                                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                                </svg>
                                                                <span className="text-xs text-gray-500">Reach</span>
                                                            </div>
                                                            <p className="font-semibold text-deep-black">{selectedMediaMetrics.reach?.toLocaleString() || '--'}</p>
                                                        </div>

                                                        {/* Engagement Rate calculated locally since API might only return base metrics */}
                                                        {selectedMediaMetrics.reach > 0 && (
                                                            <div className="col-span-2 p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-primary-orange/20 rounded-lg text-center mt-1">
                                                                <p className="text-xs text-gray-600 mb-1">Engagement Rate (Interactions / Reach)</p>
                                                                <p className="text-xl font-bebas tracking-wide text-primary-orange">
                                                                    {((selectedMediaMetrics.total_interactions / selectedMediaMetrics.reach) * 100).toFixed(2)}%
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400">Metrics unavailable</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
            {/* Collaboration Modal */}
            {collaborationModalOpen && (
                <div
                    className={`fixed inset-0 z-[100] overflow-y-auto backdrop-blur-sm transition-all duration-300 ease-out flex items-center justify-center p-4 ${collaborationModalVisible ? 'bg-black/60' : 'bg-black/0'}`}
                    onClick={closeCollaborationModal}
                >
                    <div
                        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transition-all duration-300 ease-out transform ${collaborationModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50">
                            <h3 className="text-2xl font-bebas tracking-wide text-deep-black">Connect with {name}</h3>
                            <button onClick={closeCollaborationModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleCollaborationSubmit} className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Brand Name *</label>
                                    <input
                                        required
                                        type="text"
                                        name="brandName"
                                        placeholder="e.g. Acme Corp"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.brandName}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Contact Person Name *</label>
                                    <input
                                        required
                                        type="text"
                                        name="contactPersonName"
                                        placeholder="Your Full Name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.contactPersonName}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Person Email *</label>
                                    <input
                                        required
                                        type="email"
                                        name="personEmail"
                                        placeholder="work@brand.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.personEmail}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Person Phone Number</label>
                                    <input
                                        type="tel"
                                        name="personPhoneNumber"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.personPhoneNumber}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Business Info *</label>
                                <textarea
                                    required
                                    name="businessInfo"
                                    rows="3"
                                    placeholder="Tell more about your business and brand objectives."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm resize-none"
                                    value={collaborationFormData.businessInfo}
                                    onChange={handleCollaborationInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Budget</label>
                                    <input
                                        type="text"
                                        name="budget"
                                        placeholder="e.g. $1000 - $5000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.budget}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Notes</label>
                                    <input
                                        type="text"
                                        name="notes"
                                        placeholder="Any additional requests or notes"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-orange focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                        value={collaborationFormData.notes}
                                        onChange={handleCollaborationInputChange}
                                    />
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-gray-50">
                                <button
                                    type="button"
                                    onClick={closeCollaborationModal}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all text-sm"
                                    disabled={submittingCollaboration}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-orange to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                                    disabled={submittingCollaboration}
                                >
                                    {submittingCollaboration ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending Request...
                                        </>
                                    ) : (
                                        'Send Collaboration Request'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Profile Picture Lightbox */}
            {profilePicture && (
                <Lightbox
                    isOpen={isProfilePicLightboxOpen}
                    onClose={() => setIsProfilePicLightboxOpen(false)}
                    imageSrc={`${API_BASE_URL}/${profilePicture}`}
                    imageAlt={`${name}'s Profile Picture`}
                    caption={`${name}'s Profile Picture`}
                />
            )}
        </div >
    );
};

export default PublicPortfolio;
