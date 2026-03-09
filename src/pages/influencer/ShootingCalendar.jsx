import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import DateInput from '../../components/ui/DateInput';
import TimeInput from '../../components/ui/TimeInput';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ErrorAlert from '../../components/ui/ErrorAlert';
import AddEventModal from '../../components/dashboard/AddEventModal';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Upload, Video, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const ShootingCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null, eventType: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemType: null });
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    // API data
    const [shoots, setShoots] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Calendar logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fetch shoots and uploads for the current month
    // silent = true skips the full-page loader (used for refreshes after CRUD ops)
    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);
            const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

            const [shootsRes, uploadsRes] = await Promise.all([
                api.get('/api/shoots', { params: { start_date: startDate, end_date: endDate } }),
                api.get('/api/uploads', { params: { start_date: startDate, end_date: endDate } }),
            ]);

            setShoots(Array.isArray(shootsRes.data) ? shootsRes.data : []);
            setUploads(Array.isArray(uploadsRes.data) ? uploadsRes.data : []);
        } catch (err) {
            if (!silent) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Failed to load calendar data.';
                setError(msg);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [year, month, daysInMonth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Helper to format date
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // Helper to convert HH:MM:SS or HH:MM to display time
    const toDisplayTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Map API data to the format the component expects
    const bookings = shoots.map(s => ({
        id: s.id,
        brandName: s.brand_name || '',
        campaign: s.name || '',
        shootDate: s.shoot_date,
        shootTime: toDisplayTime(s.shoot_time),
        location: s.location || '',
        status: s.completed ? 'completed' : 'confirmed',
        notes: s.notes || ''
    }));

    const uploadSchedule = uploads.map(u => ({
        id: u.id,
        brandName: u.brand_name || '',
        campaign: u.name || '',
        uploadDate: u.upload_date,
        uploadTime: toDisplayTime(u.upload_time),
        platform: u.platform || '',
        contentType: 'Video',
        status: u.completed ? 'uploaded' : 'confirmed',
        notes: u.notes || ''
    }));

    // Calendar helpers
    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const isBooked = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return bookings.some(b => b.shootDate === dateStr);
    };

    const hasUploads = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return uploadSchedule.some(u => u.uploadDate === dateStr);
    };

    const getBookingsForDate = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return bookings.filter(b => b.shootDate === dateStr);
    };

    const getUploadsForDate = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return uploadSchedule.filter(u => u.uploadDate === dateStr);
    };

    const getBookingCountForDate = (day) => getBookingsForDate(day).length;
    const getUploadCountForDate = (day) => getUploadsForDate(day).length;

    const isPast = (day) => {
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isFull = (day) => getBookingCountForDate(day) >= 4;

    // Generate calendar days
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    // Get today for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getSelectedDateObj = () => {
        if (!selectedDate) return today;
        const date = new Date(year, month, selectedDate);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const selectedDateObj = getSelectedDateObj();
    const isPastDate = selectedDateObj < today;

    // Categorize events for selected date
    const categorizeEvents = () => {
        if (!selectedDate) return { shoots: [], uploads: [], delayedShoots: [], delayedUploads: [] };
        const allBookings = getBookingsForDate(selectedDate);
        const allUploads = getUploadsForDate(selectedDate);

        if (isPastDate) {
            return {
                shoots: allBookings.filter(b => b.status === 'completed'),
                uploads: allUploads.filter(u => u.status === 'uploaded'),
                delayedShoots: allBookings.filter(b => b.status !== 'completed'),
                delayedUploads: allUploads.filter(u => u.status !== 'uploaded')
            };
        } else {
            return {
                shoots: allBookings,
                uploads: allUploads,
                delayedShoots: [],
                delayedUploads: []
            };
        }
    };

    const { shoots: selectedBookings, uploads: selectedUploads, delayedShoots, delayedUploads } = categorizeEvents();


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
            fetchData(true); // Silent refresh
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
            fetchData(true); // Silent refresh
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
                    <p className="text-gray-600">Loading calendar...</p>
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
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Calendar</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your schedule</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bebas tracking-wide text-deep-black">
                                {monthNames[month]} {year}
                            </h2>
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center"
                                >
                                    <span className="mr-1 text-lg leading-none">+</span>
                                    <span className="hidden sm:inline">Add to Calendar</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                                <Button variant="white" size="sm" onClick={previousMonth}>
                                    <ChevronLeft size={16} />
                                </Button>
                                <Button variant="white" size="sm" onClick={nextMonth}>
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mb-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-primary-orange rounded"></div>
                                <span className="text-gray-600">Shoots</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-700 rounded"></div>
                                <span className="text-gray-600">Uploads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-700 rounded"></div>
                                <span className="text-gray-600">Both</span>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {/* Day names */}
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="aspect-square"></div>;
                                }

                                const booked = isBooked(day);
                                const hasUpload = hasUploads(day);
                                const past = isPast(day);
                                const bookingCount = getBookingCountForDate(day);
                                const uploadCount = getUploadCountForDate(day);
                                const full = isFull(day);

                                let bgColor = 'bg-white hover:bg-gray-50';

                                if (booked && hasUpload) {
                                    bgColor = 'bg-orange-700 text-white hover:bg-orange-800';
                                } else if (booked) {
                                    if (full) {
                                        bgColor = 'bg-red-500 text-white hover:bg-red-600';
                                    } else {
                                        bgColor = 'bg-primary-orange text-white hover:bg-orange-600';
                                    }
                                } else if (hasUpload) {
                                    bgColor = 'bg-gray-700 text-white hover:bg-gray-800';
                                } else if (!past) {
                                    bgColor = 'bg-gray-50 border border-gray-200 hover:bg-gray-100';
                                }

                                if (past && !booked && !hasUpload) bgColor = 'bg-gray-50 text-gray-400';

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(day)}
                                        className={`aspect-square p-1 sm:p-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${bgColor} ${selectedDate === day ? 'ring-2 ring-primary-orange ring-offset-2' : ''
                                            }`}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full relative">
                                            <span>{day}</span>
                                            {(bookingCount > 0 || uploadCount > 0) && (
                                                <div className="flex gap-0.5 mt-0.5 sm:mt-1">
                                                    {bookingCount > 0 && (
                                                        <span className="text-[8px] sm:text-[10px] font-bold leading-tight">
                                                            S:{bookingCount}
                                                        </span>
                                                    )}
                                                    {uploadCount > 0 && (
                                                        <span className="text-[8px] sm:text-[10px] font-bold leading-tight">
                                                            U:{uploadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Selected Date Info */}
                    {selectedDate && (
                        <Card className="p-4">
                            <h3 className="font-semibold text-deep-black mb-3">
                                {monthNames[month]} {selectedDate}, {year}
                            </h3>

                            {/* Shoots Section */}
                            {selectedBookings.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Video size={16} className="text-primary-orange" />
                                        <p className="text-sm font-semibold text-primary-orange">
                                            Shoots ({selectedBookings.length})
                                        </p>
                                    </div>
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {selectedBookings.map((booking, idx) => (
                                            <div key={booking.id} className={`pb-4 ${idx < selectedBookings.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-primary-orange font-semibold">Shoot #{idx + 1}</p>
                                                    <Badge variant={booking.status === 'completed' ? 'success' : 'warning'}>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {booking.brandName && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Brand</p>
                                                            <p className="font-medium text-deep-black text-sm">{booking.brandName}</p>
                                                        </div>
                                                    )}
                                                    {booking.campaign && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Campaign</p>
                                                            <p className="text-sm text-gray-700">{booking.campaign}</p>
                                                        </div>
                                                    )}
                                                    {booking.shootTime && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Time</p>
                                                            <p className="text-sm text-gray-700">{booking.shootTime}</p>
                                                        </div>
                                                    )}
                                                    {booking.location && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Location</p>
                                                            <p className="text-sm text-gray-700">{booking.location}</p>
                                                        </div>
                                                    )}
                                                    {booking.notes && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Notes</p>
                                                            <p className="text-sm text-gray-700">{booking.notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons - hidden for completed shoots */}
                                                {booking.status !== 'completed' && (
                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
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
                                                            className="text-red-600 hover:bg-red-50 hover:border-red-600"
                                                            onClick={() => handleDelete(booking.id, 'shoot')}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Uploads Section */}
                            {selectedUploads.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Upload size={16} className="text-gray-700" />
                                        <p className="text-sm font-semibold text-gray-700">
                                            Uploads ({selectedUploads.length})
                                        </p>
                                    </div>
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {selectedUploads.map((upload, idx) => (
                                            <div key={upload.id} className={`pb-4 ${idx < selectedUploads.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-gray-700 font-semibold">Upload #{idx + 1}</p>
                                                    <Badge variant={upload.status === 'uploaded' ? 'success' : 'warning'}>
                                                        {upload.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {upload.brandName && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Brand</p>
                                                            <p className="font-medium text-deep-black text-sm">{upload.brandName}</p>
                                                        </div>
                                                    )}
                                                    {upload.campaign && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Campaign</p>
                                                            <p className="text-sm text-gray-700">{upload.campaign}</p>
                                                        </div>
                                                    )}
                                                    {upload.platform && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Platform</p>
                                                            <p className="text-sm text-gray-700">{upload.platform}</p>
                                                        </div>
                                                    )}
                                                    {upload.uploadTime && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Time</p>
                                                            <p className="text-sm text-gray-700">{upload.uploadTime}</p>
                                                        </div>
                                                    )}
                                                    {upload.notes && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Notes</p>
                                                            <p className="text-sm text-gray-700">{upload.notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons - hidden for completed uploads */}
                                                {upload.status !== 'uploaded' && (
                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
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
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delayed Section - Only show for past dates */}
                            {isPastDate && (delayedShoots.length > 0 || delayedUploads.length > 0) && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle size={16} className="text-red-600" />
                                        <p className="text-sm font-semibold text-red-600">
                                            Delayed ({delayedShoots.length + delayedUploads.length})
                                        </p>
                                    </div>
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {/* Delayed Shoots */}
                                        {delayedShoots.map((shoot) => (
                                            <div key={shoot.id} className="pb-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-red-600 font-semibold">Delayed Shoot</p>
                                                    <Badge variant="error">Delayed</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {shoot.brandName && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Brand</p>
                                                            <p className="font-medium text-deep-black text-sm">{shoot.brandName}</p>
                                                        </div>
                                                    )}
                                                    {shoot.campaign && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Campaign</p>
                                                            <p className="text-sm text-gray-700">{shoot.campaign}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReschedule(shoot, 'shoot')}>
                                                        Reschedule
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-600" onClick={() => handleDelete(shoot.id, 'shoot')}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Delayed Uploads */}
                                        {delayedUploads.map((upload) => (
                                            <div key={upload.id} className="pb-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs text-orange-600 font-semibold">Delayed Upload</p>
                                                    <Badge variant="warning">Delayed</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {upload.brandName && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Brand</p>
                                                            <p className="font-medium text-deep-black text-sm">{upload.brandName}</p>
                                                        </div>
                                                    )}
                                                    {upload.campaign && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Campaign</p>
                                                            <p className="text-sm text-gray-700">{upload.campaign}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReschedule(upload, 'upload')}>
                                                        Reschedule
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-600" onClick={() => handleDelete(upload.id, 'upload')}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedBookings.length === 0 && selectedUploads.length === 0 && delayedShoots.length === 0 && delayedUploads.length === 0 && (
                                <p className="text-sm text-gray-500">No events for this date</p>
                            )}
                        </Card>
                    )}
                </div>
            </div>

            {/* Add to Calendar Modal */}
            <AddEventModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={(msg) => {
                    setSuccessAlert({ isOpen: true, message: msg });
                    setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                    fetchData(true); // Silent refresh
                }}
            />
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

            {/* Error Alert */}
            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default ShootingCalendar;
