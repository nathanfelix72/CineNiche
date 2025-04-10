using System.Text.Json.Serialization;

namespace CineNiche.Data
{
    public class MovieRecommendation
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }
    }
}