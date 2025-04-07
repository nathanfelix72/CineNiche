import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminMoviesPage from './pages/AdminMoviesPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AdminMoviesPage />} />
          <Route path="/adminmovies" element={<AdminMoviesPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
