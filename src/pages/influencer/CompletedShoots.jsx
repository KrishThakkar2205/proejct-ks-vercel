import React, { useState, useEffect, useCallback } from 'react';
import { Link2, Copy, CheckCircle, Calendar, MapPin, Clock, Search, Loader2, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ErrorAlert from '../../components/ui/ErrorAlert';
import api from '../../utils/api';
import { utcToIST, utcToISTDate } from '../../utils/dateUtils';

const CompletedShoots = () => {
    const [completedShoots, setCompletedShoots] = useState([]);
    const [completedUploads, setCompletedUploads] = useState([]);
    const [activeTab, setActiveTab] = useState('shoots');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [copiedLink, setCopiedLink] = useState(null);
    const [generatingFor, setGeneratingFor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    // IST display helpers (imported from dateUtils)
    const utcToLocalDisplay = (d, t) => utcToIST(d, t);
    const utcDateToLocal = utcToISTDate;

    // Fetch completed shoots, uploads, and reviews
    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);

            const [shootsRes, uploadsRes] = await Promise.all([
                api.get('/api/shoots', { params: { completed: true } }),
                api.get('/api/uploads', { params: { completed: true } }),
            ]);

            setCompletedShoots(Array.isArray(shootsRes.data) ? shootsRes.data : []);
            setCompletedUploads(Array.isArray(uploadsRes.data) ? uploadsRes.data : []);
        } catch (err) {
            if (!silent) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Failed to load completed shoots data.';
                setError(msg);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map API data to component format
    const shootsList = completedShoots.map(s => ({
        id: s.id,
        brandName: s.brand_name || '',
        campaign: s.name || '',
        shootDate: utcDateToLocal(s.shoot_date, s.shoot_time),
        shootTime: utcToLocalDisplay(s.shoot_date, s.shoot_time),
        location: s.location || '',
        completedAt: s.completed_at,
        notes: s.notes || '',
        reviewGenerated: s.review_generated || false,
        reviewId: s.review_id || '',
    }));

    const uploadsList = completedUploads.map(u => ({
        id: u.id,
        brandName: u.brand_name || '',
        campaign: u.name || '',
        uploadDate: utcDateToLocal(u.upload_date, u.upload_time),
        uploadTime: utcToLocalDisplay(u.upload_date, u.upload_time),
        platform: u.platform || '',
        completedAt: u.completed_at,
        notes: u.notes || '',
    }));



    // Generate review link via API
    const handleGenerateLink = async (shootId) => {
        setGeneratingFor(shootId);
        try {
            const response = await api.post(`/api/reviews/generate/${shootId}`);
            const reviewLink = response.data?.review_link;

            if (reviewLink) {
                copyToClipboard(reviewLink, shootId);
            }

            // Refresh data to get the updated review_generated flag
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to generate review link.' });
        } finally {
            setGeneratingFor(null);
        }
    };

    const copyToClipboard = (link, id) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedLink(id);
            setTimeout(() => setCopiedLink(null), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    // Filter functions
    const filterShoots = () => {
        if (!searchQuery && !dateFilter) return shootsList;
        const query = searchQuery.toLowerCase();
        return shootsList.filter(shoot => {
            const matchesSearch = !searchQuery || (
                shoot.brandName?.toLowerCase().includes(query) ||
                shoot.campaign?.toLowerCase().includes(query) ||
                shoot.location?.toLowerCase().includes(query) ||
                shoot.shootDate?.toLowerCase().includes(query) ||
                shoot.shootTime?.toLowerCase().includes(query)
            );
            let matchesDate = true;
            if (dateFilter) {
                matchesDate = shoot.shootDate === dateFilter;
            }
            return matchesSearch && matchesDate;
        });
    };

    const filterUploads = () => {
        if (!searchQuery && !dateFilter) return uploadsList;
        const query = searchQuery.toLowerCase();
        return uploadsList.filter(upload => {
            const matchesSearch = !searchQuery || (
                upload.brandName?.toLowerCase().includes(query) ||
                upload.campaign?.toLowerCase().includes(query) ||
                upload.platform?.toLowerCase().includes(query) ||
                upload.uploadTime?.toLowerCase().includes(query)
            );
            let matchesDate = true;
            if (dateFilter) {
                matchesDate = upload.uploadDate === dateFilter;
            }
            return matchesSearch && matchesDate;
        });
    };

    const filteredShoots = filterShoots();
    const filteredUploads = filterUploads();

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading completed shoots...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-2">Error</p>
                    <p className="text-gray-600 text-sm mb-4">{typeof error === 'string' ? error : 'Something went wrong.'}</p>
                    <Button onClick={() => fetchData()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">


            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {['shoots', 'uploads'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab === 'shoots'
                            ? `Completed Shoots (${shootsList.length})`
                            : `Completed Uploads (${uploadsList.length})`}
                    </button>
                ))}
            </div>

            {/* Stats Card */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bebas tracking-wide text-deep-black mb-1">
                            {activeTab === 'shoots' ? 'Total Completed Shoots' : 'Total Completed Uploads'}
                        </h2>
                        <p className="text-4xl font-bold text-green-600">
                            {activeTab === 'shoots' ? shootsList.length : uploadsList.length}
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={32} />
                    </div>
                </div>
            </Card>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="flex flex-col gap-3">
                    {/* Search */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'shoots' ? 'shoots' : 'uploads'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent text-sm"
                                placeholder="Filter by date"
                            />
                        </div>
                        {dateFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDateFilter('')}
                                className="whitespace-nowrap"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Completed Items List */}
            {activeTab === 'shoots' ? (
                // Shoots Tab
                filteredShoots.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredShoots.map((shoot) => {

                            return (
                                <Card key={shoot.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                                <CheckCircle className="text-green-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-deep-black text-lg">{shoot.brandName || 'Untitled'}</h3>
                                                <p className="text-sm text-gray-600">{shoot.campaign}</p>
                                            </div>
                                        </div>
                                        {shoot.reviewGenerated && (
                                            <Badge variant="success">Review Generated</Badge>
                                        )}
                                    </div>

                                    {/* Shoot Details */}
                                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={16} className="text-gray-400" />
                                            {new Date(shoot.shootDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        {shoot.shootTime && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={16} className="text-gray-400" />
                                                {shoot.shootTime}
                                            </div>
                                        )}
                                        {shoot.location && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={16} className="text-gray-400" />
                                                {shoot.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Link Section */}
                                    {shoot.reviewGenerated ? (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <CheckCircle size={18} className="text-green-600" />
                                                <span className="text-sm font-semibold text-green-700">Review Generated</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => copyToClipboard(`${window.location.origin}/review/${shoot.reviewId}`, shoot.id)}
                                            >
                                                <Copy size={16} className="mr-2" />
                                                {copiedLink === shoot.id ? 'Copied!' : 'Copy Link'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                                                <p className="text-sm text-gray-700 mb-3">
                                                    Generate a review link to share with your client
                                                </p>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => handleGenerateLink(shoot.id)}
                                                    disabled={generatingFor === shoot.id}
                                                >
                                                    {generatingFor === shoot.id ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin mr-2" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link2 size={16} className="mr-2" />
                                                            Generate Review Link
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {searchQuery || dateFilter ? 'No shoots found' : 'No completed shoots yet'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchQuery || dateFilter
                                ? 'Try adjusting your search query or date filter'
                                : 'Mark shoots as completed from the Schedule page to see them here'}
                        </p>
                        {!searchQuery && !dateFilter && (
                            <Button variant="primary" onClick={() => window.location.href = '/influencer/schedule'}>
                                Go to Schedule
                            </Button>
                        )}
                    </Card>
                )
            ) : (
                // Uploads Tab
                filteredUploads.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredUploads.map((upload) => (
                            <Card key={upload.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-deep-black mb-1">{upload.brandName || 'Untitled'}</h3>
                                        <p className="text-sm text-gray-600">{upload.campaign}</p>
                                    </div>
                                    <Badge variant="success">Uploaded</Badge>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {upload.completedAt && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>Uploaded: {new Date(upload.completedAt).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                        </div>
                                    )}
                                    {upload.platform && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ExternalLink size={16} className="text-gray-400" />
                                            <span>Platform: {upload.platform}</span>
                                        </div>
                                    )}
                                    {upload.uploadTime && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>Scheduled: {upload.uploadTime}</span>
                                        </div>
                                    )}
                                </div>

                                {upload.notes && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-xs text-gray-500">{upload.notes}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center">
                            <CheckCircle size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {searchQuery || dateFilter ? 'No uploads found' : 'No completed uploads yet'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchQuery || dateFilter
                                ? 'Try adjusting your search query or date filter'
                                : 'Mark uploads as completed from the Schedule page to see them here'}
                        </p>
                        {!searchQuery && !dateFilter && (
                            <Button variant="primary" onClick={() => window.location.href = '/influencer/schedule'}>
                                Go to Schedule
                            </Button>
                        )}
                    </Card>
                )
            )}

            {/* Error Alert */}
            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default CompletedShoots;
