import React from 'react';
import { Check } from 'lucide-react';

const MultiSelect = ({
    label,
    value = [],
    onChange,
    options = [],
    placeholder = "Select categories",
    className = "",
    required = false,
    name
}) => {
    const handleToggle = (optionValue) => {
        const newValue = value.includes(optionValue)
            ? value.filter(v => v !== optionValue)
            : [...value, optionValue];

        // Create a synthetic event to match standard input onChange signature
        const event = {
            target: {
                name: name,
                value: newValue
            }
        };
        onChange(event);
    };

    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Selected count indicator */}
            {value.length > 0 && (
                <div className="mb-3">
                    <span className="text-xs font-semibold text-primary-orange">
                        {value.length} selected
                    </span>
                </div>
            )}

            {/* Pill/Chip Grid */}
            <div className="flex flex-wrap gap-2">
                {options.map((option, index) => {
                    const optValue = typeof option === 'object' ? option.value : option;
                    const optLabel = typeof option === 'object' ? option.label : option;
                    const isSelected = value.includes(optValue);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleToggle(optValue)}
                            className={`
                                group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                                text-sm font-medium transition-all duration-200
                                ${isSelected
                                    ? 'bg-primary-orange text-white shadow-md hover:bg-orange-600 hover:shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {isSelected && (
                                <Check size={14} className="flex-shrink-0" />
                            )}
                            <span>{optLabel}</span>
                        </button>
                    );
                })}
            </div>

            {options.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">
                    No options available
                </div>
            )}

            {value.length === 0 && options.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                    {placeholder}
                </p>
            )}
        </div>
    );
};

export default MultiSelect;
