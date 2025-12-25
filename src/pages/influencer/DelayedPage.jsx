import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessAlert from '../../components/ui/SuccessAlert';
import { Calendar, Clock, MapPin, Search, Upload, Video, AlertTriangle, Trash2 } from 'lucide-react';
import { calendarEvents } from '../../data/demoData';

const DelayedPage = () => {
    const [activeTab, setActiveTab] = useState('shoots');
    const [searchQuery, setSearchQuery] = useState('');
    const [completedItems, setCompletedItems] = useState(new Set());
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null });
    const [rescheduledEvents, setRescheduledEvents] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null });
    const [deletedItems, setDeletedItems] = useState(new Set());
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter delayed shoots (past due date)
    const delayedShoots = calendarEvents
        .filter(event => {
            if (event.type !== 'shoot') return false;
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate < today && event.status !== 'completed';
        })
        .map(event => ({
            id: event.id,
            brandName: event.brand,
            campaign: event.campaign,
            shootDate: event.date,
            shootTime: event.displayTime,
            location: event.location,
            status: event.status,
            notes: event.description
        }));

    // Filter delayed uploads (past due date)
    const delayedUploads = calendarEvents
        .filter(event => {
            if (event.type !== 'upload') return false;
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate < today && event.status !== 'uploaded';
        })
        .map(event => ({
            id: event.id,
            brandName: event.brand,
            campaign: event.campaign,
            uploadDate: event.date,
            uploadTime: event.displayTime,
            platform: event.platform || 'YouTube',
            contentType: 'Video',
            status: event.status,
            notes: event.description
        }));

    // Filter functions
    const filterShoots = () => {
        const filtered = delayedShoots.filter(s => !deletedItems.has(s.id));
        if (!searchQuery) return filtered;
        const query = searchQuery.toLowerCase();
        return filtered.filter(shoot =>
            shoot.brandName?.toLowerCase().includes(query) ||
            shoot.campaign?.toLowerCase().includes(query) ||
            shoot.location?.toLowerCase().includes(query)
        );
    };

    const filterUploads = () => {
        const filtered = delayedUploads.filter(u => !deletedItems.has(u.id));
        if (!searchQuery) return filtered;
        const query = searchQuery.toLowerCase();
        return filtered.filter(upload =>
            upload.brandName?.toLowerCase().includes(query) ||
            upload.campaign?.toLowerCase().includes(query) ||
            upload.platform?.toLowerCase().includes(query)
        );
    };

    const filteredShoots = filterShoots();
    const filteredUploads = filterUploads();

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'uploaded':
                return 'success';
            case 'pending':
                return 'warning';
            case 'delayed':
                return 'error';
            default:
                return 'secondary';
        }
    };

    const getPlatformIcon = (platform) => {
        return <Upload size={20} className="text-gray-700" />;
    };

    // Action handlers
    const handleMarkComplete = (itemId) => {
        setCompletedItems(prev => {
            const newSet = new Set(prev);
            newSet.add(itemId);
            return newSet;
        });
        setSuccessAlert({
            isOpen: true,
            message: 'Item marked as completed!'
        });
        setTimeout(() => {
            setSuccessAlert({ isOpen: false, message: '' });
        }, 3000);
    };

    const handleReschedule = (event) => {
        setRescheduleModal({ isOpen: true, event });
    };

    const handleCloseRescheduleModal = () => {
        setRescheduleModal({ isOpen: false, event: null });
    };

    const handleRescheduleConfirm = (rescheduleData) => {
        if (rescheduleModal.event && rescheduleData) {
            const [hours, minutes] = rescheduleData.time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            const displayTime = `${displayHour}:${minutes} ${ampm}`;

            setRescheduledEvents(prev => ({
                ...prev,
                [rescheduleModal.event.id]: {
                    date: rescheduleData.date,
                    time: rescheduleData.time,
                    displayTime: displayTime
                }
            }));

            setSuccessAlert({
                isOpen: true,
                message: 'Event rescheduled successfully!'
            });

            setTimeout(() => {
                setSuccessAlert({ isOpen: false, message: '' });
            }, 3000);
        }
        handleCloseRescheduleModal();
    };

    const handleDelete = (itemId) => {
        setDeleteConfirm({ isOpen: true, itemId });
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm.itemId) {
            setDeletedItems(prev => {
                const newSet = new Set(prev);
                newSet.add(deleteConfirm.itemId);
                return newSet;
            });

            setSuccessAlert({
                isOpen: true,
                message: 'Event deleted successfully!'
            });

            setTimeout(() => {
                setSuccessAlert({ isOpen: false, message: '' });
            }, 3000);
        }
        setDeleteConfirm({ isOpen: false, itemId: null });
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({ isOpen: false, itemId: null });
    };

    return (
        <div className="space-y-8">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Delayed Items</h1>
                <p className="text-gray-600 text-sm mt-1">Overdue shoots and uploads</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Delayed Shoots</p>
                            <h3 className="text-4xl font-bebas tracking-wide text-red-600">
                                {delayedShoots.length}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">Require immediate attention</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-red-600" size={32} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Delayed Uploads</p>
                            <h3 className="text-4xl font-bebas tracking-wide text-orange-600">
                                {delayedUploads.length}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">Pending upload</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                            <Upload className="text-orange-600" size={32} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {['shoots', 'uploads'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab === 'shoots'
                            ? `Delayed Shoots (${delayedShoots.length})`
                            : `Delayed Uploads (${delayedUploads.length})`}
                    </button>
                ))}
            </div>

            {/* Search */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'shoots' ? 'shoots' : 'uploads'}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Delayed Shoots */}
            {activeTab === 'shoots' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredShoots.length > 0 ? (
                        filteredShoots.map((shoot) => (
                            <Card key={shoot.id} className="p-6 hover:border-red-400 transition-colors border-l-4 border-l-red-500">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Video size={20} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{shoot.brandName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{shoot.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant="error" className="self-start sm:self-auto">
                                        Delayed
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(shoot.shootDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock size={16} className="text-gray-400" />
                                        {shoot.shootTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPin size={16} className="text-gray-400" />
                                        {shoot.location}
                                    </div>
                                </div>

                                {shoot.notes && (
                                    <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                                        <p className="text-xs text-gray-700 font-semibold mb-1">Notes:</p>
                                        <p className="text-sm text-gray-700">{shoot.notes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleReschedule(shoot)}
                                            disabled={completedItems.has(shoot.id)}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDelete(shoot.id)}
                                            disabled={completedItems.has(shoot.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant={completedItems.has(shoot.id) ? "outline" : "primary"}
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleMarkComplete(shoot.id)}
                                        disabled={completedItems.has(shoot.id)}
                                    >
                                        {completedItems.has(shoot.id) ? 'Completed' : 'Mark as Complete'}
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <Video size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No delayed shoots</h3>
                            <p className="text-sm text-gray-500">
                                {searchQuery ? 'Try adjusting your search' : 'All shoots are on schedule'}
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Delayed Uploads */}
            {activeTab === 'uploads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUploads.length > 0 ? (
                        filteredUploads.map((upload) => (
                            <Card key={upload.id} className="p-6 hover:border-orange-400 transition-colors border-l-4 border-l-orange-500">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            {getPlatformIcon(upload.platform)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{upload.brandName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{upload.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant="warning" className="self-start sm:self-auto">
                                        Delayed
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Calendar size={16} className="text-gray-400" />
                                        {new Date(upload.uploadDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Clock size={16} className="text-gray-400" />
                                        {upload.uploadTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Upload size={16} className="text-gray-400" />
                                        {upload.platform} - {upload.contentType}
                                    </div>
                                </div>

                                {upload.notes && (
                                    <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                                        <p className="text-xs text-gray-700 font-semibold mb-1">Notes:</p>
                                        <p className="text-sm text-gray-700">{upload.notes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleReschedule(upload)}
                                            disabled={completedItems.has(upload.id)}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDelete(upload.id)}
                                            disabled={completedItems.has(upload.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant={completedItems.has(upload.id) ? "outline" : "primary"}
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleMarkComplete(upload.id)}
                                        disabled={completedItems.has(upload.id)}
                                    >
                                        {completedItems.has(upload.id) ? 'Completed' : 'Mark as Complete'}
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <Upload size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No delayed uploads</h3>
                            <p className="text-sm text-gray-500">
                                {searchQuery ? 'Try adjusting your search' : 'All uploads are on schedule'}
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Reschedule Modal */}
            {createPortal(
                <RescheduleModal
                    isOpen={rescheduleModal.isOpen}
                    event={rescheduleModal.event}
                    onClose={handleCloseRescheduleModal}
                    onConfirm={handleRescheduleConfirm}
                />,
                document.body
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
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

export default DelayedPage;
