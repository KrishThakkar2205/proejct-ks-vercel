import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import RescheduleModal from './RescheduleModal';
import { AlertTriangle, Clock, Calendar, AlertCircle } from 'lucide-react';

const DelayedShootsToday = ({ onMarkComplete }) => {
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null });
    const [completedShoots, setCompletedShoots] = useState([]);
    const [rescheduledShoots, setRescheduledShoots] = useState({});

    // Handle opening reschedule modal
    const handleReschedule = (shoot) => {
        setRescheduleModal({ isOpen: true, event: shoot });
    };

    // Handle closing reschedule modal
    const handleCloseModal = () => {
        setRescheduleModal({ isOpen: false, event: null });
    };

    // Handle reschedule confirmation
    const handleRescheduleConfirm = (rescheduleData) => {
        // In production, this would call an API to update the event
        const shootId = rescheduleModal.event.id;
        console.log('Rescheduling delayed shoot:', shootId, 'to', rescheduleData);

        // Convert 24-hour time to 12-hour format for display
        const [hours, minutes] = rescheduleData.time.split(':');
        const hour = parseInt(hours);
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayTime = `${displayHour}:${minutes} ${ampm}`;

        setRescheduledShoots(prev => ({
            ...prev,
            [shootId]: { ...rescheduleData, displayTime }
        }));

        handleCloseModal();
    };

    // Handle marking shoot as complete
    const handleMarkComplete = (shoot) => {
        // Add to completed list locally
        setCompletedShoots(prev => [...prev, shoot.id]);

        // Call parent handler to add to completed shoots
        if (onMarkComplete) {
            onMarkComplete(shoot);
        }
    };

    // Mock data - in production, this would come from API
    // Delayed shoots are those scheduled for today or earlier that haven't been completed
    const mockDelayedShoots = [
        {
            id: 1,
            brand: 'StyleHub',
            campaign: 'Winter Collection',
            type: 'shoot', // 'shoot' or 'upload'
            scheduledTime: '8:00 AM',
            time: '08:00',
            scheduledDate: '2025-12-18',
            delayHours: 3,
            reason: 'Equipment delay'
        },
        {
            id: 2,
            brand: 'FitLife',
            campaign: 'Yoga Series',
            type: 'upload',
            scheduledTime: '9:30 AM',
            time: '09:30',
            scheduledDate: '2025-12-24',
            delayHours: 1.5,
            reason: 'Editing pending'
        },
        {
            id: 3,
            brand: 'TechReview',
            campaign: 'Smartphone Unboxing',
            type: 'shoot',
            scheduledTime: '7:00 AM',
            time: '07:00',
            scheduledDate: '2025-12-23',
            delayHours: 30,
            reason: 'Product not delivered'
        }
    ];

    const calculateDelay = (hours) => {
        if (hours < 1) return `${Math.round(hours * 60)} minutes`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''}`;
    };

    const getDelayColor = (hours) => {
        if (hours < 2) return 'yellow'; // Minor delay
        if (hours < 24) return 'amber'; // Moderate delay
        return 'red'; // Critical delay
    };

    // Filter out completed shoots and rescheduled shoots
    const delayedShoots = mockDelayedShoots.filter(shoot =>
        !completedShoots.includes(shoot.id) && !rescheduledShoots[shoot.id]
    );

    return (
        <Card className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bebas tracking-wide text-deep-black">Delayed Tasks</h2>
                    <p className="text-sm text-gray-600 mt-1">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
            </div>

            {delayedShoots.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No delayed tasks</p>
                    <p className="text-xs text-gray-400 mt-1">All on track!</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {/* Alert Banner */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 rounded">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">{delayedShoots.length}</span> task
                                {delayedShoots.length > 1 ? 's' : ''} behind schedule
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {delayedShoots.map((shoot) => {
                            const delayColor = getDelayColor(shoot.delayHours);
                            const colorClasses = {
                                yellow: {
                                    bg: 'bg-yellow-50',
                                    border: 'border-yellow-300',
                                    icon: 'bg-yellow-500',
                                    text: 'text-yellow-700',
                                    badge: 'bg-yellow-100 text-yellow-800'
                                },
                                amber: {
                                    bg: 'bg-amber-50',
                                    border: 'border-amber-400',
                                    icon: 'bg-amber-500',
                                    text: 'text-amber-700',
                                    badge: 'bg-amber-100 text-amber-800'
                                },
                                red: {
                                    bg: 'bg-red-50',
                                    border: 'border-red-400',
                                    icon: 'bg-red-500',
                                    text: 'text-red-700',
                                    badge: 'bg-red-100 text-red-800'
                                }
                            };

                            const colors = colorClasses[delayColor];

                            return (
                                <div
                                    key={shoot.id}
                                    className={`p-4 ${colors.bg} border-2 ${colors.border} rounded-lg hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <AlertTriangle className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-deep-black text-sm truncate">
                                                    {shoot.brand}
                                                </h4>
                                                {/* Type Badge */}
                                                <Badge
                                                    variant={shoot.type === 'shoot' ? 'default' : 'secondary'}
                                                    className={shoot.type === 'shoot'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200 text-xs'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200 text-xs'
                                                    }
                                                >
                                                    {shoot.type === 'shoot' ? 'Shoot' : 'Upload'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate">
                                                {shoot.campaign}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                                            {calculateDelay(shoot.delayHours)} late
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs text-gray-600 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>Scheduled: {new Date(shoot.scheduledDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            <span>Time: {shoot.scheduledTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={() => handleReschedule(shoot)}
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="flex-1 text-xs"
                                            onClick={() => handleMarkComplete(shoot)}
                                        >
                                            Mark Complete
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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

// Import CheckCircle for the empty state
const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DelayedShootsToday;
