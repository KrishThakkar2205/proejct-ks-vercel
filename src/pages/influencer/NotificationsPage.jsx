import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Star, Info, Clock, CheckCircle2, Search, Filter, Trash2, MoreVertical, Loader2, Calendar, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../utils/api';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString();
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/dashboard-collab-notification');

            // Transform the data based on the provided API response structure
            const transformedData = response.data.map(item => {
                const createdAt = new Date(item.created_at);
                return {
                    id: item.id,
                    type: 'collab',
                    title: `Collaboration Request`,
                    brandName: item.brand_name,
                    message: `${item.person_name} from ${item.brand_name} is interested in collaborating. Budget: ${item.budget}.`,
                    details: item.notes,
                    businessInfo: item.business_info,
                    time: formatRelativeTime(item.created_at),
                    date: createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    read: false, // Default to unread as API doesn't specify
                    icon: <MessageSquare className="text-blue-500" size={20} />,
                    category: 'New Request',
                    raw: item
                };
            });

            setNotifications(transformedData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Failed to load notifications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);


    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/collab-notification/${id}`);
            await fetchNotifications();
        } catch (err) {
            console.error('Failed to delete notification:', err);
            alert('Could not delete notification. Please try again.');
        }
    };

    // Filter & Sort Logic
    const getFilteredNotifications = () => {
        let list = notifications;

        if (dateFilter) {
            list = list.filter(n => {
                const nDate = new Date(n.raw.created_at);
                const nDateStr = `${nDate.getFullYear()}-${String(nDate.getMonth() + 1).padStart(2, '0')}-${String(nDate.getDate()).padStart(2, '0')}`;
                return nDateStr === dateFilter;
            });
        }

        return list.sort((a, b) => new Date(b.raw.created_at) - new Date(a.raw.created_at));
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bebas tracking-wide text-deep-black leading-tight">Collaboration Requests</h1>
                    <p className="text-gray-500 text-[11px] md:text-sm mt-1">Manage your brand partnerships and campaign updates</p>
                </div>
                
                {/* Date Filter Input */}
                <div className="relative w-full sm:w-48 h-9 shrink-0">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 border border-gray-250 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent bg-gray-50/50 focus:bg-white text-gray-600 h-full"
                    />
                    {dateFilter && (
                        <button
                            onClick={() => setDateFilter('')}
                            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
                        >
                            <X size={13} className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3 md:space-y-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 size={40} className="text-primary-orange animate-spin" />
                        <p className="text-gray-500 animate-pulse">Fetching your requests...</p>
                    </div>
                ) : error ? (
                    <Card className="p-10 text-center bg-red-50 border-red-100">
                        <Info className="text-red-500 mx-auto mb-4" size={40} />
                        <h3 className="text-lg font-bebas tracking-wide text-red-700">{error}</h3>
                        <Button variant="outline" className="mt-4 border-red-200 text-red-600 hover:bg-red-100" onClick={fetchNotifications}>
                            Try Again
                        </Button>
                    </Card>
                ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`p-2.5 md:p-5 transition-all hover:shadow-md cursor-pointer border-l-4 ${!notification.read ? 'border-l-primary-orange bg-white shadow-sm' : 'border-l-transparent bg-white/60'}`}
                        >
                            <div className="flex gap-2.5 md:gap-5">
                                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0 ${!notification.read ? 'bg-orange-50 ring-1 ring-orange-100' : 'bg-gray-100'}`}>
                                    {React.cloneElement(notification.icon, { size: 14, className: (notification.icon.props.className || '') + ' w-3.5 h-3.5 md:w-5 md:h-5' })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                <h3 className={`text-sm sm:text-base md:text-lg font-bebas tracking-wide ${!notification.read ? 'text-deep-black' : 'text-gray-600'} break-words`}>
                                                    {notification.brandName}
                                                </h3>
                                                <Badge variant="outline" className="text-[8px] md:text-[10px] uppercase font-bold px-1 py-0.5 border-gray-200 text-gray-500 shrink-0">
                                                    {notification.category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-400">
                                                <Clock size={9} className="md:w-3 md:h-3" />
                                                <span>{notification.time}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{notification.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-[11px] sm:text-xs md:text-sm leading-relaxed mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                                        {notification.message}
                                    </p>
                                    {(notification.details || notification.businessInfo) && (
                                        <div className="mt-1.5 p-1.5 bg-gray-50 rounded-md border border-gray-100 text-[9px] md:text-xs">
                                            {notification.businessInfo && (
                                                <div className="mb-0.5">
                                                    <span className="font-bold text-gray-600 uppercase">Business Info:</span>
                                                    <span className="ml-1 text-gray-500">{notification.businessInfo}</span>
                                                </div>
                                            )}
                                            {notification.details && (
                                                <div className="mb-0.5">
                                                    <span className="font-bold text-gray-600 uppercase">Notes:</span>
                                                    <span className="ml-1 text-gray-500">{notification.details}</span>
                                                </div>
                                            )}
                                            {notification.raw.person_phone && (
                                                <div>
                                                    <span className="font-bold text-gray-600 uppercase">Phone:</span>
                                                    <span className="ml-1 text-gray-500">{notification.raw.person_phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-2.5 md:mt-4">
                                        <Button size="sm" variant="outline" className="text-[10px] md:text-xs py-1 px-2.5 h-7 md:h-auto text-red-500 border-red-250 hover:bg-red-50 font-semibold" onClick={() => deleteNotification(notification.id)}>Delete Notification</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center bg-white border border-gray-150 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            {dateFilter ? <Calendar size={32} className="text-gray-300" /> : <Bell size={32} className="text-gray-300" />}
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No requests found</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            {dateFilter
                                ? 'No collaboration requests were received on the selected date.'
                                : 'When you receive collaboration requests or system updates, they will appear here.'}
                        </p>
                        {dateFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDateFilter('')}
                                className="mt-4"
                            >
                                Clear Date Filter
                            </Button>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
