import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch portfolio analytics data.
 * Fetches summary and sources in parallel using Promise.all.
 * Refetches if profileId or token changes.
 * 
 * @param {string} profileId - The creator's profile ID
 * @param {string} token - The auth token
 * @returns {object} - { summary, sources, loading, error }
 */
export const usePortfolioAnalytics = (profileId, token) => {
    const [summary, setSummary] = useState(null);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!profileId || !token) {
            return;
        }

        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);

            // API base URL: process.env.NEXT_PUBLIC_API_URL
            const apiBaseUrl = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) 
                || 'https://api.influrunner.com';

            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                // Fetch both endpoints in parallel
                const [summaryRes, sourcesRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/analytics/portoflio/summary/${profileId}`, { headers }),
                    fetch(`${apiBaseUrl}/analytics/portfolio/viewed/source/${profileId}`, { headers })
                ]);

                if (!summaryRes.ok || !sourcesRes.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const summaryData = await summaryRes.json();
                const sourcesData = await sourcesRes.json();

                setSummary(summaryData);
                setSources(sourcesData.sources || []);
            } catch (err) {
                console.error("Error fetching portfolio analytics:", err);
                setError("Couldn't load analytics. Try refreshing.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [profileId, token]);

    return { summary, sources, loading, error };
};

export default usePortfolioAnalytics;
