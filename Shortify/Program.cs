

using Shortify.Services;
using Shortify.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ShortifyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("UrlShortenerDatabase")));

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
  throw new InvalidOperationException("JWT Key is not configured.");
}

// builder.Services.AddAuthentication(options =>
// {
//   options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//   options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })


// Adding Authentication
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
  options.SaveToken = true;
  options.RequireHttpsMetadata = false;
  options.TokenValidationParameters = new TokenValidationParameters()
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidAudience = builder.Configuration["Jwt:Audience"],
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
  };

  options.Events = new JwtBearerEvents
  {
    OnAuthenticationFailed = context =>
    {
      Console.WriteLine("Authentication failed.");
      Console.WriteLine(context.Exception.ToString());
      return Task.CompletedTask;
    },
    OnTokenValidated = context =>
    {
      Console.WriteLine("Token validated.");
      return Task.CompletedTask;
    }
  };
});




// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//       options.TokenValidationParameters = new TokenValidationParameters
//       {
//         ValidateIssuer = true,
//         ValidateAudience = true,
//         ValidateLifetime = true,
//         ValidateIssuerSigningKey = true,
//         ValidIssuer = builder.Configuration["Jwt:Issuer"],
//         ValidAudience = builder.Configuration["Jwt:Audience"],
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
//       };
//
//
//     });
//
//builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IShortifyService, ShortifyService>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Use(async (context, next) =>
{
  var token = context.Request.Headers["Authorization"].ToString();
  Console.WriteLine($"Token: {token}");
  await next.Invoke();
});

app.Run();



