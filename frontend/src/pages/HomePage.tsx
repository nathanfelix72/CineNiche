import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import styles from './HomePage.module.css';
import {FaHome,FaSearch,FaPlus,FaFilm,FaTv,FaPlayCircle,FaStar,FaChevronLeft,FaChevronRight} from 'react-icons/fa';
import { Film } from 'lucide-react';


//  read recommender API URL from .env
const RECOMMENDER_API = import.meta.env.VITE_RECOMMENDER_API;

const HomePage = () => {
  const [recs, setRecs] = useState<{
    [key: string]: { id: number; title: string }[];
  }>({});
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Featured content state
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Featured movies and shows data
  const featuredContent = [
    {
      id: 38,
      title: "The Angry Birds Movie",
      type: "MOVIE",
      rating: "99% Match",
      year: "2018",
      description: "Birds Red Chuck and their feathered friends have lots of adventures while guarding eggs in their nest that pesky pigs keep trying to steal.",
      backgroundImage: "https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/Angry%20Birds.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D"
    },
    {
      id: 42,
      title: "Jaws",
      type: "MOVIE",
      rating: "95% Match",
      year: "1975",
      description: " When an insatiable great white shark terrorizes Amity Island a police chief an oceanographer and a grizzled shark hunter seek to destroy the beast.",
      backgroundImage: "https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/Jaws.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D"
    },
    {
      id: 128,
      title: "A Cinderella Story",
      type: "MOVIE",
      rating: "92% Match",
      year: "2004",
      description: "Teen Sam meets the boy of her dreams at a dance before returning to toil in her stepmother's diner. Can her lost cell phone bring them together?",
      backgroundImage: "https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/A%20Cinderella%20Story.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D"
    }
  ];

  // Feature carousel autoplay effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isAutoplay) {
      interval = window.setInterval(() => {
        setCurrentFeaturedIndex((prevIndex) => 
          prevIndex === featuredContent.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Change slide every 8 seconds
    }
    
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isAutoplay, featuredContent.length]);

  const handlePrevFeatured = () => {
    setIsAutoplay(false); // Stop autoplay when user interacts
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === 0 ? featuredContent.length - 1 : prevIndex - 1
    );
  };

  const handleNextFeatured = () => {
    setIsAutoplay(false); // Stop autoplay when user interacts
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === featuredContent.length - 1 ? 0 : prevIndex + 1
    );
  };

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
    } else if (link === 'Admin Login') {
      handleAdminClick();
    }
  };

  const sanitizeTitle = (title: string): string => {
    return title.replace(/[^\p{L}\p{N}\p{M}\s]/gu, '').trim();
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
        setUserId(data.userId);
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
        {/* Featured Content Banner/Carousel */}
        <div className="position-relative mb-5 mt-5" style={{ height: '500px', marginTop: '80px' }}>
          {/* Featured banner */}
          {featuredContent.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: index === currentFeaturedIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                display: 'flex',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              }}
            >
              {/* Gradient overlay */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                  zIndex: 1,
                }}
              />
              
              {/* Background image */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${item.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)',
                }}
              />
              
             {/* Content */}
              <div className="container h-100 d-flex align-items-center position-relative" style={{ zIndex: 2 }}>
                <div className="col-md-6 text-start">
                  <span 
                    className="badge mb-2"
                    style={{
                      backgroundColor: item.type === 'ORIGINAL' ? '#d13e4a' : 
                                      item.type === 'SERIES' ? '#2a7de1' : '#1a936f',
                      fontSize: '0.9rem',
                      padding: '0.5rem 1rem',
                    }}
                  >
                    {item.type}
                  </span>
                  <h1 
                    className="display-4 fw-bold mb-2" 
                    style={{
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      textAlign: 'left',
                    }}
                  >
                    {item.title}
                  </h1>
                  <div className="d-flex align-items-center mb-3">
                    <span className="text-success fw-bold me-3">{item.rating}</span>
                    <span className="text-light me-3">{item.year}</span>
                  </div>
                  <p 
                    className="lead mb-4" 
                    style={{
                      color: '#f5e9d9',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      maxWidth: '90%',
                      textAlign: 'left',
                    }}
                  >
                    {item.description}
                  </p>
                  <div className="d-flex gap-3">
                    <button 
                      className="btn btn-light btn-lg px-4 py-2"
                      style={{
                        backgroundColor: '#d13e4a',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                      onClick={() => navigate(`/movie/${item.id}`)}
                    >
                      <FaPlayCircle className="me-2" /> Watch Now
                    </button>
                    <button 
                      className="btn btn-outline-light btn-lg px-4 py-2"
                      style={{
                        borderWidth: '2px',
                        fontWeight: 'bold',
                      }}
                    >
                      <FaPlus className="me-2" /> Add to Watchlist
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
          
          {/* Navigation buttons */}
          <button
            className="btn position-absolute start-0 top-50 translate-middle-y"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 3,
              marginLeft: '20px',
            }}
            onClick={handlePrevFeatured}
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button
            className="btn position-absolute end-0 top-50 translate-middle-y"
            style={{
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 3,
              marginRight: '20px',
            }}
            onClick={handleNextFeatured}
          >
            <FaChevronRight size={20} />
          </button>
          
          {/* Indicator dots */}
          <div 
            className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
            style={{ 
              display: 'flex',
              gap: '10px',
              zIndex: 3,
            }}
          >
            {featuredContent.map((_, index) => (
              <button
                key={index}
                className="btn p-0"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: index === currentFeaturedIndex ? '#d13e4a' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                }}
                onClick={() => {
                  setIsAutoplay(false);
                  setCurrentFeaturedIndex(index);
                }}
              />
            ))}
          </div>
        </div>
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