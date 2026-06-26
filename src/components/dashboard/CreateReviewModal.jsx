import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link as LinkIcon, Check, Loader2, AlertCircle, Share2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ErrorAlert from '../ui/ErrorAlert';
import api from '../../utils/api';

const CreateReviewModal = ({ isOpen, onClose, onSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });
    
    const [formData, setFormData] = useState({
        brandName: ''
    });

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setFormData({ brandName: '' });
            setGeneratedLink('');
            setCopied(false);
        }, 300);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorAlert({ isOpen: false, message: '' });

        try {
            // Call standalone review generate endpoint passing brand_name as query param
            const res = await api.post(`/api/reviews/generate?brand_name=${encodeURIComponent(formData.brandName)}`);

            const data = res.data;
            const reviewPath = data?.review_link || data?.link;
            
            if (reviewPath) {
                const reviewUrl = `${window.location.origin}${reviewPath}`;
                setGeneratedLink(reviewUrl);
                if (onSuccess) {
                    onSuccess('Review link created successfully!');
                }
            } else {
                throw new Error('No review link returned from backend.');
            }
        } catch (err) {
            console.error('Error generating review link:', err);
            const msg =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to generate review link. Please try again.';
            setErrorAlert({ isOpen: true, message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopy = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return createPortal(
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 ${isClosing ? 'animate-backdrop-exit' : 'animate-fadeIn'}`}
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={handleClose}
        >
            <Card
                className={`w-[95%] md:w-full max-w-md max-h-[85vh] overflow-y-auto ${isClosing ? 'animate-popup-exit' : 'animate-scaleIn'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-2 md:p-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Share2 className="w-6 h-6 text-primary-orange" />
                            <h2 className="text-2xl font-bebas tracking-wide text-deep-black">Create Review Link</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {errorAlert.isOpen && (
                        <div className="mb-4">
                            <ErrorAlert
                                message={errorAlert.message}
                                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
                            />
                        </div>
                    )}

                    {!generatedLink ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Brand Name *
                                </label>
                                <input
                                    type="text"
                                    name="brandName"
                                    value={formData.brandName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Fashion Nova"
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="white"
                                    onClick={handleClose}
                                    className="border-gray-200 text-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={submitting}
                                    className="min-w-[120px]"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        'Create Link'
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6 py-4 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-2">
                                <Check size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-deep-black mb-1">Review Link Ready!</h3>
                                <p className="text-sm text-gray-500">Share this link with the brand client to collect feedback.</p>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex items-center justify-between gap-3 text-left">
                                <span className="text-sm font-medium text-gray-700 truncate select-all">{generatedLink}</span>
                                <Button
                                    variant={copied ? 'success' : 'primary'}
                                    size="sm"
                                    onClick={handleCopy}
                                    className="flex-shrink-0 min-w-[90px]"
                                >
                                    {copied ? (
                                        <span className="flex items-center gap-1">
                                            <Check size={14} />
                                            Copied
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <LinkIcon size={14} />
                                            Copy Link
                                        </span>
                                    )}
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <Button variant="white" onClick={handleClose} className="w-full">
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>,
        document.body
    );
};

export default CreateReviewModal;
