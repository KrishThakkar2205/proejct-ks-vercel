import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Send, Loader2, MessageSquare, ShieldAlert, BadgeCheck } from 'lucide-react';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import InteractiveStarRating from '../../components/ui/InteractiveStarRating';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { API_BASE_URL } from '../../utils/api';

const ClientReviewPage = () => {
    const { token: reviewId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shootData, setShootData] = useState(null); // stores { influencer_name, brand_name }
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    const [formData, setFormData] = useState({
        reviewerName: '',
        phoneNumber: '',
        rating: 0,
        reviewText: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch review validation data using the review ID
    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/reviews/validate/${reviewId}`);
                setShootData(response.data);
                if (response.data?.reviewer_name) {
                    setFormData(prev => ({ ...prev, reviewerName: response.data.reviewer_name }));
                }
            } catch (err) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Invalid or expired review link';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        if (reviewId) {
            fetchReviewData();
        }
    }, [reviewId]);

    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.reviewerName.trim()) {
            errors.reviewerName = 'Name is required';
        }

        // Phone number validation (basic)
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid phone number';
        }

        // Rating validation
        if (formData.rating === 0) {
            errors.rating = 'Please select a rating';
        }

        // Review text validation
        if (!formData.reviewText.trim()) {
            errors.reviewText = 'Review text is required';
        } else if (formData.reviewText.trim().length < 10) {
            errors.reviewText = 'Review must be at least 10 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRatingChange = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        if (formErrors.rating) {
            setFormErrors(prev => ({ ...prev, rating: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/api/reviews/submit/${reviewId}`, {
                reviewer_name: formData.reviewerName,
                reviewer_phone: formData.phoneNumber,
                rating: formData.rating,
                review: formData.reviewText,
            });

            setSubmitted(true);
        } catch (err) {
            const msg =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                'Failed to submit review. Please try again.';
            setErrorAlert({ isOpen: true, message: typeof msg === 'string' ? msg : 'Failed to submit review.' });
        } finally {
            setSubmitting(false);
        }
    };

    const getRatingLabel = (rating) => {
        switch (rating) {
            case 5: return 'Excellent! 🌟';
            case 4: return 'Great! 👍';
            case 3: return 'Good 🙂';
            case 2: return 'Could be better 😕';
            case 1: return 'Poor 😡';
            default: return 'Select your rating';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-4 relative overflow-hidden"
                 style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[55%] aspect-square rounded-full bg-gradient-to-br from-orange-500/5 to-pink-500/5 blur-[130px] pointer-events-none" />
                <div className="backdrop-blur-md bg-white/[0.01] border border-white/[0.06] shadow-2xl rounded-3xl p-8 text-center max-w-sm relative z-10">
                    <Loader2 size={36} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-400 font-medium text-sm">Loading review console...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-4 relative overflow-hidden"
                 style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[55%] aspect-square rounded-full bg-gradient-to-br from-orange-500/5 to-pink-500/5 blur-[130px] pointer-events-none" />
                <div className="backdrop-blur-md bg-white/[0.01] border border-red-500/10 shadow-2xl rounded-3xl p-8 text-center max-w-md relative z-10 space-y-6">
                    <div className="w-16 h-16 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/5">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bebas tracking-wide text-white mb-2">Invalid Review Link</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">{typeof error === 'string' ? error : 'This review request link has expired, or is invalid.'}</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/')} className="w-full py-3 rounded-xl">
                        Go to Homepage
                    </Button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-4 relative overflow-hidden"
                 style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[55%] aspect-square rounded-full bg-gradient-to-br from-orange-500/5 to-pink-500/5 blur-[130px] pointer-events-none" />
                <div className="backdrop-blur-md bg-white/[0.01] border border-green-500/10 shadow-2xl rounded-3xl p-10 text-center max-w-md relative z-10 space-y-6">
                    <div className="w-20 h-20 bg-green-500/5 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400 shadow-lg shadow-green-500/5 animate-pulse">
                        <BadgeCheck size={44} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bebas tracking-wide text-white mb-2">Submission Complete</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Thank you! Your feedback has been registered and will be shared on the profile portfolio.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08080a] py-16 px-4 relative overflow-hidden flex flex-col justify-center"
             style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            
            {/* Ambient background decoration */}
            <div className="absolute top-[-25%] left-[-20%] w-[65%] aspect-square rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[60%] aspect-square rounded-full bg-gradient-to-br from-orange-500/5 to-pink-500/5 blur-[140px] pointer-events-none" />

            <div className="w-full max-w-xl mx-auto relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center mb-5">
                        <img src="/logo.png" alt="InfluRunner Logo" className="h-10 w-auto filter brightness-110" />
                    </div>
                    <h1 className="text-4xl font-bebas tracking-wide text-white">Share Your Experience</h1>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Collaboration review console</p>
                </div>

                {/* Main Console Box */}
                <div className="backdrop-blur-md bg-white/[0.02] border border-white/[0.07] shadow-2xl rounded-3xl p-6 md:p-10 space-y-6">
                    
                    {/* Collaboration Context Pill */}
                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-bold text-primary-orange uppercase tracking-widest block">Reviewing Influencer</span>
                            <span className="text-lg font-bold text-white mt-0.5 block">{shootData?.influencer_name || 'Influencer'}</span>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.05] px-4 py-2.5 rounded-xl text-sm self-start sm:self-auto min-w-[140px]">
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold tracking-wider">Brand Name</span>
                            <span className="font-semibold text-white mt-0.5 block">{shootData?.brand_name || 'Brand Client'}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                name="reviewerName"
                                value={formData.reviewerName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-white/[0.02] border ${formErrors.reviewerName ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:ring-primary-orange/20'} rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:bg-white/[0.04] transition-all`}
                                placeholder="Sarah Connor"
                            />
                            {formErrors.reviewerName && (
                                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                                    <span>{formErrors.reviewerName}</span>
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-white/[0.02] border ${formErrors.phoneNumber ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:ring-primary-orange/20'} rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:bg-white/[0.04] transition-all`}
                                placeholder="+91 9876543210"
                            />
                            {formErrors.phoneNumber && (
                                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                                    <span>{formErrors.phoneNumber}</span>
                                </p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                                Rating *
                            </label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl w-fit">
                                <InteractiveStarRating
                                    rating={formData.rating}
                                    onRatingChange={handleRatingChange}
                                />
                                <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${formData.rating > 0 ? 'text-primary-orange bg-primary-orange/10' : 'text-gray-500 bg-white/[0.03]'}`}>
                                    {getRatingLabel(formData.rating)}
                                </span>
                            </div>
                            {formErrors.rating && (
                                <p className="text-red-400 text-xs mt-2 font-medium">{formErrors.rating}</p>
                            )}
                        </div>

                        {/* Review text */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Your Review *
                            </label>
                            <textarea
                                name="reviewText"
                                value={formData.reviewText}
                                onChange={handleInputChange}
                                rows="4"
                                className={`w-full px-4 py-3 bg-white/[0.02] border ${formErrors.reviewText ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/[0.08] focus:ring-primary-orange/20'} rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:bg-white/[0.04] resize-none transition-all`}
                                placeholder="Describe your experience working together on this campaign..."
                            />
                            <div className="flex justify-between items-center mt-1.5">
                                {formErrors.reviewText ? (
                                    <p className="text-red-400 text-xs font-medium">{formErrors.reviewText}</p>
                                ) : (
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Min 10 characters</p>
                                )}
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{formData.reviewText.length} characters</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-orange to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg shadow-orange-500/5 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Submitting Review...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    <span>Submit Review</span>
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer Disclaimer */}
                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <MessageSquare size={13} className="text-gray-600" />
                    <span>Your review will be visible on the influencer's public portfolio.</span>
                </p>
            </div>

            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default ClientReviewPage;
