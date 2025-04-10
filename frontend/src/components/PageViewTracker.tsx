import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple component to log page views if consent is given
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // This effect runs when the component mounts AND whenever location.pathname changes.
    // Because this component will only be mounted when consent is true,
    // this log will only happen for page views after consent has been granted.
    console.log(`[Tracking - Consent OK] Page View: ${location.pathname}`);

    // --- IF YOU WANTED PERSISTENCE LATER ---
    // Example using localStorage (very basic):
    // try {
    //   const views = JSON.parse(localStorage.getItem('pageViews') || '[]');
    //   views.push({ path: location.pathname, time: new Date().toISOString() });
    //   localStorage.setItem('pageViews', JSON.stringify(views.slice(-100))); // Keep last 100 views
    // } catch (e) { console.error("Error saving page view", e); }
    //
    // Example sending to a backend (requires a backend endpoint):
    // fetch('/api/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type: 'pageview', path: location.pathname, timestamp: new Date().toISOString() })
    // }).catch(error => console.error('Tracking error:', error));
    // --- END EXAMPLES ---
  }, [location.pathname]); // Re-run the effect only when the pathname changes

  return null; // This component doesn't render anything visible
};

export default PageViewTracker;
