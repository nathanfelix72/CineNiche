import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... other page imports
import Layout from './components/Layout';
import CookieConsent, { Cookies } from 'react-cookie-consent'; // Import Cookies helper
import { useState, useEffect } from 'react';
import SearchPage from './pages/SearchPage';
import WelcomePage from './pages/WelcomePage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MovieDetailsPage from './pages/MovieDetailsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

// --- EXAMPLE: Component to conditionally load Analytics ---
const InitializeAnalytics = () => {
  useEffect(() => {
    // This effect runs only when the component mounts (i.e., when consent is given)
    console.log('Consent granted! Initializing Analytics...');
    // --- !!! PLACE YOUR ANALYTICS INIT CODE HERE !!! ---
    // Example for Google Analytics (replace with your actual code):
    // if (window.ga) {
    //   window.ga('create', 'UA-XXXXX-Y', 'auto');
    //   window.ga('send', 'pageview');
    // }
    // --- END OF ANALYTICS INIT CODE ---
  }, []); // Empty dependency array ensures it runs only once on mount

  return null; // This component doesn't render anything visible
};
// --- END EXAMPLE ---

function App() {
  // State to track if consent is granted. Initialize by checking the cookie.
  const [hasConsent, setHasConsent] = useState(
    () => !!Cookies.get('userCookieConsent')
  );

  const handleAccept = () => {
    // The component sets the cookie specified by cookieName automatically.
    // We just update our local state.
    setHasConsent(true);
    console.log('Cookie consent accepted.');
  };

  const handleDecline = () => {
    // Update state - useful if you need to actively remove things or prevent features
    setHasConsent(false);
    console.log('Cookie consent declined.');
    // You might want to remove any non-essential cookies already set, if possible
    // Cookies.remove('some_analytics_cookie'); // Example
  };

  // Log consent status on change (for debugging)
  useEffect(() => {
    console.log('Consent status:', hasConsent);
  }, [hasConsent]);

  return (
    <>
      {/* Cookie Consent Component */}
      <CookieConsent
        location="bottom"
        buttonText="Accept Necessary Cookies"
        cookieName="userCookieConsent" // The cookie managed by this component
        style={{ background: '#2B373B', zIndex: 10000 }} // Ensure high z-index
        buttonStyle={{
          background: '#4CAF50',
          color: 'white',
          fontSize: '13px' /*...*/,
        }}
        // Decline Button
        enableDeclineButton
        declineButtonText="Decline Non-Essential"
        declineButtonStyle={{
          background: '#f1f1f1',
          color: '#333',
          fontSize: '13px' /*...*/,
        }}
        // Flip Buttons (optional, makes Accept more prominent)
        // flipButtons
        // Callbacks
        onAccept={handleAccept}
        onDecline={handleDecline}
        // Behavior - Set cookie on accept, don't set one on decline by default (check docs if needed)
        // setDeclineCookie={false} // Usually default
        expires={150} // Cookie expiration in days
        // debug={true} // Useful during development
      >
        This website uses essential cookies for authentication and basic
        functionality. We also use non-essential cookies to enhance user
        experience and analyze traffic. See our{' '}
        <a href="/privacy-policy" style={{ color: '#aef' }}>
          Privacy Policy
        </a>{' '}
        for more details. Do you accept non-essential cookies?
      </CookieConsent>

      {/* --- Conditionally Render Non-Essential Components --- */}
      {/* Only mount InitializeAnalytics if consent has been granted */}
      {hasConsent && <InitializeAnalytics />}
      {/* Add similar conditional logic for other non-essential components/scripts */}

      <Router>
        <Layout>
          <Routes>
            {/* Your Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/adminmovies" element={<AdminMoviesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
