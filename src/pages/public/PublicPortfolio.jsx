import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/ui/StarRating';
import { Instagram, Facebook, Youtube, MapPin, TrendingUp, Users, Heart, MessageCircle, Eye, X, ChevronLeft, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import { MOCK_INFLUENCER_DATA } from '../../data/mockData';

const PublicPortfolio = () => {
    const { username } = useParams();
    const { profile, socialMedia, reviews } = MOCK_INFLUENCER_DATA;
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [slideDirection, setSlideDirection] = useState('right');

    const openMediaModal = (media, platform, index) => {
        setSelectedMedia({ ...media, platform });
        setCurrentIndex(index);
        setIsClosing(false);
        setSlideDirection('right');
    };

    const closeMediaModal = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedMedia(null);
            setIsClosing(false);
        }, 300);
    }, []);

    // Swipe handlers
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
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    const handleNext = useCallback(() => {
        if (!selectedMedia) return;

        const list = selectedMedia.platform === 'instagram'
            ? socialMedia?.instagram?.recentPosts
            : socialMedia?.youtube?.recentVideos;

        // Stop at the last item
        if (list && currentIndex < list.length - 1) {
            setSlideDirection('right');
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSelectedMedia({ ...list[nextIndex], platform: selectedMedia.platform });
        }
    }, [currentIndex, selectedMedia, socialMedia]);

    const handlePrev = useCallback(() => {
        if (!selectedMedia) return;

        const list = selectedMedia.platform === 'instagram'
            ? socialMedia?.instagram?.recentPosts
            : socialMedia?.youtube?.recentVideos;

        // Stop at the first item
        if (currentIndex > 0) {
            setSlideDirection('left');
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setSelectedMedia({ ...list[prevIndex], platform: selectedMedia.platform });
        }
    }, [currentIndex, selectedMedia, socialMedia]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedMedia) return;

            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') closeMediaModal();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedMedia, handleNext, handlePrev, closeMediaModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-orange to-orange-600 text-white py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Profile Image */}
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary-orange text-5xl font-bold shadow-2xl">
                            {profile.name.charAt(0)}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide mb-2">{profile.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <span className="text-orange-100">{profile.location}</span>
                                </div>
                                <div className="flex gap-2">
                                    {profile.categories.map((cat, idx) => (
                                        <Badge key={idx} className="bg-white/20 text-white border-white/30">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg text-orange-100 max-w-2xl">{profile.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                {/* Social Media Stats */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Social Media Reach</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Instagram */}
                        <Card className="p-6 bg-gradient-to-br from-pink-50 to-orange-50 border-2 border-pink-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Instagram size={32} className="text-pink-600" />
                                <div>
                                    <h3 className="font-semibold text-deep-black">Instagram</h3>
                                    <p className="text-sm text-gray-600">{socialMedia.instagram.username}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Followers</span>
                                    <span className="text-xl font-bebas text-deep-black">
                                        {socialMedia.instagram.followers.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Engagement Rate</span>
                                    <span className="text-lg font-bold text-pink-600">
                                        {socialMedia.instagram.engagementRate}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Avg Likes</span>
                                    <span className="text-md font-semibold text-gray-700">
                                        {socialMedia.instagram.avgLikes.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Facebook */}
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Facebook size={32} className="text-blue-600" />
                                <div>
                                    <h3 className="font-semibold text-deep-black">Facebook</h3>
                                    <p className="text-sm text-gray-600">{socialMedia.facebook.username}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Followers</span>
                                    <span className="text-xl font-bebas text-deep-black">
                                        {socialMedia.facebook.followers.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Engagement Rate</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {socialMedia.facebook.engagementRate}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Avg Likes</span>
                                    <span className="text-md font-semibold text-gray-700">
                                        {socialMedia.facebook.avgLikes.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* YouTube */}
                        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Youtube size={32} className="text-red-600" />
                                <div>
                                    <h3 className="font-semibold text-deep-black">YouTube</h3>
                                    <p className="text-sm text-gray-600">{socialMedia.youtube.username}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subscribers</span>
                                    <span className="text-xl font-bebas text-deep-black">
                                        {socialMedia.youtube.subscribers.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Engagement Rate</span>
                                    <span className="text-lg font-bold text-red-600">
                                        {socialMedia.youtube.engagementRate}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Avg Views</span>
                                    <span className="text-md font-semibold text-gray-700">
                                        {socialMedia.youtube.avgViews.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Overall Stats */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Performance Highlights</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                            <Users className="mx-auto mb-2 text-primary-orange" size={32} />
                            <p className="text-3xl font-bebas text-deep-black">
                                {(socialMedia.instagram.followers + socialMedia.facebook.followers + socialMedia.youtube.subscribers).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Total Reach</p>
                        </Card>
                        <Card className="p-6 text-center bg-gradient-to-br from-pink-50 to-pink-100">
                            <Heart className="mx-auto mb-2 text-pink-600" size={32} />
                            <p className="text-3xl font-bebas text-deep-black">
                                {((socialMedia.instagram.engagementRate + socialMedia.facebook.engagementRate + socialMedia.youtube.engagementRate) / 3).toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Avg Engagement</p>
                        </Card>
                        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
                            <TrendingUp className="mx-auto mb-2 text-green-600" size={32} />
                            <p className="text-3xl font-bebas text-deep-black">3</p>
                            <p className="text-sm text-gray-600 mt-1">Platforms</p>
                        </Card>
                        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <MessageCircle className="mx-auto mb-2 text-blue-600" size={32} />
                            <p className="text-3xl font-bebas text-deep-black">
                                {profile.categories.length}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Categories</p>
                        </Card>
                    </div>
                </div>

                {/* Recent Performance */}
                <div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-6">Recent Content Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instagram Posts */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Instagram size={24} className="text-pink-600" />
                                <h3 className="font-semibold text-deep-black">Instagram Posts</h3>
                            </div>
                            <div className="space-y-4">
                                {socialMedia.instagram.recentPosts.map((post, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors cursor-pointer"
                                        onClick={() => openMediaModal(post, 'instagram', idx)}
                                    >
                                        {/* Media Thumbnail */}
                                        <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Instagram size={32} className="text-white opacity-50" />
                                        </div>
                                        {/* Content Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} className="text-pink-600" />
                                                    <span className="font-semibold">{post.likes.toLocaleString()}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={14} className="text-blue-600" />
                                                    <span className="font-semibold">{post.comments}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* YouTube Videos */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Youtube size={24} className="text-red-600" />
                                <h3 className="font-semibold text-deep-black">YouTube Videos</h3>
                            </div>
                            <div className="space-y-4">
                                {socialMedia.youtube.recentVideos.map((video, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                        onClick={() => openMediaModal(video, 'youtube', idx)}
                                    >
                                        {/* Video Thumbnail */}
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-orange-200 rounded-lg flex-shrink-0 flex items-center justify-center relative">
                                            <Youtube size={32} className="text-white opacity-50" />
                                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-[10px] px-1 rounded">
                                                {Math.floor(Math.random() * 10) + 5}:00
                                            </div>
                                        </div>
                                        {/* Video Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {new Date(video.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Eye size={14} className="text-gray-600" />
                                                    <span className="font-semibold">{video.views.toLocaleString()}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} className="text-red-600" />
                                                    <span className="font-semibold">{video.likes.toLocaleString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Client Reviews Section */}
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
                                            {reviews.length > 0
                                                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                                                : '0.0'
                                            }
                                        </h3>
                                        <StarRating
                                            rating={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
                                            size="lg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">Based on {reviews.filter(r => r.isPublished).length} reviews</p>
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
                    {reviews.filter(r => r.isPublished).length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews
                                .filter(r => r.isPublished)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 4)
                                .map((review) => (
                                    <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-deep-black">{review.clientName}</h4>
                                                    {review.isVerified && (
                                                        <ShieldCheck className="text-blue-600" size={16} title="Verified Client" />
                                                    )}
                                                </div>
                                                <StarRating rating={review.rating} size="sm" showNumber />
                                            </div>
                                            {review.projectType && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {review.projectType}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                                            {review.reviewText}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-3">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </Card>
                                ))}
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <Card className="p-8 bg-gradient-to-r from-primary-orange to-orange-600 text-white text-center">
                    <h2 className="text-3xl font-bebas tracking-wide mb-3">Interested in Collaborating?</h2>
                    <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                        I'm always open to exciting brand partnerships and creative collaborations. Let's create something amazing together!
                    </p>
                    <a
                        href="/signup"
                        className="inline-block bg-white text-primary-orange px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                    >
                        Get in Touch
                    </a>
                </Card>
            </div>

            {/* Footer */}
            <div className="bg-deep-black text-white py-8 text-center">
                <p className="text-sm text-gray-400">
                    Powered by <span className="font-bebas text-primary-orange">INFLURUNNER</span>
                </p>
            </div>

            {/* Media Modal */}
            {selectedMedia && (
                <div
                    className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-backdrop-exit' : 'animate-backdrop'}`}
                    onClick={closeMediaModal}
                >
                    <div
                        className={`bg-white rounded-lg w-full max-w-2xl lg:max-w-6xl max-h-[90vh] lg:h-[85vh] overflow-hidden relative flex flex-col lg:flex-row ${isClosing ? 'animate-popup-exit' : 'animate-popup'}`}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Left Side - Media (Desktop) */}
                        <div className="hidden lg:flex lg:w-3/5 bg-gray-100 items-center justify-center relative h-full">
                            {/* Navigation Buttons */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                className="absolute left-4 p-2 bg-white/80 hover:bg-white rounded-full text-deep-black transition-all z-10"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="absolute right-4 p-2 bg-white/80 hover:bg-white rounded-full text-deep-black transition-all z-10"
                                disabled={
                                    currentIndex === (selectedMedia.platform === 'instagram'
                                        ? socialMedia?.instagram?.recentPosts.length
                                        : socialMedia?.youtube?.recentVideos.length) - 1
                                }
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Media Preview */}
                            <div className={`w-full h-full flex items-center justify-center ${selectedMedia.platform === 'instagram'
                                ? 'bg-gradient-to-br from-pink-200 to-orange-200'
                                : 'bg-gradient-to-br from-red-200 to-orange-200'
                                }`}>
                                {selectedMedia.platform === 'instagram' ? (
                                    <Instagram size={80} className="text-white opacity-50" />
                                ) : (
                                    <Youtube size={80} className="text-white opacity-50" />
                                )}
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    {selectedMedia.platform === 'instagram' ? (
                                        <Instagram size={24} className="text-pink-600" />
                                    ) : (
                                        <Youtube size={24} className="text-red-600" />
                                    )}
                                    <h3 className="text-xl font-bebas tracking-wide text-deep-black">
                                        {selectedMedia.platform === 'instagram' ? 'Instagram Post' : 'YouTube Video'}
                                    </h3>
                                </div>
                                <button
                                    onClick={closeMediaModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div
                                    key={currentIndex}
                                    className={`${slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}
                                >
                                    {/* Mobile Media Preview (Hidden on Desktop) */}
                                    <div className={`lg:hidden w-full aspect-square rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${selectedMedia.platform === 'instagram'
                                        ? 'bg-gradient-to-br from-pink-200 to-orange-200'
                                        : 'bg-gradient-to-br from-red-200 to-orange-200'
                                        }`}>
                                        {selectedMedia.platform === 'instagram' ? (
                                            <Instagram size={64} className="text-white opacity-50" />
                                        ) : (
                                            <Youtube size={64} className="text-white opacity-50" />
                                        )}
                                    </div>

                                    {/* Dots Indicator (Mobile Only) */}
                                    <div className="lg:hidden flex justify-center gap-2 mb-6">
                                        {(selectedMedia.platform === 'instagram' ? socialMedia?.instagram?.recentPosts : socialMedia?.youtube?.recentVideos)?.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary-orange w-4' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Media Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Published Date</p>
                                            <p className="text-lg font-semibold text-deep-black">
                                                {new Date(selectedMedia.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Eye size={16} className="text-gray-600" />
                                                    <p className="text-sm text-gray-600">Views</p>
                                                </div>
                                                <p className="text-2xl font-bebas text-deep-black">
                                                    {selectedMedia.views ? selectedMedia.views.toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div className={`p-4 rounded-lg ${selectedMedia.platform === 'instagram' ? 'bg-pink-50' : 'bg-red-50'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Heart size={16} className={selectedMedia.platform === 'instagram' ? 'text-pink-600' : 'text-red-600'} />
                                                    <p className="text-sm text-gray-600">Likes</p>
                                                </div>
                                                <p className="text-2xl font-bebas text-deep-black">
                                                    {selectedMedia.likes.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MessageCircle size={16} className="text-blue-600" />
                                                    <p className="text-sm text-gray-600">Comments</p>
                                                </div>
                                                <p className="text-2xl font-bebas text-deep-black">
                                                    {selectedMedia.comments}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Engagement Rate */}
                                        <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-primary-orange">
                                            <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                                            <p className="text-3xl font-bebas text-primary-orange">
                                                {selectedMedia.platform === 'youtube'
                                                    ? ((selectedMedia.likes + selectedMedia.comments) / (selectedMedia.views || 1) * 100).toFixed(2)
                                                    : ((selectedMedia.likes + selectedMedia.comments) / (socialMedia?.instagram?.followers || 1) * 100).toFixed(2)
                                                }%
                                            </p>
                                        </div>

                                        <p className="text-sm text-gray-500 text-center mt-4">
                                            * When connected to API, actual media content will be displayed here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicPortfolio;
