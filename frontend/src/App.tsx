import { useEffect } from 'react'; // Ensure React is imported
import './App.css';
// Use BrowserRouter directly or rename the import if preferred
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CookieConsent from 'react-cookie-consent';
import SearchPage from './pages/SearchPage';
import WelcomePage from './pages/WelcomePage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MovieDetailsPage from './pages/MovieDetailsPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PageViewTracker from './components/PageViewTracker';
import { ConsentProvider, useConsent } from './components/ConsentContext';

// --- Import the modified AuthorizeView ---
import AuthorizeView from './components/AuthorizeView'; // Adjust path if needed

function App() {
  return (
    <ConsentProvider>
      <>
        {/* CookieConsent needs to be high up, but can be outside Router */}
        <CookieConsentConsumer />
        <BrowserRouter>
          {/* Tracking might depend on consent only, place inside Router if it needs router context */}
          <ConditionalTracking />

          {/* --- Wrap Layout with AuthorizeView --- */}
          {/* AuthorizeView will run the auth check and provide context */}
          <AuthorizeView>
            <Layout>
              {' '}
              {/* Layout and its children now have access to UserContext */}
              <Routes>
                {/* Public Routes: Accessible always. AuthorizeView won't redirect from /login */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Protected Routes: AuthorizeView will redirect to /login if not authenticated */}
                <Route path="/adminmovies" element={<AdminMoviesPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Add other routes as needed */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </Layout>
          </AuthorizeView>
        </BrowserRouter>
      </>
    </ConsentProvider>
  );
}

// --- CookieConsentConsumer Component ---
const CookieConsentConsumer = () => {
  const { acceptConsent, declineConsent } = useConsent();
  // Make sure href is correct if PrivacyPolicy is a route
  const privacyPolicyPath = '/privacy-policy';

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept Necessary Cookies"
      cookieName="userCookieConsent" // The cookie managed by this component
      style={{ background: '#2B373B', zIndex: 10000 }} // Ensure high z-index
      buttonStyle={{
        background: '#4CAF50',
        color: 'white',
        fontSize: '13px',
      }}
      enableDeclineButton
      declineButtonText="Decline Non-Essential"
      declineButtonStyle={{
        background: '#f1f1f1',
        color: '#333',
        fontSize: '13px',
      }}
      onAccept={acceptConsent}
      onDecline={declineConsent}
      expires={150}
    >
      This website uses essential cookies for authentication and basic
      functionality. We also use non-essential cookies to enhance user
      experience and analyze traffic. See our{' '}
      {/* Use Link component from react-router-dom if possible for client-side routing */}
      <a href={privacyPolicyPath} style={{ color: '#aef' }}>
        Privacy Policy
      </a>{' '}
      for more details. Do you accept non-essential cookies?
    </CookieConsent>
  );
};

// --- ConditionalTracking Component ---
const ConditionalTracking = () => {
  const { hasConsent } = useConsent();
  useEffect(() => {
    // This will log whenever consent status changes or component mounts
    console.log('[ConditionalTracking] Consent status:', hasConsent);
  }, [hasConsent]); // Dependency array ensures it runs when hasConsent changes

  // Render PageViewTracker only if consent is given
  return hasConsent ? <PageViewTracker /> : null;
};

export default App;
