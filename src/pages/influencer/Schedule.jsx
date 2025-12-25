import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Calendar, Clock, MapPin, Search, Upload, Video, X } from 'lucide-react';
import { calendarEvents } from '../../data/demoData';

const Schedule = () => {
    const [activeTab, setActiveTab] = useState('shoots');
    const [searchQuery, setSearchQuery] = useState('');
    const [completedShoots, setCompletedShoots] = useState(new Set());
    const [completedUploads, setCompletedUploads] = useState(new Set());
    const [selectedShoot, setSelectedShoot] = useState(null);
    const [isModalClosing, setIsModalClosing] = useState(false);

    // Get today's date string
    const getTodayStr = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const todayStr = getTodayStr();

    // Convert calendar events to booking format for shoots
    const bookings = calendarEvents
        .filter(event => event.type === 'shoot' && event.date === todayStr)
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

    // Convert calendar events to upload format
    const uploadSchedule = calendarEvents
        .filter(event => event.type === 'upload' && event.date === todayStr)
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

    // Get today's shoots
    const getTodaysShoot = () => {
        return bookings.filter(b =>
            b.shootDate === todayStr &&
            (b.status === 'confirmed' || b.status === 'pending')
        );
    };

    // Get today's uploads
    const getTodaysUploads = () => {
        return uploadSchedule.filter(u => u.uploadDate === todayStr);
    };

    const todaysShoot = getTodaysShoot();
    const todaysUploads = getTodaysUploads();

    // Handler for marking shoot as completed
    const handleMarkShootComplete = (shootId) => {
        setCompletedShoots(prev => {
            const newSet = new Set(prev);
            newSet.add(shootId);
            return newSet;
        });

        // Persist completed shoot to localStorage
        const shoot = bookings.find(b => b.id === shootId);
        if (shoot) {
            const completedShootsData = JSON.parse(localStorage.getItem('completedShoots') || '[]');

            // Check if shoot is already in completed list
            if (!completedShootsData.find(s => s.id === shootId)) {
                completedShootsData.push({
                    ...shoot,
                    completedAt: new Date().toISOString(),
                    status: 'completed'
                });
                localStorage.setItem('completedShoots', JSON.stringify(completedShootsData));

                // Show success notification (optional)
                console.log('Shoot marked as completed! Visit Completed Shoots page to generate review link.');
            }
        }
    };

    // Handler for marking upload as completed
    const handleMarkUploadComplete = (uploadId) => {
        setCompletedUploads(prev => {
            const newSet = new Set(prev);
            newSet.add(uploadId);
            return newSet;
        });

        // Persist completed upload to localStorage
        const upload = uploadSchedule.find(u => u.id === uploadId);
        if (upload) {
            const completedUploadsData = JSON.parse(localStorage.getItem('completedUploads') || '[]');

            // Check if upload is already in completed list
            if (!completedUploadsData.find(u => u.id === uploadId)) {
                completedUploadsData.push({
                    ...upload,
                    completedAt: new Date().toISOString(),
                    status: 'uploaded'
                });
                localStorage.setItem('completedUploads', JSON.stringify(completedUploadsData));

                // Show success notification (optional)
                console.log('Upload marked as completed!');
            }
        }
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
        }, 300); // Match animation duration
    };

    // Filter shoots by search
    const filterShoot = () => {
        let filtered = todaysShoot;

        if (searchQuery) {
            filtered = filtered.filter(b =>
                b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.campaign.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => a.shootTime.localeCompare(b.shootTime));
    };

    // Filter uploads by search
    const filterUploads = () => {
        let filtered = todaysUploads;

        if (searchQuery) {
            filtered = filtered.filter(u =>
                u.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.platform.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => a.uploadTime.localeCompare(b.uploadTime));
    };

    const filteredShoot = filterShoot();
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
        // You can customize icons based on platform
        return <Upload size={16} />;
    };

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
                                            <h3 className="font-semibold text-deep-black">{booking.brandName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{booking.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(booking.status)} className="self-start sm:self-auto">
                                        {booking.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-orange">
                                        <Clock size={16} />
                                        {booking.shootTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        {booking.location}
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="p-3 bg-orange-50 rounded-lg mb-4 border border-orange-200">
                                        <p className="text-xs text-primary-orange font-semibold mb-1">Important Notes:</p>
                                        <p className="text-sm text-gray-700">{booking.notes}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 w-full sm:w-auto"
                                        onClick={() => openShootModal(booking)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant={completedShoots.has(booking.id) ? "outline" : "primary"}
                                        size="sm"
                                        className="flex-1 w-full sm:w-auto"
                                        onClick={() => handleMarkShootComplete(booking.id)}
                                        disabled={completedShoots.has(booking.id)}
                                    >
                                        {completedShoots.has(booking.id) ? 'Done' : 'Mark as Completed'}
                                    </Button>
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
                                            <h3 className="font-semibold text-deep-black">{upload.brandName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{upload.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(upload.status)} className="self-start sm:self-auto">
                                        {upload.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Clock size={16} />
                                        {upload.uploadTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Upload size={16} className="text-gray-400" />
                                        {upload.platform} - {upload.contentType}
                                    </div>
                                </div>

                                {upload.notes && (
                                    <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                                        <p className="text-xs text-gray-700 font-semibold mb-1">Upload Notes:</p>
                                        <p className="text-sm text-gray-700">{upload.notes}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2">

                                    <Button
                                        variant={completedUploads.has(upload.id) ? "outline" : "primary"}
                                        size="sm"
                                        className="flex-1 w-full sm:w-auto"
                                        onClick={() => handleMarkUploadComplete(upload.id)}
                                        disabled={completedUploads.has(upload.id)}
                                    >
                                        {completedUploads.has(upload.id) ? 'Done' : 'Mark as Completed'}
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
                                            {selectedShoot.brandName}
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
                                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-primary-orange">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={18} className="text-primary-orange" />
                                            <p className="text-xs font-semibold text-primary-orange uppercase">Shoot Time</p>
                                        </div>
                                        <p className="text-lg font-semibold text-deep-black">{selectedShoot.shootTime}</p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={18} className="text-gray-600" />
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Location</p>
                                    </div>
                                    <p className="text-base text-deep-black font-medium">{selectedShoot.location}</p>
                                </div>

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
                                        variant={completedShoots.has(selectedShoot.id) ? "outline" : "primary"}
                                        className="flex-1"
                                        onClick={() => {
                                            handleMarkShootComplete(selectedShoot.id);
                                            closeShootModal();
                                        }}
                                        disabled={completedShoots.has(selectedShoot.id)}
                                    >
                                        {completedShoots.has(selectedShoot.id) ? 'Done' : 'Mark as Completed'}
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
        </div>
    );
};

export default Schedule;
