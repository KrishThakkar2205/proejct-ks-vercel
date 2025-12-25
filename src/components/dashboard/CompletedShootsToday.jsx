import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CheckCircle, Calendar, Clock, Award, Link as LinkIcon, Check } from 'lucide-react';

const CompletedShootsToday = ({ completedShoots = [] }) => {
    const [generatedLinks, setGeneratedLinks] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    // Generate review link
    const generateReviewLink = (shootId) => {
        // In production, this would generate a unique review link from the backend
        const reviewLink = `${window.location.origin}/review/${shootId}`;

        setGeneratedLinks(prev => ({
            ...prev,
            [shootId]: reviewLink
        }));
    };

    // Copy link to clipboard
    const copyLink = (shootId, link) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(shootId);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return (
        <Card className="p-6 h-auto lg:h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bebas tracking-wide text-deep-black">Completed Today</h2>
                    <p className="text-sm text-gray-600 mt-1">Tasks finished</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
            </div>

            {/* Count Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Completed</p>
                        <h3 className="text-3xl font-bebas tracking-wide text-green-600">
                            {completedShoots.length}
                        </h3>
                    </div>
                    <Award className="w-8 h-8 text-green-600 opacity-50" />
                </div>
            </div>

            {completedShoots.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No tasks completed yet</p>
                    <p className="text-xs text-gray-400 mt-1">Keep going!</p>
                </div>
            ) : (
                <div className="space-y-3 lg:max-h-[600px] lg:overflow-y-auto pr-2">
                    {completedShoots.map((shoot) => (
                        <div
                            key={shoot.id}
                            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-deep-black text-sm truncate">
                                            {shoot.brand}
                                        </h4>
                                        {/* Type Badge */}
                                        {shoot.type && (
                                            <Badge
                                                variant={shoot.type === 'shoot' ? 'default' : 'secondary'}
                                                className={shoot.type === 'shoot'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200 text-xs'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200 text-xs'
                                                }
                                            >
                                                {shoot.type === 'shoot' ? 'Shoot' : 'Upload'}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                        {shoot.campaign}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{shoot.completedAt}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={i < shoot.rating ? 'text-yellow-500' : 'text-gray-300'}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Review Link Section - Below main content */}
                            {shoot.type === 'shoot' && (
                                <div className="mt-3 pt-3 border-t border-green-300">
                                    {!generatedLinks[shoot.id] ? (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => generateReviewLink(shoot.id)}
                                            className="w-full"
                                        >
                                            <LinkIcon className="w-4 h-4 mr-2" />
                                            Generate Review Link
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={generatedLinks[shoot.id]}
                                                    readOnly
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none"
                                                />
                                                <Button
                                                    variant={copiedId === shoot.id ? "success" : "primary"}
                                                    size="sm"
                                                    onClick={() => copyLink(shoot.id, generatedLinks[shoot.id])}
                                                    className="whitespace-nowrap"
                                                >
                                                    {copiedId === shoot.id ? (
                                                        <>
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        'Copy'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {completedShoots.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                        Great work today! 🎉
                    </p>
                </div>
            )}
        </Card>
    );
};

export default CompletedShootsToday;
