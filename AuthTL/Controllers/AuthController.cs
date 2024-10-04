namespace AuthTL.Controllers;

using AuthTL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly RoleManager<IdentityRole> _roleManager;
  private readonly IConfiguration _configuration;

  public AuthController(
      UserManager<ApplicationUser> userManager,
      RoleManager<IdentityRole> roleManager,
      IConfiguration configuration)
  {
    _userManager = userManager;
    _roleManager = roleManager;
    _configuration = configuration;
  }

  [HttpPost]
  [Route("login")]
  public async Task<IActionResult> Login([FromBody] LoginModel model)
  {
    var user = await _userManager.FindByNameAsync(model.Username);
    if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
    {
      var userRoles = await _userManager.GetRolesAsync(user);

      var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Sid, user.Id),
            };

      foreach (var userRole in userRoles)
      {
        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
      }

      var token = GetToken(authClaims);

      return Ok(new
      {
        username = user.UserName,
        token = new JwtSecurityTokenHandler().WriteToken(token),
        expiration = token.ValidTo
      });
    }
    return Unauthorized();
  }

  [HttpPost]
  [Route("register")]
  public async Task<IActionResult> Register([FromBody] RegisterModel model)
  {
    var userExists = await _userManager.FindByNameAsync(model.Username);
    if (userExists != null)
      return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

    ApplicationUser user = new()
    {
      Email = model.Email,
      SecurityStamp = Guid.NewGuid().ToString(),
      UserName = model.Username
    };

    var result = await _userManager.CreateAsync(user, model.Password);

    if (!result.Succeeded)
            // Require better handling of this
            //return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = result.ToString() });


      return Ok(new Response { Status = "Success", Message = "User created successfully!" });
  }

  [HttpPost]
  [Route("admin/register")]
  public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
  {
    var userExists = await _userManager.FindByNameAsync(model.Username);
    if (userExists != null)
      return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

    ApplicationUser user = new()
    {
      Email = model.Email,
      SecurityStamp = Guid.NewGuid().ToString(),
      UserName = model.Username
    };

    var result = await _userManager.CreateAsync(user, model.Password);

    if (!result.Succeeded)
      return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

    if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
      await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
    if (!await _roleManager.RoleExistsAsync(UserRoles.User))
      await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

    if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
    {
      await _userManager.AddToRoleAsync(user, UserRoles.Admin);
    }
    if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
    {
      await _userManager.AddToRoleAsync(user, UserRoles.User);
    }
    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
  }

  private JwtSecurityToken GetToken(List<Claim> authClaims)
  {
    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));

    var token = new JwtSecurityToken(
        issuer: _configuration["JWT:Issuer"],
        audience: _configuration["JWT:Audience"],
        expires: DateTime.Now.AddHours(3),
        claims: authClaims,
        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

    return token;
  }
}

