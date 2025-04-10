import React from 'react';

type GenreFilterProps = {
  selectedGenres: string[]; // ✅ PLURAL
  setSelectedGenres: (genres: string[]) => void;
  genres: string[];
};

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  setSelectedGenres,
  genres,
}) => {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  return (
    <div
      className="genre-filter mb-3"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
    >
      {genres.map((genre) => (
        <button
          key={genre}
          className={`btn ${selectedGenres.includes(genre) ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => toggleGenre(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
export default GenreFilter;
