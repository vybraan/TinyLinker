﻿namespace AuthTL.Models;

public class UpdateProfileModel
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set;}
    public string? ProfilePictureUrl { get; set; }
}
