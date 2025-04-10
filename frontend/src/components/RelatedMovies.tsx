import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovieImage } from '../utils/imageHelpers';

interface RelatedMoviesProps {
  relatedMovies: { id: number; title: string }[];
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({ relatedMovies }) => {
  const [loading, setLoading] = useState(true);

  // Set loading to false once movies are passed in
  useEffect(() => {
    setLoading(false);
  }, [relatedMovies]);

  return (
    <div className="related-movies">
      <h3>You may also enjoy...</h3>
      <div className="carousel">
        {loading ? (
          <p>Loading recommendations...</p>
        ) : relatedMovies.length > 0 ? (
          relatedMovies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={getMovieImage(movie.title)}
                  alt={movie.title}
                  style={{
                    width: '120px',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-poster.jpg'; // optional fallback
                  }}
                />
                <div style={{ textAlign: 'center' }}>{movie.title}</div>
              </Link>
            </div>
          ))
        ) : (
          <p>No related movies found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedMovies;
