import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PlatformMetrics from '../../components/dashboard/PlatformMetrics';
import DailySchedule from '../../components/dashboard/DailySchedule';
import CompletedShootsToday from '../../components/dashboard/CompletedShootsToday';
import DelayedShootsToday from '../../components/dashboard/DelayedShootsToday';
import { Calendar, CheckCircle, Star, Clock, TrendingUp, Share2, Check, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
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

    // WhatsApp notification permission modal (shown once after signup)
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [whatsappLoading, setWhatsappLoading] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('show_whatsapp_prompt') === 'true') {
            // Small delay so the dashboard renders first
            const t = setTimeout(() => setShowWhatsappModal(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const handleWhatsappPermission = async (allow) => {
        setWhatsappLoading(true);
        sessionStorage.removeItem('show_whatsapp_prompt');
        try {
            const payload = new FormData();
            payload.append('whatsapp_notification', allow);
            await api.put('/api/profile', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (err) {
            console.error('Failed to save WhatsApp preference:', err);
        } finally {
            setWhatsappLoading(false);
            setShowWhatsappModal(false);
        }
    };

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
        { label: 'View Calendar', path: '/influencer/calendar', icon: <Calendar size={20} />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { label: 'Check Schedule', path: '/influencer/schedule', icon: <Clock size={20} />, color: 'bg-orange-50 text-primary-orange hover:bg-orange-100' },
        {
            label: 'Add to Calendar',
            onClick: () => setShowAddModal(true),
            icon: <Calendar size={20} />,
            color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
        },
        { label: 'Edit Profile', path: '/influencer/profile', icon: <TrendingUp size={20} />, color: 'bg-green-50 text-green-600 hover:bg-green-100' },
    ];

    // Portfolio link — /portfolio/{influencer_id}
    const influencerId = authUser?.influencer_id || authUser?.id || authUser?.email_id;
    const portfolioUrl = influencerId
        ? `${window.location.origin}/portfolio/${influencerId}`
        : `${window.location.origin}/portfolio`;

    const handleCopyPortfolioLink = () => {
        navigator.clipboard.writeText(portfolioUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-8">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">Overview of your influencer activities and performance</p>
            </div>

            {/* Share Portfolio & Quick Actions Row */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {/* Share Portfolio Button */}
                <button
                    onClick={handleCopyPortfolioLink}
                    className="p-2 sm:p-3 bg-gradient-to-r from-primary-orange to-orange-600 border border-orange-700 rounded-lg flex flex-col items-center justify-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity"
                >
                    <div className="flex-shrink-0">
                        {copied ? <Check size={16} className="text-white sm:w-5 sm:h-5" /> : <Share2 size={16} className="text-white sm:w-5 sm:h-5" />}
                    </div>
                    <h4 className="font-semibold text-[10px] sm:text-sm md:text-base text-white text-center leading-tight">
                        {copied ? 'Copied!' : 'Share'}
                    </h4>
                </button>

                {/* Quick Actions */}
                {quickActions.map((action, index) => (
                    action.path ? (
                        <Link key={index} to={action.path}>
                            <Card className={`p-2 sm:p-3 h-full flex flex-col items-center justify-center gap-1 sm:gap-2 hover:border-primary-orange transition-all cursor-pointer group ${action.color}`}>
                                <div className="flex-shrink-0">
                                    {React.cloneElement(action.icon, { size: 16, className: 'sm:w-5 sm:h-5' })}
                                </div>
                                <h4 className="font-semibold text-[10px] sm:text-sm md:text-base text-center leading-tight">{action.label}</h4>
                            </Card>
                        </Link>
                    ) : (
                        <button key={index} onClick={action.onClick} className="w-full">
                            <Card className={`p-2 sm:p-3 h-full flex flex-col items-center justify-center gap-1 sm:gap-2 hover:border-primary-orange transition-all cursor-pointer group ${action.color}`}>
                                <div className="flex-shrink-0">
                                    {React.cloneElement(action.icon, { size: 16, className: 'sm:w-5 sm:h-5' })}
                                </div>
                                <h4 className="font-semibold text-[10px] sm:text-sm md:text-base text-center leading-tight">{action.label}</h4>
                            </Card>
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

            {/* WhatsApp Notification Permission Modal */}
            {showWhatsappModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal card */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" style={{ animation: 'fadeInSlide 0.35s ease' }}>

                        {/* Floating WhatsApp icon badge */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>

                        <div className="mt-8 text-center">
                            <h3 className="text-xl font-bold text-deep-black mb-2">Stay in the Loop! 🔔</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Allow <span className="font-semibold text-green-600">WhatsApp notifications</span> to
                                get timely reminders for your shoots, uploads, and
                                collaboration requests — directly on your phone.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="mt-5 space-y-2">
                            {['📅  Shoot & upload reminders', '🤝  New collaboration alerts', '⚡  Real-time schedule updates'].map(item => (
                                <div key={item} className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 rounded-lg px-3 py-2">
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-[10px] text-gray-400 mt-4">
                            You can change this anytime from your Profile settings.
                        </p>

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                id="whatsapp-allow-btn"
                                onClick={() => handleWhatsappPermission(true)}
                                disabled={whatsappLoading}
                                className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-md shadow-green-200 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {whatsappLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <MessageCircle size={16} />}
                                Allow WhatsApp Notifications
                            </button>
                            <button
                                id="whatsapp-skip-btn"
                                onClick={() => handleWhatsappPermission(false)}
                                disabled={whatsappLoading}
                                className="w-full py-2.5 rounded-xl font-medium text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfluencerDashboard;
