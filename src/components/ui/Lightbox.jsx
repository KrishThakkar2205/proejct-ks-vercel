import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Lightbox = ({ isOpen, onClose, imageSrc, imageAlt, caption }) => {
    // Listen to ESC key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scrolling when open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md transition-all duration-300 animate-fadeIn"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all duration-200 z-10"
                aria-label="Close lightbox"
            >
                <X size={28} />
            </button>

            {/* Image Container */}
            <div
                className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center p-2 transition-transform duration-300 scale-95 animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageSrc}
                    alt={imageAlt || 'Fullscreen view'}
                    className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                />
            </div>

            {/* Caption / Title */}
            {caption && (
                <div 
                    className="mt-4 px-6 py-2 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm max-w-[80vw] text-center font-medium animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    {caption}
                </div>
            )}
        </div>
    );
};

export default Lightbox;
