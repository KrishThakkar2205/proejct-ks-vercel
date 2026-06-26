import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import InfluencerMessages from './pages/influencer/InfluencerMessages';
import InfluencerReviews from './pages/influencer/InfluencerReviews';
import NotificationsPage from './pages/influencer/NotificationsPage';
import MediaReports from './pages/influencer/MediaReports';
import PublicMediaReport from './pages/public/PublicMediaReport';
import PlaceholderPage from './pages/PlaceholderPage';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsAndConditions from './pages/public/TermsAndConditions';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import usePageTracking from './hooks/usePageTracking';

// Inner component so it has access to Router context (needed for useLocation)
function AppRoutes() {
    usePageTracking();
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Landing page — standalone with its own dark nav & footer */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Routes with white header/footer */}
                <Route element={<PublicLayout />}>
                    {/* Auth pages — redirect to dashboard if already logged in */}
                    <Route element={<RedirectIfAuthenticated />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    </Route>
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                </Route>

                {/* Portfolio Route (public) */}
                <Route path="/portfolio/:influencerId" element={<PublicPortfolio />} />

                {/* Review Submission Route (public) */}
                <Route path="/review/:token" element={<ClientReviewPage />} />

                {/* Media Performance Report Route (public) */}
                <Route path="/media-report/:influencerId/:mediaId" element={<PublicMediaReport />} />

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
                        <Route path="completed-shoots" element={<Navigate to="/influencer/schedule" replace />} />
                        <Route path="delayed" element={<Navigate to="/influencer/schedule" replace />} />
                        <Route path="messages" element={<InfluencerMessages />} />
                        {/* Media Reports Route */}
                        <Route path="media-reports" element={<MediaReports />} />
                        <Route path="reviews" element={<InfluencerReviews />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                    </Route>
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
