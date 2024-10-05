namespace tlshorten.Data;

using Microsoft.EntityFrameworkCore;
using tlshorten.Models;

public class ShortifyDbContext : DbContext
{
  public ShortifyDbContext(DbContextOptions<ShortifyDbContext> options) : base(options) { }


  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
  }

  // Define your DbSets for the entities (tables)
  public DbSet<UrlMap> ShortenedUrls { get; set; }
}
