import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle, Clock, Star, Link as LinkIcon, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const CompletedShootsToday = ({ completedShoots: apiShoots = [], completedUploads: apiUploads = [] }) => {
    const reviewBaseUrl = `${window.location.origin}/review/`;
    const [copiedId, setCopiedId] = useState(null);
    const [generatedLinks, setGeneratedLinks] = useState({});
    const [generatingIds, setGeneratingIds] = useState(new Set());
    const [generateErrors, setGenerateErrors] = useState({});

    // Call POST /api/reviews/generate/{shoot_id} to get a unique token
    const generateReviewLink = async (shootId, compositeId) => {
        setGeneratingIds(prev => new Set([...prev, compositeId]));
        setGenerateErrors(prev => { const n = { ...prev }; delete n[compositeId]; return n; });
        try {
            const res = await api.post(`/api/reviews/generate/${shootId}`);
            const data = res.data;
            const token = data?.review_id || data?.token || data?.review_token || data?.id || shootId;
            const link = `${reviewBaseUrl}${token}`;
            setGeneratedLinks(prev => ({ ...prev, [compositeId]: link }));
        } catch (err) {
            const msg =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                'Failed to generate link. Try again.';
            setGenerateErrors(prev => ({ ...prev, [compositeId]: msg }));
        } finally {
            setGeneratingIds(prev => {
                const next = new Set(prev);
                next.delete(compositeId);
                return next;
            });
        }
    };

    const copyLink = (compositeId, link) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(compositeId);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const formatTime = (val) => {
        if (!val) return null;
        if (val.includes('T')) {
            return new Date(val).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        if (val.includes(':')) {
            const [hours, minutes] = val.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h = hour % 12 || 12;
            return `${h}:${minutes} ${ampm}`;
        }
        return val;
    };

    const completedEvents = [
        ...apiShoots.map(s => ({
            id: `shoot-${s.id}`,
            originalId: s.id,
            brand: s.brand_name || 'Untitled Brand',
            campaign: s.name || s.campaign || null,
            type: 'shoot',
            completedAt: s.completed_at || s.shoot_time || null,
            notes: s.notes || null,
            rating: s.rating || null,
            // if the API already generated a review link token, store it
            reviewToken: s.review_generated ? (s.review_token || s.review_id || s.id) : null,
        })),
        ...apiUploads.map(u => ({
            id: `upload-${u.id}`,
            originalId: u.id,
            brand: u.brand_name || 'Untitled Brand',
            campaign: u.name || u.campaign || null,
            type: 'upload',
            completedAt: u.completed_at || u.upload_time || null,
            notes: u.notes || null,
            rating: u.rating || null,
            reviewToken: null,
        })),
    ];

    const getReviewLink = (item) => {
        // Prefer locally-generated link, then pre-existing token from API
        return generatedLinks[item.id] || (item.reviewToken ? `${reviewBaseUrl}${item.reviewToken}` : null);
    };

    return (
        <Card id="completed-shoots-section" className="p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bebas tracking-wide text-deep-black">Completed Today</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {completedEvents.length > 0
                            ? `${completedEvents.length} task${completedEvents.length !== 1 ? 's' : ''} done`
                            : 'Tasks finished today'}
                    </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-[250px]">
                {completedEvents.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <CheckCircle size={48} className="mb-3 text-gray-200" strokeWidth={1.5} />
                        <p className="text-gray-600 font-medium">No tasks completed yet</p>
                        <p className="text-sm text-gray-400 mt-1">Complete a shoot or upload to see it here</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pr-1">
                        {completedEvents.map((item) => {
                            const reviewLink = getReviewLink(item);
                            const rating = item.rating;
                            const timeLabel = formatTime(item.completedAt);

                            return (
                                <div
                                    key={item.id}
                                    className="p-4 bg-green-50 border border-green-200 rounded-xl"
                                >
                                    {/* Top Row */}
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Meta */}
                                        <div className="flex-1 min-w-0">
                                            {/* Brand + Type */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-deep-black text-sm tracking-wide uppercase">
                                                    {item.brand}
                                                </h4>
                                                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${item.type === 'shoot'
                                                    ? 'text-purple-600'
                                                    : 'text-blue-600'
                                                    }`}>
                                                    {item.type === 'shoot' ? 'Shoot' : 'Upload'}
                                                </span>
                                            </div>

                                            {/* Campaign */}
                                            {item.campaign && (
                                                <p className="text-sm text-gray-600 mt-0.5 truncate">{item.campaign}</p>
                                            )}

                                            {/* Time + Stars */}
                                            {(timeLabel || rating != null) && (
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    {timeLabel && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{timeLabel}</span>
                                                        </div>
                                                    )}
                                                    {rating != null && (
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {item.notes && (
                                                <div className="mt-2 text-xs text-gray-600 italic bg-white/60 border border-green-200 rounded-lg px-2.5 py-1.5 line-clamp-2">
                                                    {item.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review Link Section — shoots only */}
                                    {item.type === 'shoot' && (
                                        <div className="mt-3 pt-3 border-t border-green-200">
                                            {reviewLink ? (
                                                /* Link already generated — show Copy Link */
                                                <div className="flex flex-col xs:flex-row gap-2">
                                                    <input
                                                        type="text"
                                                        value={reviewLink}
                                                        readOnly
                                                        className="flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none text-gray-500 truncate"
                                                    />
                                                    <Button
                                                        variant={copiedId === item.id ? 'success' : 'primary'}
                                                        size="sm"
                                                        onClick={() => copyLink(item.id, reviewLink)}
                                                        className="whitespace-nowrap w-full xs:w-auto xs:min-w-[70px]"
                                                    >
                                                        {copiedId === item.id ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5 mr-1" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LinkIcon className="w-3.5 h-3.5 mr-1" />
                                                                Copy Link
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            ) : (
                                                /* No link yet — show Generate button */
                                                <div>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => generateReviewLink(item.originalId, item.id)}
                                                        className="w-full"
                                                        disabled={generatingIds.has(item.id)}
                                                    >
                                                        {generatingIds.has(item.id) ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LinkIcon className="w-4 h-4 mr-2" />
                                                                Generate Review Link
                                                            </>
                                                        )}
                                                    </Button>
                                                    {generateErrors[item.id] && (
                                                        <div className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                                                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                                            <span>{generateErrors[item.id]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {completedEvents.length > 0 && (
                <p className="text-xs text-center text-gray-400 mt-4 pt-4 border-t border-gray-100">
                    Great work today! 🎉
                </p>
            )}
        </Card>
    );
};

export default CompletedShootsToday;
