// Mock authentication data for testing
// In production, this would come from backend API

export const MOCK_USERS = {
    // Brand user
    'brand@test.com': {
        password: 'brand123',
        role: 'brand',
        name: 'Acme Brand',
        redirectTo: '/brand'
    },

    // Influencer user
    'influencer@test.com': {
        password: 'influencer123',
        role: 'influencer',
        name: 'Sarah Jenkins',
        redirectTo: '/influencer'
    },

    // Admin user
    'admin@test.com': {
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        redirectTo: '/admin'
    }
};

// Mock influencer data
export const MOCK_INFLUENCER_DATA = {
    profile: {
        name: 'Sarah Jenkins',
        email: 'influencer@test.com',
        bio: 'Fashion & Lifestyle content creator passionate about sustainable fashion and mindful living.',
        location: 'Los Angeles, CA',
        profilePhoto: null,
        categories: ['Fashion', 'Lifestyle', 'Sustainability'],
        budgetRange: { min: 500, max: 5000 },
        availability: true,
        joinedDate: '2024-01-15'
    },

    socialMedia: {
        instagram: {
            connected: true,
            username: '@sarahjenkins',
            followers: 125000,
            engagementRate: 4.2,
            avgLikes: 5250,
            avgComments: 180,
            lastSync: '2025-11-30T10:30:00',
            recentPosts: [
                { views: 45000, likes: 6200, comments: 210, date: '2025-11-28' },
                { views: 38000, likes: 5800, comments: 165, date: '2025-11-26' },
                { views: 32000, likes: 4900, comments: 155, date: '2025-11-24' }
            ]
        },
        facebook: {
            connected: true,
            username: 'Sarah Jenkins',
            followers: 45000,
            engagementRate: 3.1,
            avgLikes: 1395,
            avgComments: 45,
            lastSync: '2025-11-30T10:30:00',
            recentPosts: [
                { likes: 1500, comments: 52, date: '2025-11-27' },
                { likes: 1200, comments: 38, date: '2025-11-25' }
            ]
        },
        youtube: {
            connected: true,
            username: 'Sarah Jenkins Vlogs',
            subscribers: 89000,
            engagementRate: 5.8,
            avgViews: 15000,
            avgLikes: 870,
            lastSync: '2025-11-30T10:30:00',
            recentVideos: [
                { views: 18500, likes: 1050, comments: 120, date: '2025-11-26' },
                { views: 12000, likes: 680, comments: 85, date: '2025-11-20' }
            ]
        }
    },

    bookings: [
        // Today's bookings (Dec 1, 2025)
        {
            id: 1,
            brandName: 'EcoWear Fashion',
            brandLogo: null,
            campaign: 'Sustainable Summer Collection',
            shootDate: '2025-12-01',
            shootTime: '10:00 AM - 11:30 AM',
            location: 'Studio A, Downtown LA',
            status: 'confirmed',
            notes: 'Bring 3 outfit changes',
            createdDate: '2025-11-20'
        },
        {
            id: 2,
            brandName: 'GreenBeauty Co',
            brandLogo: null,
            campaign: 'Natural Skincare Launch',
            shootDate: '2025-12-01',
            shootTime: '1:00 PM - 2:30 PM',
            location: 'Outdoor - Venice Beach',
            status: 'confirmed',
            notes: 'Golden hour shoot',
            createdDate: '2025-11-22'
        },
        {
            id: 3,
            brandName: 'UrbanStyle Co',
            brandLogo: null,
            campaign: 'Street Fashion Winter',
            shootDate: '2025-12-01',
            shootTime: '3:30 PM - 5:00 PM',
            location: 'Downtown LA Streets',
            status: 'completed',
            notes: 'Casual street style',
            createdDate: '2025-11-23'
        },

        // Dec 2, 2025
        {
            id: 4,
            brandName: 'LuxeAccessories',
            brandLogo: null,
            campaign: 'Holiday Jewelry Line',
            shootDate: '2025-12-02',
            shootTime: '9:00 AM - 10:30 AM',
            location: 'Studio B, Beverly Hills',
            status: 'confirmed',
            notes: 'Evening wear required',
            createdDate: '2025-11-24'
        },
        {
            id: 5,
            brandName: 'FitLife Nutrition',
            brandLogo: null,
            campaign: 'Protein Shake Promo',
            shootDate: '2025-12-02',
            shootTime: '2:00 PM - 3:00 PM',
            location: 'Gym - Santa Monica',
            status: 'confirmed',
            notes: 'Workout attire required',
            createdDate: '2025-11-10'
        },

        // Dec 3, 2025
        {
            id: 6,
            brandName: 'TechGear Pro',
            brandLogo: null,
            campaign: 'Smart Watch Launch',
            shootDate: '2025-12-03',
            shootTime: '11:00 AM - 12:30 PM',
            location: 'Tech Hub, Silicon Beach',
            status: 'confirmed',
            notes: 'Athletic wear, outdoor setting',
            createdDate: '2025-11-15'
        },
        {
            id: 7,
            brandName: 'Organic Eats',
            brandLogo: null,
            campaign: 'Farm to Table Campaign',
            shootDate: '2025-12-03',
            shootTime: '4:00 PM - 5:30 PM',
            location: 'Local Farmers Market',
            status: 'pending',
            notes: 'Bring reusable bags',
            createdDate: '2025-11-25'
        },

        // Dec 4, 2025 (Today - Multiple shoots for demo)
        {
            id: 8,
            brandName: 'Wanderlust Travel',
            brandLogo: null,
            campaign: 'Adventure Gear Collection',
            shootDate: '2025-12-04',
            shootTime: '8:00 AM - 10:00 AM',
            location: 'Malibu Beach',
            status: 'confirmed',
            notes: 'Sunrise shoot, bring hiking boots',
            createdDate: '2025-11-26'
        },
        {
            id: 9,
            brandName: 'Zen Wellness',
            brandLogo: null,
            campaign: 'Yoga Apparel Line',
            shootDate: '2025-12-04',
            shootTime: '3:00 PM - 4:30 PM',
            location: 'Yoga Studio, West Hollywood',
            status: 'confirmed',
            notes: 'Bring yoga mat',
            createdDate: '2025-11-27'
        },
        {
            id: 11,
            brandName: 'Fresh Bites Co',
            brandLogo: null,
            campaign: 'Healthy Snack Launch',
            shootDate: '2025-12-04',
            shootTime: '11:00 AM - 12:30 PM',
            location: 'Kitchen Studio, Culver City',
            status: 'confirmed',
            notes: 'Food photography session, 5 different products',
            createdDate: '2025-11-28'
        },
        {
            id: 12,
            brandName: 'StyleHub Fashion',
            brandLogo: null,
            campaign: 'Winter Collection 2025',
            shootDate: '2025-12-04',
            shootTime: '1:00 PM - 2:30 PM',
            location: 'Studio C, Beverly Hills',
            status: 'pending',
            notes: 'Winter outfit styling, 8 looks total',
            createdDate: '2025-11-29'
        },
        {
            id: 13,
            brandName: 'TechInnovate',
            brandLogo: null,
            campaign: 'Smart Home Devices Review',
            shootDate: '2025-12-04',
            shootTime: '5:00 PM - 6:00 PM',
            location: 'Home Studio',
            status: 'confirmed',
            notes: 'Product unboxing and demo videos',
            createdDate: '2025-11-30'
        },
        {
            id: 14,
            brandName: 'Glow Cosmetics',
            brandLogo: null,
            campaign: 'Holiday Makeup Collection',
            shootDate: '2025-12-04',
            shootTime: '6:30 PM - 8:00 PM',
            location: 'Beauty Studio, West LA',
            status: 'confirmed',
            notes: 'Glam makeup looks for holiday season',
            createdDate: '2025-12-01'
        },

        // Past booking
        {
            id: 10,
            brandName: 'Vintage Vibes',
            brandLogo: null,
            campaign: 'Retro Fashion Revival',
            shootDate: '2025-11-28',
            shootTime: '12:00 PM - 2:00 PM',
            location: 'Downtown Vintage District',
            status: 'completed',
            notes: '70s inspired outfits',
            createdDate: '2025-11-18'
        },
        {
            id: 6,
            brandName: 'TechGear Pro',
            brandLogo: null,
            campaign: 'Gadget Unboxing Series',
            shootDate: '2025-12-12',
            shootTime: '11:00 AM - 12:30 PM',
            location: 'Home Studio',
            status: 'confirmed',
            notes: 'Equipment will be shipped',
            createdDate: '2025-11-28'
        },
        {
            id: 7,
            brandName: 'Wellness Hub',
            brandLogo: null,
            campaign: 'Yoga Lifestyle Brand',
            shootDate: '2025-12-12',
            shootTime: '2:00 PM - 3:30 PM',
            location: 'Yoga Studio, Santa Monica',
            status: 'confirmed',
            notes: 'Yoga mat provided',
            createdDate: '2025-11-25'
        },
        {
            id: 8,
            brandName: 'Gourmet Eats',
            brandLogo: null,
            campaign: 'Healthy Meal Prep',
            shootDate: '2025-12-12',
            shootTime: '5:00 PM - 6:30 PM',
            location: 'Kitchen Studio',
            status: 'confirmed',
            notes: 'Food styling session',
            createdDate: '2025-11-26'
        },
        {
            id: 9,
            brandName: 'TravelGear Co',
            brandLogo: null,
            campaign: 'Adventure Backpack Launch',
            shootDate: '2025-12-20',
            shootTime: '9:00 AM - 10:30 AM',
            location: 'Outdoor - Griffith Park',
            status: 'pending',
            notes: 'Hiking outfit required',
            createdDate: '2025-11-27'
        },
        {
            id: 10,
            brandName: 'PetLove Brands',
            brandLogo: null,
            campaign: 'Pet Accessories Line',
            shootDate: '2025-12-20',
            shootTime: '12:00 PM - 1:30 PM',
            location: 'Dog Park, West Hollywood',
            status: 'pending',
            notes: 'Bring your pet if possible',
            createdDate: '2025-11-28'
        }
    ],

    messages: [
        {
            id: 1,
            brandName: 'EcoWear Fashion',
            brandLogo: null,
            lastMessage: 'Looking forward to the shoot next week!',
            timestamp: '2025-11-29T15:30:00',
            unread: true
        },
        {
            id: 2,
            brandName: 'GreenBeauty Co',
            brandLogo: null,
            lastMessage: 'Can we reschedule to 3 PM instead?',
            timestamp: '2025-11-29T10:15:00',
            unread: true
        },
        {
            id: 3,
            brandName: 'FitLife Nutrition',
            brandLogo: null,
            lastMessage: 'Great work on the campaign! Here are the final edits.',
            timestamp: '2025-11-28T14:20:00',
            unread: false
        }
    ],

    calendar: {
        // Dates marked as unavailable
        unavailableDates: ['2025-12-01', '2025-12-15', '2025-12-25'],
        // Booked dates (from bookings)
        bookedDates: ['2025-12-05', '2025-12-12', '2025-12-20']
    },

    uploadSchedule: [
        // Today's uploads (Dec 2, 2025)
        {
            id: 1,
            brandName: 'EcoWear Fashion',
            campaign: 'Sustainable Summer Collection',
            platform: 'Instagram',
            uploadDate: '2025-12-02',
            uploadTime: '6:00 PM',
            contentType: 'Reel',
            status: 'pending',
            notes: 'Use hashtags: #SustainableFashion #EcoWear',
            shootDate: '2025-12-01'
        },
        {
            id: 2,
            brandName: 'GreenBeauty Co',
            campaign: 'Natural Skincare Launch',
            platform: 'Instagram',
            uploadDate: '2025-12-02',
            uploadTime: '8:00 PM',
            contentType: 'Post + Story',
            status: 'pending',
            notes: 'Tag @greenbeautyco',
            shootDate: '2025-12-01'
        },
        {
            id: 3,
            brandName: 'UrbanStyle Co',
            campaign: 'Street Fashion Winter',
            platform: 'YouTube',
            uploadDate: '2025-12-02',
            uploadTime: '12:00 PM',
            contentType: 'Short',
            status: 'uploaded',
            notes: 'Include product links in description',
            shootDate: '2025-12-01'
        },
        // Dec 3, 2025
        {
            id: 4,
            brandName: 'LuxeAccessories',
            campaign: 'Holiday Jewelry Line',
            platform: 'Instagram',
            uploadDate: '2025-12-03',
            uploadTime: '5:00 PM',
            contentType: 'Carousel Post',
            status: 'pending',
            notes: 'Show all 5 pieces',
            shootDate: '2025-12-02'
        },
        {
            id: 5,
            brandName: 'FitLife Nutrition',
            campaign: 'Protein Shake Promo',
            platform: 'TikTok',
            uploadDate: '2025-12-03',
            uploadTime: '7:00 PM',
            contentType: 'Video',
            status: 'pending',
            notes: 'Use trending audio',
            shootDate: '2025-12-02'
        },
        // Dec 4, 2025 - Today's uploads for demo
        {
            id: 13,
            brandName: 'Wanderlust Travel',
            campaign: 'Adventure Gear Collection',
            platform: 'Instagram',
            uploadDate: '2025-12-04',
            uploadTime: '10:30 AM',
            contentType: 'Reel',
            status: 'pending',
            notes: 'Upload sunrise beach footage, use #AdventureAwaits',
            shootDate: '2025-12-04'
        },
        {
            id: 14,
            brandName: 'Fresh Bites Co',
            campaign: 'Healthy Snack Launch',
            platform: 'Instagram',
            uploadDate: '2025-12-04',
            uploadTime: '2:00 PM',
            contentType: 'Carousel Post',
            status: 'pending',
            notes: 'Show all 5 products, tag @freshbitesco',
            shootDate: '2025-12-04'
        },
        {
            id: 15,
            brandName: 'Zen Wellness',
            campaign: 'Yoga Apparel Line',
            platform: 'YouTube',
            uploadDate: '2025-12-04',
            uploadTime: '5:00 PM',
            contentType: 'Short',
            status: 'pending',
            notes: 'Upload yoga flow demonstration',
            shootDate: '2025-12-04'
        },
        {
            id: 16,
            brandName: 'TechInnovate',
            campaign: 'Smart Home Devices Review',
            platform: 'TikTok',
            uploadDate: '2025-12-04',
            uploadTime: '7:00 PM',
            contentType: 'Video',
            status: 'pending',
            notes: 'Unboxing and quick review, trending sound',
            shootDate: '2025-12-04'
        },
        {
            id: 17,
            brandName: 'Glow Cosmetics',
            campaign: 'Holiday Makeup Collection',
            platform: 'Instagram',
            uploadDate: '2025-12-04',
            uploadTime: '8:30 PM',
            contentType: 'Reel + Story',
            status: 'pending',
            notes: 'Makeup tutorial with product tags',
            shootDate: '2025-12-04'
        },
        {
            id: 18,
            brandName: 'StyleHub Fashion',
            campaign: 'Winter Collection 2025',
            platform: 'Instagram',
            uploadDate: '2025-12-04',
            uploadTime: '4:00 PM',
            contentType: 'Post',
            status: 'uploaded',
            notes: 'Winter lookbook posted successfully',
            shootDate: '2025-12-04'
        },
        // Dec 5, 2025 - Upload only (no shoot)
        {
            id: 6,
            brandName: 'BeautyGlow',
            campaign: 'Winter Skincare Routine',
            platform: 'Instagram',
            uploadDate: '2025-12-05',
            uploadTime: '4:00 PM',
            contentType: 'Reel',
            status: 'pending',
            notes: 'Add product links in bio',
            shootDate: '2025-11-28'
        },
        {
            id: 7,
            brandName: 'TechReview Pro',
            campaign: 'Gadget Unboxing',
            platform: 'YouTube',
            uploadDate: '2025-12-05',
            uploadTime: '6:30 PM',
            contentType: 'Video',
            status: 'pending',
            notes: 'Include affiliate links',
            shootDate: '2025-11-29'
        },
        // Dec 7, 2025 - Upload only (no shoot)
        {
            id: 8,
            brandName: 'FashionForward',
            campaign: 'Holiday Lookbook',
            platform: 'Instagram',
            uploadDate: '2025-12-07',
            uploadTime: '5:00 PM',
            contentType: 'Carousel Post',
            status: 'pending',
            notes: 'Tag all outfit pieces',
            shootDate: '2025-11-30'
        },
        // Dec 10, 2025 - Upload only (no shoot)
        {
            id: 9,
            brandName: 'HomeDecor Studio',
            campaign: 'Cozy Winter Vibes',
            platform: 'TikTok',
            uploadDate: '2025-12-10',
            uploadTime: '3:00 PM',
            contentType: 'Video',
            status: 'pending',
            notes: 'Use trending sound #cozyhome',
            shootDate: '2025-12-01'
        },
        {
            id: 10,
            brandName: 'FitnessHub',
            campaign: 'Morning Workout Routine',
            platform: 'Instagram',
            uploadDate: '2025-12-10',
            uploadTime: '7:00 AM',
            contentType: 'Reel',
            status: 'pending',
            notes: 'Post early for engagement',
            shootDate: '2025-12-02'
        },
        // Dec 15, 2025 - Upload only (no shoot)
        {
            id: 11,
            brandName: 'TravelBug Co',
            campaign: 'Weekend Getaway Guide',
            platform: 'YouTube',
            uploadDate: '2025-12-15',
            uploadTime: '12:00 PM',
            contentType: 'Vlog',
            status: 'pending',
            notes: 'Include travel tips in description',
            shootDate: '2025-12-08'
        },
        // Dec 18, 2025 - Upload only (no shoot)
        {
            id: 12,
            brandName: 'CoffeeLovers',
            campaign: 'Holiday Coffee Recipes',
            platform: 'Instagram',
            uploadDate: '2025-12-18',
            uploadTime: '9:00 AM',
            contentType: 'Reel',
            status: 'pending',
            notes: 'Share recipe in caption',
            shootDate: '2025-12-10'
        }
    ],

    reviews: [
        {
            id: 1,
            clientName: 'EcoWear Fashion',
            clientEmail: 'marketing@ecowear.com',
            rating: 5,
            reviewText: 'Sarah was absolutely amazing to work with! Her professionalism and creativity brought our sustainable fashion campaign to life. The content she created exceeded our expectations and resonated perfectly with our target audience. Highly recommend!',
            projectType: 'Brand Campaign',
            isVerified: true,
            isPublished: true,
            createdAt: '2025-11-15T10:30:00'
        },
        {
            id: 2,
            clientName: 'GreenBeauty Co',
            clientEmail: 'team@greenbeauty.com',
            rating: 5,
            reviewText: 'Working with Sarah was a dream! She understood our brand values immediately and created stunning content that showcased our natural skincare line beautifully. Her engagement rates are incredible and she delivered everything on time.',
            projectType: 'Product Review',
            isVerified: true,
            isPublished: true,
            createdAt: '2025-10-22T14:15:00'
        },
        {
            id: 3,
            clientName: 'UrbanStyle Co',
            clientEmail: null,
            rating: 4,
            reviewText: 'Great experience overall! Sarah brought fresh ideas to our street fashion campaign and her photography skills are top-notch. The only minor issue was a slight delay in delivery, but the quality made up for it.',
            projectType: 'Brand Campaign',
            isVerified: false,
            isPublished: true,
            createdAt: '2025-10-05T09:45:00'
        },
        {
            id: 4,
            clientName: 'FitLife Nutrition',
            clientEmail: 'collabs@fitlife.com',
            rating: 5,
            reviewText: 'Sarah\'s authentic approach to fitness content is exactly what we needed. Her followers trust her recommendations and we saw a significant boost in sales after her posts. Professional, reliable, and results-driven!',
            projectType: 'Sponsored Post',
            isVerified: true,
            isPublished: true,
            createdAt: '2025-09-18T16:20:00'
        },
        {
            id: 5,
            clientName: 'LuxeAccessories',
            clientEmail: 'partnerships@luxeacc.com',
            rating: 4,
            reviewText: 'Very happy with the collaboration! Sarah styled our jewelry pieces beautifully and her aesthetic perfectly matched our luxury brand image. Would definitely work with her again.',
            projectType: 'Product Placement',
            isVerified: true,
            isPublished: true,
            createdAt: '2025-09-01T11:00:00'
        },
        {
            id: 6,
            clientName: 'Wellness Hub',
            clientEmail: null,
            rating: 5,
            reviewText: 'Outstanding work! Sarah created a series of yoga content that perfectly captured the essence of our brand. Her attention to detail and creative vision made this campaign one of our most successful.',
            projectType: 'Brand Campaign',
            isVerified: false,
            isPublished: true,
            createdAt: '2025-08-12T13:30:00'
        },
        {
            id: 7,
            clientName: 'TechGear Pro',
            clientEmail: 'marketing@techgear.com',
            rating: 4,
            reviewText: 'Good collaboration! Sarah did a great job reviewing our smart watch. Her tech knowledge surprised us and she explained features in a way that was easy for her audience to understand.',
            projectType: 'Product Review',
            isVerified: true,
            isPublished: true,
            createdAt: '2025-07-25T15:45:00'
        },
        {
            id: 8,
            clientName: 'Organic Eats',
            clientEmail: null,
            rating: 5,
            reviewText: 'Fantastic experience from start to finish! Sarah\'s passion for sustainable living shines through in her content. The farm-to-table campaign she created for us was authentic and engaging.',
            projectType: 'Sponsored Content',
            isVerified: false,
            isPublished: true,
            createdAt: '2025-07-10T10:15:00'
        }
    ]
};

