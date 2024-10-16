using tlshorten.Data;
using Microsoft.EntityFrameworkCore;


namespace tlshorten.Services;

public class MigrationService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<MigrationService> _logger;

    public MigrationService(IServiceProvider serviceProvider, ILogger<MigrationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public void ApplyMigrations()
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ShortifyDbContext>();

            try
            {
                if (dbContext.Database.GetPendingMigrations().Any())
                {
                    _logger.LogInformation("Applying migrations...");
                    dbContext.Database.Migrate();
                    _logger.LogInformation("Migrations applied successfully.");
                }
                else
                {
                    _logger.LogInformation("No pending migrations found.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while applying migrations.");
            }
        }
    }
}
