import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Calendar as CalendarIcon, Clock, MapPin, Search, Upload, Video, X, Trash2, Loader2, CheckCircle, AlertTriangle, RefreshCw, Info, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import { utcToIST, utcToISTDate } from '../../utils/dateUtils';

const Schedule = () => {
    // Filter & Search states
    const [statusFilter, setStatusFilter] = useState('all'); // all, today, upcoming, delayed, completed
    const [typeFilter, setTypeFilter] = useState('all'); // all, shoots, uploads
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Modal & Alert states
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, event: null, eventType: null });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, itemId: null, itemType: null });
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    // API raw data
    const [completedShoots, setCompletedShoots] = useState([]);
    const [completedUploads, setCompletedUploads] = useState([]);
    const [activeShoots, setActiveShoots] = useState([]);
    const [activeUploads, setActiveUploads] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get today's local date string YYYY-MM-DD
    const getTodayStr = () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };
    const todayStr = getTodayStr();

    // Time translation helpers
    const utcToLocalDisplay = (d, t) => utcToIST(d, t);
    const utcDateToLocal = utcToISTDate;

    // Fetch all shoots & uploads in parallel
    const fetchData = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);

            const [compShootsRes, compUploadsRes, actShootsRes, actUploadsRes] = await Promise.all([
                api.get('/api/shoots', { params: { completed: true } }),
                api.get('/api/uploads', { params: { completed: true } }),
                api.get('/api/shoots', { params: { completed: false } }),
                api.get('/api/uploads', { params: { completed: false } }),
            ]);

            setCompletedShoots(Array.isArray(compShootsRes.data) ? compShootsRes.data : []);
            setCompletedUploads(Array.isArray(compUploadsRes.data) ? compUploadsRes.data : []);
            setActiveShoots(Array.isArray(actShootsRes.data) ? actShootsRes.data : []);
            setActiveUploads(Array.isArray(actUploadsRes.data) ? actUploadsRes.data : []);
        } catch (err) {
            if (!silent) {
                const msg =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    'Failed to load tracking data. Please try again.';
                setError(msg);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map and normalize to unified task model
    const normalizeTasks = () => {
        const list = [];

        // Completed Shoots
        completedShoots.forEach(s => {
            list.push({
                id: s.id,
                compositeId: `shoot-${s.id}`,
                type: 'shoot',
                completed: true,
                date: s.shoot_date,
                time: utcToLocalDisplay(s.shoot_date, s.shoot_time),
                brandName: s.brand_name || 'Untitled Brand',
                campaign: s.name || s.campaign || '',
                locationOrPlatform: s.location || '',
                notes: s.notes || '',
                rating: s.rating || null,
                reviewGenerated: s.review_generated || false,
                reviewId: s.review_id || '',
                completedAt: s.completed_at || null,
                statusLabel: 'Completed'
            });
        });

        // Completed Uploads
        completedUploads.forEach(u => {
            list.push({
                id: u.id,
                compositeId: `upload-${u.id}`,
                type: 'upload',
                completed: true,
                date: u.upload_date,
                time: utcToLocalDisplay(u.upload_date, u.upload_time),
                brandName: u.brand_name || 'Untitled Brand',
                campaign: u.name || u.campaign || '',
                locationOrPlatform: u.platform || '',
                notes: u.notes || '',
                rating: null,
                completedAt: u.completed_at || null,
                statusLabel: 'Completed'
            });
        });

        // Active Shoots (Today, Upcoming, or Delayed)
        activeShoots.forEach(s => {
            const dateVal = s.shoot_date;
            let statusLabel = 'Upcoming';
            if (dateVal < todayStr) statusLabel = 'Delayed';
            else if (dateVal === todayStr) statusLabel = 'Today';

            list.push({
                id: s.id,
                compositeId: `shoot-${s.id}`,
                type: 'shoot',
                completed: false,
                date: dateVal,
                time: utcToLocalDisplay(s.shoot_date, s.shoot_time),
                brandName: s.brand_name || 'Untitled Brand',
                campaign: s.name || s.campaign || '',
                locationOrPlatform: s.location || '',
                notes: s.notes || '',
                statusLabel
            });
        });

        // Active Uploads
        activeUploads.forEach(u => {
            const dateVal = u.upload_date;
            let statusLabel = 'Upcoming';
            if (dateVal < todayStr) statusLabel = 'Delayed';
            else if (dateVal === todayStr) statusLabel = 'Today';

            list.push({
                id: u.id,
                compositeId: `upload-${u.id}`,
                type: 'upload',
                completed: false,
                date: dateVal,
                time: utcToLocalDisplay(u.upload_date, u.upload_time),
                brandName: u.brand_name || 'Untitled Brand',
                campaign: u.name || u.campaign || '',
                locationOrPlatform: u.platform || '',
                notes: u.notes || '',
                statusLabel
            });
        });

        return list;
    };

    const allTasks = normalizeTasks();

    // Helper counts for Stats Overview (based on normal tasks before text filters)
    const countStats = {
        active: allTasks.filter(t => !t.completed && (t.statusLabel === 'Today' || t.statusLabel === 'Upcoming')).length,
        delayed: allTasks.filter(t => !t.completed && t.statusLabel === 'Delayed').length,
        completed: allTasks.filter(t => t.completed).length,
    };

    // Filter Logic
    const getFilteredTasks = () => {
        let list = allTasks;

        // 1. Status Filter
        if (statusFilter === 'today') {
            list = list.filter(t => !t.completed && t.statusLabel === 'Today');
        } else if (statusFilter === 'upcoming') {
            list = list.filter(t => !t.completed && t.statusLabel === 'Upcoming');
        } else if (statusFilter === 'delayed') {
            list = list.filter(t => !t.completed && t.statusLabel === 'Delayed');
        } else if (statusFilter === 'completed') {
            list = list.filter(t => t.completed);
        }

        // 2. Type Filter
        if (typeFilter !== 'all') {
            list = list.filter(t => t.type === typeFilter.slice(0, -1)); // convert shoots -> shoot, uploads -> upload
        }

        // 3. Date Picker Filter
        if (dateFilter) {
            list = list.filter(t => t.date === dateFilter);
        }

        // 4. Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            list = list.filter(t =>
                t.brandName.toLowerCase().includes(query) ||
                t.campaign.toLowerCase().includes(query) ||
                t.locationOrPlatform.toLowerCase().includes(query) ||
                t.notes.toLowerCase().includes(query)
            );
        }

        // Sort by Date, then Time
        return list.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.time.localeCompare(b.time);
        });
    };

    const filteredTasks = getFilteredTasks();

    // Mark complete handler
    const handleMarkComplete = async (itemId, itemType) => {
        try {
            if (itemType === 'shoot') {
                await api.put(`/api/shoots/${itemId}`, { completed: true });
            } else {
                await api.put(`/api/uploads/${itemId}`, { completed: true });
            }
            setSuccessAlert({ isOpen: true, message: 'Task marked as completed successfully!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to update task state.' });
        }
    };

    // Reschedule triggers
    const triggerReschedule = (task) => {
        // RescheduleModal requires normalized event format
        const mockEvent = {
            id: task.id,
            brandName: task.brandName,
            campaign: task.campaign,
            date: task.date,
            time: task.time,
        };
        setRescheduleModal({ isOpen: true, event: mockEvent, eventType: task.type });
    };

    const handleCloseRescheduleModal = () => {
        setRescheduleModal({ isOpen: false, event: null, eventType: null });
    };

    const handleRescheduleConfirm = async (rescheduleData) => {
        if (!rescheduleModal.event || !rescheduleData) {
            handleCloseRescheduleModal();
            return;
        }

        try {
            const eventId = rescheduleModal.event.id;
            if (rescheduleModal.eventType === 'shoot') {
                await api.put(`/api/shoots/${eventId}`, {
                    shoot_date: rescheduleData.date,
                    shoot_time: rescheduleData.time || null,
                });
            } else {
                await api.put(`/api/uploads/${eventId}`, {
                    upload_date: rescheduleData.date,
                    upload_time: rescheduleData.time || null,
                });
            }

            setSuccessAlert({ isOpen: true, message: 'Task rescheduled successfully!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to reschedule event.' });
        }
        handleCloseRescheduleModal();
    };

    // Delete triggers
    const triggerDelete = (itemId, itemType) => {
        setDeleteConfirm({ isOpen: true, itemId, itemType });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.itemId) {
            setDeleteConfirm({ isOpen: false, itemId: null, itemType: null });
            return;
        }

        try {
            if (deleteConfirm.itemType === 'shoot') {
                await api.delete(`/api/shoots/${deleteConfirm.itemId}`);
            } else {
                await api.delete(`/api/uploads/${deleteConfirm.itemId}`);
            }

            setSuccessAlert({ isOpen: true, message: 'Task deleted successfully!' });
            setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
            fetchData(true);
        } catch (err) {
            setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to delete task.' });
        }
        setDeleteConfirm({ isOpen: false, itemId: null, itemType: null });
    };

    // Modal triggers
    const openDetailsModal = (task) => {
        setSelectedItem(task);
    };

    const closeDetailsModal = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setSelectedItem(null);
            setIsModalClosing(false);
        }, 300);
    };

    const getStatusStyle = (statusLabel) => {
        switch (statusLabel) {
            case 'Completed':
                return {
                    border: 'border-l-green-500',
                    badge: 'success',
                    bg: 'bg-green-50/50 hover:bg-green-50',
                };
            case 'Delayed':
                return {
                    border: 'border-l-red-500 animate-pulse',
                    badge: 'error',
                    bg: 'bg-red-50/40 hover:bg-red-50/60',
                };
            case 'Today':
                return {
                    border: 'border-l-primary-orange',
                    badge: 'warning',
                    bg: 'bg-orange-50/40 hover:bg-orange-50/60',
                };
            default: // Upcoming
                return {
                    border: 'border-l-blue-400',
                    badge: 'info',
                    bg: 'bg-white hover:bg-gray-50/50',
                };
        }
    };

    const formatDateNice = (dateStr) => {
        if (!dateStr) return '';
        try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) return dateStr;
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading Work Tracker data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-2">Error Loading Data</p>
                    <p className="text-gray-600 text-sm mb-4">{typeof error === 'string' ? error : 'Something went wrong.'}</p>
                    <Button onClick={() => fetchData()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-deep-black to-gray-800 rounded-3xl p-6 md:p-8 text-white shadow-xl">
                {/* Background patterns */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-primary-orange border border-white/10 uppercase">
                            <Sparkles size={12} className="animate-pulse" />
                            <span>Operations Console</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bebas tracking-wide mt-1">Work Tracker</h1>
                        <p className="text-gray-300 text-sm max-w-2xl font-light">
                            Consolidated view of your scheduled shoots and content uploads with real-time status tracking.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => fetchData(false)}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/10 font-semibold rounded-xl px-5 py-2.5 backdrop-blur-sm self-start md:self-center hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                    >
                        <RefreshCw size={14} />
                        <span>Refresh</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Overview Stack */}
            {/* Mobile View: Single Row Banner/Strap */}
            <Card className="block sm:hidden p-2.5 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex items-center justify-between divide-x divide-gray-100 text-center">
                    {/* Active */}
                    <div className="flex-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none">Active</span>
                        <span className="text-base font-bold text-blue-500 mt-1 block leading-none">{countStats.active}</span>
                    </div>

                    {/* Delayed */}
                    <div className="flex-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none">Delayed</span>
                        <span className={`text-base font-bold mt-1 block leading-none ${countStats.delayed > 0 ? 'text-red-600' : 'text-gray-400'}`}>{countStats.delayed}</span>
                    </div>

                    {/* Completed */}
                    <div className="flex-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none">Completed</span>
                        <span className="text-base font-bold text-green-600 mt-1 block leading-none">{countStats.completed}</span>
                    </div>
                </div>
            </Card>

            {/* Desktop View: Three Grid Cards */}
            <div className="hidden sm:grid grid-cols-3 gap-6">
                <Card className="p-5 border-l-4 border-l-blue-400 bg-white shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Today & Upcoming</p>
                        <h3 className="text-3xl font-bold font-bebas text-deep-black mt-1">{countStats.active}</h3>
                        <p className="text-xs text-gray-400 mt-1">Confirmed schedule slots</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                        <Video size={24} />
                    </div>
                </Card>

                <Card className={`p-5 border-l-4 bg-white shadow-sm flex items-center justify-between transition-colors ${countStats.delayed > 0 ? 'border-l-red-500 bg-red-50/20' : 'border-l-gray-300'}`}>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delayed / Overdue</p>
                        <h3 className={`text-3xl font-bold font-bebas mt-1 ${countStats.delayed > 0 ? 'text-red-600' : 'text-deep-black'}`}>{countStats.delayed}</h3>
                        <p className="text-xs text-gray-400 mt-1">{countStats.delayed > 0 ? 'Action required immediately' : 'Everything on track'}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${countStats.delayed > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                        <AlertTriangle size={24} />
                    </div>
                </Card>

                <Card className="p-5 border-l-4 border-l-green-500 bg-white shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed History</p>
                        <h3 className="text-3xl font-bold font-bebas text-green-600 mt-1">{countStats.completed}</h3>
                        <p className="text-xs text-gray-400 mt-1">Tasks fully processed</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <CheckCircle size={24} />
                    </div>
                </Card>
            </div>

            {/* Filter Deck */}
            <Card className="p-3 sm:p-5 bg-white border border-gray-100 shadow-sm space-y-3 sm:space-y-4">
                {/* Mobile View: Select Dropdowns (Compact side-by-side) */}
                <div className="flex sm:hidden gap-2">
                    {/* Status Dropdown */}
                    <div className="flex-1 relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent text-gray-700 h-9"
                        >
                            <option value="all">All Statuses</option>
                            <option value="today">Today</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="delayed">Delayed {countStats.delayed > 0 ? `(${countStats.delayed})` : ''}</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Type Dropdown */}
                    <div className="flex-1 relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent text-gray-700 h-9"
                        >
                            <option value="all">All Types</option>
                            <option value="shoots">Shoots</option>
                            <option value="uploads">Uploads</option>
                        </select>
                    </div>
                </div>

                {/* Desktop View: Tab Buttons */}
                <div className="hidden sm:flex flex-row items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex gap-1.5 p-1 bg-gray-50 rounded-xl">
                        {[
                            { id: 'all', label: 'All Statuses' },
                            { id: 'today', label: 'Today' },
                            { id: 'upcoming', label: 'Upcoming' },
                            { id: 'delayed', label: `Delayed${countStats.delayed > 0 ? ` (${countStats.delayed})` : ''}` },
                            { id: 'completed', label: 'Completed' }
                        ].map((stat) => (
                            <button
                                key={stat.id}
                                onClick={() => setStatusFilter(stat.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === stat.id
                                    ? 'bg-white text-primary-orange shadow-sm font-bold'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
                                    }`}
                            >
                                {stat.label}
                            </button>
                        ))}
                    </div>

                    {/* Type Filters */}
                    <div className="flex items-center gap-1.5">
                        {[
                            { id: 'all', label: 'All Types' },
                            { id: 'shoots', label: 'Shoots' },
                            { id: 'uploads', label: 'Uploads' }
                        ].map((tp) => (
                            <button
                                key={tp.id}
                                onClick={() => setTypeFilter(tp.id)}
                                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${typeFilter === tp.id
                                    ? 'bg-deep-black text-white border-deep-black shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {tp.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Date Picker (Stacked on mobile, side-by-side on desktop) */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1 w-full items-center">
                    {/* Search query input */}
                    <div className="relative w-full sm:flex-[1.8] min-w-0 h-9">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 border border-gray-250 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent bg-gray-50/50 focus:bg-white transition-colors h-full"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Calendar Filter */}
                    <div className="relative w-full sm:flex-[1.2] min-w-0 h-9">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-8 pr-8 py-2 border border-gray-250 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent bg-gray-50/50 focus:bg-white text-gray-600 h-full"
                        />
                        {dateFilter && (
                            <button
                                onClick={() => setDateFilter('')}
                                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* List Results */}
            <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredTasks.map((task) => {
                            const styles = getStatusStyle(task.statusLabel);

                            return (
                                <Card
                                    key={task.compositeId}
                                    className={`p-4 sm:p-6 border-l-4 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 ${styles.border} ${styles.bg}`}
                                    onClick={() => openDetailsModal(task)}
                                >
                                    <div>
                                        {/* Card Header Row */}
                                        <div className="flex items-start justify-between mb-3 gap-2">
                                            <div className="flex items-start gap-2.5 sm:gap-3">
                                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center ${task.type === 'shoot' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {task.type === 'shoot' ? <Video size={16} className="sm:hidden" /> : <Upload size={16} className="sm:hidden" />}
                                                    {task.type === 'shoot' ? <Video size={20} className="hidden sm:block" /> : <Upload size={20} className="hidden sm:block" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-deep-black text-sm sm:text-base uppercase tracking-wide leading-tight">{task.brandName}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">{task.campaign}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-end gap-1 sm:gap-1.5">
                                                    <Badge variant={styles.badge} className="uppercase text-[9px] sm:text-[10px] font-bold">
                                                        {task.statusLabel}
                                                    </Badge>
                                                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${task.type === 'shoot' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                                        {task.type === 'shoot' ? 'Shoot' : 'Upload'}
                                                    </span>
                                                </div>
                                                <div className="p-1 rounded-lg text-gray-400 hover:text-primary-orange hover:bg-orange-50 transition-colors">
                                                    <Info size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Specific Info */}
                                        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-3 text-xs sm:text-sm mt-3 sm:mt-4 border-t border-gray-100 pt-3 text-gray-600">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <CalendarIcon size={14} className="text-gray-400" />
                                                <span>{formatDateNice(task.date)}</span>
                                                {task.time && (
                                                    <>
                                                        <span className="text-gray-300 hidden sm:inline">•</span>
                                                        <Clock size={14} className="text-gray-400 sm:hidden ml-1" />
                                                        <Clock size={14} className="text-gray-400 hidden sm:inline" />
                                                        <span>{task.time}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:col-span-2">
                                                {task.type === 'shoot' ? (
                                                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                ) : (
                                                    <Upload size={14} className="text-gray-400 flex-shrink-0" />
                                                )}
                                                <span className="truncate">
                                                    <span className="hidden sm:inline">{task.type === 'shoot' ? 'Location: ' : 'Platform: '}</span>
                                                    <strong className="text-deep-black font-semibold">{task.locationOrPlatform}</strong>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Notes Callout - hidden on mobile to make the card smaller */}
                                        {task.notes && (
                                            <div className="hidden sm:block p-3 bg-white/70 border border-gray-100 rounded-lg mt-4 text-xs text-gray-600">
                                                <p className="font-semibold text-deep-black mb-1 uppercase tracking-wider text-[9px]">Important Notes:</p>
                                                <p className="italic line-clamp-2">{task.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footers */}
                                    {(!task.completed || (task.type === 'shoot' && task.reviewGenerated)) && (
                                        <div className="flex gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100/60">
                                            {!task.completed ? (
                                                <div className="flex w-full gap-2 items-center justify-between">
                                                    {/* Actions: reschedule & delete */}
                                                    <div className="flex gap-1.5">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-3 h-8 text-[11px] sm:text-xs font-semibold"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                triggerReschedule(task);
                                                            }}
                                                        >
                                                            Reschedule
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-500 hover:bg-red-50 hover:border-red-500 border-gray-200 px-2.5 h-8"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                triggerDelete(task.id, task.type);
                                                            }}
                                                        >
                                                            <Trash2 size={13} />
                                                        </Button>
                                                    </div>
                                                    {/* Right side primary action: Mark Done */}
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-8 text-[11px] sm:text-xs font-semibold px-3.5 flex-1 sm:flex-none whitespace-nowrap"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkComplete(task.id, task.type);
                                                        }}
                                                    >
                                                        Mark Done
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex w-full items-center justify-between gap-2">
                                                    {task.type === 'shoot' && task.reviewGenerated && (
                                                        <Badge variant="success" className="text-[9px] font-bold py-0.5 px-2">
                                                            Review Active
                                                        </Badge>
                                                    )}
                                                    <span className="text-[10px] text-gray-400 italic">Click card to view details</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="p-16 text-center border border-gray-150 bg-white">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No tracker events found</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            {searchQuery || dateFilter
                                ? 'No shoots or uploads match your current search query or date constraints.'
                                : 'There are no items recorded in this category.'}
                        </p>
                        {(searchQuery || dateFilter || statusFilter !== 'all' || typeFilter !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setDateFilter('');
                                    setStatusFilter('all');
                                    setTypeFilter('all');
                                }}
                                className="mt-4"
                            >
                                Reset Filters
                            </Button>
                        )}
                    </Card>
                )}
            </div>

            {/* Task Details Modal (Overlay Portal) */}
            {selectedItem && createPortal(
                <div
                    className={`fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 ${isModalClosing ? 'animate-backdrop-exit' : 'animate-fadeIn'}`}
                    style={{ backdropFilter: 'blur(4px)' }}
                    onClick={closeDetailsModal}
                >
                    <Card
                        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${isModalClosing ? 'animate-popup-exit' : 'animate-scaleIn'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${selectedItem.type === 'shoot' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {selectedItem.type === 'shoot' ? <Video size={28} /> : <Upload size={28} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold font-bebas text-deep-black tracking-wide leading-tight">
                                            {selectedItem.brandName}
                                        </h2>
                                        <p className="text-gray-500 text-sm font-medium">{selectedItem.campaign}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant={getStatusStyle(selectedItem.statusLabel).badge} className="uppercase text-[9px] font-bold">
                                                {selectedItem.statusLabel}
                                            </Badge>
                                            <Badge variant="secondary" className="uppercase text-[9px] font-bold">
                                                {selectedItem.type === 'shoot' ? 'Shoot' : 'Upload'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={closeDetailsModal}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Details Matrix */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
                                        <p className="text-[10px] font-bold text-primary-orange uppercase tracking-wider mb-1">Scheduled Date</p>
                                        <p className="text-base font-semibold text-deep-black">
                                            {formatDateNice(selectedItem.date)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
                                        <p className="text-[10px] font-bold text-primary-orange uppercase tracking-wider mb-1">Scheduled Time</p>
                                        <p className="text-base font-semibold text-deep-black">
                                            {selectedItem.time || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Location or Platform Info */}
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                        {selectedItem.type === 'shoot' ? 'Location Address' : 'Platform Destination'}
                                    </p>
                                    <p className="text-base font-semibold text-deep-black">
                                        {selectedItem.locationOrPlatform || 'Not specified'}
                                    </p>
                                </div>

                                {/* Completed Time Info */}
                                {selectedItem.completed && selectedItem.completedAt && (
                                    <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Completion Record</p>
                                        <p className="text-sm text-deep-black font-semibold">
                                            Completed at: {new Date(selectedItem.completedAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {/* Notes Block */}
                                {selectedItem.notes && (
                                    <div className="p-4 bg-orange-50/30 border border-orange-200/80 rounded-xl">
                                        <p className="text-[10px] font-bold text-primary-orange uppercase tracking-wider mb-1.5">Actionable Instructions</p>
                                        <p className="text-sm text-gray-700 leading-relaxed font-sans">{selectedItem.notes}</p>
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                                    {!selectedItem.completed ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="flex-1 font-semibold text-sm"
                                                onClick={() => {
                                                    triggerReschedule(selectedItem);
                                                    closeDetailsModal();
                                                }}
                                            >
                                                Reschedule Slot
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="flex-1 font-semibold text-sm"
                                                onClick={() => {
                                                    handleMarkComplete(selectedItem.id, selectedItem.type);
                                                    closeDetailsModal();
                                                }}
                                            >
                                                Mark as Completed
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full font-semibold text-sm"
                                            onClick={closeDetailsModal}
                                        >
                                            Close Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>,
                document.body
            )}

            {/* Reschedule Modal Overlay Portal */}
            {createPortal(
                <RescheduleModal
                    isOpen={rescheduleModal.isOpen}
                    event={rescheduleModal.event}
                    onClose={handleCloseRescheduleModal}
                    onConfirm={handleRescheduleConfirm}
                />,
                document.body
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Item"
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null, itemType: null })}
                onClose={() => setDeleteConfirm({ isOpen: false, itemId: null, itemType: null })}
            />

            {/* Success Notification Alert */}
            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />

            {/* Error Notification Alert */}
            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default Schedule;
