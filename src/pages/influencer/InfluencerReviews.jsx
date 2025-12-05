import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import StarRating from '../../components/ui/StarRating';
import { Star, ShieldCheck, Calendar } from 'lucide-react';
import { MOCK_INFLUENCER_DATA } from '../../data/mockData';

const InfluencerReviews = () => {
    const { reviews } = MOCK_INFLUENCER_DATA;

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    // Filter published reviews
    const publishedReviews = reviews.filter(review => review.isPublished);

    // Sort reviews by date (newest first)
    const sortedReviews = [...publishedReviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="space-y-8">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Reviews</h1>
                <p className="text-gray-600 text-sm mt-1">Client feedback and ratings</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Average Rating</p>
                            <div className="flex items-center gap-3">
                                <h3 className="text-4xl font-bebas tracking-wide text-deep-black">
                                    {averageRating.toFixed(1)}
                                </h3>
                                <StarRating rating={averageRating} size="lg" />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Based on {publishedReviews.length} reviews</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                            <Star className="text-primary-orange" size={32} fill="currentColor" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Total Reviews</p>
                            <h3 className="text-4xl font-bebas tracking-wide text-deep-black">
                                {publishedReviews.length}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">
                                {reviews.filter(r => r.isVerified).length} verified clients
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <ShieldCheck className="text-blue-600" size={32} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Rating Distribution */}
            {sortedReviews.length > 0 && (
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
            )}

            {/* Reviews List */}
            <div>
                <h2 className="text-xl font-bebas tracking-wide text-deep-black mb-4">Client Reviews</h2>

                {sortedReviews.length === 0 ? (
                    // Empty State
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Star className="text-gray-400" size={40} />
                            </div>
                            <h3 className="text-xl font-bebas tracking-wide text-gray-700 mb-2">
                                No Reviews Yet
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                Your client reviews will appear here once brands you've worked with submit their feedback.
                            </p>
                        </div>
                    </Card>
                ) : (
                    // Reviews Grid
                    <div className="grid grid-cols-1 gap-4">
                        {sortedReviews.map((review) => (
                            <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                                {/* Review Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-deep-black">
                                                {review.clientName}
                                            </h3>
                                            {review.isVerified && (
                                                <ShieldCheck
                                                    className="text-blue-600"
                                                    size={18}
                                                    title="Verified Client"
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <StarRating rating={review.rating} size="sm" showNumber />
                                            {review.projectType && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {review.projectType}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-700 leading-relaxed">
                                    {review.reviewText}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfluencerReviews;
