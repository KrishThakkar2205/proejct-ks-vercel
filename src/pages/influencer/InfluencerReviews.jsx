import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';
import { Star, ShieldCheck, Calendar, Search, Loader2, Share2, CheckCircle, MessageSquare, ExternalLink, Sparkles, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const InfluencerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Fetch reviews from API
    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/reviews');
            setReviews(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const msg =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                'Failed to load reviews.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleCopyLink = (id) => {
        const link = `${window.location.origin}/review/${id}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    // Filter to submitted reviews for stats calculation
    const submittedReviews = reviews.filter(r => r.submitted);

    // Calculate average rating
    const averageRating = submittedReviews.length > 0
        ? submittedReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / submittedReviews.length
        : 0;

    // Apply filters
    const filteredReviews = reviews.filter(review => {
        // Search filter
        const matchesSearch = !searchQuery || (
            (review.reviewer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (review.review || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (review.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Rating filter
        const matchesRating = !ratingFilter || review.rating === parseInt(ratingFilter);

        // Date filter
        let matchesDate = true;
        if (dateFilter) {
            const reviewDate = new Date(review.created_at || review.submitted_at);
            const filterDate = new Date(dateFilter);
            matchesDate = reviewDate.toDateString() === filterDate.toDateString();
        }

        return matchesSearch && matchesRating && matchesDate;
    });

    // Sort reviews by date (newest first)
    const sortedReviews = [...filteredReviews].sort(
        (a, b) => new Date(b.created_at || b.submitted_at || 0) - new Date(a.created_at || a.submitted_at || 0)
    );

    const getInitials = (name) => {
        if (!name) return 'C';
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1) {
            return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-2">Error</p>
                    <p className="text-gray-600 text-sm mb-4">{typeof error === 'string' ? error : 'Something went wrong.'}</p>
                    <Button onClick={() => fetchReviews()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-deep-black to-gray-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
                {/* Background patterns */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-orange/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-primary-orange border border-white/10 uppercase">
                            <Sparkles size={12} className="animate-pulse" />
                            <span>Feedback Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bebas tracking-wide mt-1">Review Console</h1>
                        <p className="text-gray-300 text-sm max-w-2xl font-light">
                            Gather client ratings, view performance metrics, and copy customized feedback generation links to build credibility.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Average Rating */}
                <div className="bg-white/80 backdrop-blur-md border border-orange-100/50 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-primary-orange/10 to-pink-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                    
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Rating</p>
                            <div className="flex items-baseline gap-2.5 mt-2">
                                <h3 className="text-5xl font-bebas tracking-wide text-deep-black leading-none">
                                    {averageRating.toFixed(1)}
                                </h3>
                                <span className="text-sm font-semibold text-gray-500">/ 5.0</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Star className="w-6 h-6" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <StarRating rating={averageRating} size="sm" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                            Based on {submittedReviews.length} reviews
                        </span>
                    </div>
                </div>

                {/* Card 2: Total Reviews & Links */}
                <div className="bg-white/80 backdrop-blur-md border border-orange-100/50 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                    
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Reviews</p>
                            <h3 className="text-5xl font-bebas tracking-wide text-deep-black mt-2 leading-none">
                                {submittedReviews.length}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Pending Requests</span>
                        <span className="font-semibold text-primary-orange bg-orange-50 px-2 py-0.5 rounded-md">
                            {reviews.length - submittedReviews.length} pending
                        </span>
                    </div>
                </div>

                {/* Card 3: Rating Distribution Summary */}
                <div className="bg-white/80 backdrop-blur-md border border-orange-100/50 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 relative overflow-hidden p-6 rounded-2xl">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rating Breakdown</p>
                    {submittedReviews.length === 0 ? (
                        <div className="h-24 flex items-center justify-center text-xs text-gray-400 italic">
                            No reviews submitted yet
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = submittedReviews.filter(r => r.rating === stars).length;
                                const percentage = submittedReviews.length > 0 ? (count / submittedReviews.length) * 100 : 0;
                                
                                return (
                                    <div key={stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-0.5 w-10 flex-shrink-0">
                                            <span className="text-xs font-bold text-gray-700">{stars}</span>
                                            <Star className="text-primary-orange" size={11} fill="currentColor" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-100/80 rounded-full overflow-hidden border border-gray-200/20">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    stars >= 4 
                                                        ? 'bg-gradient-to-r from-primary-orange via-pink-500 to-purple-500' 
                                                        : stars === 3 
                                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                                                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 w-12 text-right">
                                            {count} ({percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white/90 border border-gray-100 shadow-md rounded-2xl p-5">
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search reviews by reviewer, brand, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-orange/10 focus:border-primary-orange transition-all text-sm placeholder-gray-400 bg-gray-50/50 hover:bg-white focus:bg-white"
                        />
                    </div>

                    {/* Filters & Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Rating Dropdown */}
                        <div className="relative min-w-[150px] flex-1 md:flex-initial">
                            <Star className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-orange/10 focus:border-primary-orange text-sm appearance-none bg-white cursor-pointer hover:border-primary-orange/40 transition-colors"
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                            <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                        </div>

                        {/* Date Filter */}
                        <div className="relative min-w-[150px] flex-1 md:flex-initial">
                            <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-orange/10 focus:border-primary-orange text-sm hover:border-primary-orange/40 transition-colors"
                            />
                        </div>

                        {/* Clear Filters Button */}
                        {(searchQuery || ratingFilter || dateFilter) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setRatingFilter('');
                                    setDateFilter('');
                                }}
                                className="whitespace-nowrap rounded-xl border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 h-10 px-4 text-xs font-semibold text-gray-600 hover:text-deep-black"
                            >
                                <Trash2 size={13} />
                                <span>Clear Filters</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Feedback Deck Console */}
            <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-3">
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black flex items-center gap-2">
                        <MessageSquare className="text-primary-orange" size={22} />
                        <span>Feedback Console</span>
                    </h2>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Showing {sortedReviews.length} of {reviews.length} total
                    </span>
                </div>

                {sortedReviews.length === 0 ? (
                    <Card className="p-16 text-center border border-gray-100 shadow-md rounded-2xl bg-white/70 backdrop-blur-md">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/60 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner">
                                <Star size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-sans text-gray-700">No matching logs found</h3>
                                <p className="text-gray-500 text-sm max-w-sm mt-1 leading-relaxed">
                                    {searchQuery || ratingFilter || dateFilter
                                        ? 'No records match your active query. Try adjusting or clearing the filters.'
                                        : 'Your generated review links and submitted ratings will appear here.'}
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        {sortedReviews.map((review) => {
                            const isSubmitted = review.submitted;

                            return (
                                <div
                                    key={review.id}
                                    className={`relative overflow-hidden transition-all duration-300 rounded-2xl p-6 bg-white border shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                                        isSubmitted
                                            ? 'border-gray-100 border-l-4 border-l-success-green'
                                            : 'border-2 border-dashed border-orange-200 bg-orange-50/5 hover:border-primary-orange/40 hover:bg-orange-50/15'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Left Info Column */}
                                        <div className="flex-1 min-w-0 flex items-start gap-4">
                                            {isSubmitted ? (
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/10 flex-shrink-0 select-none">
                                                    {getInitials(review.reviewer_name)}
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-orange-50 border border-orange-200/50 text-primary-orange rounded-full flex items-center justify-center flex-shrink-0 select-none relative">
                                                    <Share2 size={18} />
                                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary-orange animate-pulse border-2 border-white" />
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0 space-y-2.5">
                                                {/* Title block with brand and status badge */}
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-lg font-bold font-sans text-deep-black tracking-wide leading-none">
                                                        {review.brand_name || 'Untitled Brand'}
                                                    </h3>
                                                    <Badge className={
                                                        isSubmitted
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                                                            : 'bg-orange-50 text-primary-orange border-orange-200 font-semibold'
                                                    }>
                                                        {isSubmitted ? 'Submitted' : 'Pending Request'}
                                                    </Badge>
                                                </div>

                                                {/* Detailed Review Description */}
                                                {isSubmitted ? (
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                                                            <span className="font-semibold text-gray-700">Client: {review.reviewer_name || 'Anonymous Client'}</span>
                                                            {review.reviewer_phone && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Phone: {review.reviewer_phone}</span>
                                                                </>
                                                            )}
                                                            <span>•</span>
                                                            <StarRating rating={review.rating || 0} size="sm" showNumber />
                                                        </div>
                                                        {review.review && (
                                                            <div className="relative mt-2">
                                                                <p className="text-sm text-gray-600 leading-relaxed italic bg-warm-cream/20 p-4 border border-orange-100/10 rounded-2xl pl-6">
                                                                    <span className="absolute top-2 left-2 text-2xl font-serif text-primary-orange/20 leading-none select-none">“</span>
                                                                    {review.review.trim()}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-500 font-medium flex items-center gap-2 bg-orange-50/40 p-2.5 rounded-xl border border-orange-100/20 max-w-lg">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-orange" />
                                                        <span>Feedback pending. Share the link below to get reviews from this client.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Action Column */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100/80">
                                            {/* Date Display */}
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5 select-none">
                                                <Calendar size={13} className="text-gray-400" />
                                                <span>
                                                    {new Date(review.created_at || review.submitted_at || Date.now()).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </span>

                                            {/* Actions */}
                                            {!isSubmitted && (
                                                <div className="flex items-center gap-2">
                                                    {/* Copy Link Button */}
                                                    <Button
                                                        variant={copiedId === review.id ? 'success' : 'primary'}
                                                        size="sm"
                                                        onClick={() => handleCopyLink(review.id)}
                                                        className="flex items-center justify-center gap-1.5 shadow-sm rounded-xl py-2 px-4 transition-all text-xs font-semibold tracking-wide"
                                                    >
                                                        {copiedId === review.id ? (
                                                            <>
                                                                <CheckCircle size={13} />
                                                                <span>Copied!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Share2 size={13} />
                                                                <span>Copy Link</span>
                                                            </>
                                                        )}
                                                    </Button>

                                                    {/* Test Link Button */}
                                                    <a
                                                        href={`/review/${review.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-orange hover:bg-orange-50 hover:border-primary-orange/30 transition-all shadow-sm"
                                                        title="Test Review Page"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfluencerReviews;
