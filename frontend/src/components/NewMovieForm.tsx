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
    showId: 0,
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
    rating: 0,
    duration: 0,
    description: '',
    // Genre booleans
    action: false,
    adventure: false,
    animeSeriesInternationalTvShows: false,
    britishTvShowsDocuseriesInternationalTvShows: false,
    children: false,
    comedies: false,
    comediesDramasInternationalMovies: false,
    comediesInternationalMovies: false,
    comediesRomanticMovies: false,
    crimeTvShowsDocuseries: false,
    documentaries: false,
    documentariesInternationalMovies: false,
    docuseries: false,
    dramas: false,
    dramasInternationalMovies: false,
    dramasRomanticMovies: false,
    familyMovies: false,
    fantasy: false,
    horrorMovies: false,
    internationalMoviesThrillers: false,
    internationalTvShowsRomanticTvShowsTvDramas: false,
    kidsTv: false,
    languageTvShows: false,
    musicals: false,
    natureTv: false,
    realityTv: false,
    spirituality: false,
    tvAction: false,
    tvComedies: false,
    tvDramas: false,
    talkShowsTvComedies: false,
    thrillers: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all genre booleans to false
    const updatedGenres = genreOptions.reduce((acc, genre) => {
      acc[genre] = genre === selectedGenre;
      return acc;
    }, {} as Record<string, boolean>);

    const movieToSubmit = {
      ...formData,
      ...updatedGenres,
    };

    await addMovie(movieToSubmit);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>
      <label>
        Movie Title:
        <input type="text" 
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
