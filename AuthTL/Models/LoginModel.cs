namespace AuthTL.Models;

using System.ComponentModel.DataAnnotations;

public class LoginModel
{
  [Required(ErrorMessage = "User Name is required")]
  public string? Username { get; set; }

  // [Required(ErrorMessage = "User Email is required")]
  // public string? Email { get; set; }

  [Required(ErrorMessage = "Password is required")]
  public string? Password { get; set; }
}
