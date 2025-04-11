import React from 'react';
import { FaFilter } from 'react-icons/fa';
import './GenreFilter.css'; // You'll need to create this CSS file

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  genres, 
  selectedGenre, 
  onGenreSelect 
}) => {
  return (
    <div className="genre-filter-container">
      <div className="genre-filter-header">
        <FaFilter className="filter-icon" />
        <h5>Filter by Genre</h5>
      </div>
      
      <div className="genre-buttons">
        <button
          className={`genre-button ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => onGenreSelect(null)}
        >
          All Genres
        </button>
        
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onGenreSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;