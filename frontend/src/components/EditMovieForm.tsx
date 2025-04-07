import { useEffect, useRef, useState } from 'react';
import { MoviesTitle } from '../types/MoviesTitle';
import { updateMovie } from '../api/MoviesAPI';
import './formstyles.css';
import { genreDisplayNames } from '../utils/genreDisplayNames';

interface EditMovieFormProps {
  moviesTitle: MoviesTitle;
  onSuccess: () => void;
  onCancel: () => void;
}

const genreOptions = [
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
] as const;
type GenreKey = (typeof genreOptions)[number];

const EditMovieForm = ({
  moviesTitle,
  onSuccess,
  onCancel,
}: EditMovieFormProps) => {
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const [formData, setFormData] = useState<MoviesTitle>({ ...moviesTitle });

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    genreOptions.filter((genre) => moviesTitle[genre] === 1)
  );

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + 'px';
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Auto-grow the description field
    if (name === 'description') {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = 'auto'; // reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // grow to fit
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: MoviesTitle = { ...formData };

    genreOptions.forEach((genre) => {
      updatedData[genre] = 0;
    });

    genreOptions.forEach((genre) => {
      updatedData[genre] = 0;
    });

    selectedGenres.forEach((genre) => {
      updatedData[genre as GenreKey] = 1;
    });

    await updateMovie(updatedData.showId, updatedData);
    onSuccess();
  };
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      <h2 className="form-title">Edit Movie</h2>
      <div className="form-grid">
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </label>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Director:
          <input
            type="text"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </label>
        <label>
          Cast:
          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Release Year:
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
          />
        </label>
        <label>
          Rating:
          <input
            type="text"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </label>
        <label>
          Duration:
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="description-textarea"
            ref={descriptionRef}
          />
        </label>
        <div className="genre-label">
          <label>Genres:</label>

          <div className="selected-genre-bubbles">
            {selectedGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`genre-tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genreDisplayNames[genre] || genre}
              </button>
            ))}
          </div>

          <div className="genre-list-scrollable">
            {genreOptions.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`genre-tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genreDisplayNames[genre] || genre}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          Update Movie
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
