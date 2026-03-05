import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Wraps auth pages (login, signup, etc.) — if the user already has a valid
 * token they are redirected straight to the dashboard instead of seeing
 * the login/signup forms again.
 */
const RedirectIfAuthenticated = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/influencer" replace />;
    }

    return <Outlet />;
};

export default RedirectIfAuthenticated;
