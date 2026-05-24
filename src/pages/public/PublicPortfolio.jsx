import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import { MapPin, Star, Loader2, Calendar, X, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

const PublicPortfolio = () => {
    const { influencerId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [portfolio, setPortfolio] = useState(null);
    const [instaMetrics, setInstaMetrics] = useState(null);
    const [metricsLoading, setMetricsLoading] = useState(true);
    const [instaMedia, setInstaMedia] = useState([]);
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
                const response = await axios.get(`${API_BASE_URL}/api/insta-metric-per-media?influencer_id=${influencerId}&media_id=${selectedMedia.id}`);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
            {/* Hero Section */}
            <div className="relative text-white py-16 px-6 overflow-hidden">
                {/* Blurred background image */}
                {profilePicture ? (
                    <div
                        className="absolute inset-0 scale-110"
                        style={{
                            backgroundImage: `url(${API_BASE_URL}/${profilePicture})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(20px) brightness(0.6)',
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-orange to-orange-600" />
                )}
                {/* Semi-transparent overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-primary-orange/40" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Profile Image */}
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary-orange text-5xl font-bold shadow-2xl overflow-hidden">
                            {profilePicture ? (
                                <img src={`${API_BASE_URL}/${profilePicture}`} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                name.charAt(0)
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide mb-2">{name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                {location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        <span className="text-orange-100">{location}</span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {categoryList.map((cat, idx) => (
                                        <Badge key={idx} className="bg-white/20 text-white border-white/30">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {bio && <p className="text-lg text-orange-100 max-w-2xl">{bio}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

                {/* Social Media Reach */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Social Media Reach</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Instagram Card */}
                        <Card className="p-6 border border-pink-200 bg-gradient-to-br from-pink-50 to-orange-50">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bebas tracking-wide text-deep-black">
                                        Instagram {instaMetrics && <span className="text-gray-500 font-sans font-normal text-sm ml-2">@{instaMetrics.username}</span>}
                                    </h3>
                                    <p className="text-xs text-gray-500">Last 30 days (Excl. today)</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Followers</span>
                                    {metricsLoading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : (
                                        <span className="font-semibold text-deep-black">
                                            {instaMetrics ? instaMetrics.followers_count.toLocaleString() : '--'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Engagement Rate</span>
                                    {metricsLoading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : (
                                        <span className="font-semibold text-pink-500">
                                            {instaMetrics && instaMetrics.reach > 0
                                                ? ((instaMetrics.total_interactions / instaMetrics.reach) * 100).toFixed(2) + '%'
                                                : '--'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total Interactions</span>
                                    {metricsLoading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : (
                                        <span className="font-semibold text-deep-black">
                                            {instaMetrics ? instaMetrics.total_interactions.toLocaleString() : '--'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Performance Highlights */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black">Performance Highlights</h2>
                        <p className="text-sm text-gray-500 mt-1">Last 30 days (excluding today)</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Total Reach */}
                        <Card className="p-5 text-center bg-orange-50">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bebas tracking-wide text-deep-black">
                                {metricsLoading ? <Loader2 size={24} className="animate-spin text-gray-400 mx-auto" /> : (instaMetrics ? instaMetrics.reach.toLocaleString() : '--')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Total Reach</p>
                        </Card>
                        {/* Avg Engagement */}
                        <Card className="p-5 text-center bg-pink-50">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bebas tracking-wide text-deep-black">
                                {metricsLoading ? <Loader2 size={24} className="animate-spin text-gray-400 mx-auto" /> : (
                                    instaMetrics && instaMetrics.reach > 0
                                        ? ((instaMetrics.total_interactions / instaMetrics.reach) * 100).toFixed(2) + '%'
                                        : '--'
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Avg Engagement</p>
                        </Card>
                        {/* Accounts Engaged */}
                        <Card className="p-5 text-center bg-green-50">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bebas tracking-wide text-deep-black">
                                {metricsLoading ? <Loader2 size={24} className="animate-spin text-gray-400 mx-auto" /> : (instaMetrics ? instaMetrics.accounts_engaged.toLocaleString() : '--')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Accounts Engaged</p>
                        </Card>
                        {/* Views */}
                        <Card className="p-5 text-center bg-blue-50">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bebas tracking-wide text-deep-black">
                                {metricsLoading ? <Loader2 size={24} className="animate-spin text-gray-400 mx-auto" /> : (instaMetrics ? instaMetrics.views.toLocaleString() : '--')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Total Views</p>
                        </Card>
                    </div>
                </div>

                {/* Recent Content Performance */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Recent Content Performance</h2>
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                            <h3 className="font-bebas tracking-wide text-deep-black">Instagram Posts</h3>
                        </div>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {mediaLoading ? (
                                <div className="flex justify-center p-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : instaMedia.length > 0 ? (
                                instaMedia.map((media) => (
                                    <div
                                        key={media.id}
                                        className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-pink-300 hover:shadow-sm transition-all"
                                        onClick={() => setSelectedMedia(media)}
                                    >
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                            {media.thumbnail_url || media.media_url ? (
                                                <img
                                                    src={media.thumbnail_url || media.media_url}
                                                    alt="Instagram post thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204...z" />
                                                </svg>
                                            )}
                                            {media.media_type === 'VIDEO' && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            {media.timestamp && (
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {new Date(media.timestamp).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-deep-black line-clamp-2">
                                                {media.caption || 'No caption'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">No media found</p>
                                        <p className="text-xs text-gray-400">Come back later for new content</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {reviews.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Client Reviews</h2>

                        {/* Reviews Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-primary-orange">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Average Rating</p>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-5xl font-bebas tracking-wide text-deep-black">
                                                {averageRating.toFixed(1)}
                                            </h3>
                                            <StarRating rating={averageRating} size="lg" />
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Based on {totalReviews} reviews</p>
                                    </div>
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Star className="text-white" size={40} fill="currentColor" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-bebas tracking-wide text-deep-black mb-4">
                                    Rating Distribution
                                </h3>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = reviews.filter(r => r.rating === stars).length;
                                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                                        return (
                                            <div key={stars} className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 w-16">
                                                    <span className="text-sm font-medium text-gray-700">{stars}</span>
                                                    <Star className="text-primary-orange" size={14} fill="currentColor" />
                                                </div>
                                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-orange rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        {/* Recent Reviews */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews
                                .sort((a, b) => new Date(b.created_at || b.submitted_at || 0) - new Date(a.created_at || a.submitted_at || 0))
                                .map((review, idx) => (
                                    <Card key={review.id || idx} className="p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-deep-black mb-1">
                                                    {review.reviewer_name || 'Anonymous'}
                                                </h4>
                                                <StarRating rating={review.rating || 0} size="sm" showNumber />
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar size={14} />
                                                {new Date(review.created_at || review.submitted_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                            {review.review || ''}
                                        </p>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )}

                {/* Empty Reviews State */}
                {reviews.length === 0 && (
                    <div>
                        <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Client Reviews</h2>
                        <Card className="p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="text-gray-400" size={40} />
                            </div>
                            <h3 className="text-xl font-bebas tracking-wide text-gray-700 mb-2">No Reviews Yet</h3>
                            <p className="text-gray-500 text-sm">Reviews will appear here once clients submit feedback.</p>
                        </Card>
                    </div>
                )}

                {/* CTA Section */}
                <Card className="p-8 bg-gradient-to-r from-primary-orange to-orange-600 text-white text-center">
                    <h2 className="text-3xl font-bebas tracking-wide mb-3">Interested in Collaborating?</h2>
                    <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                        I'm always open to exciting brand partnerships and creative collaborations. Let's create something amazing together!
                    </p>
                    <button
                        onClick={openCollaborationModal}
                        className="inline-block bg-white text-primary-orange px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                    >
                        Get in Touch
                    </button>
                </Card>
            </div>

            {/* Footer */}
            <div className="bg-deep-black text-white py-8 text-center">
                <p className="text-sm text-gray-400">
                    Powered by <span className="font-bebas text-primary-orange">INFLURUNNER</span>
                </p>
            </div>
            {/* Media Detail Modal */}
            {
                selectedMedia && (
                    <div
                        className={`fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm transition-all duration-200 ease-out ${modalVisible ? 'bg-black/60' : 'bg-black/0'
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
                                    <div className="w-full md:w-auto bg-black md:bg-transparent flex items-start md:items-center justify-center relative md:max-h-[85vh] group/media shrink-0">
                                        {/* Navigation Buttons (Large Screen) */}
                                        {currentIndex > 0 && (
                                            <button
                                                onClick={handlePrevMedia}
                                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm"
                                                aria-label="Previous Media"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                        {currentIndex > -1 && currentIndex < instaMedia.length - 1 && (
                                            <button
                                                onClick={handleNextMedia}
                                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-all backdrop-blur-sm"
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
                                                    src={selectedMedia.media_url}
                                                    autoPlay
                                                    className="w-auto h-auto max-w-full max-h-[60vh] md:max-h-[80vh] md:max-w-full lg:max-w-full object-contain block mx-auto rounded-none md:rounded-bl-xl"
                                                />
                                            ) : (
                                                <img
                                                    key={`img-${selectedMedia?.id || 'none'}`}
                                                    src={selectedMedia?.media_url}
                                                    alt="Instagram post"
                                                    className="w-auto h-auto max-w-full max-h-[60vh] md:max-h-[80vh] md:max-w-full lg:max-w-full object-contain block mx-auto rounded-none md:rounded-bl-xl"
                                                />
                                            )}
                                        </div>
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

                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Caption</p>
                                                <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                                                    {selectedMedia?.caption || 'No caption available.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        </div >
    );
};

export default PublicPortfolio;
