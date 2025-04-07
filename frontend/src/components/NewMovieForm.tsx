import { useState } from 'react';
import { addMovie } from '../api/MoviesAPI';
import { Movie } from '../types/Movie';

interface NewMovieFormProps {
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
];

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('action');

  const [formData, setFormData] = useState<Movie>({
    showId: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
    rating: '',
    duration: '',
    description: '',
    // Genre integers (0 by default)
    action: 0,
    adventure: 0,
    animeSeriesInternationalTvShows: 0,
    britishTvShowsDocuseriesInternationalTvShows: 0,
    children: 0,
    comedies: 0,
    comediesDramasInternationalMovies: 0,
    comediesInternationalMovies: 0,
    comediesRomanticMovies: 0,
    crimeTvShowsDocuseries: 0,
    documentaries: 0,
    documentariesInternationalMovies: 0,
    docuseries: 0,
    dramas: 0,
    dramasInternationalMovies: 0,
    dramasRomanticMovies: 0,
    familyMovies: 0,
    fantasy: 0,
    horrorMovies: 0,
    internationalMoviesThrillers: 0,
    internationalTvShowsRomanticTvShowsTvDramas: 0,
    kidsTv: 0,
    languageTvShows: 0,
    musicals: 0,
    natureTv: 0,
    realityTv: 0,
    spirituality: 0,
    tvAction: 0,
    tvComedies: 0,
    tvDramas: 0,
    talkShowsTvComedies: 0,
    thrillers: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all genre values to 0
    const updatedGenres = genreOptions.reduce((acc, genre) => {
      acc[genre] = genre === selectedGenre ? 1 : 0; // Set selected genre to 1, others to 0
      return acc;
    }, {} as Record<string, number>);

    const movieToSubmit = {
      ...formData,
      ...updatedGenres,
    };

    console.log('Submitting new movie:', movieToSubmit);
    const newMovieWithStringRating = {
        ...movieToSubmit,
        rating: movieToSubmit.rating.toString(), // Ensure the rating is sent as a string
      };
      
      await addMovie(newMovieWithStringRating);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>
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
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NewMovieForm;
