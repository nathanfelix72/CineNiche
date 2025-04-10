import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SearchPage from './pages/SearchPage';
function App() {
  return (
    <>
      {/* Cookie Consent Component */}
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>

      <Router>
        <Layout>
          <Routes>
            <Route path="/adminmovies" element={<AdminMoviesPage />} />
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
