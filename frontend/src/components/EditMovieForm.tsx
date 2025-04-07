import { useState } from 'react';
import { updateMovie } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

// 1. Define the genre keys
type GenreKey = keyof Pick<
  Movie,
  | 'action'
  | 'adventure'
  | 'animeSeriesInternationalTvShows'
  | 'britishTvShowsDocuseriesInternationalTvShows'
  | 'children'
  | 'comedies'
  | 'comediesDramasInternationalMovies'
  | 'comediesInternationalMovies'
  | 'comediesRomanticMovies'
  | 'crimeTvShowsDocuseries'
  | 'documentaries'
  | 'documentariesInternationalMovies'
  | 'docuseries'
  | 'dramas'
  | 'dramasInternationalMovies'
  | 'dramasRomanticMovies'
  | 'familyMovies'
  | 'fantasy'
  | 'horrorMovies'
  | 'internationalMoviesThrillers'
  | 'internationalTvShowsRomanticTvShowsTvDramas'
  | 'kidsTv'
  | 'languageTvShows'
  | 'musicals'
  | 'natureTv'
  | 'realityTv'
  | 'spirituality'
  | 'tvAction'
  | 'tvComedies'
  | 'tvDramas'
  | 'talkShowsTvComedies'
  | 'thrillers'
>;

const GENRES: GenreKey[] = [
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

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  // Find currently selected genre
  const currentGenre = GENRES.find((genre) => formData[genre] === 1) || '';

  const [selectedGenre, setSelectedGenre] = useState<GenreKey | ''>(
    currentGenre
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as GenreKey;
    setSelectedGenre(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set all genre values to 0 (false)
    const updatedGenres: Partial<Record<GenreKey, number>> = GENRES.reduce(
      (acc, genre) => {
        acc[genre] = 0;
        return acc;
      },
      {} as Partial<Record<GenreKey, number>>
    );

    // Set selected genre to 1 (true)
    if (selectedGenre) {
      updatedGenres[selectedGenre] = 1;
    }

    const updatedMovie: Movie = {
      ...formData,
      ...updatedGenres,
    };

    await updateMovie(Number(updatedMovie.showId), updatedMovie);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Movie</h2>
      <label>
        Movie Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
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
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </label>
      <label>
        Duration:
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Genre:
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">-- Select Genre --</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Update Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditMovieForm;
