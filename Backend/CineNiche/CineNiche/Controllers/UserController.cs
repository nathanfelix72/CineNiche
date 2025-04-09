using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[Route("[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly MoviesContext _context;

    public UserController(MoviesContext context)
    {
        _context = context;
    }

    // GET: api/users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MoviesUser>> GetUser(int id)
    {
        var user = await _context.MoviesUsers.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    [HttpPut("UpdateUser/{userId}")]
    public IActionResult UpdateUser(int userId, [FromBody] MoviesUser updatedUser)
    {
        var existingUser = _context.MoviesUsers.Find(userId);
        if (existingUser == null)
        {
            return NotFound(new { message = "User not found" });
        }

        existingUser.Name = updatedUser.Name;
        existingUser.Phone = updatedUser.Phone;
        existingUser.Email = updatedUser.Email;
        existingUser.Age = updatedUser.Age;
        existingUser.Gender = updatedUser.Gender;
        existingUser.Netflix = updatedUser.Netflix;
        existingUser.AmazonPrime = updatedUser.AmazonPrime;
        existingUser.Disney = updatedUser.Disney;
        existingUser.Paramount = updatedUser.Paramount;
        existingUser.Max = updatedUser.Max;
        existingUser.Hulu = updatedUser.Hulu;
        existingUser.AppleTv = updatedUser.AppleTv;
        existingUser.Peacock = updatedUser.Peacock;
        existingUser.City = updatedUser.City;
        existingUser.State = updatedUser.State;
        existingUser.Zip = updatedUser.Zip;

        _context.MoviesUsers.Update(existingUser);
        _context.SaveChanges();

        return Ok(existingUser);
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<MoviesUser>> PostUser(MoviesUser newUser)
    {
        _context.MoviesUsers.Add(newUser);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetUser", new { id = newUser.UserId }, newUser);
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.MoviesUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.MoviesUsers.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("current")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

        Console.WriteLine("Roles: " + string.Join(", ", roles));  // Log roles for debugging

        if (email == null)
        {
            return Unauthorized(new { message = "User email not found in claims." });
        }

        var user = _context.MoviesUsers.FirstOrDefault(u => u.Email == email);
        if (user == null)
        {
            return NotFound(new { message = "User not found in database." });
        }

        return Ok(new { userId = user.UserId, email = user.Email, roles });
    }

}
