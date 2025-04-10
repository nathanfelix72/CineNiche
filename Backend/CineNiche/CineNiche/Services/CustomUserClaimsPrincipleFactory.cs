using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser, IdentityRole>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor)
    { }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        // Fetch roles for the user
        var roles = await UserManager.GetRolesAsync(user);

        // Add each role as a claim
        foreach (var role in roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }

        return identity;
    }
}
