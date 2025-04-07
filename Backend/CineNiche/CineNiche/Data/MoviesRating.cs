using System;
using System.Collections.Generic;

namespace CineNiche.Data;

public partial class MoviesRating
{
    public int? UserId { get; set; }

    public string? ShowId { get; set; }

    public int? Rating { get; set; }
}
