import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Wraps protected routes — redirects to /login if no valid token exists.
 * After login the user is sent back to the page they originally tried to visit.
 */
const ProtectedRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
