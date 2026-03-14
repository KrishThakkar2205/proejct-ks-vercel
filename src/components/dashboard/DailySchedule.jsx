import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RescheduleModal from './RescheduleModal';
import { Calendar, Clock, MapPin, Video, Camera, Instagram, Facebook, Youtube, CheckCircle, CalendarClock, X, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import ErrorAlert from '../ui/ErrorAlert';
import ConfirmDialog from '../ui/ConfirmDialog';
import api from '../../utils/api';
import { utcToIST, utcToISTDate } from '../../utils/dateUtils';

const DailySchedule = ({ shoots = [], uploads = [], onMarkComplete }) => {
    const [completingIds, setCompletingIds] = useState(new Set());
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [completeErrorId, setCompleteErrorId] = useState(null);
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null });
    const [rescheduledEvents, setRescheduledEvents] = useState({});
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, event: null });

    // IST display helpers (imported from dateUtils)
    const utcToLocalDisplay = (d, t) => utcToIST(d, t) || '12:00 PM';
    const utcDateToLocal = utcToISTDate;

    // Handle marking event as complete — calls the backend API
    const handleMarkComplete = async (event) => {
        setCompletingIds(prev => new Set([...prev, event.id]));
        setCompleteErrorId(null);
        try {
            if (event.type === 'shoot') {
                await api.put(`/api/shoots/${event.originalId}`, { completed: true });
            } else {
                await api.put(`/api/uploads/${event.originalId}`, { completed: true });
            }
            // Tell the dashboard to soft-reload its data
            if (onMarkComplete) onMarkComplete();
        } catch (err) {
            console.error('Failed to mark complete:', err);
            setCompleteErrorId(event.id);
            setTimeout(() => setCompleteErrorId(null), 4000);
        } finally {
            setCompletingIds(prev => {
                const next = new Set(prev);
                next.delete(event.id);
                return next;
            });
        }
    };

    // Handle delete button click (opens confirmation dialog)
    const handleDeleteClick = (event) => {
        setDeleteConfirm({ isOpen: true, event });
    };

    // Handle actual deletion after confirmation
    const handleConfirmDelete = async () => {
        const event = deleteConfirm.event;
        setDeleteConfirm({ isOpen: false, event: null });

        if (!event) return;

        setDeletingIds(prev => new Set([...prev, event.id]));
        try {
            if (event.type === 'shoot') {
                await api.delete(`/api/shoots/${event.originalId}`);
            } else {
                await api.delete(`/api/uploads/${event.originalId}`);
            }
            if (onMarkComplete) onMarkComplete(); // Re-fetch the dashboard
        } catch (err) {
            console.error('Failed to delete event:', err);
            setErrorAlert({ isOpen: true, message: 'Failed to delete event. Please try again.' });
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(event.id);
                return next;
            });
        }
    };

    // Handle opening reschedule modal
    const handleReschedule = (event) => {
        setRescheduleModal({ isOpen: true, event });
    };

    // Handle closing reschedule modal
    const handleCloseModal = () => {
        setRescheduleModal({ isOpen: false, event: null });
    };

    // Handle reschedule confirmation
    const handleRescheduleConfirm = async (rescheduleData) => {
        setIsRescheduling(true);
        const event = rescheduleModal.event;
        const eventId = event.id;
        const [hours, minutes] = rescheduleData.time.split(':');

        try {
            if (event.type === 'shoot') {
                await api.put(`/api/shoots/${event.originalId}`, {
                    shoot_date: rescheduleData.date,
                    shoot_time: `${hours}:${minutes}`,
                });
            } else {
                await api.put(`/api/uploads/${event.originalId}`, {
                    upload_date: rescheduleData.date,
                    upload_time: `${hours}:${minutes}`,
                });
            }

            // The rescheduleData already contains UTC date+time (from RescheduleModal's UTC conversion)
            // Convert back to local for display
            const displayTime = utcToLocalDisplay(rescheduleData.date, rescheduleData.time);

            setRescheduledEvents(prev => ({
                ...prev,
                [event.originalId]: { ...rescheduleData, displayTime }
            }));

            // Soft-refresh the dashboard if possible
            if (onMarkComplete) onMarkComplete();
        } catch (error) {
            console.error('Error rescheduling task:', error);
            setErrorAlert({ isOpen: true, message: 'Failed to reschedule task. Please try again.' });
        } finally {
            setIsRescheduling(false);
            handleCloseModal();
        }
    };

    // Combine shoots and uploads into a single schedule
    const todaySchedule = [
        ...shoots.map(s => ({
            id: `shoot-${s.id}`,
            originalId: s.id,
            type: 'shoot',
            title: s.brand_name || 'Untitled Brand',
            campaign: s.campaign,
            time: utcToLocalDisplay(s.shoot_date, s.shoot_time),
            localDate: utcDateToLocal(s.shoot_date, s.shoot_time),
            location: s.location,
            status: s.status || 'upcoming',
            platform: null,
            notes: s.notes
        })),
        ...uploads.map(u => ({
            id: `upload-${u.id}`,
            originalId: u.id,
            type: 'upload',
            title: u.brand_name || 'Untitled Brand',
            campaign: u.campaign,
            time: utcToLocalDisplay(u.upload_date, u.upload_time),
            localDate: utcDateToLocal(u.upload_date, u.upload_time),
            platform: u.platform?.toLowerCase() || null,
            status: u.status || 'upcoming',
            location: null,
            notes: u.notes
        }))
    ];

    // Apply rescheduled times to events
    const scheduleWithUpdates = todaySchedule.map(event => ({
        ...event,
        time: rescheduledEvents[event.originalId]?.displayTime || event.time,
        date: rescheduledEvents[event.originalId]?.date || null
    }));

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'instagram':
                return <Instagram className="w-4 h-4 text-pink-600" />;
            case 'facebook':
                return <Facebook className="w-4 h-4 text-blue-600" />;
            case 'youtube':
                return <Youtube className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getPlatformBadge = (platform) => {
        const styles = {
            instagram: 'bg-pink-50 text-pink-700 border-pink-200',
            facebook: 'bg-blue-50 text-blue-700 border-blue-200',
            youtube: 'bg-red-50 text-red-700 border-red-200'
        };
        return styles[platform] || '';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return 'default';
            case 'in-progress':
                return 'warning';
            case 'completed':
                return 'success';
            default:
                return 'default';
        }
    };

    // Convert time string to 24-hour format for sorting
    const convertTo24Hour = (time) => {
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes; // Return total minutes for easy comparison
    };

    // Sort events by time and get earliest shoot and upload
    const getEarliestEvents = () => {
        const sortedSchedule = [...scheduleWithUpdates].sort((a, b) =>
            convertTo24Hour(rescheduledEvents[a.originalId]?.displayTime || a.time) - convertTo24Hour(rescheduledEvents[b.originalId]?.displayTime || b.time)
        );

        const earliestShoot = sortedSchedule.find(item => item.type === 'shoot');
        const earliestUpload = sortedSchedule.find(item => item.type === 'upload');

        const events = [];
        if (earliestShoot) events.push(earliestShoot);
        if (earliestUpload) events.push(earliestUpload);

        // Sort the selected events by time
        return events.sort((a, b) =>
            convertTo24Hour(rescheduledEvents[a.originalId]?.displayTime || a.time) -
            convertTo24Hour(rescheduledEvents[b.originalId]?.displayTime || b.time)
        );
    };

    const displayEvents = getEarliestEvents();

    return (
        <Card className="p-6 h-auto lg:h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="min-w-0">
                    <h2 className="text-xl font-bebas tracking-wide text-deep-black">Today's Schedule</h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-500 hidden xs:inline">{displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {displayEvents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-gray-400">
                    <Calendar size={48} className="mb-4 text-gray-300" strokeWidth={1.5} />
                    <p className="text-gray-600 font-medium text-lg">No events scheduled</p>
                    <p className="text-sm mt-1">Enjoy your free time!</p>
                </div>
            ) : (
                <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto pr-2">
                    {displayEvents.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-primary-orange transition-all"
                        >
                            {/* Mobile: Compact Header */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                                {/* Time Badge - Compact for Mobile */}
                                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-primary-orange">
                                    <Clock className="w-3.5 h-3.5 text-primary-orange flex-shrink-0" />
                                    <span className="text-sm font-semibold text-deep-black whitespace-nowrap">
                                        {rescheduledEvents[item.originalId]?.displayTime || item.time}
                                    </span>
                                    {rescheduledEvents[item.originalId] && (
                                        <span className="text-[9px] text-green-600 font-medium">✓</span>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <Badge variant={getStatusBadge(item.status)} className="flex-shrink-0">
                                    {item.status === 'in-progress' ? 'In Progress' : item.status}
                                </Badge>
                            </div>

                            {/* Title & Type */}
                            <div className="mb-2">
                                <div className="flex items-start gap-2 mb-1">
                                    {item.type === 'shoot' ? (
                                        <Camera className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Video className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />
                                    )}
                                    <h4 className="font-semibold text-deep-black text-sm sm:text-base leading-tight flex-1">
                                        {item.title}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2 ml-6">
                                    <Badge
                                        variant={item.type === 'shoot' ? 'default' : 'secondary'}
                                        className={`text-xs ${item.type === 'shoot'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}
                                    >
                                        {item.type === 'shoot' ? 'Shoot' : 'Upload'}
                                    </Badge>
                                    {rescheduledEvents[item.originalId] && (
                                        <span className="text-[10px] text-green-600 font-medium">Rescheduled</span>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-1.5 mb-3 ml-6 text-xs sm:text-sm text-gray-600">
                                {item.campaign && (
                                    <div className="font-medium text-primary-orange">
                                        {item.campaign}
                                    </div>
                                )}

                                {item.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="line-clamp-1">{item.location}</span>
                                    </div>
                                )}

                                {item.platform && (
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${getPlatformBadge(item.platform)}`}>
                                        {getPlatformIcon(item.platform)}
                                        <span className="font-medium capitalize">
                                            {item.platform}
                                        </span>
                                    </div>
                                )}

                                {item.notes && (
                                    <div className="mt-2 p-2 bg-gray-50 border border-gray-100 rounded text-xs text-gray-500 italic">
                                        {item.notes}
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {completeErrorId === item.id && (
                                <p className="text-xs text-red-500 mt-1 text-center">
                                    Failed to mark complete. Please try again.
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col xs:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReschedule(item)}
                                    className="flex-1 text-xs px-2"
                                    disabled={completingIds.has(item.id) || isRescheduling || deletingIds.has(item.id)}
                                >
                                    {isRescheduling && rescheduleModal?.event?.id === item.id ? (
                                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin inline" />
                                    ) : null}
                                    Reschedule
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleMarkComplete(item)}
                                    className="flex-1 text-xs px-2"
                                    disabled={completingIds.has(item.id) || deletingIds.has(item.id)}
                                >
                                    {completingIds.has(item.id) ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin inline" />
                                            Saving...
                                        </>
                                    ) : 'Mark Complete'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteClick(item)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors px-3 flex-shrink-0 flex items-center justify-center"
                                    disabled={deletingIds.has(item.id) || completingIds.has(item.id)}
                                    title="Delete event"
                                >
                                    {deletingIds.has(item.id) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reschedule Modal */}
            <RescheduleModal
                isOpen={rescheduleModal.isOpen}
                event={rescheduleModal.event}
                onClose={handleCloseModal}
                onConfirm={handleRescheduleConfirm}
            />

            {/* Error Alert */}
            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Scheduled Event"
                message={`Are you sure you want to delete "${deleteConfirm.event?.title}"? This action cannot be undone.`}
                confirmText="Yes, Delete it"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, event: null })}
            />
        </Card>
    );
};

export default DailySchedule;
