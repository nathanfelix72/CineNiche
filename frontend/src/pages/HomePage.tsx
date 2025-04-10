import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import styles from './HomePage.module.css';
import {FaHome,FaSearch,FaPlus,FaFilm,FaTv,FaPlayCircle,FaStar} from 'react-icons/fa';
import { Film } from 'lucide-react';


//  read recommender API URL from .env
const RECOMMENDER_API = import.meta.env.VITE_RECOMMENDER_API;

const HomePage = () => {
  const [recs, setRecs] = useState<{
    [key: string]: { id: number; title: string }[];
  }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handlePrivacyClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/privacy-policy');
  };

  const handleAdminClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/adminmovies');
  };

  const handleClick = (link: string) => {
    if (link === 'Privacy') {
      handlePrivacyClick();
    } else if (link === 'Admin Page') {
      handleAdminClick();
    }
  };

  const sanitizeTitle = (title: string): string => {
    return title.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
  };
  
  // --- Image URL Generation ---
  const getMovieImage = (title: string) => {
    if (!title) return '';
    const imagePath = encodeURIComponent(sanitizeTitle(title));
    return `https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/${imagePath}.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D`;
  };


  // Fetch current user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/user/current',
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setUserEmail(data.email);
        setUserId(data.userId);
        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch user recommendations from your recommender API
  useEffect(() => {
    if (!userId || !RECOMMENDER_API) return;

    const fetchRecs = async () => {
      try {
        const res = await fetch(
          `${RECOMMENDER_API}/user-recs?user_id=${userId}`
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        console.log('Fetched recommendations:', JSON.stringify(data, null, 2));
        setRecs(data);
      } catch (err) {
        console.error('Error fetching user recommendations:', err);
      }
    };

    fetchRecs();
  }, [userId]);

  return (
    <AuthorizeView>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage:
          'radial-gradient(circle at 20% 70%, #d13e4a 0%, #f5e9d9 70%)',
        overflowY: 'auto',
        zIndex: 9999,
        paddingTop: '50px',
        paddingBottom: '50px',
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-dark px-4 py-3"
        style={{
          background: 'linear-gradient(90deg, #d13e4a 0%, #f5e9d9 100%)',
          borderBottom: '3px double rgba(255, 255, 255, 0.15)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
        }}
      >
        <div className="container-fluid justify-content-between">
          <div className="d-flex align-items-center">
            <h1
              className="navbar-brand fs-2 fw-bold mb-0"
              style={{
                fontFamily: 'Monoton, cursive',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              CINENICHE
            </h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Navigation Buttons */}
            <button className="btn fw-bold nav-btn" onClick={() => navigate('/homepage')}>
              <FaHome className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Home</span>
            </button>
            <button className="btn fw-bold nav-btn" onClick={() => navigate('/search')}>
              <FaSearch className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Search</span>
            </button>
            <button className="btn fw-bold nav-btn">
              <FaPlus className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Watchlist</span>
            </button>
            <button className="btn fw-bold nav-btn">
              <FaFilm className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Movies</span>
            </button>
            <button className="btn fw-bold nav-btn">
              <FaTv className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Series</span>
            </button>
            <button className="btn fw-bold nav-btn">
              <FaPlayCircle className="nav-icon" style={{ margin: '0.5rem' }} />
              <span>Originals</span>
            </button>

            {/* Profile Icon */}
            <div className="dropdown">
              <button
                className="btn"
                onClick={toggleProfileDropdown}
                style={{
                  backgroundColor: '#d13e4a',
                  borderRadius: '50%',
                  padding: '20px',
                  fontSize: '20px',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FaStar />
              </button>
              {isProfileDropdownOpen && (
                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                  <p className="dropdown-item fw-bold" style={{ color: '#d13e4a' }}>Help</p>
                  <p className="dropdown-item fw-bold" style={{ color: '#d13e4a' }}>Profile</p>
                  <p className="dropdown-item fw-bold" style={{ color: '#d13e4a' }}>Account</p>
                  <p className="dropdown-item fw-bold" style={{ color: '#d13e4a' }}>App Settings</p>
                  <button
                    className="dropdown-item fw-bold"
                    onClick={() => navigate('/login')}
                    style={{ color: '#d13e4a' }}
                  >
                    <Logout>
                      Logout <AuthorizedUser value="email" />
                    </Logout>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.homePage}>
  <h1>Welcome {userName ? userName : userEmail}!</h1>

  {Object.entries(recs).map(([section, movies]) => (
    <div key={section} className={styles.carouselSection}>
      <h2>{section}</h2>
      <div
        className={styles.carousel}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          paddingBottom: '1rem',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              flex: '0 0 auto',
              scrollSnapAlign: 'start',
              width: '200px',
            }}
          >
            <Link to={`/movie/${movie.id}`} style={{textDecoration: 'none'}}>
              <img
                src={getMovieImage(movie.title!)}
                className="img-fluid"
                alt={movie.title}
                style={{
                  width: '200px',
                  height: '300px',
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  borderRadius: '4px',
                  display: 'block',
                  margin: '0 auto 10px auto',
                }}
                loading="lazy"
              />
              <div
                className="text-black"
                style={{
                  textAlign: 'center',
                  fontWeight: '500',
                }}
              >
                {movie.title}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  ))}
           {/* Footer with Classic Cinema Credits Style */}
    <footer
          className="py-5"
          style={{
            backgroundColor: 'transparent',
            borderTop: '3px double rgba(255, 255, 255, 0.1)',
            color: 'black',
            position: 'relative',
            fontWeight: 'bold'
          }}
        >
          {/* Film style perforation at top of footer */}
          <div
            className="position-absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(215, 65, 103, 0.2) 0px, rgba(215, 65, 103, 0.2) 6px, transparent 6px, transparent 12px)',
            }}
          ></div>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Film size={16} className="me-2" />
                  <p
                    className="mb-0"
                    style={{ fontFamily: '"Courier Prime", monospace' }}
                  >
                    Questions? Call 1-123-456-7890
                  </p>
                </div>

                <div className="row row-cols-2 row-cols-md-4 g-4 mb-4">
                  {[
                    ['FAQ', 'Help Center', 'Account', 'Media Center'],
                    [
                      'Investor Relations',
                      'Jobs',
                      'Ways to Watch',
                      'Corporate Information',
                    ],
                    [
                      'Buy Gift Cards',
                      'Cookie Preferences',
                      'Legal Notices',
                      'Terms of Use',
                    ],
                    ['Privacy', 'Admin Login', 'Ad Choices', 'Contact Us'],
                  ].map((group, idx) => (
                    <div className="col" key={idx}>
                      <ul className="list-unstyled small">
                        {group.map((link, i) => (
                          <li key={i} className="mb-2">
                            <a
                              href="#"
                              className="text-decoration-none"
                              style={{
                                color: 'black',
                                fontFamily: '"Courier Prime", monospace',
                              }}
                              onClick={() => handleClick(link)}
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </AuthorizeView>
  );
};

export default HomePage;
