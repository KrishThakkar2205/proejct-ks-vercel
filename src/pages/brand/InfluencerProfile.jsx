import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MapPin, Instagram, Youtube, Facebook, MessageSquare, Share2, Star, CheckCircle, TrendingUp, Users, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Lightbox from '../../components/ui/Lightbox';

const InfluencerProfile = () => {
    const { id } = useParams();
    const location = useLocation();

    // Mock Data (In a real app, fetch based on ID)
    const influencer = {
        name: "Sarah Jenkins",
        handle: "@sarahstyle",
        niche: "Fashion & Lifestyle",
        location: "New York, USA",
        bio: "Fashion enthusiast and lifestyle content creator passionate about sustainable fashion and travel. I help brands connect with authentic audiences through storytelling.",
        verified: true,
        // Platform-specific data structure
        platforms: [
            { id: 'instagram', name: 'Instagram', icon: <Instagram size={18} />, handle: '@sarahstyle', followers: '850k' },
            { id: 'youtube', name: 'YouTube', icon: <Youtube size={18} />, handle: 'Sarah Jenkins Vlogs', followers: '350k' },
            { id: 'facebook', name: 'Facebook', icon: <Facebook size={18} />, handle: 'Sarah Jenkins Official', followers: '1.2M' },
        ],
        stats: {
            instagram: { followers: "850k", engagement: "4.8%", avgLikes: "45k", avgComments: "1.2k" },
            youtube: { followers: "350k", engagement: "3.5%", avgLikes: "15k", avgComments: "450" },
            facebook: { followers: "1.2M", engagement: "2.9%", avgLikes: "25k", avgComments: "800" }
        },
        content: {
            instagram: [
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1529139574466-a302c27e3844?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=400",
            ],
            youtube: [
                "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1524601500432-1e1a4c71d692?auto=format&fit=crop&q=80&w=400",
            ],
            facebook: [
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=400",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400",
            ]
        },
        packages: [
            { title: "Instagram Post", price: "$1,500", description: "1 Static Post + Story with link" },
            { title: "Facebook Post", price: "$1,200", description: "Photo/Video post with link" },
            { title: "YouTube Integration", price: "$5,000", description: "60-90s dedicated segment" },
        ]
    };

    // Determine initial tab: passed state > first platform
    const initialTab = location.state?.activePlatform && influencer.platforms.find(p => p.id === location.state.activePlatform)
        ? location.state.activePlatform
        : influencer.platforms[0].id;

    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [lightboxImage, setLightboxImage] = useState({ isOpen: false, src: '', alt: '', caption: '' });

    const openLightbox = (src, caption = '') => {
        // Use high-res version if Unsplash
        const highResSrc = src.includes('unsplash.com') ? src.replace('w=200', 'w=800').replace('w=400', 'w=800') : src;
        setLightboxImage({ isOpen: true, src: highResSrc, alt: caption, caption });
    };

    const closeLightbox = () => {
        setLightboxImage(prev => ({ ...prev, isOpen: false }));
    };

    const currentStats = influencer.stats[activeTab];
    const currentContent = influencer.content[activeTab];

    return (
        <div className="space-y-8">
            {/* Header / Profile Info */}
            <Card className="p-0 overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-100 to-pink-100 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button variant="white" size="sm"><Share2 size={18} /></Button>
                        <Button variant="white" size="sm"><Star size={18} /></Button>
                    </div>
                </div>
                <div className="px-4 pb-6 md:px-8 md:pb-8">
                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-12 mb-6 gap-4 md:gap-0">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 text-center md:text-left">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                                    alt={influencer.name}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                    onClick={() => openLightbox("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", `${influencer.name}'s Profile Picture`)}
                                />
                                {influencer.verified && (
                                    <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white rounded-full p-1 shadow-sm">
                                        <CheckCircle size={16} className="text-success-green fill-white md:w-5 md:h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="mb-0 md:mb-2">
                                <h1 className="text-2xl md:text-3xl font-bebas tracking-wide text-deep-black">{influencer.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm md:text-base">
                                    <span className="font-medium text-primary-orange">{influencer.handle}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {influencer.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
                            <Button variant="secondary" className="flex-1 md:flex-none">Message</Button>
                            <Button className="flex-1 md:flex-none">Make Offer</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio */}
                            <div>
                                <h3 className="text-lg font-bebas tracking-wide text-deep-black mb-2">About</h3>
                                <p className="text-gray-600 leading-relaxed">{influencer.bio}</p>
                            </div>

                            {/* Platform Tabs */}
                            <div className="grid grid-cols-3 gap-2">
                                {influencer.platforms.map(platform => (
                                    <button
                                        key={platform.id}
                                        onClick={() => setActiveTab(platform.id)}
                                        className={`px-2 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 whitespace-nowrap ${activeTab === platform.id
                                            ? 'bg-deep-black text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {platform.icon}
                                        <span>{platform.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100">
                                    <div className="flex justify-center text-primary-orange mb-2"><Users size={20} /></div>
                                    <div className="font-bold text-xl text-deep-black">{currentStats.followers}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Followers</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-green-50 transition-colors duration-300 border border-transparent hover:border-green-100">
                                    <div className="flex justify-center text-green-500 mb-2"><TrendingUp size={20} /></div>
                                    <div className="font-bold text-xl text-deep-black">{currentStats.engagement}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Engagement</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-pink-50 transition-colors duration-300 border border-transparent hover:border-pink-100">
                                    <div className="flex justify-center text-blue-500 mb-2"><Heart size={20} /></div>
                                    <div className="font-bold text-xl text-deep-black">{currentStats.avgLikes}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Likes</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-100">
                                    <div className="flex justify-center text-purple-500 mb-2"><MessageSquare size={20} /></div>
                                    <div className="font-bold text-xl text-deep-black">{currentStats.avgComments}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Comments</div>
                                </div>
                            </div>

                            {/* Content Portfolio */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bebas tracking-wide text-deep-black">
                                        {`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content`}
                                    </h3>
                                    <Button variant="ghost" size="sm" className="text-primary-orange">View All</Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {currentContent.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="aspect-square rounded-lg overflow-hidden group cursor-pointer relative"
                                            onClick={() => openLightbox(img, `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content photo ${idx + 1}`)}
                                        >
                                            <img src={img} alt="Content" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white/90 p-2 rounded-full text-deep-black transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                    <Heart size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Platforms */}
                            <Card className="p-6">
                                <h3 className="text-lg font-bebas tracking-wide text-deep-black mb-4">Platforms</h3>
                                <div className="space-y-4">
                                    {influencer.platforms.map((platform, idx) => (
                                        <div key={idx} className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab(platform.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full transition-colors ${activeTab === platform.id ? 'bg-deep-black text-white' : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'}`}>
                                                    {platform.icon}
                                                </div>
                                                <div>
                                                    <div className={`font-medium transition-colors ${activeTab === platform.id ? 'text-primary-orange' : 'text-deep-black'}`}>{platform.name}</div>
                                                    <div className="text-xs text-gray-500">{platform.handle}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-deep-black">{platform.followers}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Packages */}
                            <Card className="p-6">
                                <h3 className="text-lg font-bebas tracking-wide text-deep-black mb-4">Standard Packages</h3>
                                <div className="space-y-4">
                                    {influencer.packages.map((pkg, idx) => (
                                        <div key={idx} className="p-3 border border-gray-100 rounded-lg hover:border-primary-orange transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-deep-black">{pkg.title}</div>
                                                <div className="font-bold text-primary-orange">{pkg.price}</div>
                                            </div>
                                            <p className="text-xs text-gray-500">{pkg.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-4 text-sm">View All Services</Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>
            <Lightbox
                isOpen={lightboxImage.isOpen}
                onClose={closeLightbox}
                imageSrc={lightboxImage.src}
                imageAlt={lightboxImage.alt}
                caption={lightboxImage.caption}
            />
        </div>
    );
};

export default InfluencerProfile;
