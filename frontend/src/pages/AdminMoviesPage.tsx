import { SetStateAction, useEffect, useState } from 'react';
import { MoviesTitle } from '../types/MoviesTitle.ts';
import { deleteMovie, fetchMovies } from '../api/MoviesAPI';
import NewMovieForm from '../components/NewMovieForm.tsx';
import EditMovieForm from '../components/EditMovieForm.tsx';
import Pagination from '../components/Pagination.tsx';
import { useNavigate } from 'react-router-dom';

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

  // Initial movie load (no filter)
  useEffect(() => {
    const loadMovies = async () => {
      try {
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
  }, [pageSize, pageNum]);

  const handleDelete = async (showId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(showId);
      setMovies(movies.filter((m) => Number(m.showId) !== showId));
    } catch {
      alert('Failed to delete movie. Please try again.');
    }
  };

  // Handle search logic
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Clear search
      setSearchResults([]);
      setHasSearched(false);
      setPageNum(1);
      try {
        const data = await fetchMovies(pageSize, 1, [], '');
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        console.error('Error fetching all movies:', err);
        alert('Failed to load all movies.');
      }
    } else {
      // Do the actual search
      try {
        const data = await fetchMovies(pageSize, 1, [], searchQuery);
        setSearchResults(data.movies);
        setHasSearched(true);
        setPageNum(1);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        console.error('Search error:', err);
        alert('Something went wrong while searching.');
      }
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Movies</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Movie
        </button>
      )}

      {showForm && !editingMovie && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && !showForm && (
        <EditMovieForm
          moviesTitle={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(pageSize, pageNum, []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page refresh
          handleSearch();
        }}
        style={{ marginBottom: '1rem' }}
      >
        <input
          type="text"
          placeholder="Search by movie title..."
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            if (value.trim() === '') {
              setHasSearched(false);
              setSearchResults([]);
            }
          }}
          className="form-control"
          style={{
            maxWidth: '300px',
            display: 'inline-block',
            marginRight: '0.5rem',
          }}
        />

        <button type="submit" className="btn btn-outline-primary">
          Search
        </button>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
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
          {/* Display either the search results or full list of movies */}
          {(hasSearched ? searchResults : movies).map((m) => (
            <tr key={m.showId}>
              <td>{m.showId}</td>
              <td>{m.type}</td>
              <td>{m.title}</td>
              <td>{m.rating}</td>
              <td>{m.avgStarRating?.toFixed(1) ?? '—'}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingMovie(m)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(Number(m.showId))}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary btn-sm w-100 mt-1"
                  onClick={() => navigate(`/movie/${m.showId}`)}
                >
                  More Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize: SetStateAction<number>) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminMoviesPage;
