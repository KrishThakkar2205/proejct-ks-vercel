import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimeInput = ({
    label,
    value,
    onChange,
    required = false,
    name,
    className = ""
}) => {
    // Parse 24-hour time to 12-hour components
    const parseTime = (timeString) => {
        if (!timeString) return { hour: '', minute: '', period: 'AM' };
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const period = hour24 >= 12 ? 'PM' : 'AM';
        return { hour: hour12.toString(), minute: minutes, period };
    };

    const [timeComponents, setTimeComponents] = useState(parseTime(value));

    // Update components when value changes externally
    useEffect(() => {
        setTimeComponents(parseTime(value));
    }, [value]);

    // Convert 12-hour to 24-hour format
    const convertTo24Hour = (hour, minute, period) => {
        if (!hour || !minute) return '';
        let hour24 = parseInt(hour);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        return `${hour24.toString().padStart(2, '0')}:${minute}`;
    };

    const handleChange = (field, newValue) => {
        const newComponents = { ...timeComponents, [field]: newValue };
        setTimeComponents(newComponents);

        // Only trigger onChange if we have all components
        if (newComponents.hour && newComponents.minute) {
            const time24 = convertTo24Hour(newComponents.hour, newComponents.minute, newComponents.period);
            onChange({ target: { name, value: time24 } });
        }
    };

    // Generate hour options (1-12)
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    // Generate minute options (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && '*'}
                </label>
            )}

            <div className="flex gap-2">
                {/* Hour */}
                <select
                    value={timeComponents.hour}
                    onChange={(e) => handleChange('hour', e.target.value)}
                    required={required}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-orange focus:ring-2 focus:ring-primary-orange focus:ring-opacity-20 focus:outline-none bg-white"
                >
                    <option value="">HH</option>
                    {hours.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>

                <span className="flex items-center text-gray-400">:</span>

                {/* Minute */}
                <select
                    value={timeComponents.minute}
                    onChange={(e) => handleChange('minute', e.target.value)}
                    required={required}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-orange focus:ring-2 focus:ring-primary-orange focus:ring-opacity-20 focus:outline-none bg-white"
                >
                    <option value="">MM</option>
                    {minutes.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                {/* AM/PM */}
                <select
                    value={timeComponents.period}
                    onChange={(e) => handleChange('period', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:border-primary-orange focus:ring-2 focus:ring-primary-orange focus:ring-opacity-20 focus:outline-none bg-white"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>

                <div className="flex items-center px-2">
                    <Clock size={20} className="text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default TimeInput;
