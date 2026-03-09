import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Calendar, Clock, MapPin, Search, Upload, Video, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const DelayedPage = () => {
    const [activeTab, setActiveTab] = useState('shoots');
    const [searchQuery, setSearchQuery] = useState('');
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null, eventType: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemType: null });
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    // API data
    const [shoots, setShoots] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Yesterday's date (delayed = before today, not completed)
    const getYesterdayStr = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const yesterdayStr = getYesterdayStr();

    // Helper to convert HH:MM:SS or HH:MM to display time
    const toDisplayTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Fetch delayed (past due, not completed) shoots and uploads
    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);

            const [shootsRes, uploadsRes] = await Promise.all([
                api.get('/api/shoots', { params: { completed: false, end_date: yesterdayStr } }),
                api.get('/api/uploads', { params: { completed: false, end_date: yesterdayStr } }),
            ]);

            setShoots(Array.isArray(shootsRes.data) ? shootsRes.data : []);
            setUploads(Array.isArray(uploadsRes.data) ? uploadsRes.data : []);
        } catch (err) {
            if (!silent) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Failed to load delayed items.';
                setError(msg);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [yesterdayStr]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map API data to component format
    const delayedShoots = shoots.map(s => ({
        id: s.id,
        brandName: s.brand_name || '',
        campaign: s.name || '',
        shootDate: s.shoot_date,
        shootTime: toDisplayTime(s.shoot_time),
        location: s.location || '',
        notes: s.notes || '',
    }));

    const delayedUploads = uploads.map(u => ({
        id: u.id,
        brandName: u.brand_name || '',
        campaign: u.name || '',
        uploadDate: u.upload_date,
        uploadTime: toDisplayTime(u.upload_time),
        platform: u.platform || '',
        notes: u.notes || '',
    }));

    // Filter functions
    const filterShoots = () => {
        if (!searchQuery) return delayedShoots;
        const query = searchQuery.toLowerCase();
        return delayedShoots.filter(shoot =>
            shoot.brandName?.toLowerCase().includes(query) ||
            shoot.campaign?.toLowerCase().includes(query) ||
            shoot.location?.toLowerCase().includes(query)
        );
    };

    const filterUploads = () => {
        if (!searchQuery) return delayedUploads;
        const query = searchQuery.toLowerCase();
        return delayedUploads.filter(upload =>
            upload.brandName?.toLowerCase().includes(query) ||
            upload.campaign?.toLowerCase().includes(query) ||
            upload.platform?.toLowerCase().includes(query)
        );
    };

    const filteredShoots = filterShoots();
    const filteredUploads = filterUploads();

    const getPlatformIcon = () => {
        return <Upload size={20} className="text-gray-700" />;
    };

    // Mark as completed via API
    const handleMarkComplete = async (itemId, type) => {
        try {
            if (type === 'shoot') {
                await api.put(`/api/shoots/${itemId}`, { completed: true });
            } else {
                await api.put(`/api/uploads/${itemId}`, { completed: true });
            }
            setSuccessAlert({ isOpen: true, message: 'Item marked as completed!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to mark as completed.' });
        }
    };

    // Reschedule handlers
    const handleReschedule = (event, type) => {
        setRescheduleModal({ isOpen: true, event, eventType: type });
    };

    const handleCloseRescheduleModal = () => {
        setRescheduleModal({ isOpen: false, event: null, eventType: null });
    };

    const handleRescheduleConfirm = async (rescheduleData) => {
        if (!rescheduleModal.event || !rescheduleData) {
            handleCloseRescheduleModal();
            return;
        }

        try {
            const eventId = rescheduleModal.event.id;
            if (rescheduleModal.eventType === 'shoot') {
                await api.put(`/api/shoots/${eventId}`, {
                    shoot_date: rescheduleData.date,
                    shoot_time: rescheduleData.time || null,
                });
            } else {
                await api.put(`/api/uploads/${eventId}`, {
                    upload_date: rescheduleData.date,
                    upload_time: rescheduleData.time || null,
                });
            }

            setSuccessAlert({ isOpen: true, message: 'Event rescheduled successfully!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to reschedule event.' });
        }
        handleCloseRescheduleModal();
    };

    // Delete handlers
    const handleDelete = (itemId, type) => {
        setDeleteConfirm({ isOpen: true, itemId, itemType: type });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.itemId) {
            setDeleteConfirm({ isOpen: false, itemId: null, itemType: null });
            return;
        }

        try {
            if (deleteConfirm.itemType === 'shoot') {
                await api.delete(`/api/shoots/${deleteConfirm.itemId}`);
            } else {
                await api.delete(`/api/uploads/${deleteConfirm.itemId}`);
            }

            setSuccessAlert({ isOpen: true, message: 'Event deleted successfully!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to delete event.' });
        }
        setDeleteConfirm({ isOpen: false, itemId: null, itemType: null });
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({ isOpen: false, itemId: null, itemType: null });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading delayed items...</p>
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
                    <Button onClick={() => fetchData()}>Try Again</Button>
                </Card>
            </div>
        );
    }

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
                                            <h3 className="font-semibold text-deep-black">{shoot.brandName || 'Untitled'}</h3>
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
                                    {shoot.shootTime && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Clock size={16} className="text-gray-400" />
                                            {shoot.shootTime}
                                        </div>
                                    )}
                                    {shoot.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <MapPin size={16} className="text-gray-400" />
                                            {shoot.location}
                                        </div>
                                    )}
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
                                            onClick={() => handleReschedule(shoot, 'shoot')}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600"
                                            onClick={() => handleDelete(shoot.id, 'shoot')}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleMarkComplete(shoot.id, 'shoot')}
                                    >
                                        Mark as Complete
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
                                            {getPlatformIcon()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{upload.brandName || 'Untitled'}</h3>
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
                                    {upload.uploadTime && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Clock size={16} className="text-gray-400" />
                                            {upload.uploadTime}
                                        </div>
                                    )}
                                    {upload.platform && (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <Upload size={16} className="text-gray-400" />
                                            {upload.platform}
                                        </div>
                                    )}
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
                                            onClick={() => handleReschedule(upload, 'upload')}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600"
                                            onClick={() => handleDelete(upload.id, 'upload')}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleMarkComplete(upload.id, 'upload')}
                                    >
                                        Mark as Complete
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

            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />

            {/* Error Alert */}
            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default DelayedPage;
