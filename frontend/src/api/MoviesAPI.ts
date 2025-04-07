import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  movies: Movie[];
  totalNumMovies: number;
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

const API_URL = 'https://localhost:5000/movie';

export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `movieTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/AllMovies?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies: ', error);
    throw error;
  }
};

export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    // Generate a map for genre fields (1 for selected, 0 for not selected)
    const genreFields = GENRES.reduce(
      (acc, genre) => {
        acc[genre] = newMovie[genre] ? 1 : 0;
        return acc;
      },
      {} as Record<GenreKey, number>
    );

    const movieData = {
      title: newMovie.title,
      type: newMovie.type,
      director: newMovie.director,
      cast: newMovie.cast,
      country: newMovie.country,
      releaseYear: Number(newMovie.releaseYear),
      rating: Number(newMovie.rating),
      duration: Number(newMovie.duration),
      description: newMovie.description,
      ...genreFields, // Include the genre fields here
    };

    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error adding movie:', errorResponse);
      throw new Error(
        `Failed to add movie: ${errorResponse.message || 'Unknown error'}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie', error);
    throw error;
  }
};

export const updateMovie = async (
  showId: number,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMovie),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updated movie:', error);
    throw error;
  }
};

export const deleteMovie = async (showId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${showId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};
