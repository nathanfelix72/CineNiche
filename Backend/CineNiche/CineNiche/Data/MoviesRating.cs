using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CineNiche.Data;

public class MoviesRating
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int? UserId { get; set; }

    [Column("show_id")]
    public int? ShowId { get; set; }

    [Column("rating")]
    public int? Rating { get; set; }

    public MoviesTitle? Movie { get; set; }
}
