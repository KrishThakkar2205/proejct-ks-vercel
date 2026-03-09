import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ isOpen, message, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            // Auto-close after 4 seconds (slightly longer for errors so user can read)
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-md">
                <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ErrorAlert;
