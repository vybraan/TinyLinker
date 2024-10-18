namespace tlshorten.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tlshorten.Services;
using System.Security.Claims;
using System.Security.Policy;
using tlshorten.Models;

[Route("tl/[controller]")]
[ApiController]
public class RouterController : ControllerBase
{
    private readonly IRouterService _routerService;

    public RouterController(IRouterService routerService)
    {
        _routerService = routerService;
    }

    [HttpPost("click")]
    public async Task<IActionResult> Click([FromBody] UrlDto shorcode) {

        if (string.IsNullOrWhiteSpace(shorcode.OriginalUrl))
        {
            return BadRequest("shorcode is required.");
        }

        Console.WriteLine("shorcode being retrievedd");


        var urlMap = await _routerService.GetUrlByShortCodeAsync(shorcode.OriginalUrl);
        if (urlMap == null)
        {
            return NotFound("ShortCode not found.");
        }
        await _routerService.UpdateClickStatsAsync(urlMap);
        return Ok(new { message = "Click Updated" });
    }

    // GET /{shortCode} - This route does not require authentication
    [HttpGet("{shortCode}")]
    public async Task<IActionResult> RedirectByShortCode(string shortCode)
    {

        if (string.IsNullOrWhiteSpace(shortCode))
        {
            return BadRequest("ShortCode is required.");
        }

        Console.WriteLine("shorcode being retrievedd");


        var urlMap = await _routerService.GetUrlByShortCodeAsync(shortCode);
        if (urlMap == null)
        {
            return NotFound("ShortCode not found.");
        }

        await _routerService.UpdateClickStatsAsync(urlMap);
       return Ok(new { url = urlMap.OriginalUrl });
    }

    // GET api/router/stats - This route requires authentication
    [HttpGet("stats")]
    [Authorize]
    public async Task<IActionResult> GetUserStatistics()
    {
        // Retrieve userId from JWT token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized("Invalid or missing User ID.");
        }

        Guid userGuid;
        if (!Guid.TryParse(userId, out userGuid))
        {
            return BadRequest("Invalid User ID format.");
        }

        // Fetch statistics
        int totalLinks = await _routerService.GetTotalLinksForUserAsync(userGuid);
        int totalClicks = await _routerService.GetTotalClicksForUserAsync(userGuid);
        double averageClicks = await _routerService.GetAverageClicksPerLinkForUserAsync(userGuid);
        var mostClickedLink = await _routerService.GetMostClickedLinkForUserAsync(userGuid);

        var result = new
        {
            TotalLinks = totalLinks,
            TotalClicks = totalClicks,
            AverageClicksPerLink = averageClicks,
            MostClickedLink = mostClickedLink != null ? new
            {
                OriginalUrl = mostClickedLink.OriginalUrl,
                ShortenedUrl = mostClickedLink.ShortCode,
                Clicks = mostClickedLink.ClickCount
            } : null
        };

        return Ok(result);
    }
}
