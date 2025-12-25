import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
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

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Portfolio Route */}
                <Route path="/portfolio/:username" element={<PublicPortfolio />} />

                {/* Review Submission Route */}
                <Route path="/review/:token" element={<ClientReviewPage />} />

                {/* Dashboard Routes */}
                <Route path="/brand" element={<DashboardLayout />}>
                    <Route index element={<BrandDashboard />} />
                    <Route path="discover" element={<DiscoverInfluencers />} />
                    <Route path="influencer/:id" element={<InfluencerProfile />} />
                    <Route path="closed-deals" element={<ClosedDeals />} />
                    <Route path="deals" element={<ActiveDeals />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="saved" element={<PlaceholderPage title="Saved Influencers" />} />
                </Route>

                {/* Influencer Routes */}
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

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
