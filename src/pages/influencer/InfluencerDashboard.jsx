import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PlatformMetrics from '../../components/dashboard/PlatformMetrics';
import DailySchedule from '../../components/dashboard/DailySchedule';
import CompletedShootsToday from '../../components/dashboard/CompletedShootsToday';
import DelayedShootsToday from '../../components/dashboard/DelayedShootsToday';
import { Calendar, CheckCircle, DollarSign, Star, Clock, ArrowRight, TrendingUp, Share2, Check } from 'lucide-react';

const InfluencerDashboard = () => {
    const [copied, setCopied] = useState(false);
    const [completedShootsToday, setCompletedShootsToday] = useState([
        {
            id: 'completed-1',
            brand: 'Fashion Nova',
            campaign: 'Spring Collection 2025',
            type: 'shoot',
            completedAt: '9:30 AM',
            location: 'Mumbai Studio',
            rating: 5
        },
        {
            id: 'completed-2',
            brand: 'TechGear Pro',
            campaign: 'Gadget Review Series',
            type: 'upload',
            completedAt: '1:45 PM',
            location: 'Virtual',
            rating: 4
        },
        {
            id: 'completed-3',
            brand: 'Wellness Co',
            campaign: 'Fitness Challenge',
            type: 'shoot',
            completedAt: '11:00 AM',
            location: 'Outdoor Park',
            rating: 5
        },
        {
            id: 'completed-4',
            brand: 'Beauty Brands',
            campaign: 'Makeup Tutorial',
            type: 'upload',
            completedAt: '3:15 PM',
            location: 'Home Studio',
            rating: 4
        }
    ]);

    // Handler to mark event as complete
    const handleMarkComplete = (event) => {
        const newCompletedShoot = {
            id: `completed-${Date.now()}`,
            brand: event.brand || event.title,
            campaign: event.campaign || event.title,
            type: event.type,
            completedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            location: event.location || 'N/A',
            rating: 0
        };

        setCompletedShootsToday(prev => [...prev, newCompletedShoot]);
    };

    const stats = [
        { label: 'Upcoming Shoots', value: '3', trend: '+1', icon: <Calendar className="text-white" />, color: 'bg-blue-500' },
        { label: 'Completed Shoots', value: '24', trend: '+5', icon: <CheckCircle className="text-white" />, color: 'bg-green-500' },
        { label: 'Total Earnings', value: '$12.5k', trend: '+18%', icon: <DollarSign className="text-white" />, color: 'bg-primary-orange' },
        { label: 'Average Rating', value: '4.8', trend: '+0.2', icon: <Star className="text-white" />, color: 'bg-purple-500' },
    ];

    const upcomingShoots = [
        {
            id: 1,
            brand: 'Fashion Nova',
            campaign: 'Spring Collection 2025',
            date: '2025-12-20',
            time: '10:00 AM',
            location: 'Mumbai Studio',
            status: 'Confirmed',
            daysUntil: 4
        },
        {
            id: 2,
            brand: 'TechGear Pro',
            campaign: 'Gadget Review Series',
            date: '2025-12-22',
            time: '2:00 PM',
            location: 'Virtual',
            status: 'Confirmed',
            daysUntil: 6
        },
        {
            id: 3,
            brand: 'Wellness Co',
            campaign: 'Fitness Challenge',
            date: '2025-12-25',
            time: '9:00 AM',
            location: 'Outdoor Park',
            status: 'Pending',
            daysUntil: 9
        },
    ];

    const quickActions = [
        { label: 'View Calendar', path: '/influencer/calendar', icon: <Calendar size={20} />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { label: 'Check Schedule', path: '/influencer/schedule', icon: <Clock size={20} />, color: 'bg-orange-50 text-primary-orange hover:bg-orange-100' },
        { label: 'View Reviews', path: '/influencer/reviews', icon: <Star size={20} />, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
        { label: 'Edit Profile', path: '/influencer/profile', icon: <TrendingUp size={20} />, color: 'bg-green-50 text-green-600 hover:bg-green-100' },
    ];

    // Portfolio link - In production, this would use the actual username from auth context
    const username = 'johndoe'; // Replace with actual username from auth
    const portfolioUrl = `${window.location.origin}/portfolio/${username}`;

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
                    <Link key={index} to={action.path}>
                        <Card className={`p-2 sm:p-3 h-full flex flex-col items-center justify-center gap-1 sm:gap-2 hover:border-primary-orange transition-all cursor-pointer group ${action.color}`}>
                            <div className="flex-shrink-0">
                                {React.cloneElement(action.icon, { size: 16, className: "sm:w-5 sm:h-5" })}
                            </div>
                            <h4 className="font-semibold text-[10px] sm:text-sm md:text-base text-center leading-tight">{action.label}</h4>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Platform Metrics - Full Width */}
            <div className="animate-fadeIn">
                <PlatformMetrics />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bebas tracking-wide text-deep-black">{stat.value}</h3>
                            {stat.trend && (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                                    {stat.trend} this month
                                </span>
                            )}
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="space-y-6">
                {/* Top Row: Today's Schedule and Delayed Shoots side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:h-[700px]">
                        <DailySchedule onMarkComplete={handleMarkComplete} />
                    </div>
                    <div className="lg:h-[700px]">
                        <DelayedShootsToday onMarkComplete={handleMarkComplete} />
                    </div>
                </div>

                {/* Bottom Row: Completed Shoots and Upcoming Shoots */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Completed Shoots Today */}
                    <div className="lg:h-[700px]">
                        <CompletedShootsToday completedShoots={completedShootsToday} />
                    </div>

                    {/* Recent Reviews */}
                    <div className="lg:h-[700px]">
                        <Card className="p-6 h-auto lg:h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-bebas tracking-wide text-deep-black">Recent Reviews</h2>
                                    <p className="text-sm text-gray-600 mt-1">Client feedback</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 lg:overflow-y-auto pr-2">
                                {[
                                    {
                                        id: 1,
                                        clientName: 'Fashion Nova',
                                        rating: 5,
                                        comment: 'Excellent work! Very professional and delivered amazing content.',
                                        date: '2 days ago',
                                        avatar: 'FN'
                                    },
                                    {
                                        id: 2,
                                        clientName: 'TechGear Pro',
                                        rating: 4,
                                        comment: 'Great collaboration. Looking forward to working again!',
                                        date: '5 days ago',
                                        avatar: 'TG'
                                    },
                                    {
                                        id: 3,
                                        clientName: 'Wellness Co',
                                        rating: 5,
                                        comment: 'Outstanding creativity and engagement. Highly recommended!',
                                        date: '1 week ago',
                                        avatar: 'WC'
                                    }
                                ].map((review) => (
                                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-semibold text-sm">{review.avatar}</span>
                                            </div>

                                            {/* Review Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="font-semibold text-deep-black text-sm">{review.clientName}</h3>
                                                    <span className="text-xs text-gray-500">{review.date}</span>
                                                </div>

                                                {/* Star Rating */}
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Comment */}
                                                <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link to="/influencer/reviews" className="block mt-4">
                                <Button variant="outline" size="sm" className="w-full">
                                    View All Reviews
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerDashboard;
