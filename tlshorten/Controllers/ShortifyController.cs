namespace tlshorten.Controllers;

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tlshorten.Services;
using tlshorten.Models;


[Route("api/[controller]")]
[Authorize]
[ApiController]
public class ShortenController : ControllerBase
{
    private readonly IShortifyService _shortifyService;
    private readonly ILogger<ShortenController> _logger;

    public ShortenController(IShortifyService shortifyService, ILogger<ShortenController> logger)
    {
        _shortifyService = shortifyService;
        _logger = logger;
    }

    [HttpGet("urls")]
    public async Task<IActionResult> GetUserGeneratedUrls()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return BadRequest("Invalid or missing USER ID.");
        }

        var urls = await _shortifyService.GetUserGeneratedUrlsAsync(userId);

        if (urls == null || !urls.Any())
        {
            return NotFound("No URLs found for this user.");
        }

        return Ok(urls);
    }

    [HttpPost("ourl")]
    public async Task<IActionResult> ShortifyUrl([FromBody] UrlDto urlDto)
    {
        if (string.IsNullOrWhiteSpace(urlDto.OriginalUrl))
        {
            _logger.LogWarning("Invalid or missing URL from user.");
            return BadRequest(new { message = "Invalid or missing URL." });
        }

        if (!Uri.IsWellFormedUriString(urlDto.OriginalUrl, UriKind.Absolute))
        {
            _logger.LogWarning($"Invalid URL format: {urlDto.OriginalUrl}");
            return BadRequest(new { message = "Invalid URL format." });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            _logger.LogError("Missing user ID in claims.");
            return BadRequest(new { message = "Invalid or missing user ID." });
        }

        try
        {
            string shortCode = await _shortifyService.GenerateShortUrlAsync(urlDto.OriginalUrl, userId);

            _logger.LogInformation($"Short URL generated successfully for user {userId}.");
            return Ok(new { ShortCode = shortCode });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating short URL.");
            return StatusCode(500, new { message = "An error occurred while generating the short URL." });
        }
    }
}
