import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const DateInput = ({
    label,
    value,
    onChange,
    required = false,
    name,
    min,
    className = ""
}) => {
    const inputRef = useRef(null);

    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Select date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && '*'}
                </label>
            )}

            <div
                onClick={handleContainerClick}
                className={`
                    w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between
                    bg-white transition-all duration-200 border-gray-200 hover:border-gray-300
                    focus-within:border-primary-orange focus-within:ring-2 focus-within:ring-primary-orange focus-within:ring-opacity-20
                `}
            >
                <span className={`${!value ? 'text-gray-400' : 'text-deep-black'}`}>
                    {formatDate(value)}
                </span>
                <CalendarIcon size={20} className="text-gray-400" />

                <input
                    ref={inputRef}
                    type="date"
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    min={min}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full -z-10"
                    tabIndex={-1}
                />
            </div>
        </div>
    );
};

export default DateInput;
