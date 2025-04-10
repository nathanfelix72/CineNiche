import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
              <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
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