namespace AuthTL.Controllers;

using AuthTL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpGet]
    [Route("profile")]
    public async Task<IActionResult> GetUserProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        var profile = new
        {
            user.UserName,
            user.Email,
            user.PhoneNumber,
            user.FirstName,
            user.LastName,
            user.ProfilePictureUrl,
        };

        return Ok(profile);
    }

    [HttpPut]
    [Route("profile")]
    public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateProfileModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        //user.UserName = model.UserName ?? user.UserName;
        //user.Email = model.Email ?? user.Email;
        user.FirstName = model.FirstName ?? user.FirstName;
        user.LastName = model.LastName ?? user.LastName;
        user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;
        user.ProfilePictureUrl = model.ProfilePictureUrl ?? user.ProfilePictureUrl;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Update failed" });

        return Ok(new Response { Status = "Success", Message = "Profile updated successfully" });
    }


    [HttpGet]
    [Route("preferences")]
    public async Task<IActionResult> GetUserPreferences()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        var preferences = new
        {
            user.PreferredTheme,
            user.PreferredLanguage,
            user.ShorteningMethod,
        };

        return Ok(preferences);
    }

    [HttpPut]
    [Route("preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] PreferencesModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        user.PreferredTheme = model.PreferredTheme ?? user.PreferredTheme;
        user.PreferredLanguage = model.PreferredLanguage ?? user.PreferredLanguage;
        user.ShorteningMethod = model.ShorteningMethod ?? user.ShorteningMethod;

        await _userManager.UpdateAsync(user);

        return Ok(new Response { Status = "Success", Message = "Preferences updated successfully" });
    }



    [HttpGet]
    [Route("security")]
    public async Task<IActionResult> GetUserSecurity()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        var security = new
        {
            TwoFactorEnabled = user.TwoFactorEnabled,
            EmailConfirmed = user.EmailConfirmed,
            DataSharingEnabled = user.DataSharingEnabled,
        };

        return Ok(security);
    }


    [HttpPut]
    [Route("security")]
    public async Task<IActionResult> UpdateUserSecurity([FromBody] SecurityModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        //user.TwoFactorEnabled = model.TwoFactorEnabled ?? user.TwoFactorEnabled,
        //user.EmailConfirmed = model.EmailConfirmed ?? user.EmailConfirmed,
        user.DataSharingEnabled = model.DataSharingEnabled; //?? user.DataSharingEnabled

        await _userManager.UpdateAsync(user);

        return Ok(new Response { Status = "Success", Message = "Preferences updated successfully" });
    }


    // Enable or Disable 2FA
    [HttpPost]
    [Route("enable-2fa")]
    public async Task<IActionResult> EnableTwoFactorAuthentication()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        user.TwoFactorEnabled = true;
        await _userManager.UpdateAsync(user);

        return Ok(new Response { Status = "Success", Message = "Two-factor authentication enabled" });
    }

    [HttpPost]
    [Route("disable-2fa")]
    public async Task<IActionResult> DisableTwoFactorAuthentication()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        user.TwoFactorEnabled = false;
        await _userManager.UpdateAsync(user);

        return Ok(new Response { Status = "Success", Message = "Two-factor authentication disabled" });
    }

    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound(new Response { Status = "Error", Message = "User not found" });

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Account deletion failed" });

        return Ok(new Response { Status = "Success", Message = "Account deleted successfully" });
    }
}
