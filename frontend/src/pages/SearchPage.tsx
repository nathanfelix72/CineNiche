import {
    SetStateAction,
    useEffect,
    useState,
    useRef,
    useCallback,
  } from 'react';
  import { MoviesTitle } from '../types/MoviesTitle'; // Adjust path if needed
  import { fetchMovies } from '../api/MoviesAPI'; // Adjust path if needed
  import Pagination from '../components/Pagination'; // Adjust path if needed
  import { Link } from 'react-router-dom';
  import {
    FaHome,
    FaSearch,
    FaPlus,
    FaFilm,
    FaTv,
    FaPlayCircle,
    FaStar,
    FaFilter,
  } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { Film } from 'lucide-react';
  import Logout from '../components/Logout';
  import { AuthorizedUser } from '../components/AuthorizeView';
  
  const SearchPage = () => {
    const navigate = useNavigate();
  
    // State for movie data
    const [movies, setMovies] = useState<MoviesTitle[]>([]); // For Browse
    const [searchResults, setSearchResults] = useState<MoviesTitle[]>([]); // For search results
    const [displayableMovies, setDisplayableMovies] = useState<MoviesTitle[]>([]); // Movies with verified posters for the current page
  
    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false); // Track if a search operation is active
  
    // State for genre filtering
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [availableGenres, setAvailableGenres] = useState<string[]>([
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
      'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
      'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
    ]);
  
    // State for loading and errors
    const [error, setError] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true); // Loading for API fetch
    const [isVerifyingImages, setIsVerifyingImages] = useState(false); // Loading for image checks
  
    // State for pagination
    const [pageSize, setPageSize] = useState<number>(20); // Set to 20 for 20 movies per page
    const [pageNum, setPageNum] = useState<number>(1); // Current page number
    const [totalPages, setTotalPages] = useState<number>(0); // Total pages from API
  
    // Ref for debouncing (optional, could also use searchQuery directly in cleanup)
    const searchQueryRef = useRef(searchQuery);
    searchQueryRef.current = searchQuery; // Keep ref updated
  
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
  
    // Genre filter handler
    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedGenre(e.target.value);
      setPageNum(1); // Reset to first page when genre changes
    };
  
    // --- Debouncing ---
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedQuery(searchQueryRef.current); // Update debouncedQuery after delay
      }, 700); // 500ms delay to trigger the search after typing stops
  
      return () => {
        clearTimeout(handler); // Clear timeout on cleanup to prevent issues when the user types quickly
      };
    }, [searchQuery]); // Only re-run effect when searchQuery changes
  
    // --- Data Fetching ---
    const loadMovieData = useCallback(
      async (pSize: number, pNum: number, query?: string, genre?: string) => {
        console.log(
          `Fetching: page=${pNum}, size=${pSize}, query='${query || ''}', genre='${genre || ''}'`
        );
        setIsLoadingData(true);
        setIsVerifyingImages(false); // Reset verification state on new fetch
        setDisplayableMovies([]); // Clear previous displayable movies
        setError(null);
  
        const isSearching = (query?.trim() || '').length > 0 || (genre?.trim() || '').length > 0;
        setHasSearched(isSearching);
  
        try {
          // Include genre in the filter criteria when calling fetchMovies
          const genreFilter = genre ? [genre] : [];
          const data = await fetchMovies(pSize, pNum, genreFilter, query);
  
          if (isSearching) {
            setMovies([]); // Clear browse movies when searching
            setSearchResults(data.movies);
            console.log('Search/filter results:', data.movies);
          } else {
            setSearchResults([]); // Clear search results when Browse
            setMovies(data.movies);
            console.log('Browse results:', data.movies);
          }
  
          // Calculate total pages based on the API response and current pageSize
          setTotalPages(Math.ceil(data.totalNumMovies / pSize));
        } catch (err) {
          console.error('Error fetching movie data:', err);
          setError((err as Error).message || 'Failed to load movie data.');
          setMovies([]); // Clear data on error
          setSearchResults([]);
          setTotalPages(0);
        } finally {
          setIsLoadingData(false); // Mark data loading as complete
        }
      },
      []
    ); // No dependencies, relies on arguments
  
    // Effect to trigger data fetch on page, size, debounced query, or genre change
    useEffect(() => {
      loadMovieData(pageSize, pageNum, debouncedQuery, selectedGenre);
    }, [pageSize, pageNum, debouncedQuery, selectedGenre, loadMovieData]); // Dependencies that trigger a refetch
  
    // Determine which list is the source for image verification
    const sourceMovies = hasSearched ? searchResults : movies;
  
    const sanitizeTitle = (title: string): string => {
      return title.replace(/[^a-zA-Z0-9 ]/g, '').trim(); // Remove special chars and trim
    };
  
    // --- Image URL Generation ---
    const getMovieImage = (title: string) => {
      if (!title) return '';
      const imagePath = encodeURIComponent(sanitizeTitle(title));
      return `https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/${imagePath}.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D`;
    };
  
    // --- Image Verification Effect ---
    useEffect(() => {
      if (isLoadingData || sourceMovies.length === 0) {
        setDisplayableMovies([]); // Clear displayable movies if no source or still loading data
        setIsVerifyingImages(false);
        return;
      }
  
      const checkImage = (movie: MoviesTitle): Promise<MoviesTitle | null> => {
        return new Promise((resolve) => {
          if (!movie.title) {
            resolve(null); // Skip if no title
            return;
          }
          const img = new Image();
          img.onload = () => resolve(movie); // Image exists
          img.onerror = () => resolve(null); // Image failed to load
          img.src = getMovieImage(movie.title);
        });
      };
  
      let isCancelled = false; // Flag to handle component unmount or dependency change during async operations
      setIsVerifyingImages(true); // Start verification
  
      Promise.all(sourceMovies.map(checkImage))
        .then((results) => {
          if (!isCancelled) {
            const validMovies = results.filter(
              (movie) => movie !== null
            ) as MoviesTitle[];
            setDisplayableMovies(validMovies);
            console.log('Displayable movies after verification:', validMovies);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error('Error during image verification:', err);
            setError('Failed to verify some movie posters.');
            setDisplayableMovies([]); // Clear display on verification error
          }
        })
        .finally(() => {
          if (!isCancelled) {
            setIsVerifyingImages(false); // Finish verification
          }
        });
  
      return () => {
        isCancelled = true;
        setIsVerifyingImages(false);
      };
    }, [sourceMovies, isLoadingData]);
  
    // --- Render Logic ---
    const handlePageSizeChange = (newSize: SetStateAction<number>) => {
      const resolvedSize =
        typeof newSize === 'function' ? newSize(pageSize) : newSize;
      setPageSize(resolvedSize);
      setPageNum(1); // Reset to first page when page size changes
    };
  
    // Clear all filters
    const handleClearFilters = () => {
      setSearchQuery('');
      setSelectedGenre('');
      setPageNum(1);
    };
  
    // Loading States
    if (isLoadingData) return <p>Loading movie data...</p>;
    if (isVerifyingImages) return <p>Verifying movie posters...</p>;
  
    // Error State
    if (error && !isLoadingData && !isVerifyingImages)
      return <p className="text-red-500">Error: {error}</p>;
  
    // Content Rendering
    return (
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
                    backgroundColor: '#d13e4a', // Set background color to pink
                    borderRadius: '50%', // Make the button circular
                    padding: '20px', // Padding for the size of the circle
                    fontSize: '20px', // Font size for the icon
                    border: 'none', // Remove the default button border
                    width: '60px', // Set width to match height for a perfect circle
                    height: '60px', // Set height to match width for a perfect circle
                    display: 'flex', // Use flexbox to center the icon
                    justifyContent: 'center', // Center the icon horizontally
                    alignItems: 'center', // Center the icon vertically
                  }}
                >
                  <FaStar /> {/* Star icon */}
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
                      Profile
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
        <div>
          <br />
          <br />
          <br />
          {/* Search and Filter Section */}
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-4" style={{ padding: '0 20px' }}>
            {/* Search Input */}
            <div className="d-flex align-items-center">
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search by movie title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    color: 'black',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>
  
            {/* Genre Filter Dropdown */}
            <div className="d-flex align-items-center">
              <div className="input-group" style={{ maxWidth: '250px' }}>
                <span className="input-group-text bg-white">
                  <FaFilter />
                </span>
                <select
                  className="form-select"
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  aria-label="Filter by genre"
                >
                  <option value="">All Genres</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            {/* Clear Filters Button - Only show when filters are applied */}
            {(searchQuery || selectedGenre) && (
              <button
                className="btn btn-outline-dark"
                onClick={handleClearFilters}
                style={{ maxWidth: '150px' }}
              >
                Clear Filters
              </button>
            )}
          </div>
  
          {/* Filter Status Message */}
          {(searchQuery || selectedGenre) && (
            <div style={{ padding: '0 20px', marginBottom: '20px' }}>
              <p className="mb-0">
                <small>
                  Showing results for
                  {searchQuery && <span> "{searchQuery}"</span>}
                  {searchQuery && selectedGenre && <span> in</span>}
                  {selectedGenre && <span> {selectedGenre} genre</span>}
                </small>
              </p>
            </div>
          )}
  
          {/* Conditional Messages */}
          {hasSearched &&
            sourceMovies.length === 0 &&
            !isLoadingData &&
            !isVerifyingImages && (
              <p style={{ padding: '0 20px' }}>
                No movies found{searchQuery ? ` matching "${debouncedQuery}"` : ''}
                {selectedGenre ? ` in the ${selectedGenre} genre` : ''}.
                Try different search criteria.
              </p>
            )}
          {hasSearched &&
            sourceMovies.length > 0 &&
            displayableMovies.length === 0 &&
            !isLoadingData &&
            !isVerifyingImages && (
              <p style={{ padding: '0 20px' }}>
                Found movies{searchQuery ? ` matching "${debouncedQuery}"` : ''}
                {selectedGenre ? ` in the ${selectedGenre} genre` : ''}, 
                but none have available posters for this page.
              </p>
            )}
          {!hasSearched &&
            movies.length > 0 &&
            displayableMovies.length === 0 &&
            !isLoadingData &&
            !isVerifyingImages && (
              <p style={{ padding: '0 20px' }}>No movie posters available to display for this page.</p>
            )}
          {!hasSearched &&
            movies.length === 0 &&
            !isLoadingData &&
            !isVerifyingImages && (
              <p style={{ padding: '0 20px' }}>No movies found.</p>
            )}
  
          {/* Movie Grid - Render directly from displayableMovies */}
          {displayableMovies.length > 0 && (
            <div
              className="movie-posters-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // 4 items per row
                gap: '1rem',
                marginTop: '20px',
                marginLeft: '10px',
                marginRight: '10px',
              }}
            >
              {displayableMovies.map((movie) => (
                <div
                  key={movie.showId}
                  className="movie-poster"
                  style={{ textAlign: 'center' }}
                >
                  <Link
                    to={`/movie/${movie.showId}`}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'black',
                    }}
                  >
                    <img
                      src={getMovieImage(movie.title!)}
                      className="img-fluid"
                      alt={movie.title}
                      style={{
                        width: '240px', // Bigger width
                        height: '360px', // Bigger height
                        objectFit: 'cover',
                        border: '2px solid #fff',
                        borderRadius: '4px',
                        display: 'block',
                        margin: '0 auto 5px auto', // Less vertical spacing
                      }}
                      loading="lazy"
                    />
                    <h5 style={{ minHeight: '3em' }}>{movie.title}</h5>
                  </Link>
                </div>
              ))}
            </div>
          )}
  
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
        <br />
        <br />
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
    );
  };
  
  export default SearchPage;