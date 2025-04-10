import React, { useState } from 'react';

type GenreFilterProps = {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  genres: string[];
};

const formatGenreLabel = (genre: string): string => {
  return genre
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'tv') return 'TV';
      if (word.toLowerCase() === 'id') return 'ID';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  setSelectedGenres,
  genres,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="genre-filter mb-3">
      <button
        onClick={toggleExpand}
        className="btn btn-outline-secondary mb-2"
      >
        {isExpanded ? 'Hide Filters ▲' : 'Show Filters ▼'}
      </button>

      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          {genres.map((genre) => (
            <button
              key={genre}
              className={`btn ${
                selectedGenres.includes(genre)
                  ? 'btn-dark'
                  : 'btn-outline-dark'
              }`}
              onClick={() => toggleGenre(genre)}
            >
              {formatGenreLabel(genre)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreFilter;