import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Calendar, Clock, MapPin, Search, Upload, Video, X, Trash2, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const Schedule = () => {
    const [activeTab, setActiveTab] = useState('shoots');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedShoot, setSelectedShoot] = useState(null);
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null, eventType: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemType: null });
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    // API data
    const [shoots, setShoots] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get today's date string
    const getTodayStr = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const todayStr = getTodayStr();

    // Convert UTC date + time from backend → user's local 12h time
    const utcToLocalDisplay = (utcDate, utcTime) => {
        if (!utcDate || !utcTime) return '';
        const d = new Date(`${utcDate}T${utcTime}:00Z`);
        if (isNaN(d.getTime())) return utcTime;
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Convert UTC date + time → local YYYY-MM-DD
    const utcDateToLocal = (utcDate, utcTime) => {
        if (!utcDate) return utcDate;
        const d = new Date(`${utcDate}T${utcTime || '00:00'}:00Z`);
        if (isNaN(d.getTime())) return utcDate;
        return d.toLocaleDateString('en-CA');
    };

    // Fetch today's shoots and uploads
    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);

            const [shootsRes, uploadsRes] = await Promise.all([
                api.get('/api/shoots', { params: { start_date: todayStr, end_date: todayStr } }),
                api.get('/api/uploads', { params: { start_date: todayStr, end_date: todayStr } }),
            ]);

            setShoots(Array.isArray(shootsRes.data) ? shootsRes.data : []);
            setUploads(Array.isArray(uploadsRes.data) ? uploadsRes.data : []);
        } catch (err) {
            if (!silent) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Failed to load schedule data.';
                setError(msg);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [todayStr]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map API data to component format
    const bookings = shoots.map(s => ({
        id: s.id,
        brandName: s.brand_name || '',
        campaign: s.name || '',
        shootDate: utcDateToLocal(s.shoot_date, s.shoot_time),
        shootTime: utcToLocalDisplay(s.shoot_date, s.shoot_time),
        location: s.location || '',
        status: s.completed ? 'completed' : 'confirmed',
        notes: s.notes || '',
        completed: s.completed
    }));

    const uploadSchedule = uploads.map(u => ({
        id: u.id,
        brandName: u.brand_name || '',
        campaign: u.name || '',
        uploadDate: utcDateToLocal(u.upload_date, u.upload_time),
        uploadTime: utcToLocalDisplay(u.upload_date, u.upload_time),
        platform: u.platform || '',
        contentType: 'Video',
        status: u.completed ? 'uploaded' : 'confirmed',
        notes: u.notes || '',
        completed: u.completed
    }));

    // Get today's active shoots (not completed)
    const todaysShoot = bookings.filter(b => !b.completed);
    const todaysUploads = uploadSchedule.filter(u => !u.completed);

    // Mark as completed handlers (call PUT API)
    const handleMarkShootComplete = async (shootId) => {
        try {
            await api.put(`/api/shoots/${shootId}`, { completed: true });
            setSuccessAlert({ isOpen: true, message: 'Shoot marked as completed!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to mark shoot as completed.' });
        }
    };

    const handleMarkUploadComplete = async (uploadId) => {
        try {
            await api.put(`/api/uploads/${uploadId}`, { completed: true });
            setSuccessAlert({ isOpen: true, message: 'Upload marked as completed!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to mark upload as completed.' });
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

    // Modal handlers
    const openShootModal = (shoot) => {
        setSelectedShoot(shoot);
    };

    const closeShootModal = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setSelectedShoot(null);
            setIsModalClosing(false);
        }, 300);
    };

    // Filter functions
    const filterShoots = () => {
        let filtered = todaysShoot;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking =>
                booking.brandName?.toLowerCase().includes(query) ||
                booking.campaign?.toLowerCase().includes(query) ||
                booking.location?.toLowerCase().includes(query) ||
                booking.status?.toLowerCase().includes(query) ||
                booking.shootTime?.toLowerCase().includes(query) ||
                booking.notes?.toLowerCase().includes(query)
            );
        }
        return filtered.sort((a, b) => a.shootTime.localeCompare(b.shootTime));
    };

    const filterUploads = () => {
        let filtered = todaysUploads;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(upload =>
                upload.brandName?.toLowerCase().includes(query) ||
                upload.campaign?.toLowerCase().includes(query) ||
                upload.platform?.toLowerCase().includes(query) ||
                upload.contentType?.toLowerCase().includes(query) ||
                upload.status?.toLowerCase().includes(query) ||
                upload.uploadTime?.toLowerCase().includes(query) ||
                upload.notes?.toLowerCase().includes(query)
            );
        }
        return filtered.sort((a, b) => a.uploadTime.localeCompare(b.uploadTime));
    };

    const filteredShoot = filterShoots();
    const filteredUploads = filterUploads();

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'completed': return 'info';
            case 'uploaded': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getPlatformIcon = (platform) => {
        return <Upload size={16} />;
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading schedule...</p>
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
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Schedule</h1>
                <p className="text-gray-600 text-sm mt-1">Today's shoots and uploads</p>
            </div>

            {/* Today's Summary Card */}
            {(todaysShoot.length > 0 || todaysUploads.length > 0) && (
                <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-primary-orange">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="text-xl font-bebas tracking-wide font-bold text-deep-black">Today's Schedule</h2>
                        </div>
                        <Badge variant="error" className="animate-pulse">Live</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-primary-orange">
                            <div className="flex items-center gap-2 mb-2">
                                <Video size={20} className="text-primary-orange" />
                                <h3 className="font-semibold text-deep-black">Shoots</h3>
                            </div>
                            <p className="text-3xl font-bold text-primary-orange">{todaysShoot.length}</p>
                            <p className="text-sm text-gray-600 mt-1">scheduled today</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Upload size={20} className="text-gray-700" />
                                <h3 className="font-semibold text-deep-black">Uploads</h3>
                            </div>
                            <p className="text-3xl font-bold text-gray-700">{todaysUploads.length}</p>
                            <p className="text-sm text-gray-600 mt-1">to upload today</p>
                        </div>
                    </div>
                </Card>
            )}

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
                        {tab === 'shoots' ? `Shoot Schedule (${todaysShoot.length})` : `Upload Schedule (${todaysUploads.length})`}
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Shoot Schedule */}
            {activeTab === 'shoots' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredShoot.length > 0 ? (
                        filteredShoot.map((booking) => (
                            <Card key={booking.id} className="p-6 hover:border-orange-300 transition-colors border-l-4 border-l-primary-orange">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{booking.brandName || 'Untitled'}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{booking.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(booking.status)} className="self-start sm:self-auto">
                                        {booking.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {booking.shootTime && (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-primary-orange">
                                            <Clock size={16} />
                                            {booking.shootTime}
                                        </div>
                                    )}
                                    {booking.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin size={16} className="text-gray-400" />
                                            {booking.location}
                                        </div>
                                    )}
                                </div>

                                {booking.notes && (
                                    <div className="p-3 bg-orange-50 rounded-lg mb-4 border border-orange-200">
                                        <p className="text-xs text-primary-orange font-semibold mb-1">Important Notes:</p>
                                        <p className="text-sm text-gray-700">{booking.notes}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 mt-4">
                                    {/* First row: Reschedule and Delete side by side */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleReschedule(booking, 'shoot')}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDelete(booking.id, 'shoot')}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    {/* Second row: View Details and Mark as Completed */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => openShootModal(booking)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleMarkShootComplete(booking.id)}
                                        >
                                            Mark as Completed
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <Video size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No shoots scheduled</h3>
                            <p className="text-sm text-gray-500">
                                {searchQuery ? 'Try adjusting your search' : 'No shoots scheduled for today'}
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Upload Schedule */}
            {activeTab === 'uploads' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUploads.length > 0 ? (
                        filteredUploads.map((upload) => (
                            <Card key={upload.id} className="p-6 hover:border-gray-400 transition-colors border-l-4 border-l-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            {getPlatformIcon(upload.platform)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{upload.brandName || 'Untitled'}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{upload.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(upload.status)} className="self-start sm:self-auto">
                                        {upload.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {upload.uploadTime && (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <Clock size={16} />
                                            {upload.uploadTime}
                                        </div>
                                    )}
                                    {upload.platform && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Upload size={16} className="text-gray-400" />
                                            {upload.platform}
                                        </div>
                                    )}
                                </div>

                                {upload.notes && (
                                    <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                                        <p className="text-xs text-gray-700 font-semibold mb-1">Upload Notes:</p>
                                        <p className="text-sm text-gray-700">{upload.notes}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 mt-4">
                                    {/* First row: Reschedule and Delete side by side */}
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
                                            className="text-red-600 hover:bg-red-50 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDelete(upload.id, 'upload')}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    {/* Second row: Mark as Completed */}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleMarkUploadComplete(upload.id)}
                                    >
                                        Mark as Completed
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="col-span-full p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <Upload size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No uploads scheduled</h3>
                            <p className="text-sm text-gray-500">
                                {searchQuery ? 'Try adjusting your search' : 'No uploads scheduled for today'}
                            </p>
                        </Card>
                    )}
                </div>
            )}

            {/* Shoot Details Modal */}
            {selectedShoot && createPortal(
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 ${isModalClosing ? 'animate-backdrop-exit' : 'animate-fadeIn'}`}
                    style={{ backdropFilter: 'blur(4px)' }}
                    onClick={closeShootModal}
                >
                    <Card
                        className={`w-[95%] md:w-full max-w-2xl max-h-[85vh] overflow-y-auto ${isModalClosing ? 'animate-popup-exit' : 'animate-scaleIn'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div>
                                        <h2 className="text-2xl font-bebas tracking-wide text-deep-black mb-1">
                                            {selectedShoot.brandName || 'Untitled'}
                                        </h2>
                                        <p className="text-gray-600">{selectedShoot.campaign}</p>
                                        <Badge variant={getStatusVariant(selectedShoot.status)} className="mt-2">
                                            {selectedShoot.status}
                                        </Badge>
                                    </div>
                                </div>
                                <button
                                    onClick={closeShootModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Shoot Details */}
                            <div className="space-y-6">
                                {/* Date & Time Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-primary-orange">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar size={18} className="text-primary-orange" />
                                            <p className="text-xs font-semibold text-primary-orange uppercase">Shoot Date</p>
                                        </div>
                                        <p className="text-lg font-semibold text-deep-black">
                                            {new Date(selectedShoot.shootDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {selectedShoot.shootTime && (
                                        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-primary-orange">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock size={18} className="text-primary-orange" />
                                                <p className="text-xs font-semibold text-primary-orange uppercase">Shoot Time</p>
                                            </div>
                                            <p className="text-lg font-semibold text-deep-black">{selectedShoot.shootTime}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                {selectedShoot.location && (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin size={18} className="text-gray-600" />
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                                        </div>
                                        <p className="text-base text-deep-black font-medium">{selectedShoot.location}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedShoot.notes && (
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-xs text-primary-orange font-semibold mb-2 uppercase">Important Notes</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{selectedShoot.notes}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={() => {
                                            handleMarkShootComplete(selectedShoot.id);
                                            closeShootModal();
                                        }}
                                    >
                                        Mark as Completed
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={closeShootModal}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>,
                document.body
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
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
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

export default Schedule;
