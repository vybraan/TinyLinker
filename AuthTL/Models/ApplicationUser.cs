using Microsoft.AspNetCore.Identity;

namespace AuthTL.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string PreferredTheme { get; set; } = "cupcake";
    public string? PreferredLanguage { get; set; }
    public string ShorteningMethod { get; set; } = "Random"; // "random" or "custom"
    public bool DataSharingEnabled { get; set; } = true;

    public List<ActivityLog>? ActivityLogs { get; set; }
}
