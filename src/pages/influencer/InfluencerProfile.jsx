import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Instagram, Facebook, Youtube, MapPin, Mail, Camera, Edit2, Check, X } from 'lucide-react';
import { MOCK_INFLUENCER_DATA } from '../../data/mockData';

const InfluencerProfile = () => {
    const { profile, socialMedia } = MOCK_INFLUENCER_DATA;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);

    const categories = [
        'Fashion',
        'Beauty & Makeup',
        'Lifestyle',
        'Fitness & Wellness',
        'Food & Cooking',
        'Travel',
        'Technology',
        'Gaming',
        'Education',
        'Entertainment',
        'Sports',
        'Music',
        'Art & Design',
        'Business',
        'Parenting',
        'Home & Decor',
        'Photography',
        'Sustainability'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryToggle = (category) => {
        const newCategories = formData.categories.includes(category)
            ? formData.categories.filter(c => c !== category)
            : [...formData.categories, category];
        setFormData({ ...formData, categories: newCategories });
    };

    const handleSave = () => {
        // In production, this would save to backend
        console.log('Saving profile:', formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Header - Mobile Only */}
            <div className="md:hidden">
                <h1 className="text-3xl font-bebas tracking-wide text-deep-black">Profile</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your profile and social connections</p>
            </div>

            {/* Share Portfolio - Mobile Only (Top Position) */}
            <div className="md:hidden">
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-primary-orange">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-deep-black">Share Your Portfolio</h3>
                        <Badge className="bg-primary-orange text-white">New</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Share your public portfolio with brands and potential collaborators
                    </p>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={`${window.location.origin}/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                            readOnly
                            className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white overflow-x-auto"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    const link = `${window.location.origin}/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
                                    navigator.clipboard.writeText(link);
                                    alert('Portfolio link copied to clipboard!');
                                }}
                                className="flex-1"
                            >
                                Copy Link
                            </Button>
                            <Link
                                to={`/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button
                                    variant="white"
                                    size="sm"
                                    className="w-full border-primary-orange text-primary-orange hover:bg-orange-50"
                                >
                                    View
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <h2 className="text-xl font-bebas tracking-wide font-bold text-deep-black">Basic Information</h2>
                            {!isEditing ? (
                                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="whitespace-nowrap">
                                    <Edit2 size={16} className="mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="primary" size="sm" onClick={handleSave} className="whitespace-nowrap">
                                        <Check size={16} className="mr-2" />
                                        Save
                                    </Button>
                                    <Button variant="white" size="sm" onClick={handleCancel} className="whitespace-nowrap">
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-primary-orange text-3xl font-bold flex-shrink-0 mx-auto sm:mx-0">
                                {formData.name.charAt(0)}
                            </div>
                            {isEditing && (
                                <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                                    <Button variant="white" size="sm" className="w-full sm:w-auto">
                                        <Camera size={16} className="mr-2" />
                                        Change Photo
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={true}
                                helperText="Email cannot be changed"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="9876543210"
                                maxLength="10"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>

                            <Input
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                                icon={<MapPin size={16} />}
                            />
                        </div>
                    </Card>

                    {/* Categories */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bebas tracking-wide font-bold text-deep-black mb-4">Categories</h2>
                        <p className="text-sm text-gray-600 mb-4">Select the categories that best describe your content</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => isEditing && handleCategoryToggle(category)}
                                    disabled={!isEditing}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.categories.includes(category)
                                        ? 'bg-primary-orange text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Budget Range */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bebas tracking-wide font-bold text-deep-black mb-4">Budget Range</h2>
                        <p className="text-sm text-gray-600 mb-4">Set your preferred collaboration budget range</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Minimum Budget"
                                name="budgetMin"
                                type="number"
                                value={formData.budgetRange.min}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    budgetRange: { ...formData.budgetRange, min: parseInt(e.target.value) }
                                })}
                                disabled={!isEditing}
                                prefix="$"
                            />
                            <Input
                                label="Maximum Budget"
                                name="budgetMax"
                                type="number"
                                value={formData.budgetRange.max}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    budgetRange: { ...formData.budgetRange, max: parseInt(e.target.value) }
                                })}
                                disabled={!isEditing}
                                prefix="$"
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Share Portfolio - Desktop Only */}
                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-primary-orange hidden md:block">
                        <h3 className="font-semibold text-deep-black mb-3">Share Your Portfolio</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Share your public portfolio with brands and potential collaborators
                        </p>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={`${window.location.origin}/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                                readOnly
                                className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white overflow-x-auto"
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        const link = `${window.location.origin}/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`;
                                        navigator.clipboard.writeText(link);
                                        alert('Portfolio link copied to clipboard!');
                                    }}
                                    className="flex-1"
                                >
                                    Copy Link
                                </Button>
                                <Link
                                    to={`/portfolio/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <Button
                                        variant="white"
                                        size="sm"
                                        className="w-full border-primary-orange text-primary-orange hover:bg-orange-50"
                                    >
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    {/* Availability */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-deep-black mb-4">Availability Status</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Available for bookings</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                                    disabled={!isEditing}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
                            </label>
                        </div>
                    </Card>

                    {/* Social Media Connections */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-deep-black mb-4">Social Media</h3>
                        <div className="space-y-4">
                            {/* Instagram */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg gap-3">
                                <div className="flex items-center gap-3">
                                    <Instagram size={20} className="text-pink-600" />
                                    <div>
                                        <p className="text-sm font-medium text-deep-black">Instagram</p>
                                        {socialMedia.instagram.connected && (
                                            <p className="text-xs text-gray-600">{socialMedia.instagram.username}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={socialMedia.instagram.connected ? 'success' : 'default'} className="self-start sm:self-auto">
                                    {socialMedia.instagram.connected ? 'Connected' : 'Connect'}
                                </Badge>
                            </div>

                            {/* Facebook */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 rounded-lg gap-3">
                                <div className="flex items-center gap-3">
                                    <Facebook size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-deep-black">Facebook</p>
                                        {socialMedia.facebook.connected && (
                                            <p className="text-xs text-gray-600">{socialMedia.facebook.username}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={socialMedia.facebook.connected ? 'success' : 'default'} className="self-start sm:self-auto">
                                    {socialMedia.facebook.connected ? 'Connected' : 'Connect'}
                                </Badge>
                            </div>

                            {/* YouTube */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-50 rounded-lg gap-3">
                                <div className="flex items-center gap-3">
                                    <Youtube size={20} className="text-red-600" />
                                    <div>
                                        <p className="text-sm font-medium text-deep-black">YouTube</p>
                                        {socialMedia.youtube.connected && (
                                            <p className="text-xs text-gray-600">{socialMedia.youtube.username}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={socialMedia.youtube.connected ? 'success' : 'default'} className="self-start sm:self-auto">
                                    {socialMedia.youtube.connected ? 'Connected' : 'Connect'}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            Last synced: {new Date(socialMedia.instagram.lastSync).toLocaleString()}
                        </p>
                    </Card>

                    {/* Account Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-deep-black mb-4">Account Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Member since</p>
                                <p className="text-deep-black font-medium">
                                    {new Date(formData.joinedDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Account Type</p>
                                <p className="text-deep-black font-medium">Influencer</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InfluencerProfile;
