// src/pages/MovieDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoviesTitle } from '../types/MoviesTitle';
import { fetchMovieById } from '../api/MoviesAPI';
import { genreDisplayNames } from '../utils/genreDisplayNames';

const StarRatingInput = ({
  showId,
  onRatingSubmitted,
}: {
  showId: number;
  onRatingSubmitted: () => void;
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (rating: number) => {
    setSelectedRating(rating);
    try {
      await fetch(`https://localhost:5000/movie/${showId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ showId, rating }),
      });

      setSubmitted(true);
      onRatingSubmitted();
    } catch (err) {
      console.error('Rating failed:', err);
      alert('Error submitting rating.');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <p>
        <strong>Rate this movie:</strong>
      </p>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRate(star)}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
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
  const { id } = useParams();
  const [movie, setMovie] = useState<MoviesTitle | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        const data = await fetchMovieById(parseInt(id));
        setMovie(data);
      }
    };

    loadMovie();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
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
          <strong>Average Star Rating:</strong> {movie.avgStarRating.toFixed(1)}{' '}
          / 5 ⭐
        </p>
      ) : (
        <p>
          <strong>Average Star Rating:</strong> Not yet rated
        </p>
      )}

      <StarRatingInput
        showId={movie.showId}
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
          .filter(([key, value]) => genreKeys.includes(key) && value === 1)
          .map(([key]) => genreDisplayNames[key])
          .join(', ') || 'None'}
      </p>
    </div>
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
