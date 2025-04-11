import { SetStateAction, useEffect, useState } from 'react';
import { MoviesTitle } from '../types/MoviesTitle';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import NewMovieForm from '../components/NewMovieForm.tsx';
import EditMovieForm from '../components/EditMovieForm.tsx';
import Pagination from '../components/Pagination.tsx';
import { useNavigate } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView.tsx';
import RequireRole from '../components/RequireRole.tsx';
import Logout from '../components/Logout.tsx';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<MoviesTitle[]>([]);
  const [searchResults, setSearchResults] = useState<MoviesTitle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MoviesTitle | null>(null);
  const navigate = useNavigate();

  const handlePageSizeChange = (newSize: SetStateAction<number>) => {
    const resolvedSize = typeof newSize === 'function' ? newSize(pageSize) : newSize;
    setPageSize(resolvedSize);
    setPageNum(1);
  };

  // 🔧 Load movies when not searching
  useEffect(() => {
    if (hasSearched) return;

    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchMovies(pageSize, pageNum, []);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, hasSearched]);

  // 🔧 Load search results on pagination change
  useEffect(() => {
    const fetchSearchedMovies = async () => {
      if (!hasSearched || !searchQuery.trim()) return;

      try {
        setLoading(true);
        const data = await fetchMovies(pageSize, pageNum, [], searchQuery);
        setSearchResults(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchedMovies();
  }, [pageSize, pageNum, hasSearched, searchQuery]);

  const handleDelete = async (showId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      setMovies(movies.filter((m) => Number(m.showId) !== showId));
      setSearchResults(searchResults.filter((m) => Number(m.showId) !== showId));
    } catch {
      alert('Failed to delete movie. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Clear search
      setSearchResults([]);
      setHasSearched(false);
      setPageNum(1);
    } else {
      setHasSearched(true);
      setPageNum(1);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const moviesToDisplay = hasSearched ? searchResults : movies;

  return (
    <AuthorizeView>
      <RequireRole role="Administrator" redirectTo="/homepage">
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 70%, #d13e4a 0%, #f5e9d9 70%)',
            overflowY: 'auto',
            zIndex: 9999,
            paddingTop: '50px',
            paddingBottom: '50px',
          }}
        >
        <div style={{ marginBottom: '1rem' }}>
        <button
          className="submit-btn mb-3"
          onClick={() => navigate('/login')}
          style={{ marginRight: '2rem', color: 'white', fontWeight: 'bold', textDecoration: 'none' }}
        >
          <Logout>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Logout</span>
              <span style={{ fontWeight: 'bold' }}>
                <AuthorizedUser value="email" />
              </span>
            </div>
          </Logout>
        </button>

        <button className="submit-btn mb-3" onClick={() => navigate('/homepage')}>
          Homepage
        </button>
      </div>
          <div
            className="movie-form"
            style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', textAlign: 'center' }}
          >
            <h1
              style={{
                fontFamily: 'Monoton, cursive',
                wordSpacing: '0.3em',
                color: '#d13e4a',
              }}
            >
              ADMIN MOVIES PAGE
            </h1>

            {!showForm && (
              <button className="submit-btn mb-3" onClick={() => setShowForm(true)}>
                Add Movie
              </button>
            )}

            {showForm && !editingMovie && (
              <NewMovieForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchMovies(pageSize, pageNum, []).then((data) => setMovies(data.movies));
                }}
                onCancel={() => setShowForm(false)}
              />
            )}

            {editingMovie && !showForm && (
              <EditMovieForm
                moviesTitle={editingMovie}
                onSuccess={() => {
                  setEditingMovie(null);
                  fetchMovies(pageSize, pageNum, []).then((data) => setMovies(data.movies));
                }}
                onCancel={() => setEditingMovie(null)}
              />
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              style={{ marginBottom: '1rem' }}
            >
              <input
                type="text"
                placeholder="Search by movie title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ maxWidth: '300px', display: 'inline-block', marginRight: '0.5rem' }}
              />
              <button type="submit" className="submit-btn">
                Search
              </button>
            </form>

            <table className="table table-hover table-light">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Rating</th>
                  <th>Avg Star Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {moviesToDisplay.map((m) => (
                  <tr key={m.showId}>
                    <td>{m.showId}</td>
                    <td>{m.type}</td>
                    <td>{m.title}</td>
                    <td>{m.rating}</td>
                    <td>{m.avgStarRating?.toFixed(1) ?? '—'}</td>
                    <td>
                      <button className="submit-btn btn-sm w-20 mb-1" onClick={() => setEditingMovie(m)}>
                        Edit
                      </button>
                      <br />
                      <button
                        className="cancel-btn btn-sm w-20 mb-1"
                        onClick={() => handleDelete(Number(m.showId))}
                      >
                        Delete
                      </button>
                      <br />
                      <button
                        className="genre-tag btn-sm w-20 mb-1"
                        onClick={() => navigate(`/movie/${m.showId}`)}
                      >
                        More Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
        </div>
      </RequireRole>
    </AuthorizeView>
  );
};

export default AdminMoviesPage;
