namespace Shortify.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shortify.Services;
using Shortify.Models;


[Route("api/[controller]")]
[ApiController]
public class ShortifyController : ControllerBase
{
  private readonly IShortifyService _shortifyService;

  public ShortifyController(IShortifyService shortifyService)
  {
    _shortifyService = shortifyService;
  }

  [Authorize]
  [HttpPost("shortify")]
  public async Task<IActionResult> ShortifyUrl([FromBody] UrlDto urlDto)
  {

    if (string.IsNullOrWhiteSpace(urlDto.OriginalUrl))
    {
      return BadRequest("Invalid or missing URL.");
    }

    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (userId == null)
    {
      //return BadRequest("Invalid or missing USER ID.");
      return Ok(User.FindFirst(ClaimTypes.NameIdentifier).ToString());
      //return Unauthorized();
    }

    string shortCode = await _shortifyService.GenerateShortUrlAsync(urlDto.OriginalUrl, userId);
    return Ok(new { ShortCode = shortCode });

  }
}
