import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RescheduleModal from './RescheduleModal';
import { Calendar, Clock, MapPin, Video, Camera, Instagram, Facebook, Youtube, CheckCircle, CalendarClock, X, AlertTriangle } from 'lucide-react';

const DailySchedule = ({ onMarkComplete }) => {
    const [completedEvents, setCompletedEvents] = useState([]);
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null });
    const [rescheduledEvents, setRescheduledEvents] = useState({});

    // Handle marking event as complete
    const handleMarkComplete = (event) => {
        // Add to completed list locally
        setCompletedEvents(prev => [...prev, event.id]);

        // Call parent handler to add to completed shoots
        if (onMarkComplete) {
            onMarkComplete(event);
        }
    };

    // Handle opening reschedule modal
    const handleReschedule = (event) => {
        setRescheduleModal({ isOpen: true, event });
    };

    // Handle closing reschedule modal
    const handleCloseModal = () => {
        setRescheduleModal({ isOpen: false, event: null });
        setRescheduleModalOpen(false);
        setSelectedEvent(null);
    };

    // Handle reschedule confirmation
    const handleRescheduleConfirm = (rescheduleData) => {
        // In production, this would call an API to update the event
        const eventId = rescheduleModal.event.id;
        console.log('Rescheduling event:', eventId, 'to', rescheduleData);

        // Convert 24-hour time to 12-hour format for display
        const [hours, minutes] = rescheduleData.time.split(':');
        const hour = parseInt(hours);
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayTime = `${displayHour}:${minutes} ${ampm}`;

        setRescheduledEvents(prev => ({
            ...prev,
            [eventId]: { ...rescheduleData, displayTime }
        }));

        handleCloseModal();
    };
    // Mock data - in production, this would come from API and filtered for today
    const todaySchedule = [
        {
            id: 1,
            type: 'shoot',
            title: 'Fashion Nova - Spring Collection',
            brand: 'Fashion Nova',
            time: '10:00 AM',
            location: 'Mumbai Studio',
            status: 'upcoming',
            platform: null
        },
        {
            id: 2,
            type: 'upload',
            title: 'Product Review - Tech Gadget',
            time: '11:30 AM',
            platform: 'youtube',
            status: 'upcoming',
            location: null
        },
        {
            id: 3,
            type: 'shoot',
            title: 'Wellness Co - Fitness Challenge',
            brand: 'Wellness Co',
            time: '2:00 PM',
            location: 'Outdoor Park',
            status: 'in-progress',
            platform: null
        },
        {
            id: 4,
            type: 'upload',
            title: 'Fashion Haul Video',
            time: '4:00 PM',
            platform: 'instagram',
            status: 'upcoming',
            location: null
        },
        {
            id: 5,
            type: 'upload',
            title: 'Behind the Scenes',
            time: '6:00 PM',
            platform: 'facebook',
            status: 'upcoming',
            location: null
        }
    ];

    // Apply rescheduled times to events
    const scheduleWithUpdates = todaySchedule.map(event => ({
        ...event,
        time: rescheduledEvents[event.id]?.time || event.time,
        date: rescheduledEvents[event.id]?.date || null
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
            convertTo24Hour(rescheduledEvents[a.id]?.displayTime || a.time) - convertTo24Hour(rescheduledEvents[b.id]?.displayTime || b.time)
        );

        const earliestShoot = sortedSchedule.find(item => item.type === 'shoot');
        const earliestUpload = sortedSchedule.find(item => item.type === 'upload');

        const events = [];
        if (earliestShoot) events.push(earliestShoot);
        if (earliestUpload) events.push(earliestUpload);

        // Sort the selected events by time
        return events.sort((a, b) =>
            convertTo24Hour(rescheduledEvents[a.id]?.displayTime || a.time) -
            convertTo24Hour(rescheduledEvents[b.id]?.displayTime || b.time)
        );
    };

    const displayEvents = getEarliestEvents();

    return (
        <Card className="p-6 h-auto lg:h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Today's Schedule</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Next {displayEvents.length} event{displayEvents.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {displayEvents.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No events scheduled for today</p>
                    <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
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
                                        {rescheduledEvents[item.id]?.displayTime || item.time}
                                    </span>
                                    {rescheduledEvents[item.id] && (
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
                                    {rescheduledEvents[item.id] && (
                                        <span className="text-[10px] text-green-600 font-medium">Rescheduled</span>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-1.5 mb-3 ml-6 text-xs sm:text-sm text-gray-600">
                                {item.type === 'shoot' && item.brand && (
                                    <div className="font-medium text-primary-orange">
                                        {item.brand}
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
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReschedule(item)}
                                    className="flex-1 text-xs sm:text-sm"
                                >
                                    Reschedule
                                </Button>
                                <Button
                                    variant={completedEvents.includes(item.id) ? "success" : "primary"}
                                    size="sm"
                                    onClick={() => handleMarkComplete(item)}
                                    className="flex-1 text-xs sm:text-sm"
                                    disabled={completedEvents.includes(item.id)}
                                >
                                    {completedEvents.includes(item.id) ? 'Completed' : 'Mark Complete'}
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
        </Card>
    );
};

export default DailySchedule;
