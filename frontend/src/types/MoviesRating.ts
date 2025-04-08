import { MoviesTitle } from './MoviesTitle';

export interface MovieRating {
  id: number;
  user_id: number | null;
  show_id: number | null;
  rating: number | null;
  movie: MoviesTitle | null;
}
