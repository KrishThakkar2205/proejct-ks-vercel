import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Calendar, Clock, X, AlertTriangle, Camera, Video } from 'lucide-react';

const RescheduleModal = ({ isOpen, event, onClose, onConfirm }) => {
    const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
    const [rescheduleError, setRescheduleError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Trigger animation after render
            setTimeout(() => setIsAnimating(true), 10);

            // Set current date and time as default
            const today = new Date().toISOString().split('T')[0];
            setRescheduleData({ date: today, time: event.time || event.scheduledTime || '12:00' });
            setRescheduleError('');
        } else {
            // Start closing animation
            setIsAnimating(false);
            // Remove from DOM after animation completes
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isOpen, event]);

    const handleClose = () => {
        setRescheduleData({ date: '', time: '' });
        setRescheduleError('');
        onClose();
    };

    const handleSubmit = () => {
        // Validate that the new date/time is not in the past
        const selectedDateTime = new Date(`${rescheduleData.date}T${rescheduleData.time}`);
        const now = new Date();

        if (selectedDateTime < now) {
            setRescheduleError('Cannot reschedule to a past date or time. Please select a future date and time.');
            return;
        }

        if (!rescheduleData.date || !rescheduleData.time) {
            setRescheduleError('Please select both date and time.');
            return;
        }

        onConfirm(rescheduleData);
        handleClose();
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-300 ${isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
                }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bebas tracking-wide text-deep-black">
                        Reschedule Event
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Event Details */}
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-deep-black text-sm mb-1">
                        {event?.title || event?.campaign || 'Event'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        {event?.type === 'shoot' || event?.brand ? (
                            <Camera className="w-3 h-3" />
                        ) : (
                            <Video className="w-3 h-3" />
                        )}
                        <span className="capitalize">{event?.type || 'Shoot'}</span>
                        <span className="text-gray-400">•</span>
                        <Clock className="w-3 h-3" />
                        <span>Current: {event?.time || event?.scheduledTime}</span>
                    </div>
                </div>

                {/* Date Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={rescheduleData.date}
                            onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Time Input - 12 Hour Format */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Hour */}
                        <div className="relative">
                            <select
                                value={rescheduleData.time.split(':')[0] > 12 ? rescheduleData.time.split(':')[0] - 12 : (rescheduleData.time.split(':')[0] === '00' ? '12' : rescheduleData.time.split(':')[0])}
                                onChange={(e) => {
                                    const currentTime = rescheduleData.time || '12:00';
                                    const [, minutes] = currentTime.split(':');
                                    const isPM = parseInt(currentTime.split(':')[0]) >= 12;
                                    let hour24 = parseInt(e.target.value);
                                    if (isPM && hour24 !== 12) hour24 += 12;
                                    if (!isPM && hour24 === 12) hour24 = 0;
                                    setRescheduleData({ ...rescheduleData, time: `${hour24.toString().padStart(2, '0')}:${minutes || '00'}` });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        {/* Minute */}
                        <div className="relative">
                            <select
                                value={rescheduleData.time.split(':')[1] || '00'}
                                onChange={(e) => {
                                    const currentTime = rescheduleData.time || '12:00';
                                    const [hours] = currentTime.split(':');
                                    setRescheduleData({ ...rescheduleData, time: `${hours}:${e.target.value}` });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                            >
                                {[...Array(60)].map((_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>

                        {/* AM/PM */}
                        <div className="relative">
                            <select
                                value={rescheduleData.time && parseInt(rescheduleData.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                                onChange={(e) => {
                                    const currentTime = rescheduleData.time || '12:00';
                                    const [hours, minutes] = currentTime.split(':');
                                    let hour24 = parseInt(hours);

                                    if (e.target.value === 'PM') {
                                        if (hour24 < 12) hour24 += 12;
                                    } else {
                                        if (hour24 >= 12) hour24 -= 12;
                                    }

                                    setRescheduleData({ ...rescheduleData, time: `${hour24.toString().padStart(2, '0')}:${minutes}` });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {rescheduleError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {rescheduleError}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        className="flex-1"
                    >
                        Confirm Reschedule
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
