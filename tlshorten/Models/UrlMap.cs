namespace tlshorten.Models;

using System.ComponentModel.DataAnnotations;

public class UrlMap
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(2048)]
    public string OriginalUrl { get; set; }

    [Required]
    [MaxLength(6)]
    public string ShortCode { get; set; }

    [Required]
    public Guid UserId { get; set; }  

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ExpirationDate { get; set; } = DateTime.Now.AddDays(7);


    public int ClickCount { get; set; } = 0;
    public DateTime? LastClicked { get; set; }
}

