import React, { useState, useEffect } from 'react';
import { Link2, Copy, CheckCircle, Calendar, MapPin, Clock, Search, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CompletedShoots = () => {
    const [completedShoots, setCompletedShoots] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    useEffect(() => {
        // Load completed shoots from localStorage
        const shoots = JSON.parse(localStorage.getItem('completedShoots') || '[]');
        setCompletedShoots(shoots);
    }, []);

    const generateReviewToken = () => {
        // Generate a unique token (in production, this would be done server-side)
        return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleGenerateLink = (shootId) => {
        const token = generateReviewToken();
        const reviewLink = `${window.location.origin}/review/${token}`;

        // Update the shoot with the review token
        const updatedShoots = completedShoots.map(shoot => {
            if (shoot.id === shootId) {
                return {
                    ...shoot,
                    reviewToken: token,
                    reviewLink: reviewLink,
                    reviewLinkGeneratedAt: new Date().toISOString()
                };
            }
            return shoot;
        });

        setCompletedShoots(updatedShoots);
        localStorage.setItem('completedShoots', JSON.stringify(updatedShoots));

        // Auto-copy to clipboard
        copyToClipboard(reviewLink, token);
    };

    const copyToClipboard = (link, token) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedToken(token);
            setTimeout(() => setCopiedToken(null), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const filterShoots = () => {
        if (!searchQuery) return completedShoots;

        return completedShoots.filter(shoot =>
            shoot.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shoot.campaign.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredShoots = filterShoots();

    const hasReviewSubmitted = (shootId) => {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        return reviews.some(review => review.shootId === shootId);
    };

    return (
        <div className="space-y-8">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Completed Shoots</h1>
                <p className="text-gray-600 text-sm mt-1">Manage review links for completed shoots</p>
            </div>

            {/* Stats Card */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bebas tracking-wide text-deep-black mb-1">Total Completed Shoots</h2>
                        <p className="text-4xl font-bold text-green-600">{completedShoots.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={32} />
                    </div>
                </div>
            </Card>

            {/* Search */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by brand or campaign..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Completed Shoots List */}
            {filteredShoots.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredShoots.map((shoot) => {
                        const reviewSubmitted = hasReviewSubmitted(shoot.id);
                        const hasReviewLink = !!shoot.reviewToken;

                        return (
                            <Card key={shoot.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <CheckCircle className="text-green-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-deep-black text-lg">{shoot.brandName}</h3>
                                            <p className="text-sm text-gray-600">{shoot.campaign}</p>
                                        </div>
                                    </div>
                                    {reviewSubmitted && (
                                        <Badge variant="success">Review Received</Badge>
                                    )}
                                </div>

                                {/* Shoot Details */}
                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(shoot.shootDate).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-gray-400" />
                                        {shoot.shootTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        {shoot.location}
                                    </div>
                                </div>

                                {/* Review Link Section */}
                                {hasReviewLink ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Link2 size={16} className="text-primary-orange" />
                                            <span className="text-xs font-semibold text-primary-orange uppercase">Review Link Generated</span>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Review Link:</p>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs text-gray-700 flex-1 truncate">
                                                    {shoot.reviewLink}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(shoot.reviewLink, shoot.reviewToken)}
                                                    className="text-primary-orange hover:text-orange-600 transition-colors flex-shrink-0"
                                                    title="Copy link"
                                                >
                                                    {copiedToken === shoot.reviewToken ? (
                                                        <CheckCircle size={18} className="text-green-500" />
                                                    ) : (
                                                        <Copy size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => copyToClipboard(shoot.reviewLink, shoot.reviewToken)}
                                            >
                                                <Copy size={16} className="mr-2" />
                                                {copiedToken === shoot.reviewToken ? 'Copied!' : 'Copy Link'}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => window.open(shoot.reviewLink, '_blank')}
                                            >
                                                <ExternalLink size={16} className="mr-2" />
                                                Preview
                                            </Button>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center">
                                            Generated {new Date(shoot.reviewLinkGeneratedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                                            <p className="text-sm text-gray-700 mb-3">
                                                Generate a review link to share with your client
                                            </p>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleGenerateLink(shoot.id)}
                                            >
                                                <Link2 size={16} className="mr-2" />
                                                Generate Review Link
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {searchQuery ? 'No shoots found' : 'No completed shoots yet'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Mark shoots as completed from the Schedule page to see them here'}
                    </p>
                    {!searchQuery && (
                        <Button variant="primary" onClick={() => window.location.href = '/influencer/schedule'}>
                            Go to Schedule
                        </Button>
                    )}
                </Card>
            )}
        </div>
    );
};

export default CompletedShoots;
