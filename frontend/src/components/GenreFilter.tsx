// components/GenreFilter.tsx
import React, { useEffect, useState } from 'react';

type GenreFilterProps = {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
};

const formatGenreLabel = (genre: string): string => {
  return genre
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Space before capital letters
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'tv') return 'TV';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  setSelectedGenres,
}) => {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    // You can hardcode or fetch from your backend later
    const staticGenres = [
      'action',
      'dramas',
      'comedies',
      'thrillers',
      'documentaries',
      'familyMovies',
      'tvComedies',
      'tvDramas',
    ];
    setGenres(staticGenres);
  }, []);

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
  };

  return (
    <div className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {genres.map((genre) => (
        <button
          key={genre}
          className={`btn ${
            selectedGenres.includes(genre) ? 'btn-dark' : 'btn-outline-dark'
          }`}
          onClick={() => toggleGenre(genre)}
        >
          {formatGenreLabel(genre)}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;