using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize(Roles = "Administrator")]
    public class MovieController : ControllerBase
    {
        private MoviesContext _moviesContext;

        public MovieController(MoviesContext temp)
        {
            _moviesContext = temp;
        }

        public class MoviesTitleWithRating
        {
            public MoviesTitle Movie { get; set; }
            public double? AvgStarRating { get; set; }
        }

        [HttpGet("AllMovies")]
        public IActionResult GetMovies(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] List<string>? movieTypes = null,
            [FromQuery] string? searchQuery = null
        )
        {
            var query = _moviesContext.MoviesTitles.AsQueryable();

            // If there is a search query, filter movies based on title using LIKE for case-insensitive search
            if (!string.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(m => EF.Functions.Like(m.Title, $"%{searchQuery}%"));
            }

            if (movieTypes != null && movieTypes.Any())
            {
                query = query.Where(m => movieTypes.Contains(m.Title));
            }

            var totalNumMovies = query.Count();

            var result = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new MoviesTitleWithRating
            {
                Movie = m,
                AvgStarRating = _moviesContext.MoviesRatings
                    .Where(r => r.ShowId == m.ShowId)
                    .Select(r => (double?)r.Rating)
                    .Average()
            })
            .ToList();


            return Ok(new { Movies = result, TotalNumMovies = totalNumMovies });
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
        public IActionResult AddProject([FromBody] MoviesTitle newMovie)
        {
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

            existingMovie.Type = updatedMovie.Type;
            existingMovie.Title = updatedMovie.Title;
            existingMovie.Director = updatedMovie.Director;
            existingMovie.Cast = updatedMovie.Cast;
            existingMovie.Country = updatedMovie.Country;
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Description = updatedMovie.Description;
            existingMovie.Action = updatedMovie.Action;
            existingMovie.Adventure = updatedMovie.Adventure;
            existingMovie.AnimeSeriesInternationalTvShows = updatedMovie.AnimeSeriesInternationalTvShows;
            existingMovie.BritishTvShowsDocuseriesInternationalTvShows = updatedMovie.BritishTvShowsDocuseriesInternationalTvShows;
            existingMovie.Children = updatedMovie.Children;
            existingMovie.Comedies = updatedMovie.Comedies;
            existingMovie.ComediesDramasInternationalMovies = updatedMovie.ComediesDramasInternationalMovies;
            existingMovie.ComediesInternationalMovies = updatedMovie.ComediesInternationalMovies;
            existingMovie.ComediesRomanticMovies = updatedMovie.ComediesRomanticMovies;
            existingMovie.CrimeTvShowsDocuseries = updatedMovie.CrimeTvShowsDocuseries;
            existingMovie.Documentaries = updatedMovie.Documentaries;
            existingMovie.DocumentariesInternationalMovies = updatedMovie.DocumentariesInternationalMovies;
            existingMovie.Docuseries = updatedMovie.Docuseries;
            existingMovie.Dramas = updatedMovie.Dramas;
            existingMovie.DramasInternationalMovies = updatedMovie.DramasInternationalMovies;
            existingMovie.DramasRomanticMovies = updatedMovie.DramasRomanticMovies;
            existingMovie.FamilyMovies = updatedMovie.FamilyMovies;
            existingMovie.Fantasy = updatedMovie.Fantasy;
            existingMovie.HorrorMovies = updatedMovie.HorrorMovies;
            existingMovie.InternationalMoviesThrillers = updatedMovie.InternationalMoviesThrillers;
            existingMovie.InternationalTvShowsRomanticTvShowsTvDramas = updatedMovie.InternationalTvShowsRomanticTvShowsTvDramas;
            existingMovie.KidsTv = updatedMovie.KidsTv;
            existingMovie.LanguageTvShows = updatedMovie.LanguageTvShows;
            existingMovie.Musicals = updatedMovie.Musicals;
            existingMovie.NatureTv = updatedMovie.NatureTv;
            existingMovie.RealityTv = updatedMovie.RealityTv;
            existingMovie.Spirituality = updatedMovie.Spirituality;
            existingMovie.TvAction = updatedMovie.TvAction;
            existingMovie.TvComedies = updatedMovie.TvComedies;
            existingMovie.TvDramas = updatedMovie.TvDramas;
            existingMovie.TalkShowsTvComedies = updatedMovie.TalkShowsTvComedies;
            existingMovie.Thrillers = updatedMovie.Thrillers;

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

        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            var movie = _moviesContext.MoviesTitles.FirstOrDefault(m => m.ShowId == id);
            if (movie == null)
            {
                return NotFound();
            }

            var avgRating = _moviesContext.MoviesRatings
                .Where(r => r.ShowId == id)
                .Select(r => (double?)r.Rating)
                .Average();

            var result = new MoviesTitleWithRating
            {
                Movie = movie,
                AvgStarRating = avgRating
            };

            return Ok(result);
        }

        public class RatingDto
        {
            public int ShowId { get; set; }
            public int Rating { get; set; } // between 1 and 5
            public int? UserId { get; set; } // optional, for user tracking
        }

        [HttpPost("{id}/rate")]
        public IActionResult RateMovie(int id, [FromBody] RatingDto rating)
        {
            if (rating.Rating < 1 || rating.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            var movie = _moviesContext.MoviesTitles.FirstOrDefault(m => m.ShowId == id);
            if (movie == null)
            {
                return NotFound("Movie not found.");
            }

            var newRating = new MoviesRating
            {
                ShowId = id,
                Rating = rating.Rating,
                UserId = rating.UserId // optional
            };

            _moviesContext.MoviesRatings.Add(newRating);
            _moviesContext.SaveChanges();

            return Ok("Rating submitted.");
        }

        [HttpGet("GetUserRatings")]
        public IActionResult GetUserRatings()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (email == null)
            {
                return Unauthorized("User email not found.");
            }

            var domainUser = _moviesContext.MoviesUsers.FirstOrDefault(u => u.Email == email);
            if (domainUser == null)
            {
                return NotFound("User not found in movie database.");
            }

            var userRatings = _moviesContext.MoviesRatings
                .Where(r => r.UserId == domainUser.UserId)
                .Include(r => r.Movie)
                .Select(r => new
                {
                    r.Movie,
                    r.Rating
                })
                .ToList();

            if (!userRatings.Any())
            {
                return NotFound(new { message = "No ratings found for this user." });
            }

            return Ok(userRatings);
        }
    }
}
