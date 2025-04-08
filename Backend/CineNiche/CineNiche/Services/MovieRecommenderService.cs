// Backend/Services/MovieRecommenderService.cs

using System.Text.Json;

namespace CineNiche.Services
{
    public class MovieRecommenderService
    {
        private readonly HttpClient _httpClient;

        public MovieRecommenderService(HttpClient httpClient)
        {
            _httpClient = httpClient;
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
        public async Task<Dictionary<string, List<string>>> GetUserRecommendations(int userId)
        {
            var response = await _httpClient.GetAsync($"/user-recs?user_id={userId}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json);

            return result ?? new Dictionary<string, List<string>>();
        }

        // This matches the JSON returned from /recommend
        private class TitleRecommendationResponse
        {
            public List<string> Recommended { get; set; }
        }
    }
}