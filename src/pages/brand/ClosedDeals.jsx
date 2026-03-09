import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SuccessAlert from '../../components/ui/SuccessAlert';
import { Download, Search, Calendar, DollarSign, Instagram, Youtube, Facebook, FileText } from 'lucide-react';

const ClosedDeals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // 'all' or 'thisMonth'
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });

    // Mock data for closed deals
    const closedDeals = [
        // Current Month Deals (November 2025)
        {
            id: 1,
            influencerName: "Sarah Jenkins",
            influencerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            platforms: ["instagram", "youtube"], // Multiple platforms
            bookingDate: "2025-11-05",
            shootDate: "2025-11-12",
            uploadDate: "2025-11-15",
            price: "$1,500",
            invoiceId: "INV-2025-011",
            status: "Completed"
        },
        {
            id: 2,
            influencerName: "TechReview Pro",
            influencerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
            platforms: ["youtube"],
            bookingDate: "2025-11-01",
            shootDate: "2025-11-08",
            uploadDate: "2025-11-10",
            price: "$3,200",
            invoiceId: "INV-2025-012",
            status: "Completed"
        },
        {
            id: 3,
            influencerName: "Elena Cooks",
            influencerImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
            platforms: ["instagram", "youtube", "facebook"], // All 3 platforms
            bookingDate: "2025-11-10",
            shootDate: "2025-11-17",
            uploadDate: "2025-11-20",
            price: "$2,100",
            invoiceId: "INV-2025-013",
            status: "Completed"
        },
        // Previous Months Deals
        {
            id: 4,
            influencerName: "Sarah Jenkins",
            influencerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            platforms: ["instagram"],
            bookingDate: "2024-10-15",
            shootDate: "2024-10-22",
            uploadDate: "2024-10-25",
            price: "$1,500",
            invoiceId: "INV-2024-001",
            status: "Completed"
        },
        {
            id: 5,
            influencerName: "TechReview Pro",
            influencerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
            platforms: ["youtube", "facebook"],
            bookingDate: "2024-09-20",
            shootDate: "2024-09-28",
            uploadDate: "2024-10-02",
            price: "$3,200",
            invoiceId: "INV-2024-002",
            status: "Completed"
        },
        {
            id: 6,
            influencerName: "Fitness Mike",
            influencerImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
            platforms: ["instagram"],
            bookingDate: "2024-09-10",
            shootDate: "2024-09-18",
            uploadDate: "2024-09-20",
            price: "$800",
            invoiceId: "INV-2024-003",
            status: "Completed"
        },
        {
            id: 7,
            influencerName: "Elena Cooks",
            influencerImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
            platforms: ["facebook"],
            bookingDate: "2024-08-25",
            shootDate: "2024-09-05",
            uploadDate: "2024-09-08",
            price: "$2,100",
            invoiceId: "INV-2024-004",
            status: "Completed"
        },
        {
            id: 8,
            influencerName: "Fitness Mike",
            influencerImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200",
            platforms: ["youtube", "instagram"],
            bookingDate: "2024-08-10",
            shootDate: "2024-08-20",
            uploadDate: "2024-08-23",
            price: "$1,800",
            invoiceId: "INV-2024-005",
            status: "Completed"
        }
    ];

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'instagram':
                return <Instagram size={16} className="text-pink-600" />;
            case 'youtube':
                return <Youtube size={16} className="text-red-600" />;
            case 'facebook':
                return <Facebook size={16} className="text-blue-600" />;
            default:
                return null;
        }
    };

    const getPlatformBadge = (platform) => {
        const colors = {
            instagram: 'bg-pink-100 text-pink-700',
            youtube: 'bg-red-100 text-red-700',
            facebook: 'bg-blue-100 text-blue-700'
        };
        return colors[platform] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Calculate this month's deals and spending
    const getCurrentMonthDeals = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return closedDeals.filter(deal => {
            const uploadDate = new Date(deal.uploadDate);
            return uploadDate.getMonth() === currentMonth && uploadDate.getFullYear() === currentYear;
        });
    };

    const thisMonthDeals = getCurrentMonthDeals();
    const thisMonthSpent = thisMonthDeals.reduce((total, deal) => {
        const price = parseFloat(deal.price.replace(/[$,]/g, ''));
        return total + price;
    }, 0);

    const totalSpent = closedDeals.reduce((total, deal) => {
        const price = parseFloat(deal.price.replace(/[$,]/g, ''));
        return total + price;
    }, 0);

    const filteredDeals = closedDeals.filter(deal => {
        // Search filter
        const matchesSearch = deal.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deal.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());

        // Date filter
        if (dateFilter === 'thisMonth') {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const uploadDate = new Date(deal.uploadDate);
            const matchesDate = uploadDate.getMonth() === currentMonth && uploadDate.getFullYear() === currentYear;
            return matchesSearch && matchesDate;
        }

        return matchesSearch;
    });


    return (
        <div className="space-y-6">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Previously Closed Deals</h1>
                <p className="text-gray-600 text-sm mt-1">View all your completed collaborations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Deals</p>
                            <p className="text-2xl font-bold text-deep-black mt-1">{closedDeals.length}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <FileText size={24} className="text-primary-orange" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="text-2xl font-bold text-deep-black mt-1">${totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign size={24} className="text-success-green" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">This Month Deals</p>
                            <p className="text-2xl font-bold text-deep-black mt-1">{thisMonthDeals.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Calendar size={24} className="text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">This Month Spent</p>
                            <p className="text-2xl font-bold text-deep-black mt-1">${thisMonthSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <DollarSign size={24} className="text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Filter Buttons */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setDateFilter('all')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${dateFilter === 'all'
                            ? 'bg-white text-primary-orange shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All Deals
                    </button>
                    <button
                        onClick={() => setDateFilter('thisMonth')}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${dateFilter === 'thisMonth'
                            ? 'bg-white text-primary-orange shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        This Month
                    </button>
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:flex-none sm:w-64">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-orange outline-none"
                    />
                </div>
            </div>

            {/* Deals Table - Desktop */}
            <Card className="overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px] whitespace-nowrap">Influencer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] whitespace-nowrap">Platform</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px] whitespace-nowrap">Booking Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Shoot Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px] whitespace-nowrap">Upload Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] whitespace-nowrap">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px] whitespace-nowrap">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDeals.map((deal) => (
                                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={deal.influencerImage}
                                                alt={deal.influencerName}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-deep-black">{deal.influencerName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {deal.platforms.map((platform, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-2 rounded-full ${platform === 'instagram' ? 'bg-pink-100' :
                                                        platform === 'youtube' ? 'bg-red-100' :
                                                            'bg-blue-100'
                                                        }`}
                                                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                >
                                                    {getPlatformIcon(platform)}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(deal.bookingDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(deal.shootDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(deal.uploadDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-success-green">{deal.price}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-gray-700">{deal.invoiceId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-2 text-sm"
                                            onClick={() => {
                                                setSuccessAlert({ isOpen: true, message: `Downloading invoice ${deal.invoiceId}` });
                                                setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                                            }}
                                        >
                                            <Download size={16} />
                                            Invoice
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDeals.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No deals found matching your search.</p>
                    </div>
                )}
            </Card>

            {/* Deals Cards - Mobile */}
            <div className="md:hidden space-y-4">
                {filteredDeals.map((deal) => (
                    <Card key={deal.id} className="p-4">
                        <div className="space-y-3">
                            {/* Header with influencer info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={deal.influencerImage}
                                        alt={deal.influencerName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-medium text-deep-black">{deal.influencerName}</p>
                                        <p className="text-xs text-gray-500">{deal.invoiceId}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-success-green">{deal.price}</span>
                            </div>

                            {/* Platforms */}
                            <div className="flex items-center gap-2">
                                {deal.platforms.map((platform, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-full ${platform === 'instagram' ? 'bg-pink-100' :
                                            platform === 'youtube' ? 'bg-red-100' :
                                                'bg-blue-100'
                                            }`}
                                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    >
                                        {getPlatformIcon(platform)}
                                    </div>
                                ))}
                            </div>

                            {/* Dates Grid */}
                            <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Booking</p>
                                    <p className="text-sm font-medium text-gray-700">{formatDate(deal.bookingDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Shoot</p>
                                    <p className="text-sm font-medium text-gray-700">{formatDate(deal.shootDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Upload</p>
                                    <p className="text-sm font-medium text-gray-700">{formatDate(deal.uploadDate)}</p>
                                </div>
                            </div>

                            {/* Download Button */}
                            <Button
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => {
                                    setSuccessAlert({ isOpen: true, message: `Downloading invoice ${deal.invoiceId}` });
                                    setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                                }}
                            >
                                <Download size={16} />
                                Download Invoice
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredDeals.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No deals found matching your search.</p>
                    </div>
                )}
            </div>

            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default ClosedDeals;
