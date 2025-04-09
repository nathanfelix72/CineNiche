import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoviesTitle } from '../types/MoviesTitle';
import { fetchMovieById } from '../api/MoviesAPI';
import { genreDisplayNames } from '../utils/genreDisplayNames';
import { fetchRelatedMovies } from '../api/MoviesAPI';
import './MovieDetailsPage.module.css';
import RelatedMovies from '../components/RelatedMovies';
import AuthorizeView from '../components/AuthorizeView';
import './movieDetailsPage.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaFilm,
  FaTv,
  FaPlayCircle,
} from 'react-icons/fa';
import { Film } from 'lucide-react';

const StarRatingInput = ({
  showId,
  userId,
  onRatingSubmitted,
}: {
  showId: number;
  userId: number | null;
  onRatingSubmitted: () => void;
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (rating: number) => {
    if (userId === null) {
      alert('You must be logged in to rate a movie.');
      return;
    }

    setSelectedRating(rating);
    try {
      await fetch(
        `https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/Movie/${showId}/rate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ showId, rating, userId }), // Include userId
        }
      );

      setSubmitted(true);
      onRatingSubmitted();
    } catch (err) {
      console.error('Rating failed:', err);
      alert('Error submitting rating.');
    }
  };
  return (
    <div style={{ marginTop: '1rem' }}>
      <p style={{ marginBottom: '-1rem' }}>
        <strong>Rate this movie:</strong>
      </p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRate(star)}
          style={{
            cursor: 'pointer',
            fontSize: '4rem',
            color:
              selectedRating && star <= selectedRating ? '#f5c518' : '#ccc',
          }}
        >
          ★
        </span>
      ))}
      {submitted && <p style={{ color: 'green' }}>Thanks for rating!</p>}
    </div>
  );
};

const MovieDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState<MoviesTitle | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<
    { id: number; title: string }[]
  >([]);
  const [userId, setUserId] = useState<number | null>(null); // State for user ID
  // Dynamically fetch image based on movie title
  const getMovieImage = (title: string) => {
    const imagePath = encodeURIComponent(title); // Proper URL encoding
    return `https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/${imagePath}.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D`;
  };

  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handlePrivacyClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/privacy-policy');
  };

  const handlePrivacyClick2 = () => {
    // Navigate to the Privacy Policy page
    navigate('/adminmovies');
  };

  const handleClick = (link: string) => {
    if (link === 'Privacy') {
      handlePrivacyClick();
    } else if (link === 'Admin Page') {
      handlePrivacyClick2();
    }
  };

  // Load the selected movie by ID
  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        const data = await fetchMovieById(parseInt(id));
        setMovie(data);
      }
    };

    loadMovie();
  }, [id]);

  // Fetch the current user ID from API or context (adjust based on your auth setup)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/User/current',
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        if (data && data.userId) {
          setUserId(data.userId);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch related movies by title from hybrid recommender
  useEffect(() => {
    const loadRelated = async () => {
      if (movie?.title) {
        try {
          const data = await fetchRelatedMovies(movie.title);
          console.log('Raw response from fetchRelatedMovies:', data);

          // Option 1: if data is an object with .recommended
          if (Array.isArray(data.recommended)) {
            setRelatedMovies(data.recommended);
          }
          // Option 2: if data *is* the array
          else if (Array.isArray(data)) {
            setRelatedMovies(data);
          } else {
            console.warn('Unexpected data format:', data);
            setRelatedMovies([]); // prevent crash
          }
        } catch (error) {
          console.error('Error fetching related movies:', error);
        }
      }
    };

    loadRelated();
  }, [movie?.title]);

  return (
    <AuthorizeView>
      {!movie ? (
        <div>Loading...</div>
      ) : (
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <p>
            <strong>Type:</strong> {movie.type}
          </p>
          <p>
            <strong>Director:</strong> {movie.director}
          </p>
          <p>
            <strong>Cast:</strong> {movie.cast}
          </p>
          <p>
            <strong>Country:</strong> {movie.country}
          </p>
          <p>
            <strong>Release Year:</strong> {movie.releaseYear}
          </p>
          <p>
            <strong>Rating:</strong> {movie.rating}
          </p>
          {movie.avgStarRating !== undefined && movie.avgStarRating !== null ? (
            <p>
              <strong>Average Star Rating:</strong>{' '}
              {movie.avgStarRating.toFixed(1)} / 5 ⭐
            </p>
          ) : (
            <p>
              <strong>Average Star Rating:</strong> Not yet rated
            </p>
          )}
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
              paddingTop: '50px', // Adds space at the top
              paddingBottom: '50px', // Adds space at the bottom
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
                  <button
                    className="btn fw-bold nav-btn"
                    onClick={() => navigate('/homepage')}
                  >
                    <FaHome className="nav-icon" style={{ margin: '0.5rem' }} />
                    <span>Home</span>
                  </button>
                  <button
                    className="btn fw-bold nav-btn"
                    onClick={() => navigate('/search')}
                  >
                    <FaSearch
                      className="nav-icon"
                      style={{ margin: '0.5rem' }}
                    />
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
                    <FaPlayCircle
                      className="nav-icon"
                      style={{ margin: '0.5rem' }}
                    />
                    <span>Originals</span>
                  </button>
                  {/* Profile Icon */}
                  <div className="dropdown">
                    <button
                      className="btn btn-dark"
                      onClick={toggleProfileDropdown}
                      style={{
                        borderRadius: '50%',
                        padding: '20px', // Increased padding for a bigger circle
                        fontSize: '24px', // Increased font size for the icon
                      }}
                    >
                      <i className="bi bi-person-circle"></i>{' '}
                      {/* New icon (gear icon) */}
                    </button>
                    {isProfileDropdownOpen && (
                      <div
                        className="dropdown-menu show"
                        style={{ position: 'absolute', right: 0 }}
                      >
                        <p
                          className="dropdown-item fw-bold"
                          style={{ color: '#d13e4a' }}
                        >
                          Help
                        </p>
                        <p
                          className="dropdown-item fw-bold"
                          style={{ color: '#d13e4a' }}
                        >
                          Edit Profile
                        </p>
                        <p
                          className="dropdown-item fw-bold"
                          style={{ color: '#d13e4a' }}
                        >
                          Account
                        </p>
                        <p
                          className="dropdown-item fw-bold"
                          style={{ color: '#d13e4a' }}
                        >
                          App Settings
                        </p>
                        <button
                          className="dropdown-item fw-bold"
                          onClick={() => navigate('/login')}
                          style={{ color: '#d13e4a' }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>
            <br />
            <br />
            <div className="movie-details">
              <div className="movie-info">
                {/* Movie Poster */}
                <div className="movie-poster">
                  <img
                    src={getMovieImage(movie.title)}
                    className="img-fluid"
                    alt={movie.title}
                    style={{
                      width: '100%', // Make images take up the full width of their container
                      height: '100%', // Fixed height to make images uniform
                      objectFit: 'cover', // Crop images to fit within the specified dimensions
                      border: '4px solid #000',
                      boxShadow: '0 5px 15px #d13e4a',
                    }}
                  />
                </div>

                {/* Movie Information */}
                <div className="movie-description">
                  <h2>{movie.title}</h2>
                  <p>
                    <strong>Type:</strong> {movie.type}
                  </p>
                  <p>
                    <strong>Director:</strong> {movie.director}
                  </p>
                  <p>
                    <strong>Cast:</strong> {movie.cast}
                  </p>
                  <p>
                    <strong>Country:</strong> {movie.country}
                  </p>
                  <p>
                    <strong>Release Year:</strong> {movie.releaseYear}
                  </p>
                  <p>
                    <strong>Rating:</strong> {movie.rating}
                  </p>
                  {movie.avgStarRating !== undefined &&
                  movie.avgStarRating !== null ? (
                    <p>
                      <strong>Average Star Rating:</strong>{' '}
                      {movie.avgStarRating.toFixed(1)} / 5 ⭐
                    </p>
                  ) : (
                    <p>
                      <strong>Average Star Rating:</strong> Not yet rated
                    </p>
                  )}

                  <StarRatingInput
                    showId={movie.showId}
                    userId={userId} // Pass the userId to StarRatingInput
                    onRatingSubmitted={async () => {
                      const updated = await fetchMovieById(movie.showId);
                      setMovie(updated);
                    }}
                  />
                  <StarRatingInput
                    showId={movie.showId}
                    userId={userId} // Pass the userId to StarRatingInput
                    onRatingSubmitted={async () => {
                      const updated = await fetchMovieById(movie.showId);
                      setMovie(updated);
                    }}
                  />

                  <p>
                    <strong>Duration:</strong> {movie.duration}
                  </p>
                  <p>
                    <strong>Description:</strong> {movie.description}
                  </p>
                  <p>
                    <strong>Genres:</strong>{' '}
                    {Object.entries(movie)
                      .filter(
                        ([key, value]) => genreKeys.includes(key) && value === 1
                      )
                      .map(([key]) => genreDisplayNames[key])
                      .join(', ') || 'None'}
                  </p>
                  <p>
                    <strong>Duration:</strong> {movie.duration}
                  </p>
                  <p>
                    <strong>Description:</strong> {movie.description}
                  </p>
                  <p>
                    <strong>Genres:</strong>{' '}
                    {Object.entries(movie)
                      .filter(
                        ([key, value]) => genreKeys.includes(key) && value === 1
                      )
                      .map(([key]) => genreDisplayNames[key])
                      .join(', ') || 'None'}
                  </p>

                  {/* Related Movies Carousel */}
                  <RelatedMovies relatedMovies={relatedMovies} />
                </div>
                {/* 🎯 Related Movies Carousel */}
                {relatedMovies.length > 0 && (
                  <div className="related-movies">
                    <h3>Related Movies</h3>
                    <div className="carousel">
                      {relatedMovies.map(
                        (
                          movie // Renamed variable to 'movie'
                        ) => (
                          // Use movie.id as the key
                          <div key={movie.id} className="carousel-item">
                            {/* Use Link component and movie.id for the route */}
                            <Link to={`/movie/${movie.id}`}>
                              {/* Display the movie.title */}
                              {movie.title}
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Footer with Classic Cinema Credits Style */}
          <footer
            className="py-5"
            style={{
              backgroundColor: '#f5e9d9',
              borderTop: '3px double rgba(255, 255, 255, 0.1)',
              color: '#999',
              position: 'relative',
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
                      ['Privacy', 'Admin Page', 'Ad Choices', 'Contact Us'],
                    ].map((group, idx) => (
                      <div className="col" key={idx}>
                        <ul className="list-unstyled small">
                          {group.map((link, i) => (
                            <li key={i} className="mb-2">
                              <a
                                href="#"
                                className="text-decoration-none"
                                style={{
                                  color: '#a9a9a9',
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
      )}
    </AuthorizeView>
  );
};

const genreKeys = [
  'action',
  'adventure',
  'animeSeriesInternationalTvShows',
  'britishTvShowsDocuseriesInternationalTvShows',
  'children',
  'comedies',
  'comediesDramasInternationalMovies',
  'comediesInternationalMovies',
  'comediesRomanticMovies',
  'crimeTvShowsDocuseries',
  'documentaries',
  'documentariesInternationalMovies',
  'docuseries',
  'dramas',
  'dramasInternationalMovies',
  'dramasRomanticMovies',
  'familyMovies',
  'fantasy',
  'horrorMovies',
  'internationalMoviesThrillers',
  'internationalTvShowsRomanticTvShowsTvDramas',
  'kidsTv',
  'languageTvShows',
  'musicals',
  'natureTv',
  'realityTv',
  'spirituality',
  'tvAction',
  'tvComedies',
  'tvDramas',
  'talkShowsTvComedies',
  'thrillers',
];

export default MovieDetailsPage;
