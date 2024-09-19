namespace Shortify.Models;

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

  public int UserId { get; set; }  // Foreign key to identify the user

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime? ExpirationDate { get; set; }
}

