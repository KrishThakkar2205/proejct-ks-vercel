import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Fires a Google Analytics page_view event every time the user
 * navigates to a different route inside the React SPA.
 */
function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        // Make sure gtag is available (loaded from index.html)
        if (typeof window.gtag !== 'function') return;

        window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title,
        });
    }, [location]);
}

export default usePageTracking;
