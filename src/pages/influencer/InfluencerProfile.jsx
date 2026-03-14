import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import SuccessAlert from '../../components/ui/SuccessAlert';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Instagram, MapPin, Mail, Camera, Edit2, Check, X, Loader2, LogOut } from 'lucide-react';
import api, { API_BASE_URL } from '../../utils/api';
import { logout, setCredentials } from '../../store/slices/authSlice';

const InfluencerProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [successAlert, setSuccessAlert] = useState({ isOpen: false, message: '' });
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });
    const fileInputRef = useRef(null);

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

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/api/profile');
                const data = response.data;

                // Map API response to component data structure
                const mapped = {
                    id: data.id || '',
                    name: data.name || '',
                    email: data.email_id || '',
                    phone: data.phone_number || '',
                    bio: data.bio || '',
                    location: data.location || '',
                    categories: data.categories || [],
                    budgetRange: {
                        min: data.min_price || 0,
                        max: data.max_price || 0,
                    },
                    availability: true,
                    joinedDate: data.created_at || new Date().toISOString(),
                    profilePicture: data.profile_picture_location ? `${API_BASE_URL}/${data.profile_picture_location}` : null,
                    instagram: data.instagram || false,
                };

                setProfileData(mapped);
                setFormData(mapped);
            } catch (err) {
                const message =
                    err.response?.data?.detail?.[0]?.msg ||
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    'Failed to load profile. Please try again.';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryToggle = (category) => {
        const newCategories = formData.categories.includes(category)
            ? formData.categories.filter(c => c !== category)
            : [...formData.categories, category];
        setFormData({ ...formData, categories: newCategories });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicturePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            const payload = new FormData();
            if (formData.name) payload.append('name', formData.name);
            if (formData.bio) payload.append('bio', formData.bio);
            if (formData.location) payload.append('location', formData.location);
            if (formData.budgetRange.min != null) payload.append('min_price', formData.budgetRange.min);
            if (formData.budgetRange.max != null) payload.append('max_price', formData.budgetRange.max);
            if (formData.categories && formData.categories.length > 0) {
                formData.categories.forEach((cat) => payload.append('categories', cat));
            }
            if (profilePictureFile) {
                payload.append('profile_picture', profilePictureFile);
            }

            await api.put('/api/profile', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Soft reload — re-fetch fresh profile data from server
            const freshResponse = await api.get('/api/profile');
            const data = freshResponse.data;
            const mapped = {
                id: data.id || '',
                name: data.name || '',
                email: data.email_id || '',
                phone: data.phone_number || '',
                bio: data.bio || '',
                location: data.location || '',
                categories: data.categories || [],
                budgetRange: {
                    min: data.min_price || 0,
                    max: data.max_price || 0,
                },
                availability: true,
                joinedDate: data.created_at || new Date().toISOString(),
                profilePicture: data.profile_picture_location ? `${API_BASE_URL}/${data.profile_picture_location}` : null,
                instagram: data.instagram || false,
            };

            setProfileData(mapped);
            setFormData(mapped);
            setProfilePictureFile(null);
            setProfilePicturePreview(null);

            // Update Redux state & localStorage so the header photo updates immediately
            dispatch(setCredentials({
                user: {
                    id: data.id,
                    name: data.name,
                    profile_photo_location: data.profile_picture_location
                },
                token: localStorage.getItem('token')
            }));

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            const message =
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail ||
                err.response?.data?.message ||
                'Failed to save profile. Please try again.';
            setSaveError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profileData);
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        setSaveError(null);
        setIsEditing(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-primary-orange mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
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
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    if (!formData) return null;

    return (
        <div className="space-y-8">


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
                            value={`https://influrunner.com/portfolio/${formData.id}`}
                            readOnly
                            className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white overflow-x-auto"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    const link = `${window.location.origin}/portfolio/${formData.id}`;
                                    navigator.clipboard.writeText(link);
                                    setSuccessAlert({ isOpen: true, message: 'Portfolio link copied to clipboard!' });
                                    setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                                }}
                                className="flex-1"
                            >
                                Copy Link
                            </Button>
                            <Link
                                to={`/portfolio/${formData.id}`}
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
                                <Button variant="secondary" size="sm" onClick={() => { setIsEditing(true); setSaveSuccess(false); setSaveError(null); }} className="whitespace-nowrap">
                                    <Edit2 size={16} className="mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="primary" size="sm" onClick={handleSave} disabled={saving} className="whitespace-nowrap">
                                        {saving ? (
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                        ) : (
                                            <Check size={16} className="mr-2" />
                                        )}
                                        {saving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button variant="white" size="sm" onClick={handleCancel} disabled={saving} className="whitespace-nowrap">
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Save Success / Error Messages */}
                        {saveSuccess && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                Profile updated successfully!
                            </div>
                        )}
                        {saveError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {typeof saveError === 'string' ? saveError : 'Failed to save profile.'}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0 mx-auto sm:mx-0 overflow-hidden bg-orange-100 text-primary-orange">
                                {profilePicturePreview ? (
                                    <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    formData.name.charAt(0)
                                )}
                            </div>
                            {isEditing && (
                                <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                        onChange={handleProfilePictureChange}
                                    />
                                    <Button variant="white" size="sm" className="w-full sm:w-auto" onClick={() => fileInputRef.current?.click()}>
                                        <Camera size={16} className="mr-2" />
                                        Change Photo
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {profilePictureFile ? profilePictureFile.name : 'JPG, PNG or GIF. Max size 2MB.'}
                                    </p>
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
                                prefix="₹"
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
                                prefix="₹"
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
                                value={`https://influrunner.com/portfolio/${formData.id}`}
                                readOnly
                                className="w-full px-3 py-2 text-sm border border-orange-200 rounded-lg bg-white overflow-x-auto"
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        const link = `${window.location.origin}/portfolio/${formData.id}`;
                                        navigator.clipboard.writeText(link);
                                        setSuccessAlert({ isOpen: true, message: 'Portfolio link copied to clipboard!' });
                                        setTimeout(() => setSuccessAlert({ isOpen: false, message: '' }), 3000);
                                    }}
                                    className="flex-1"
                                >
                                    Copy Link
                                </Button>
                                <Link
                                    to={`/portfolio/${formData.id}`}
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
                            {formData.instagram ? (
                                /* Connected state */
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg gap-3">
                                    <div className="flex items-center gap-3">
                                        <Instagram size={20} className="text-pink-600" />
                                        <div>
                                            <p className="text-sm font-medium text-deep-black">Instagram</p>
                                        </div>
                                    </div>
                                    <Badge variant="success" className="self-start sm:self-auto">
                                        Connected
                                    </Badge>
                                </div>
                            ) : (
                                /* Not connected state — show connect button */
                                <div className="p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg text-center space-y-3">
                                    <Instagram size={28} className="text-pink-600 mx-auto" />
                                    <p className="text-sm text-gray-600">Connect your Instagram to sync your profile and metrics</p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-none"
                                        onClick={async () => {
                                            try {
                                                const response = await api.get('/api/social-media/connect/instagram');
                                                if (response.data?.url) {
                                                    window.location.href = response.data.url;
                                                }
                                            } catch (err) {
                                                setErrorAlert({ isOpen: true, message: err.response?.data?.detail || 'Failed to connect Instagram. Please try again.' });
                                            }
                                        }}
                                    >
                                        <Instagram size={16} className="mr-2" />
                                        Connect Instagram
                                    </Button>
                                </div>
                            )}
                        </div>
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

                    {/* Logout Button */}
                    <Card className="p-4 border-t-4 border-red-500">
                        <Button
                            variant="white"
                            className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2"
                            onClick={() => {
                                dispatch(logout());
                                navigate('/login');
                            }}
                        >
                            <LogOut size={20} />
                            Log Out
                        </Button>
                    </Card>
                </div>
            </div>

            <SuccessAlert
                isOpen={successAlert.isOpen}
                message={successAlert.message}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
            />

            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default InfluencerProfile;
