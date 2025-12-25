// Centralized Demo Data for the entire application
// This file contains all mock data used across the website

// Helper function to get dates for the next 7 days
const getNextDays = (count = 7) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }
    return days;
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

// Get day name
const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const nextDays = getNextDays(7);

// Calendar Events for next 7 days
export const calendarEvents = [
    // Day 1 (Today)
    {
        id: 'cal-1',
        type: 'shoot',
        title: 'Fashion Nova - Spring Collection',
        brand: 'Fashion Nova',
        campaign: 'Spring Collection 2025',
        date: formatDate(nextDays[0]),
        time: '10:00',
        displayTime: '10:00 AM',
        location: 'Mumbai Studio',
        status: 'confirmed',
        platform: null,
        description: 'Outdoor photoshoot for spring collection'
    },
    {
        id: 'cal-2',
        type: 'upload',
        title: 'Product Review - Tech Gadget',
        brand: 'TechGear Pro',
        campaign: 'Gadget Review Series',
        date: formatDate(nextDays[0]),
        time: '14:00',
        displayTime: '2:00 PM',
        location: 'Home Studio',
        status: 'confirmed',
        platform: 'youtube',
        description: 'Upload tech review video'
    },
    {
        id: 'cal-3',
        type: 'shoot',
        title: 'Wellness Co - Fitness Challenge',
        brand: 'Wellness Co',
        campaign: 'Fitness Challenge',
        date: formatDate(nextDays[0]),
        time: '16:00',
        displayTime: '4:00 PM',
        location: 'Outdoor Park',
        status: 'confirmed',
        platform: null,
        description: 'Fitness workout shoot'
    },

    // Day 2 (Tomorrow)
    {
        id: 'cal-4',
        type: 'shoot',
        title: 'Beauty Brands - Makeup Tutorial',
        brand: 'Beauty Brands',
        campaign: 'Makeup Tutorial Series',
        date: formatDate(nextDays[1]),
        time: '11:00',
        displayTime: '11:00 AM',
        location: 'Beauty Studio',
        status: 'confirmed',
        platform: null,
        description: 'Makeup tutorial shoot'
    },
    {
        id: 'cal-5',
        type: 'upload',
        title: 'Fashion Haul Video',
        brand: 'StyleHub',
        campaign: 'Winter Fashion',
        date: formatDate(nextDays[1]),
        time: '15:00',
        displayTime: '3:00 PM',
        location: 'Home Studio',
        status: 'confirmed',
        platform: 'instagram',
        description: 'Upload fashion haul to Instagram'
    },

    // Day 3
    {
        id: 'cal-6',
        type: 'shoot',
        title: 'FitLife - Yoga Series',
        brand: 'FitLife',
        campaign: 'Yoga Series',
        date: formatDate(nextDays[2]),
        time: '09:00',
        displayTime: '9:00 AM',
        location: 'Yoga Studio',
        status: 'confirmed',
        platform: null,
        description: 'Morning yoga session shoot'
    },
    {
        id: 'cal-7',
        type: 'upload',
        title: 'Behind the Scenes',
        brand: 'Fashion Nova',
        campaign: 'BTS Content',
        date: formatDate(nextDays[2]),
        time: '18:00',
        displayTime: '6:00 PM',
        location: 'Virtual',
        status: 'confirmed',
        platform: 'facebook',
        description: 'Upload BTS content to Facebook'
    },

    // Day 4
    {
        id: 'cal-8',
        type: 'shoot',
        title: 'TechReview - Smartphone Unboxing',
        brand: 'TechReview',
        campaign: 'Smartphone Unboxing',
        date: formatDate(nextDays[3]),
        time: '13:00',
        displayTime: '1:00 PM',
        location: 'Tech Studio',
        status: 'pending',
        platform: null,
        description: 'Unboxing and review shoot'
    },
    {
        id: 'cal-9',
        type: 'upload',
        title: 'Cooking Tutorial',
        brand: 'FoodieHub',
        campaign: 'Quick Recipes',
        date: formatDate(nextDays[3]),
        time: '17:00',
        displayTime: '5:00 PM',
        location: 'Home Kitchen',
        status: 'confirmed',
        platform: 'youtube',
        description: 'Upload cooking tutorial'
    },

    // Day 5
    {
        id: 'cal-10',
        type: 'shoot',
        title: 'Travel Vlog - City Tour',
        brand: 'TravelCo',
        campaign: 'City Exploration',
        date: formatDate(nextDays[4]),
        time: '10:00',
        displayTime: '10:00 AM',
        location: 'City Center',
        status: 'confirmed',
        platform: null,
        description: 'City tour vlog shoot'
    },
    {
        id: 'cal-11',
        type: 'upload',
        title: 'Product Unboxing',
        brand: 'GadgetWorld',
        campaign: 'Latest Gadgets',
        date: formatDate(nextDays[4]),
        time: '14:30',
        displayTime: '2:30 PM',
        location: 'Home Studio',
        status: 'confirmed',
        platform: 'instagram',
        description: 'Unboxing video upload'
    },

    // Day 6
    {
        id: 'cal-12',
        type: 'shoot',
        title: 'Skincare Routine',
        brand: 'BeautyEssentials',
        campaign: 'Skincare Guide',
        date: formatDate(nextDays[5]),
        time: '11:30',
        displayTime: '11:30 AM',
        location: 'Beauty Studio',
        status: 'pending',
        platform: null,
        description: 'Skincare routine demonstration'
    },
    {
        id: 'cal-13',
        type: 'upload',
        title: 'Q&A Session',
        brand: 'Personal',
        campaign: 'Fan Engagement',
        date: formatDate(nextDays[5]),
        time: '19:00',
        displayTime: '7:00 PM',
        location: 'Home Studio',
        status: 'confirmed',
        platform: 'youtube',
        description: 'Q&A with followers'
    },

    // Day 7
    {
        id: 'cal-14',
        type: 'shoot',
        title: 'Fitness Equipment Review',
        brand: 'FitGear',
        campaign: 'Equipment Reviews',
        date: formatDate(nextDays[6]),
        time: '09:30',
        displayTime: '9:30 AM',
        location: 'Gym',
        status: 'confirmed',
        platform: null,
        description: 'Fitness equipment review shoot'
    },
    {
        id: 'cal-15',
        type: 'upload',
        title: 'Weekly Vlog',
        brand: 'Personal',
        campaign: 'Weekly Updates',
        date: formatDate(nextDays[6]),
        time: '20:00',
        displayTime: '8:00 PM',
        location: 'Virtual',
        status: 'confirmed',
        platform: 'facebook',
        description: 'Weekly vlog upload'
    }
];

// Today's Schedule (filtered from calendar events for today)
export const todaySchedule = calendarEvents.filter(event =>
    event.date === formatDate(new Date())
);

// Delayed Tasks
export const delayedTasks = [
    {
        id: 'delayed-1',
        brand: 'StyleHub',
        campaign: 'Winter Collection',
        type: 'shoot',
        scheduledTime: '8:00 AM',
        time: '08:00',
        scheduledDate: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
        delayHours: 72,
        location: 'Mumbai Studio'
    },
    {
        id: 'delayed-2',
        brand: 'FitLife',
        campaign: 'Yoga Series',
        type: 'upload',
        scheduledTime: '9:30 AM',
        time: '09:30',
        scheduledDate: formatDate(new Date(Date.now() - 1.5 * 60 * 60 * 1000)), // 1.5 hours ago
        delayHours: 1.5,
        location: 'Virtual'
    },
    {
        id: 'delayed-3',
        brand: 'TechReview',
        campaign: 'Smartphone Unboxing',
        type: 'shoot',
        scheduledTime: '7:00 AM',
        time: '07:00',
        scheduledDate: formatDate(new Date(Date.now() - 30 * 60 * 60 * 1000)), // 30 hours ago
        delayHours: 30,
        location: 'Tech Studio'
    }
];

// Completed Shoots
export const completedShoots = [
    {
        id: 'completed-1',
        brand: 'Fashion Nova',
        campaign: 'Spring Collection 2025',
        type: 'shoot',
        completedAt: '9:30 AM',
        location: 'Mumbai Studio',
        rating: 5,
        shootDate: formatDate(new Date()),
        shootTime: '9:00 AM'
    },
    {
        id: 'completed-2',
        brand: 'TechGear Pro',
        campaign: 'Gadget Review Series',
        type: 'upload',
        completedAt: '1:45 PM',
        location: 'Virtual',
        rating: 4,
        shootDate: formatDate(new Date()),
        shootTime: '1:30 PM'
    },
    {
        id: 'completed-3',
        brand: 'Wellness Co',
        campaign: 'Fitness Challenge',
        type: 'shoot',
        completedAt: '11:00 AM',
        location: 'Outdoor Park',
        rating: 5,
        shootDate: formatDate(new Date()),
        shootTime: '10:30 AM'
    },
    {
        id: 'completed-4',
        brand: 'Beauty Brands',
        campaign: 'Makeup Tutorial',
        type: 'upload',
        completedAt: '3:15 PM',
        location: 'Home Studio',
        rating: 4,
        shootDate: formatDate(new Date()),
        shootTime: '3:00 PM'
    }
];

// Recent Reviews
export const recentReviews = [
    {
        id: 'review-1',
        clientName: 'Fashion Nova',
        rating: 5,
        comment: 'Excellent work! Very professional and delivered amazing content.',
        date: '2 days ago',
        avatar: 'FN'
    },
    {
        id: 'review-2',
        clientName: 'TechGear Pro',
        rating: 4,
        comment: 'Great collaboration. Looking forward to working again!',
        date: '5 days ago',
        avatar: 'TG'
    },
    {
        id: 'review-3',
        clientName: 'Wellness Co',
        rating: 5,
        comment: 'Outstanding creativity and engagement. Highly recommended!',
        date: '1 week ago',
        avatar: 'WC'
    }
];

// Upcoming Shoots (next 7 days from calendar)
export const upcomingShoots = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate > today;
}).slice(0, 5); // Limit to 5 upcoming

// Helper function to get events by date
export const getEventsByDate = (date) => {
    const dateStr = formatDate(new Date(date));
    return calendarEvents.filter(event => event.date === dateStr);
};

// Helper function to get events by date range
export const getEventsByDateRange = (startDate, endDate) => {
    const start = formatDate(new Date(startDate));
    const end = formatDate(new Date(endDate));
    return calendarEvents.filter(event => event.date >= start && event.date <= end);
};

export default {
    calendarEvents,
    todaySchedule,
    delayedTasks,
    completedShoots,
    recentReviews,
    upcomingShoots,
    getEventsByDate,
    getEventsByDateRange
};
