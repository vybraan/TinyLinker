namespace Shortify.Services;

using System;
using Shortify.Models;
using Shortify.Data;

public interface IShortifyService
{
  Task<string> GenerateShortUrlAsync(string url, string UserId);
}

public class ShortifyService : IShortifyService
{
  private readonly ShortifyDbContext _dbContext;

  public ShortifyService(ShortifyDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  public async Task<string> GenerateShortUrlAsync(string url, string userId)
  {
    var ShortCode = GenerateUniqueId();

    //Save the url 
    var urlMap = new UrlMap
    {
      OriginalUrl = url,
      ShortCode = ShortCode,
      UserId = int.Parse(userId),
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
    return (long)(random.NextDouble() * 56800235584); // Generates a number between 0 and 56,800,235,584
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
