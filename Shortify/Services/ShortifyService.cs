namespace Shortify.Services;

using System;
using Shortify.Models;
using Shortify.Data;
using Microsoft.EntityFrameworkCore;

public interface IShortifyService
{
    Task<string> GenerateShortUrlAsync(string url, string UserId);
    Task<List<UrlMap>> GetUserGeneratedUrlsAsync(string userId);
}

public class ShortifyService : IShortifyService
{
    private readonly ShortifyDbContext _dbContext;

    public ShortifyService(ShortifyDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task<List<UrlMap>> GetUserGeneratedUrlsAsync(string userId)
    {
        var userGuid = Guid.Parse(userId);

        return await _dbContext.ShortenedUrls
            .Where(map => map.UserId == userGuid)
            .ToListAsync();
    }

    public async Task<string> GenerateShortUrlAsync(string url, string userId)
    {
        var ShortCode = GenerateUniqueId();

        var urlMap = new UrlMap
        {
            OriginalUrl = url,
            ShortCode = ShortCode,
            UserId = Guid.Parse(userId),
            ExpirationDate = DateTime.UtcNow.AddDays(7)
        };

        _dbContext.ShortenedUrls.Add(urlMap);
        await _dbContext.SaveChangesAsync();


        return ShortCode;
    }


  private string GenerateUniqueId()
  {
    long randomId = GenerateRandomNumberForBase62();

    return Base62Encode(randomId).PadLeft(6, '0'); // Ensure the ID is 6 characters long
  }

  private long GenerateRandomNumberForBase62()
  {
    Random random = new Random();
    return (long)(random.NextDouble() * 56800235584);
  }

  private string Base62Encode(long num)
  {
    const string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var encoded = string.Empty;

    while (num > 0)
    {
      encoded = chars[(int)(num % 62)] + encoded;
      num /= 62;
    }

    return encoded;
  }

}
