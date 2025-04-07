import { useState } from 'react';
import { MoviesTitle } from '../types/MoviesTitle';
import { addMovie } from '../api/MoviesAPI';
interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}
const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<MoviesTitle>({
    showId: 0,
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: 0,
    rating: '',
    duration: '',
    description: '',
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMovie(formData);
    onSuccess();
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>
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
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Action:
          <input
            type="text"
            name="action"
            value={formData.action}
            onChange={handleChange}
          />
        </label>
        <label>
          Adventure:
          <input
            type="text"
            name="adventure"
            value={formData.adventure}
            onChange={handleChange}
          />
        </label>
        <label>
          AnimeSeriesInternationalTvShows:
          <input
            type="text"
            name="animeSeriesInternationalTvShows"
            value={formData.animeSeriesInternationalTvShows}
            onChange={handleChange}
          />
        </label>
        <label>
          BritishTvShowsDocuseriesInternationalTvShows:
          <input
            type="text"
            name="britishTvShowsDocuseriesInternationalTvShows"
            value={formData.britishTvShowsDocuseriesInternationalTvShows}
            onChange={handleChange}
          />
        </label>
        <label>
          Children:
          <input
            type="text"
            name="children"
            value={formData.children}
            onChange={handleChange}
          />
        </label>
        <label>
          Comedies:
          <input
            type="text"
            name="comedies"
            value={formData.comedies}
            onChange={handleChange}
          />
        </label>
        <label>
          ComediesDramasInternationalMovies:
          <input
            type="text"
            name="comediesDramasInternationalMovies"
            value={formData.comediesDramasInternationalMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          ComediesInternationalMovies:
          <input
            type="text"
            name="comediesInternationalMovies"
            value={formData.comediesInternationalMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          ComediesRomanticMovies:
          <input
            type="text"
            name="comediesRomanticMovies"
            value={formData.comediesRomanticMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          CrimeTvShowsDocuseries:
          <input
            type="text"
            name="crimeTvShowsDocuseries"
            value={formData.crimeTvShowsDocuseries}
            onChange={handleChange}
          />
        </label>
        <label>
          Documentaries:
          <input
            type="text"
            name="documentaries"
            value={formData.documentaries}
            onChange={handleChange}
          />
        </label>
        <label>
          DocumentariesInternationalMovies:
          <input
            type="text"
            name="documentariesInternationalMovies"
            value={formData.documentariesInternationalMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          Docuseries:
          <input
            type="text"
            name="docuseries"
            value={formData.docuseries}
            onChange={handleChange}
          />
        </label>
        <label>
          Dramas:
          <input
            type="text"
            name="dramas"
            value={formData.dramas}
            onChange={handleChange}
          />
        </label>
        <label>
          DramasInternationalMovies:
          <input
            type="text"
            name="dramasInternationalMovies"
            value={formData.dramasInternationalMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          DramasRomanticMovies:
          <input
            type="text"
            name="dramasRomanticMovies"
            value={formData.dramasRomanticMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          Family Movies:
          <input
            type="text"
            name="familyMovies"
            value={formData.familyMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          Fantasy:
          <input
            type="text"
            name="fantasy"
            value={formData.fantasy}
            onChange={handleChange}
          />
        </label>
        <label>
          Horror Movies:
          <input
            type="text"
            name="horrorMovies"
            value={formData.horrorMovies}
            onChange={handleChange}
          />
        </label>
        <label>
          InternationalMoviesThrillers:
          <input
            type="text"
            name="internationalMoviesThrillers"
            value={formData.internationalMoviesThrillers}
            onChange={handleChange}
          />
        </label>
        <label>
          InternationalTvShowsRomanticTvShowsTvDramas:
          <input
            type="text"
            name="internationalTvShowsRomanticTvShowsTvDramas"
            value={formData.internationalTvShowsRomanticTvShowsTvDramas}
            onChange={handleChange}
          />
        </label>
        <label>
          Kids TV:
          <input
            type="text"
            name="kidsTv"
            value={formData.kidsTv}
            onChange={handleChange}
          />
        </label>
        <label>
          LanguageTVShows:
          <input
            type="text"
            name="languageTvShows"
            value={formData.languageTvShows}
            onChange={handleChange}
          />
        </label>
        <label>
          Musicals:
          <input
            type="text"
            name="musicals"
            value={formData.musicals}
            onChange={handleChange}
          />
        </label>
        <label>
          Nature TV:
          <input
            type="text"
            name="natureTv"
            value={formData.natureTv}
            onChange={handleChange}
          />
        </label>
        <label>
          RealityTv:
          <input
            type="text"
            name="realityTv"
            value={formData.realityTv}
            onChange={handleChange}
          />
        </label>
        <label>
          Spirituality:
          <input
            type="text"
            name="spirituality"
            value={formData.spirituality}
            onChange={handleChange}
          />
        </label>
        <label>
          TvAction:
          <input
            type="text"
            name="tvAction"
            value={formData.tvAction}
            onChange={handleChange}
          />
        </label>
        <label>
          TvComedies:
          <input
            type="text"
            name="tvComedies"
            value={formData.tvComedies}
            onChange={handleChange}
          />
        </label>
        <label>
          TvDramas:
          <input
            type="text"
            name="tvDramas"
            value={formData.tvDramas}
            onChange={handleChange}
          />
        </label>
        <label>
          TalkShowsTvComedies:
          <input
            type="text"
            name="talkShowsTvComedies"
            value={formData.talkShowsTvComedies}
            onChange={handleChange}
          />
        </label>
        <label>
          Thrillers:
          <input
            type="text"
            name="thrillers"
            value={formData.thrillers}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Movie</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
export default NewMovieForm;
