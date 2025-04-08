using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace CineNiche.Controllers;

[Route("[controller]")]
[ApiController]
public class RoleController : Controller
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<IdentityUser> _userManager;

    public RoleController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRole(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name cannot be empty.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return Conflict("Role already exists.");
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' created successfully.");
        }

        return StatusCode(500, "An error occurred while creating the role.");
    }

    [HttpPost("AssignRoleToUser")]
    public async Task<IActionResult> AssignRoleToUser(string userEmail, string roleName)
    {
        if (string.IsNullOrWhiteSpace(userEmail) || string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("User email and role name are required.");
        }

        var user = await _userManager.FindByEmailAsync(userEmail);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            return NotFound("Role does not exist.");
        }

        var result = await _userManager.AddToRoleAsync(user, roleName);
        if (result.Succeeded)
        {
            return Ok($"Role '{roleName}' assigned to user '{userEmail}'.");
        }

        return StatusCode(500, "An error occurred while assigning the role.");
    }


    [HttpGet("GetAllRoles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _roleManager.Roles.ToListAsync();
        return Ok(roles);
    }

    [HttpGet("GetUsersInRole")]
    public async Task<IActionResult> GetUsersInRole(string roleName)
    {
        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null)
        {
            return NotFound("Role not found.");
        }

        var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
        return Ok(usersInRole);
    }

}