using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Data;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private MoviesContext _moviesContext;

        public MovieController(MoviesContext temp)
        {
            _moviesContext = temp;
        }
        
        private static readonly List<string> GENRES = new List<string>
        {
            "action", "adventure", "animeSeriesInternationalTvShows", "britishTvShowsDocuseriesInternationalTvShows", "children", "comedies",
            "comediesDramasInternationalMovies", "comediesInternationalMovies", "comediesRomanticMovies", "crimeTvShowsDocuseries", "documentaries",
            "documentariesInternationalMovies", "docuseries", "dramas", "dramasInternationalMovies", "dramasRomanticMovies", "familyMovies",
            "fantasy", "horrorMovies", "internationalMoviesThrillers", "internationalTvShowsRomanticTvShowsTvDramas", "kidsTv", "languageTvShows",
            "musicals", "natureTv", "realityTv", "spirituality", "tvAction", "tvComedies", "tvDramas", "talkShowsTvComedies", "thrillers"
        };

        [HttpGet("AllMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? movieTypes = null)
        {
            var query = _moviesContext.MoviesTitles.AsQueryable();

            if (movieTypes != null && movieTypes.Any())
            {
                query = query.Where(m => movieTypes.Contains(m.Title));
            }

            var totalNumMovies = query.Count();

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var someObject = new
            {
                Movies = something,
                TotalNumMovies = totalNumMovies
            };

            return Ok(someObject);
        }

        [HttpGet("GetMovieTypes")]
        public IActionResult GetMovieTypes()
        {
            var movieTypes = _moviesContext.MoviesTitles
                .Select(m => m.Type)
                .Distinct()
                .ToList();

            return Ok(movieTypes);
        }
        
        

        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MoviesTitle newMovie)
        {
            // Convert genre fields to boolean (1 or 0 to true or false)
            foreach (var genre in GENRES)
            {
                var genreValue = newMovie.GetType().GetProperty(genre)?.GetValue(newMovie);
                if (genreValue != null)
                {
                    newMovie.GetType().GetProperty(genre)?.SetValue(newMovie, (int)genreValue == 1);
                }
            }

            _moviesContext.MoviesTitles.Add(newMovie);
            _moviesContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(int showId, [FromBody] MoviesTitle updatedMovie)
        {
            var existingMovie = _moviesContext.MoviesTitles.Find(showId);
            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Update basic fields
            existingMovie.Type = updatedMovie.Type;
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;

            // Update genre fields (convert from 1 or 0 to boolean)
            foreach (var genre in GENRES)
            {
                var genreValue = updatedMovie.GetType().GetProperty(genre)?.GetValue(updatedMovie);
                if (genreValue != null)
                {
                    existingMovie.GetType().GetProperty(genre)?.SetValue(existingMovie, (int)genreValue == 1);
                }
            }

            _moviesContext.MoviesTitles.Update(existingMovie);
            _moviesContext.SaveChanges();

            return Ok(existingMovie);
        }



        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(int showId)
        {
            var movie = _moviesContext.MoviesTitles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _moviesContext.MoviesTitles.Remove(movie);
            _moviesContext.SaveChanges();

            return NoContent();
        }

    }
}
