// Backend/Services/MovieRecommenderService.cs

using System.Text.Json;
using CineNiche.Data;

namespace CineNiche.Services
{
    public class MovieRecommenderService
    {
        private readonly HttpClient _httpClient;

        public MovieRecommenderService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            Console.WriteLine("MovieRecommenderService HttpClient BaseAddress: " + _httpClient.BaseAddress);
        }

        // Call the Python endpoint for content-based recommendations
        public async Task<List<string>> GetRecommendationsByTitle(string title, int count)
        {
            var response = await _httpClient.GetAsync($"/recommend?title={title}&count={count}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TitleRecommendationResponse>(json);

            return result?.Recommended ?? new List<string>();
        }

        // Call the Python endpoint for collaborative/genre-based user homepage recommendations
        public async Task<Dictionary<string, List<MovieRecommendation>>> GetUserRecommendations(int userId)
        {
            var response = await _httpClient.GetAsync("http://localhost:8000/user-recs?user_id=" + userId);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, List<MovieRecommendation>>>(json);

            return result ?? new Dictionary<string, List<MovieRecommendation>>();
        }

        // This matches the JSON returned from /recommend
        private class TitleRecommendationResponse
        {
            public List<string> Recommended { get; set; }
        }
    }
}