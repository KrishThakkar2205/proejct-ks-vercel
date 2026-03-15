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
import { useDispatch, useSelector } from 'react-redux';
import { showBanner } from './store/slices/notificationSlice';
import api from './utils/api';

// Handle Android hardware back button
const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Set premium native status bar style and brand color on load
        if (Capacitor.isNativePlatform()) {
            StatusBar.setStyle({ style: Style.Dark }); // 'Dark' means light text for orange bg
            StatusBar.setBackgroundColor({ color: '#FF6B1A' });
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
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        // Only run native setup if the user is fully logged in
        if (!Capacitor.isNativePlatform() || !isAuthenticated) return;

        let listeners = [];

        const setup = async () => {
            try {
                // ── STEP 1: Attach ALL listeners FIRST, before calling register() ──
                // This is critical: if register() fires a token before a listener is
                // attached, Capacitor 8 throws a native unhandled exception.

                // Got FCM token — send to backend
                const regListener = await PushNotifications.addListener('registration', async (token) => {
                    try {
                        await api.post('/api/notifications/register-token', {
                            token: token.value,
                            platform: 'android',
                        });
                    } catch (e) {
                        console.warn('Failed to send push token to backend:', e);
                    }
                });

                // Handle FCM registration errors silently — do NOT let this crash the app
                const regErrorListener = await PushNotifications.addListener('registrationError', (err) => {
                    console.warn('FCM registration error (non-fatal):', err.error);
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
                        navigate(data.route || '/influencer');
                    }
                );

                listeners = [regListener, regErrorListener, foregroundListener, tapListener];

                // ── STEP 2: Check/request permissions AFTER listeners are ready ──
                let permStatus = await PushNotifications.checkPermissions();
                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }
                if (permStatus.receive !== 'granted') return;

                // ── STEP 3: Create Android notification channel ──
                if (Capacitor.getPlatform() === 'android') {
                    await PushNotifications.createChannel({
                        id: 'influrunner_main_v3',
                        name: 'InfluRunner Notifications',
                        description: 'Shoot requests, messages, and updates',
                        importance: 5,
                        visibility: 1,
                        vibration: true,
                        sound: 'default',
                    });
                }

                // ── STEP 4: Register — listeners are already attached, safe to call ──
                await PushNotifications.register();

            } catch (e) {
                console.warn('Push notification setup error (non-fatal):', e);
            }
        };

        const timer = setTimeout(setup, 2000);

        return () => {
            clearTimeout(timer);
            listeners.forEach(l => l?.remove?.());
        };
    }, [dispatch, navigate, isAuthenticated]);

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
