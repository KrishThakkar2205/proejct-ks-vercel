import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PlatformMetrics from '../../components/dashboard/PlatformMetrics';
import DailySchedule from '../../components/dashboard/DailySchedule';
import CompletedShootsToday from '../../components/dashboard/CompletedShootsToday';
import DelayedShootsToday from '../../components/dashboard/DelayedShootsToday';
import { Calendar, CheckCircle, Star, Clock, TrendingUp, Share2, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import AddEventModal from '../../components/dashboard/AddEventModal';
import SuccessAlert from '../../components/ui/SuccessAlert';

const InfluencerDashboard = () => {
    const [copied, setCopied] = useState(false);

    // Loading & Error State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data State
    const [todayShoots, setTodayShoots] = useState([]);
    const [todayUploads, setTodayUploads] = useState([]);
    const [delayedShoots, setDelayedShoots] = useState([]);
    const [delayedUploads, setDelayedUploads] = useState([]);
    const [completedShoots, setCompletedShoots] = useState([]);
    const [completedUploads, setCompletedUploads] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const authUser = useSelector(state => state.auth.user);
    const [statsData, setStatsData] = useState({
        upcomingCount: 0,
        completedCount: 0,
        rating: 'N/A',
    });

    // Add Event Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });

    // Helper: get YYYY-MM-DD string for a given Date object
    const toDateStr = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const fetchDashboardData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const today = new Date();
            const todayStr = toDateStr(today);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = toDateStr(yesterday);

            // Run all fetches in parallel
            const [
                resDashboardCard,
                resTodayShoots,
                resTodayUploads,
                resDelayedShoots,
                resDelayedUploads,
                resCompletedShoots,
                resCompletedUploads,
                resReviews,
                resUpcomingShoots,
            ] = await Promise.all([
                api.get('/dashboard-card', { params: { Start_Date: todayStr, End_Date: todayStr } }).catch(() => ({ data: null })),
                api.get('/api/shoots', { params: { start_date: todayStr, end_date: todayStr, completed: false } }),
                api.get('/api/uploads', { params: { start_date: todayStr, end_date: todayStr, completed: false } }),
                api.get('/api/shoots', { params: { completed: false, end_date: yesterdayStr } }),
                api.get('/api/uploads', { params: { completed: false, end_date: yesterdayStr } }),
                api.get('/api/shoots', { params: { completed: true, start_date: todayStr, end_date: todayStr } }),
                api.get('/api/uploads', { params: { completed: true, start_date: todayStr, end_date: todayStr } }),
                api.get('/api/reviews', { params: { limit: 3 } }).catch(() => ({ data: [] })),
                api.get('/api/shoots', { params: { completed: false, start_date: todayStr } }),
            ]);

            // --- Today's Schedule (not completed) ---
            const todayShootsData = Array.isArray(resTodayShoots.data) ? resTodayShoots.data : [];
            const todayUploadsData = Array.isArray(resTodayUploads.data) ? resTodayUploads.data : [];
            setTodayShoots(todayShootsData);
            setTodayUploads(todayUploadsData);

            // --- Delayed Tasks (past due & not completed) ---
            setDelayedShoots(Array.isArray(resDelayedShoots.data) ? resDelayedShoots.data : []);
            setDelayedUploads(Array.isArray(resDelayedUploads.data) ? resDelayedUploads.data : []);

            // --- Completed Today ---
            setCompletedShoots(Array.isArray(resCompletedShoots.data) ? resCompletedShoots.data : []);
            setCompletedUploads(Array.isArray(resCompletedUploads.data) ? resCompletedUploads.data : []);

            // --- Recent Reviews ---
            const fetchedReviews = Array.isArray(resReviews.data)
                ? resReviews.data
                : resReviews.data?.data || [];
            const sortedReviews = [...fetchedReviews]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 3);
            setRecentReviews(sortedReviews);


            // --- Stats ---
            // --- Stats ---
            const dashCard = resDashboardCard.data;
            const todayUpcomingCount = todayShootsData.length + todayUploadsData.length;

            setStatsData({
                upcomingCount: todayUpcomingCount,
                completedCount: dashCard?.completed_today ?? (resCompletedShoots.data?.length || 0),
                rating: dashCard?.average_rating != null
                    ? Number(dashCard.average_rating).toFixed(1)
                    : 'N/A',
            });

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please refresh.');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Soft-reload: called by child components after marking complete
    const handleRefreshAfterComplete = () => fetchDashboardData(true);

    const stats = [
        {
            label: 'Upcoming Shoots',
            value: statsData.upcomingCount.toString(),
            icon: <Calendar className="text-white" />,
            color: 'bg-blue-500',
        },
        {
            label: 'Completed Today',
            value: statsData.completedCount.toString(),
            icon: <CheckCircle className="text-white" />,
            color: 'bg-green-500',
        },
        {
            label: 'Average Rating',
            value: statsData.rating,
            icon: <Star className="text-white" />,
            color: 'bg-purple-500',
        },
    ];

    const quickActions = [
        {
            label: 'Add to Calendar',
            onClick: () => setShowAddModal(true),
            icon: <Calendar size={20} />,
            color: 'bg-white/60 backdrop-blur-md border border-white hover:border-primary-orange/50 text-gray-800 shadow-[0_4px_16px_rgba(255,107,26,0.04)]'
        }
    ];

    // Portfolio link — /portfolio/{influencer_id}
    const influencerId = authUser?.influencer_id || authUser?.id || authUser?.email_id;
    const portfolioUrl = influencerId
        ? `https://influrunner.com/portfolio/${influencerId}`
        : `https://influrunner.com/portfolio`;

    const handleCopyPortfolioLink = () => {
        navigator.clipboard.writeText(portfolioUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-8">


            {/* Share Portfolio & Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Share Portfolio Button - Premium Glass Styling */}
                <button
                    onClick={handleCopyPortfolioLink}
                    className="p-3 bg-white/60 backdrop-blur-md border border-white hover:border-primary-orange/50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(255,107,26,0.04)] group"
                >
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-orange group-hover:scale-110 transition-transform">
                        {copied ? <Check size={18} /> : <Share2 size={18} />}
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800 text-center leading-tight">
                        {copied ? 'Copied!' : 'Share Portfolio'}
                    </h4>
                </button>

                {/* Quick Actions */}
                {quickActions.map((action, index) => (
                    action.path ? (
                        <Link key={index} to={action.path} className="block h-full">
                            <div className={`p-3 h-full rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${action.color}`}>
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-orange group-hover:scale-110 transition-transform">
                                    {React.cloneElement(action.icon, { size: 18 })}
                                </div>
                                <h4 className="font-semibold text-xs sm:text-sm text-center leading-tight">{action.label}</h4>
                            </div>
                        </Link>
                    ) : (
                        <button key={index} onClick={action.onClick} className="w-full h-full">
                            <div className={`p-3 h-full rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${action.color}`}>
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-orange group-hover:scale-110 transition-transform">
                                    {React.cloneElement(action.icon, { size: 18 })}
                                </div>
                                <h4 className="font-semibold text-xs sm:text-sm text-center leading-tight">{action.label}</h4>
                            </div>
                        </button>
                    )
                ))}
            </div>

            {/* Platform Metrics - Full Width */}
            <div className="animate-fadeIn">
                <PlatformMetrics />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-orange mb-4" />
                    <p>Loading your dashboard...</p>
                </div>
            ) : error ? (
                /* Error State */
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <AlertCircle className="w-10 h-10 mb-4" />
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="flex items-center justify-between p-5">
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">{stat.label}</p>
                                    <h3 className="text-2xl sm:text-3xl font-bebas tracking-wide text-deep-black">{stat.value}</h3>
                                </div>
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="space-y-6">
                        {/* Top Row: Today's Schedule and Delayed Shoots */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DailySchedule
                                shoots={todayShoots}
                                uploads={todayUploads}
                                onMarkComplete={handleRefreshAfterComplete}
                            />
                            <DelayedShootsToday
                                delayedShoots={delayedShoots}
                                delayedUploads={delayedUploads}
                                onMarkComplete={handleRefreshAfterComplete}
                            />
                        </div>

                        {/* Bottom Row: Completed Today and Recent Reviews */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CompletedShootsToday
                                completedShoots={completedShoots}
                                completedUploads={completedUploads}
                            />

                            {/* Recent Reviews Card */}
                            <Card className="p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                    <div>
                                        <h2 className="text-xl font-bebas tracking-wide text-deep-black">Recent Reviews</h2>
                                        <p className="text-sm text-gray-600 mt-1">Client feedback</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Star className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-[250px] overflow-y-auto pr-1">
                                    {recentReviews.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                            <Star size={48} className="mb-4 text-gray-300" strokeWidth={1.5} />
                                            <p className="text-gray-600 font-medium text-lg">No reviews yet</p>
                                            <p className="text-sm mt-1">Check back later!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {recentReviews.map((review) => (
                                                <div key={review.id || review._id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex gap-3">
                                                        {/* Avatar */}
                                                        <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center flex-shrink-0">
                                                            <span className="text-white font-semibold text-sm">
                                                                {review.reviewer_name
                                                                    ? review.reviewer_name.charAt(0).toUpperCase()
                                                                    : review.brand_name
                                                                        ? review.brand_name.charAt(0).toUpperCase()
                                                                        : 'C'}
                                                            </span>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <h3 className="font-semibold text-deep-black text-sm truncate">
                                                                    {review.reviewer_name || review.brand_name || 'Anonymous Client'}
                                                                </h3>
                                                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                                    {review.created_at
                                                                        ? new Date(review.created_at).toLocaleDateString()
                                                                        : '—'}
                                                                </span>
                                                            </div>

                                                            {/* Star Rating */}
                                                            <div className="flex items-center gap-0.5 mb-1.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={13}
                                                                        className={i < (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                                    />
                                                                ))}
                                                            </div>

                                                            {/* Review Text */}
                                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                                {review.review_text || review.review || review.comment || '—'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Link to="/influencer/reviews" className="block mt-4 flex-shrink-0">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View All Reviews
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </>
            )}

            {/* Add Event Modal */}
            <AddEventModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={(msg) => {
                    setSuccessAlert({ isOpen: true, message: msg });
                    setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                    fetchDashboardData(true); // Soft reload
                }}
            />

            {/* Success Alert */}
            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default InfluencerDashboard;
