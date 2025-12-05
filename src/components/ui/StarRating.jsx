import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * Displays a star rating with support for half stars
 * 
 * @param {number} rating - Rating value (0-5, supports decimals)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showNumber - Whether to show the numeric rating
 */
const StarRating = ({ rating = 0, size = 'md', showNumber = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const starSize = sizeClasses[size] || sizeClasses.md;
    const maxStars = 5;

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= maxStars; i++) {
            const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1) * 100;

            stars.push(
                <div key={i} className="relative inline-block">
                    {/* Background star (empty) */}
                    <Star className={`${starSize} text-gray-300`} />

                    {/* Foreground star (filled) */}
                    <div
                        className="absolute top-0 left-0 overflow-hidden"
                        style={{ width: `${fillPercentage}%` }}
                    >
                        <Star className={`${starSize} text-primary-orange fill-primary-orange`} />
                    </div>
                </div>
            );
        }

        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {renderStars()}
            </div>
            {showNumber && (
                <span className="text-sm font-medium text-gray-700 ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
