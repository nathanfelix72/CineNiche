import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AdminMoviesPage from './pages/AdminMoviesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Layout from './components/Layout';
import CookieConsent from 'react-cookie-consent';
import { useEffect, useState } from 'react';

function App() {
  // Track consent status
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  useEffect(() => {
    // Check if consent is already stored in localStorage
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setIsConsentGiven(true);
    }
  }, []);

  // Handle consent acceptance
  const handleConsent = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsConsentGiven(true);
  };

  return (
    <>
      {/* Cookie Consent Component */}
      <CookieConsent
        onAccept={handleConsent}
        location="bottom"
        buttonText="Got it!"
        cookieName="userCookieConsent"
        style={{ background: '#2B373B', color: 'white' }}
        buttonStyle={{
          background: '#4CAF50',
          color: 'white',
          fontSize: '13px',
          padding: '10px 20px',
          borderRadius: '5px',
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>

      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Protected Route: Admin Movies Page */}
            <Route
              path="/adminmovies"
              element={
                isConsentGiven ? <AdminMoviesPage /> : <Navigate to="/" />
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/welcomepage" element={<WelcomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
