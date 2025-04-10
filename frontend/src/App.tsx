import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... other page imports
import Layout from './components/Layout';
import CookieConsent from 'react-cookie-consent'; // Import Cookies helper
import { useEffect } from 'react';
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

function App() {
  return (
    <ConsentProvider>
      <>
        <CookieConsentConsumer />
        <Router>
          <ConditionalTracking />
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
    </ConsentProvider>
  );
}

const CookieConsentConsumer = () => {
  const { acceptConsent, declineConsent } = useConsent();
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
      // Decline Button
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
      <a href="/privacy-policy" style={{ color: '#aef' }}>
        Privacy Policy
      </a>{' '}
      for more details. Do you accept non-essential cookies?
    </CookieConsent>
  );
};

const ConditionalTracking = () => {
  const { hasConsent } = useConsent();
  useEffect(() => {
    console.log('[ConditionalTracking] Consent status:', hasConsent);
  }, [hasConsent]);
  return hasConsent ? <PageViewTracker /> : null;
};

export default App;
