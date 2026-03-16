import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Video, Upload, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DateInput from '../ui/DateInput';
import TimeInput from '../ui/TimeInput';
import Select from '../ui/Select';
import ErrorAlert from '../ui/ErrorAlert';
import api from '../../utils/api';
import { istToUTC, getISTNow } from '../../utils/dateUtils';

const AddEventModal = ({ isOpen, onClose, onSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [scheduleType, setScheduleType] = useState('shoot'); // 'shoot' or 'upload'
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        brandName: '',
        campaign: '',
        date: getISTNow().toISOString().split('T')[0],
        time: '',
        location: '',
        platform: '',
        contentType: '',
        notes: ''
    });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Convert IST date + time entered by user to UTC for backend
    const toUTC = (date, time) => istToUTC(date, time);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate: No past dates/times relative to IST
        const now = getISTNow();
        const selectedDateStr = formData.date;
        const nowStr = now.toISOString().split('T')[0];

        // Check if selected date is today in IST
        const isToday = selectedDateStr === nowStr;

        if (isToday && formData.time) {
            const [hours, minutes] = formData.time.split(':');
            const scheduledDateTime = new Date(selectedDate);
            scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

            if (scheduledDateTime < now) {
                setErrorAlert({ isOpen: true, message: 'You cannot schedule an event in the past. Please select a future time.' });
                return;
            }
        }

        setSubmitting(true);
        try {
            const { utcDate, utcTime } = toUTC(formData.date, formData.time);

            if (scheduleType === 'shoot') {
                await api.post('/api/shoots', {
                    shoot_date: utcDate,
                    shoot_time: formData.time ? utcTime : null,
                    location: formData.location || null,
                    name: formData.campaign || null,
                    brand_name: formData.brandName || null,
                    notes: formData.notes || null,
                });
            } else {
                await api.post('/api/uploads', {
                    upload_date: utcDate,
                    upload_time: formData.time ? utcTime : null,
                    name: formData.campaign || null,
                    platform: formData.platform || null,
                    brand_name: formData.brandName || null,
                    notes: formData.notes || null,
                });
            }

            if (onSuccess) onSuccess(`${scheduleType === 'shoot' ? 'Shoot' : 'Upload'} scheduled successfully!`);
            handleClose();
            setFormData({
                brandName: '',
                campaign: '',
                date: getISTNow().toISOString().split('T')[0],
                time: '',
                location: '',
                platform: '',
                contentType: '',
                notes: ''
            });
        } catch (err) {
            const msg = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Failed to create schedule item.';
            setErrorAlert({ isOpen: true, message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 ${isClosing ? 'animate-backdrop-exit' : 'animate-fadeIn'}`}
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={handleClose}
        >
            <Card
                className={`w-[95%] md:w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-popup-exit' : 'animate-scaleIn'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Add to Calendar</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Schedule Type Selector */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
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
                            type="button"
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
                                    min={getISTNow().toISOString().split('T')[0]}
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
                                onClick={handleClose}
                                className="flex-1"
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Add to Calendar'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>,
        document.body
    );
};

export default AddEventModal;
