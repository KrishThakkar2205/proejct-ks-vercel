import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

// Handles root path — detects Instagram OAuth callback (?auth_status=success)
const RootRedirect = () => {
    const [searchParams] = useSearchParams();
    if (searchParams.get('auth_status') === 'success') {
        return <Navigate to="/influencer/profile?instagram=connected" replace />;
    }
    return <Navigate to="/login" replace />;
};
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PublicPortfolio from './pages/public/PublicPortfolio';
import ClientReviewPage from './pages/public/ClientReviewPage';
import DashboardLayout from './layouts/DashboardLayout';
import BrandDashboard from './pages/brand/BrandDashboard';
import DiscoverInfluencers from './pages/brand/DiscoverInfluencers';
import InfluencerProfile from './pages/brand/InfluencerProfile';
import ClosedDeals from './pages/brand/ClosedDeals';
import ActiveDeals from './pages/brand/ActiveDeals';
import Messages from './pages/brand/Messages';
import InfluencerLayout from './layouts/InfluencerLayout';
import InfluencerDashboard from './pages/influencer/InfluencerDashboard';
import InfluencerProfilePage from './pages/influencer/InfluencerProfile';
import ShootingCalendar from './pages/influencer/ShootingCalendar';
import Schedule from './pages/influencer/Schedule';
import CompletedShoots from './pages/influencer/CompletedShoots';
import DelayedPage from './pages/influencer/DelayedPage';
import InfluencerMessages from './pages/influencer/InfluencerMessages';
import InfluencerReviews from './pages/influencer/InfluencerReviews';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useDispatch } from 'react-redux';
import { showBanner } from './store/slices/notificationSlice';
import api from './utils/api';

// Handle Android hardware back button
const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Set premium status bar style on load
        if (Capacitor.isNativePlatform()) {
            StatusBar.setStyle({ style: Style.Light });
        }
        
        const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/influencer' || location.pathname === '/brand') {
                // Exit app if on main pages
                CapApp.exitApp();
            } else {
                // Otherwise navigate back
                navigate(-1);
            }
        });

        return () => {
            handler.then(h => h.remove());
        };
    }, [location, navigate]);

    return null;
};

// Handle Push Notifications (Android only)
const PushNotificationHandler = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const setup = async () => {

            try {
                // Check current permission state first
                let permStatus = await PushNotifications.checkPermissions();
                
                // Request only if we haven't already
                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive !== 'granted') {
                    console.log('User denied push notifications');
                    return;
                }

                // Create default notification channel (Required for Android 8.0+)
                if (Capacitor.getPlatform() === 'android') {
                    await PushNotifications.createChannel({
                        id: 'default',
                        name: 'Default',
                        description: 'General notifications',
                        importance: 4, // High importance
                        visibility: 1, // Public
                        vibration: true,
                    });
                }

            // Register with FCM - Wrap in try/catch to avoid native crashes if firebase is missing
            try {
                await PushNotifications.register();
            } catch (regError) {
                console.warn('Failed to register device with FCM (likely missing network or firebase setup):', regError);
                // If we can't register, we shouldn't attach listeners that rely on it
                return;
            }

            // Got FCM token — send to backend
            const regListener = await PushNotifications.addListener('registration', async (token) => {
                try {
                    await api.post('/api/notifications/register-token', {
                        token: token.value,
                        platform: 'android',
                    });
                } catch (e) {
                    console.warn('Failed to register push token:', e);
                }
            });

            // Foreground notification → show in-app banner
            const foregroundListener = await PushNotifications.addListener(
                'pushNotificationReceived',
                (notification) => {
                    dispatch(showBanner({
                        title: notification.title || 'InfluRunner',
                        body: notification.body || '',
                    }));
                }
            );

            // Tapped notification → navigate based on data payload
            const tapListener = await PushNotifications.addListener(
                'pushNotificationActionPerformed',
                (action) => {
                    const data = action.notification.data || {};
                    if (data.route) {
                        navigate(data.route);
                    } else {
                        navigate('/influencer');
                    }
                }
            );

            return () => {
                regListener.remove();
                foregroundListener.remove();
                tapListener.remove();
            };
            } catch (e) {
                console.warn('Push notification setup failed:', e);
            }
        };

        // Delay setup slightly to ensure the native Android Activity is fully bound
        // Requesting permissions too early in the React lifecycle can crash Capacitor 8.
        const timer = setTimeout(() => {
            setup();
        }, 2000);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return null;
};

function App() {
    return (
        <Router>
            <ScrollToTop />
            <BackButtonHandler />
            <PushNotificationHandler />
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    {/* Root redirects directly to login */}
                    <Route path="/" element={<RootRedirect />} />
                </Route>

                {/* Auth pages (no navbar) — redirect to dashboard if already logged in */}
                <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Portfolio Route (public) */}
                <Route path="/portfolio/:influencerId" element={<PublicPortfolio />} />

                {/* Review Submission Route (public) */}
                <Route path="/review/:token" element={<ClientReviewPage />} />

                {/* Protected: Brand Dashboard Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/brand" element={<DashboardLayout />}>
                        <Route index element={<BrandDashboard />} />
                        <Route path="discover" element={<DiscoverInfluencers />} />
                        <Route path="influencer/:id" element={<InfluencerProfile />} />
                        <Route path="closed-deals" element={<ClosedDeals />} />
                        <Route path="deals" element={<ActiveDeals />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="saved" element={<PlaceholderPage title="Saved Influencers" />} />
                    </Route>
                </Route>

                {/* Protected: Influencer Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/influencer" element={<InfluencerLayout />}>
                        <Route index element={<InfluencerDashboard />} />
                        <Route path="profile" element={<InfluencerProfilePage />} />
                        <Route path="calendar" element={<ShootingCalendar />} />
                        <Route path="schedule" element={<Schedule />} />
                        <Route path="completed-shoots" element={<CompletedShoots />} />
                        <Route path="delayed" element={<DelayedPage />} />
                        <Route path="messages" element={<InfluencerMessages />} />
                        <Route path="reviews" element={<InfluencerReviews />} />
                    </Route>
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
