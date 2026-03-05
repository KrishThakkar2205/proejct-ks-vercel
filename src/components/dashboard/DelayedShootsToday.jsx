import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import RescheduleModal from './RescheduleModal';
import { AlertTriangle, Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const DelayedShootsToday = ({ delayedShoots: apiShoots = [], delayedUploads: apiUploads = [], onMarkComplete }) => {
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
        const shootId = rescheduleModal.event.originalId;

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
        setCompletedShoots(prev => [...prev, shoot.originalId]);

        // Call parent handler to add to completed shoots
        if (onMarkComplete) {
            onMarkComplete(shoot);
        }
    };

    const parseDelayHours = (dateStr, timeStr) => {
        if (!dateStr) return 24; // fallback 1 day if unknown
        const dt = new Date(dateStr);
        if (timeStr) {
            // Very naive parse, e.g. "10:00 AM"
            const [time, period] = timeStr.split(' ');
            if (time && period) {
                let [h, m] = time.split(':').map(Number);
                if (period === 'PM' && h !== 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                dt.setHours(h, m || 0, 0, 0);
            }
        }
        const now = new Date();
        const diffMs = now - dt;
        const diffHrs = diffMs / (1000 * 60 * 60);
        return Math.max(0, diffHrs);
    }

    const compiledDelayedShoots = [
        ...apiShoots.map(s => ({
            id: `shoot-${s.id}`,
            originalId: s.id,
            brand: s.brand_name || 'Untitled Brand',
            campaign: s.campaign,
            type: 'shoot',
            scheduledTime: s.shoot_time || '12:00 PM',
            scheduledDate: s.shoot_date,
            delayHours: parseDelayHours(s.shoot_date, s.shoot_time),
            notes: s.notes
        })),
        ...apiUploads.map(u => ({
            id: `upload-${u.id}`,
            originalId: u.id,
            brand: u.brand_name || 'Untitled Brand',
            campaign: u.campaign,
            type: 'upload',
            scheduledTime: u.upload_time || '12:00 PM',
            scheduledDate: u.upload_date,
            delayHours: parseDelayHours(u.upload_date, u.upload_time),
            notes: u.notes
        }))
    ].sort((a, b) => b.delayHours - a.delayHours);

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
    const delayedShoots = compiledDelayedShoots.filter(shoot =>
        !completedShoots.includes(shoot.originalId) && !rescheduledShoots[shoot.originalId]
    );

    return (
        <Card className="p-6 h-auto lg:h-full flex flex-col">
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
                <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-gray-400">
                    <CheckCircle size={48} className="mb-4 text-green-400" strokeWidth={1.5} />
                    <p className="text-gray-600 font-medium text-lg">No delayed tasks</p>
                    <p className="text-sm mt-1">All on track!</p>
                </div>
            ) : (
                <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto pr-2">
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
                                    className={`p-4 ${colors.bg} border-2 ${colors.border} rounded-xl`}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-9 h-9 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <AlertTriangle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* Brand + Type Badge row */}
                                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                <h4 className="font-bold text-deep-black text-sm uppercase tracking-wide truncate">
                                                    {shoot.brand}
                                                </h4>
                                                <Badge
                                                    variant={shoot.type === 'shoot' ? 'default' : 'secondary'}
                                                    className={shoot.type === 'shoot'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200 text-xs flex-shrink-0'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0'
                                                    }
                                                >
                                                    {shoot.type === 'shoot' ? 'Shoot' : 'Upload'}
                                                </Badge>
                                            </div>
                                            {/* Delay badge below the title */}
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge} mb-1`}>
                                                {calculateDelay(shoot.delayHours)} late
                                            </span>
                                            {shoot.campaign && (
                                                <p className="text-xs text-gray-600 truncate">
                                                    {shoot.campaign}
                                                </p>
                                            )}
                                            {shoot.notes && (
                                                <div className="mt-1.5 p-1.5 bg-white/60 border border-black/5 rounded text-xs text-gray-600 italic line-clamp-2">
                                                    {shoot.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                            <span>{new Date(shoot.scheduledDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 flex-shrink-0" />
                                            <span>{shoot.scheduledTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col xs:flex-row gap-2">
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

export default DelayedShootsToday;
