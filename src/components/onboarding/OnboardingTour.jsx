import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Sparkles, Check, Instagram, Loader2, Clock, MousePointerClick } from 'lucide-react';
import { INFLUENCER_TOUR_STEPS } from '../../data/tourSteps';
import api from '../../utils/api';

const OnboardingTour = ({ isOpen, onClose, steps = INFLUENCER_TOUR_STEPS }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [connectingInsta, setConnectingInsta] = useState(false);
    const [isInstaConnected, setIsInstaConnected] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if Instagram is already connected
    useEffect(() => {
        if (isOpen) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser?.instagram === true) {
                setIsInstaConnected(true);
            }
            // Also query profile API for real-time connection status
            api.get('/api/profile')
                .then((res) => {
                    if (res.data?.instagram) {
                        setIsInstaConnected(true);
                    }
                })
                .catch(() => {});
        }
    }, [isOpen]);

    // Filter out Instagram connection step if Instagram is already connected
    const activeSteps = steps.filter((step) => !(step.isInstagramStep && isInstaConnected));

    const currentStep = activeSteps[currentStepIndex] || activeSteps[0];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === activeSteps.length - 1;

    // Detect route changes for interactive click steps
    useEffect(() => {
        if (isOpen && currentStep?.requiresClick && currentStep?.expectedPath) {
            if (location.pathname === currentStep.expectedPath) {
                // User clicked the target button and landed on expected page -> advance to next step
                setCurrentStepIndex((prev) => prev + 1);
            }
        }
    }, [isOpen, currentStep, location.pathname]);

    // Automatic route sync for non-click steps if path differs
    useEffect(() => {
        if (isOpen && !currentStep?.requiresClick && currentStep?.path && location.pathname !== currentStep.path) {
            navigate(currentStep.path);
        }
    }, [isOpen, currentStepIndex, currentStep, location.pathname, navigate]);

    // Calculate position and scroll target element into view
    const updateTargetRect = useCallback(() => {
        if (!isOpen || !currentStep?.target) {
            setTargetRect(null);
            return;
        }

        const el = document.querySelector(currentStep.target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            const rect = el.getBoundingClientRect();
            setTargetRect({
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            });
        } else {
            setTargetRect(null);
        }
    }, [isOpen, currentStep]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(updateTargetRect, 350);
            window.addEventListener('resize', updateTargetRect);
            window.addEventListener('scroll', updateTargetRect, true);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateTargetRect);
                window.removeEventListener('scroll', updateTargetRect, true);
            };
        }
    }, [isOpen, currentStepIndex, location.pathname, updateTargetRect]);

    // Attach click listener to target element for interactive steps
    useEffect(() => {
        if (!isOpen || !currentStep?.requiresClick || !currentStep?.target) return;

        const el = document.querySelector(currentStep.target);
        if (!el) return;

        const handleClick = () => {
            setCurrentStepIndex((prev) => prev + 1);
        };

        el.addEventListener('click', handleClick);
        return () => el.removeEventListener('click', handleClick);
    }, [isOpen, currentStepIndex, currentStep]);

    // Handle Keyboard Shortcuts (Esc to skip, Arrows to navigate)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleSkip();
            } else if (e.key === 'ArrowRight' && !isLastStep) {
                handleNext();
            } else if (e.key === 'ArrowLeft' && !isFirstStep) {
                handleBack();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentStepIndex, isFirstStep, isLastStep]);

    if (!isOpen || !currentStep) return null;

    const handleSkip = () => {
        localStorage.setItem('has_seen_onboarding_tour', 'true');
        sessionStorage.removeItem('show_onboarding_tour');
        setCurrentStepIndex(0);
        onClose();
    };

    const handleNext = () => {
        if (isLastStep) {
            handleSkip();
        } else {
            if (currentStep?.requiresClick && currentStep?.expectedPath) {
                navigate(currentStep.expectedPath);
            }
            setCurrentStepIndex((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    // Instagram Connect Action
    const handleConnectInstagramNow = async () => {
        setConnectingInsta(true);
        try {
            const response = await api.get('/api/social-media/connect/instagram');
            if (response.data?.url) {
                window.location.href = response.data.url;
            } else {
                alert('Redirecting to Instagram authentication...');
                handleNext();
            }
        } catch (err) {
            console.error('Error connecting Instagram:', err);
            handleNext();
        } finally {
            setConnectingInsta(false);
        }
    };

    const padding = 6;
    const hasCutout = targetRect !== null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden select-none animate-fadeIn pointer-events-none">
            {/* 4-Panel Cutout Backdrop: Leaves a true hole over the target element so user clicks land 100% on the element */}
            {hasCutout ? (
                <>
                    {/* Top backdrop */}
                    <div
                        className="fixed top-0 left-0 right-0 bg-black/65 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
                        style={{ height: Math.max(0, targetRect.top - padding) }}
                        onClick={handleNext}
                    />
                    {/* Bottom backdrop */}
                    <div
                        className="fixed left-0 right-0 bottom-0 bg-black/65 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
                        style={{ top: targetRect.top + targetRect.height + padding }}
                        onClick={handleNext}
                    />
                    {/* Left backdrop */}
                    <div
                        className="fixed bg-black/65 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
                        style={{
                            top: Math.max(0, targetRect.top - padding),
                            left: 0,
                            width: Math.max(0, targetRect.left - padding),
                            height: targetRect.height + padding * 2,
                        }}
                        onClick={handleNext}
                    />
                    {/* Right backdrop */}
                    <div
                        className="fixed right-0 bg-black/65 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
                        style={{
                            top: Math.max(0, targetRect.top - padding),
                            left: targetRect.left + targetRect.width + padding,
                            height: targetRect.height + padding * 2,
                        }}
                        onClick={handleNext}
                    />

                    {/* Spotlight Glow Ring around Target Element */}
                    <div
                        className="fixed pointer-events-none rounded-2xl transition-all duration-300 border-2 border-primary-orange shadow-[0_0_25px_rgba(255,107,26,0.8)] animate-pulse z-[9998]"
                        style={{
                            top: Math.max(0, targetRect.top - padding),
                            left: Math.max(0, targetRect.left - padding),
                            width: targetRect.width + padding * 2,
                            height: targetRect.height + padding * 2,
                        }}
                    />
                </>
            ) : (
                /* Full backdrop when no target element cut out */
                <div className="fixed inset-0 bg-black/65 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto" />
            )}

            {/* Floating Tooltip Card Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[9999]">
                <div 
                    className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md p-6 sm:p-7 overflow-hidden transition-all duration-300 pointer-events-auto"
                    style={{
                        animation: 'fadeInSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {/* Ambient Background Gradients */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Card Header: Badge & Skip Button */}
                    <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-xs font-bold text-primary-orange uppercase tracking-wider">
                            <Sparkles size={12} className="animate-spin-slow" />
                            <span>{currentStep.badge}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-400">
                                {currentStepIndex + 1} of {activeSteps.length}
                            </span>
                            {/* Prominent Skip Button */}
                            <button
                                onClick={handleSkip}
                                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                title="Skip Tour"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Dedicated Instagram Connection Step Layout */}
                    {currentStep.isInstagramStep ? (
                        <div className="relative z-10 my-2 space-y-4 text-center">
                            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-pink-500/25 animate-bounce">
                                <Instagram size={32} />
                            </div>

                            <div>
                                <h3 className="text-xl sm:text-2xl font-bebas tracking-wide text-deep-black">
                                    {currentStep.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans mt-1">
                                    {currentStep.description}
                                </p>
                            </div>

                            <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl text-left space-y-1.5">
                                <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">Why connect Instagram?</p>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Check size={13} className="text-pink-600 flex-shrink-0" />
                                        <span>Auto-sync follower reach & engagement rates</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Check size={13} className="text-pink-600 flex-shrink-0" />
                                        <span>Generate shareable post metric reports for brands</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions for Instagram Step */}
                            <div className="pt-2 space-y-2">
                                <button
                                    onClick={handleConnectInstagramNow}
                                    disabled={connectingInsta}
                                    className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                                >
                                    {connectingInsta ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Connecting Instagram...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Instagram size={16} />
                                            <span>Connect Instagram Now</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-1"
                                >
                                    <Clock size={13} />
                                    <span>Will do it later</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Standard Step Layout */
                        <div className="relative z-10 space-y-2 mb-6">
                            <h3 className="text-xl sm:text-2xl font-bebas tracking-wide text-deep-black flex items-center gap-2">
                                {currentStep.title}
                                {currentStep.requiresClick && (
                                    <span className="inline-flex items-center text-primary-orange animate-bounce">
                                        <MousePointerClick size={20} />
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-sans font-normal">
                                {currentStep.description}
                            </p>

                            {currentStep.requiresClick && (
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs font-semibold text-primary-orange flex items-center gap-2">
                                    <MousePointerClick size={16} className="animate-pulse flex-shrink-0" />
                                    <span>Click the glowing button highlighted on screen!</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Progress Dots */}
                    <div className="flex items-center justify-center gap-1.5 mb-6 relative z-10">
                        {activeSteps.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentStepIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === currentStepIndex
                                        ? 'w-6 bg-primary-orange'
                                        : idx < currentStepIndex
                                        ? 'w-2 bg-orange-300'
                                        : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Standard Card Footer */}
                    {!currentStep.isInstagramStep && (
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 relative z-10">
                            <button
                                onClick={handleSkip}
                                className="px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-gray-700 hover:underline transition-colors"
                            >
                                Skip Tour
                            </button>

                            <div className="flex items-center gap-2">
                                {!isFirstStep && (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-1"
                                    >
                                        <ChevronLeft size={14} />
                                        Back
                                    </button>
                                )}

                                <button
                                    onClick={handleNext}
                                    className="px-5 py-2.5 text-xs font-bold text-white bg-primary-orange hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                    <span>
                                        {isLastStep ? 'Get Started' : currentStep.requiresClick ? 'Or Click Next' : 'Next Step'}
                                    </span>
                                    {isLastStep ? <Check size={14} /> : <ChevronRight size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingTour;
