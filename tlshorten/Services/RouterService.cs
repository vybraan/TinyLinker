using Microsoft.EntityFrameworkCore;
using tlshorten.Data;
using tlshorten.Models;

namespace tlshorten.Services;



public interface IRouterService
{
    Task<UrlMap> GetUrlByShortCodeAsync(string shortCode);
    Task UpdateClickStatsAsync(UrlMap urlMap);
    Task<int> GetTotalLinksForUserAsync(Guid userId);
    Task<int> GetTotalClicksForUserAsync(Guid userId);
    Task<double> GetAverageClicksPerLinkForUserAsync(Guid userId);
    Task<UrlMap> GetMostClickedLinkForUserAsync(Guid userId);
}

public class RouterService : IRouterService
{
    private readonly ShortifyDbContext _dbContext;

    public RouterService(ShortifyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UrlMap> GetUrlByShortCodeAsync(string shortCode)
    {
        return await _dbContext.ShortenedUrls.FirstOrDefaultAsync(u => u.ShortCode == shortCode);
    }

    public async Task UpdateClickStatsAsync(UrlMap urlMap)
    {
        urlMap.ClickCount++;
        urlMap.LastClicked = DateTime.UtcNow;

        _dbContext.ShortenedUrls.Update(urlMap);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<int> GetTotalLinksForUserAsync(Guid userId)
    {
        return await _dbContext.ShortenedUrls.CountAsync(u => u.UserId == userId);
    }

    public async Task<int> GetTotalClicksForUserAsync(Guid userId)
    {
        return await _dbContext.ShortenedUrls.Where(u => u.UserId == userId).SumAsync(u => u.ClickCount);
    }

    public async Task<double> GetAverageClicksPerLinkForUserAsync(Guid userId)
    {
        int totalLinks = await GetTotalLinksForUserAsync(userId);
        if (totalLinks == 0)
        {
            return 0;
        }

        int totalClicks = await GetTotalClicksForUserAsync(userId);
        return (double)totalClicks / totalLinks;
    }

    public async Task<UrlMap> GetMostClickedLinkForUserAsync(Guid userId)
    {
        return await _dbContext.ShortenedUrls
                               .Where(u => u.UserId == userId)
                               .OrderByDescending(u => u.ClickCount)
                               .FirstOrDefaultAsync();
    }
}
