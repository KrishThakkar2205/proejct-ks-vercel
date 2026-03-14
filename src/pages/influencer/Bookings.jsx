import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import SuccessAlert from '../../components/ui/SuccessAlert';
import { MOCK_INFLUENCER_DATA } from '../../data/mockData';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('booked');
    const [searchQuery, setSearchQuery] = useState('');
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const { bookings } = MOCK_INFLUENCER_DATA;

    const filterBookings = () => {
        let filtered = bookings;

        // Get today's date string
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Filter by tab - only show today's bookings
        if (activeTab === 'booked') {
            filtered = filtered.filter(b =>
                b.shootDate === todayStr &&
                (b.status === 'confirmed' || b.status === 'pending')
            );
        } else if (activeTab === 'completed') {
            filtered = filtered.filter(b =>
                b.shootDate === todayStr &&
                b.status === 'completed'
            );
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(b =>
                b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.campaign.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => new Date(b.shootDate) - new Date(a.shootDate));
    };

    // Get today's bookings
    const getTodaysBookings = () => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        return bookings.filter(b =>
            b.shootDate === todayStr &&
            (b.status === 'confirmed' || b.status === 'pending')
        );
    };

    const filteredBookings = filterBookings();
    const todaysBookings = getTodaysBookings();

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'completed': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const handleAskForReview = (bookingId) => {
        // In a real app, this would send a request to the backend
        setSuccessAlert({ isOpen: true, message: 'Review request sent to brand!' });
    };

    return (
        <div className="space-y-8">


            {/* Today's Shoots Section */}
            {todaysBookings.length > 0 && (
                <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-primary-orange">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="text-xl font-bebas tracking-wide font-bold text-deep-black">Today's Shoots</h2>
                        </div>
                        <Badge variant="error" className="animate-pulse">Live</Badge>
                    </div>
                    <div className="space-y-4">
                        {todaysBookings.map((booking) => (
                            <Card key={booking.id} className="p-4 bg-white border-l-4 border-primary-orange">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-deep-black">{booking.brandName}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{booking.campaign}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(booking.status)} className="self-start sm:self-auto">
                                        {booking.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-orange">
                                        <Clock size={16} />
                                        {booking.shootTime}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        {booking.location}
                                    </div>
                                </div>
                                {booking.notes && (
                                    <div className="p-3 bg-orange-50 rounded-lg mb-3 border border-orange-200">
                                        <p className="text-xs text-primary-orange font-semibold mb-1">Important Notes:</p>
                                        <p className="text-sm text-gray-700">{booking.notes}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </Card>
            )}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {['booked', 'completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {tab === 'booked' ? "Today's Booked Deals" : "Today's Completed Deals"}
                    </button>
                ))}
            </div>

            {/* Search */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by brand or campaign..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    />
                </div>
            </Card>

            {/* Bookings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} className="p-6 hover:border-orange-300 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-deep-black">{booking.brandName}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{booking.campaign}</p>
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(booking.status)} className="self-start sm:self-auto">
                                    {booking.status}
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} className="text-gray-400" />
                                    {new Date(booking.shootDate).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock size={16} className="text-gray-400" />
                                    {booking.shootTime}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={16} className="text-gray-400" />
                                    {booking.location}
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Notes:</p>
                                    <p className="text-sm text-gray-700">{booking.notes}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="secondary" size="sm" className="flex-1 w-full sm:w-auto">
                                    View Details
                                </Button>

                                {activeTab === 'completed' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 w-full sm:w-auto border-primary-orange text-primary-orange hover:bg-orange-50"
                                        onClick={() => handleAskForReview(booking.id)}
                                    >
                                        Ask for Review
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full p-12 text-center">
                        <div className="text-gray-400 mb-2">
                            <Calendar size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">No bookings found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? 'Try adjusting your search' : `No ${activeTab === 'booked' ? 'booked' : 'completed'} deals for today`}
                        </p>
                    </Card>
                )}
            </div>

            {/* Success Alert */}
            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default Bookings;
