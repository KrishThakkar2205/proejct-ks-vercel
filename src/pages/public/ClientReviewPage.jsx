import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Send, Loader2 } from 'lucide-react';
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
    const [shootData, setShootData] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    const [formData, setFormData] = useState({
        reviewerName: '',
        phoneNumber: '',
        email: '',
        rating: 0,
        reviewText: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch review/shoot data using the review ID (public endpoint, no auth)
    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/reviews/validate/${reviewId}`);
                setShootData(response.data);
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

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
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
        // Clear error for this field
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
                reviewer_email: formData.email,
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bebas tracking-wide text-deep-black mb-2">Invalid Link</h2>
                    <p className="text-gray-600 mb-6">{typeof error === 'string' ? error : 'Invalid or expired review link'}</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Go to Homepage
                    </Button>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="text-green-500" size={48} />
                    </div>
                    <h2 className="text-3xl font-bebas tracking-wide text-deep-black mb-3">Thank You!</h2>
                    <p className="text-gray-600 mb-2">Your review has been submitted successfully.</p>
                    <p className="text-sm text-gray-500">We appreciate your feedback!</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="font-bebas text-4xl tracking-wide text-deep-black">INFLU</span>
                        <span className="font-bebas text-4xl tracking-wide text-primary-orange">RUNNER</span>
                    </div>
                    <h1 className="text-3xl font-bebas tracking-wide text-deep-black mb-2">Share Your Experience</h1>
                    <p className="text-gray-600">We'd love to hear about your collaboration</p>
                </div>

                {/* Shoot Info Card */}
                <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-primary-orange">
                    <h3 className="text-sm font-semibold text-primary-orange uppercase mb-3">Shoot Details</h3>
                    <div className="space-y-2">
                        {(shootData?.brand_name || shootData?.brandName) && (
                            <div>
                                <span className="text-xs text-gray-600">Brand:</span>
                                <p className="font-semibold text-deep-black">{shootData.brand_name || shootData.brandName}</p>
                            </div>
                        )}
                        {(shootData?.name || shootData?.campaign) && (
                            <div>
                                <span className="text-xs text-gray-600">Campaign:</span>
                                <p className="text-sm text-gray-700">{shootData.name || shootData.campaign}</p>
                            </div>
                        )}
                        {(shootData?.shoot_date || shootData?.shootDate) && (
                            <div>
                                <span className="text-xs text-gray-600">Date:</span>
                                <p className="text-sm text-gray-700">
                                    {new Date(shootData.shoot_date || shootData.shootDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Review Form */}
                <Card className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Reviewer Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="reviewerName"
                                value={formData.reviewerName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border ${formErrors.reviewerName ? 'border-red-500' : 'border-gray-200'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all`}
                                placeholder="John Doe"
                            />
                            {formErrors.reviewerName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.reviewerName}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {formErrors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all`}
                                placeholder="your.email@example.com"
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <InteractiveStarRating
                                    rating={formData.rating}
                                    onRatingChange={handleRatingChange}
                                />
                                {formData.rating > 0 && (
                                    <span className="text-lg font-semibold text-primary-orange">
                                        {formData.rating} / 5
                                    </span>
                                )}
                            </div>
                            {formErrors.rating && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>
                            )}
                        </div>

                        {/* Review Text */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Review <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="reviewText"
                                value={formData.reviewText}
                                onChange={handleInputChange}
                                rows="5"
                                className={`w-full px-4 py-3 border ${formErrors.reviewText ? 'border-red-500' : 'border-gray-200'
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent resize-none transition-all`}
                                placeholder="Tell us about your experience working on this project..."
                            />
                            <div className="flex justify-between items-center mt-1">
                                {formErrors.reviewText ? (
                                    <p className="text-red-500 text-xs">{formErrors.reviewText}</p>
                                ) : (
                                    <p className="text-xs text-gray-500">Minimum 10 characters</p>
                                )}
                                <p className="text-xs text-gray-500">{formData.reviewText.length} characters</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-2"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Review
                                </>
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Your review will be visible on the influencer's public portfolio
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
