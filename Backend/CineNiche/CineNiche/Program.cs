using System.Security.Claims;
using CineNiche.Data;
using CineNiche.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MoviesContext>(options =>
 options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddAuthorization();

// Add Identity services
builder.Services.AddTransient<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Register the CustomUserClaimsPrincipalFactory to include roles in claims
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

// Configure IdentityOptions
builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

// Configure password policies for Identity
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 15;
    options.Password.RequiredUniqueChars = 1;
});

// Configure cookies for Identity
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // change after adding https for production
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://black-flower-0d9471f1e.6.azurestaticapps.net")
                  .AllowCredentials()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add HttpClient for Python recommender microservice
builder.Services.AddHttpClient<MovieRecommenderService>(client =>
{
    client.BaseAddress = new Uri("https://cinenicheapi.ngrok.io");
});
builder.Services.AddScoped<MovieRecommenderService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// This should be where your Identity API routes are mapped
app.MapIdentityApi<IdentityUser>();

app.MapPost("/login", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    var request = await context.Request.ReadFromJsonAsync<LoginRequest>();

    if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
    {
        return Results.BadRequest(new { message = "Invalid email or password." });
    }

    var user = await signInManager.UserManager.FindByEmailAsync(request.Email);
    if (user == null)
    {
        return Results.BadRequest(new { message = "Invalid email or password." });
    }

    var result = await signInManager.PasswordSignInAsync(user, request.Password, false, false);

    if (result.Succeeded)
    {
        return Results.Ok(new { message = "Login successful" });
    }

    return Results.BadRequest(new { message = "Invalid email or password." });
});

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList();
    // Check specifically for the role claim type (usually ClaimTypes.Role or "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")
    var roles = claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

    return Results.Ok(new
    {
        IsAuthenticated = user.Identity.IsAuthenticated,
        AuthType = user.Identity.AuthenticationType, // Should show "Identity.Application"
        UserName = user.Identity.Name, // Often the email
        UserId = user.FindFirstValue(ClaimTypes.NameIdentifier),
        Roles = roles, // Explicitly show roles
        AllClaims = claims // Show all claims for debugging
    });
}).RequireAuthorization(); // Keep this to ensure the user IS authenticated

app.MapGet("/debugauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }
    var claims = user.Claims.Select(c => new { c.Type, c.Value }).ToList();
    var roles = claims.Where(c => c.Type == ClaimTypes.Role || c.Type == "role").Select(c => c.Value).ToList(); // Check common role claim types

    return Results.Ok(new {
        IsAuthenticated = user.Identity.IsAuthenticated,
        UserName = user.Identity.Name,
        UserId = user.FindFirstValue(ClaimTypes.NameIdentifier),
        Roles = roles, // What roles does the backend see?
        AllClaims = claims
    });
}).RequireAuthorization(); // Ensures the user is authenticated

app.Run();
