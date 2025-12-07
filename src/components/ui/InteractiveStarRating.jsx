import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * InteractiveStarRating Component
 * Interactive star rating selector for forms
 * 
 * @param {number} rating - Current rating value (1-5)
 * @param {function} onRatingChange - Callback when rating changes
 * @param {boolean} readonly - Whether the rating is readonly
 * @param {number} size - Size of stars in pixels
 */
const InteractiveStarRating = ({ rating = 0, onRatingChange, readonly = false, size = 32 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const getStarColor = (index) => {
        const currentRating = hoverRating || rating;
        return index <= currentRating ? 'text-primary-orange fill-primary-orange' : 'text-gray-300';
    };

    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => handleClick(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    disabled={readonly}
                    className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
                        } focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 rounded-full p-1`}
                    aria-label={`Rate ${index} star${index > 1 ? 's' : ''}`}
                >
                    <Star
                        size={size}
                        className={`${getStarColor(index)} transition-all duration-150`}
                    />
                </button>
            ))}
        </div>
    );
};

export default InteractiveStarRating;
