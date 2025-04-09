using Microsoft.AspNetCore.Mvc;
using CineNiche.Services;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("api/recommendations")]
    public class RecommendationsController : ControllerBase
    {
        private readonly MovieRecommenderService _recommenderService;

        public RecommendationsController(MovieRecommenderService recommenderService)
        {
            _recommenderService = recommenderService;
        }

        // GET /api/recommendations/title?title=Inception&count=5
        [HttpGet("title")]
        public async Task<IActionResult> GetRecommendationsByTitle(string title, int count = 5)
        {
            var recommendations = await _recommenderService.GetRecommendationsByTitle(title, count);
            return Ok(recommendations);
        }

        // GET /api/recommendations/user?userId=8
        [HttpGet("user")]
        public async Task<IActionResult> GetUserRecommendations(int userId)
        {
            var recs = await _recommenderService.GetUserRecommendations(userId);
            return Ok(recs);
        }
    }
}