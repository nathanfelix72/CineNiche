import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminMoviesPage from './pages/AdminMoviesPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AdminMoviesPage />} />
          <Route path="/adminmovies" element={<AdminMoviesPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
