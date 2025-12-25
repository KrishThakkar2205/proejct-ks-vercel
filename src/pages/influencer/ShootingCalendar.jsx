import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import DateInput from '../../components/ui/DateInput';
import TimeInput from '../../components/ui/TimeInput';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Upload, Video } from 'lucide-react';
import { calendarEvents } from '../../data/demoData';

const ShootingCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [scheduleType, setScheduleType] = useState('shoot'); // 'shoot' or 'upload'

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowAddModal(false);
            setIsClosing(false);
        }, 300); // Match animation duration
    };
    const [formData, setFormData] = useState({
        brandName: '',
        campaign: '',
        date: '',
        time: '',
        location: '',
        platform: '',
        contentType: '',
        notes: ''
    });

    // Convert calendar events to booking format
    const bookings = calendarEvents.filter(event => event.type === 'shoot').map(event => ({
        id: event.id,
        brandName: event.brand,
        campaign: event.campaign,
        shootDate: event.date,
        shootTime: event.displayTime,
        location: event.location,
        status: event.status,
        notes: event.description
    }));

    const uploadSchedule = calendarEvents.filter(event => event.type === 'upload').map(event => ({
        id: event.id,
        brandName: event.brand,
        campaign: event.campaign,
        uploadDate: event.date,
        uploadTime: event.displayTime,
        platform: event.platform,
        contentType: 'Video',
        status: event.status,
        notes: event.description
    }));

    const calendar = {
        unavailableDates: [] // No unavailable dates in demo
    };

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

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const isBooked = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return bookings.some(b => b.shootDate === dateStr);
    };

    const hasUploads = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return uploadSchedule.some(u => u.uploadDate === dateStr);
    };

    const isUnavailable = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return calendar.unavailableDates.includes(dateStr);
    };

    const getBookingsForDate = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return bookings.filter(b => b.shootDate === dateStr);
    };

    const getUploadsForDate = (day) => {
        const dateStr = formatDate(new Date(year, month, day));
        return uploadSchedule.filter(u => u.uploadDate === dateStr);
    };

    const getBookingCountForDate = (day) => {
        return getBookingsForDate(day).length;
    };

    const getUploadCountForDate = (day) => {
        return getUploadsForDate(day).length;
    };

    const isPast = (day) => {
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isFull = (day) => {
        return getBookingCountForDate(day) >= 4; // Max 4 bookings per day
    };

    // Generate calendar days
    const calendarDays = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
    const selectedUploads = selectedDate ? getUploadsForDate(selectedDate) : [];

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to backend
        console.log('New schedule item:', { type: scheduleType, ...formData });
        alert(`${scheduleType === 'shoot' ? 'Shoot' : 'Upload'} scheduled successfully!`);
        setShowAddModal(false);
        // Reset form
        setFormData({
            brandName: '',
            campaign: '',
            date: '',
            time: '',
            location: '',
            platform: '',
            contentType: '',
            notes: ''
        });
    };

    const openAddModal = () => {
        setShowAddModal(true);
        // Set default date to today
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setFormData(prev => ({ ...prev, date: dateStr }));
    };



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
                                    onClick={openAddModal}
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
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <span className="text-gray-600">Unavailable</span>
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
                                const uploads = hasUploads(day);
                                const unavailable = isUnavailable(day);
                                const past = isPast(day);
                                const bookingCount = getBookingCountForDate(day);
                                const uploadCount = getUploadCountForDate(day);
                                const full = isFull(day);

                                let bgColor = 'bg-white hover:bg-gray-50';

                                if (booked && uploads) {
                                    bgColor = 'bg-orange-700 text-white hover:bg-orange-800'; // Both shoots and uploads
                                } else if (booked) {
                                    if (full) {
                                        bgColor = 'bg-red-500 text-white hover:bg-red-600'; // Full day (4/4)
                                    } else {
                                        bgColor = 'bg-primary-orange text-white hover:bg-orange-600'; // Has bookings
                                    }
                                } else if (uploads) {
                                    bgColor = 'bg-gray-700 text-white hover:bg-gray-800'; // Has uploads
                                } else if (unavailable) {
                                    bgColor = 'bg-gray-300 text-gray-600';
                                } else if (!past) {
                                    bgColor = 'bg-gray-50 border border-gray-200 hover:bg-gray-100';
                                }

                                if (past && !booked && !uploads) bgColor = 'bg-gray-50 text-gray-400';

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
                                                    <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Brand</p>
                                                        <p className="font-medium text-deep-black text-sm">{booking.brandName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Campaign</p>
                                                        <p className="text-sm text-gray-700">{booking.campaign}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Time</p>
                                                        <p className="text-sm text-gray-700">{booking.shootTime}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Location</p>
                                                        <p className="text-sm text-gray-700">{booking.location}</p>
                                                    </div>
                                                    {booking.notes && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Notes</p>
                                                            <p className="text-sm text-gray-700">{booking.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
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
                                                    <div>
                                                        <p className="text-xs text-gray-500">Brand</p>
                                                        <p className="font-medium text-deep-black text-sm">{upload.brandName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Campaign</p>
                                                        <p className="text-sm text-gray-700">{upload.campaign}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Platform</p>
                                                        <p className="text-sm text-gray-700">{upload.platform}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Content Type</p>
                                                        <p className="text-sm text-gray-700">{upload.contentType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Time</p>
                                                        <p className="text-sm text-gray-700">{upload.uploadTime}</p>
                                                    </div>
                                                    {upload.notes && (
                                                        <div>
                                                            <p className="text-xs text-gray-500">Notes</p>
                                                            <p className="text-sm text-gray-700">{upload.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedBookings.length === 0 && selectedUploads.length === 0 && (
                                <p className="text-sm text-gray-500">No shoots or uploads for this date</p>
                            )}
                        </Card>
                    )}



                </div>
            </div>

            {/* Add to Calendar Modal */}
            {showAddModal && createPortal(
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 ${isClosing ? 'animate-backdrop-exit' : 'animate-fadeIn'}`}
                    style={{ backdropFilter: 'blur(4px)' }}
                    onClick={closeModal}
                >
                    <Card
                        className={`w-[95%] md:w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-popup-exit' : 'animate-scaleIn'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Add to Calendar</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Schedule Type Selector */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setScheduleType('shoot')}
                                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${scheduleType === 'shoot'
                                        ? 'bg-primary-orange text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Video size={16} className="inline mr-2" />
                                    Shoot Schedule
                                </button>
                                <button
                                    onClick={() => setScheduleType('upload')}
                                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${scheduleType === 'upload'
                                        ? 'bg-gray-700 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Upload size={16} className="inline mr-2" />
                                    Upload Schedule
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Brand Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="brandName"
                                            value={formData.brandName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                                            placeholder="Enter brand name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Campaign Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="campaign"
                                            value={formData.campaign}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                                            placeholder="Enter campaign name"
                                        />
                                    </div>

                                    <div>
                                        <DateInput
                                            label="Date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <TimeInput
                                            label="Time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {scheduleType === 'shoot' ? (
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Location *
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                required={scheduleType === 'shoot'}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                                                placeholder="Enter shoot location"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <Select
                                                    label="Platform"
                                                    name="platform"
                                                    value={formData.platform}
                                                    onChange={handleInputChange}
                                                    required={scheduleType === 'upload'}
                                                    options={[
                                                        'Instagram',
                                                        'YouTube',
                                                        'TikTok',
                                                        'Facebook'
                                                    ]}
                                                    placeholder="Select platform"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Content Type *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contentType"
                                                    value={formData.contentType}
                                                    onChange={handleInputChange}
                                                    required={scheduleType === 'upload'}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                                                    placeholder="e.g., Reel, Post, Video"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent resize-none"
                                            placeholder="Add any additional notes..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="flex-1"
                                    >
                                        Add to Calendar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ShootingCalendar;
