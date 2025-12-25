import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, X } from 'lucide-react';

const SuccessAlert = ({ isOpen, message, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            // Auto-close after 3 seconds if onClose is provided
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] max-w-md">
                <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
};

export default SuccessAlert;
