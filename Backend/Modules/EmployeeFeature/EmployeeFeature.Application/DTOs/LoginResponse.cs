using EmployeeFeature.Domain.Enums;

namespace EmployeeFeature.Application.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public UserProfile? User { get; set; }
    }

    public class UserProfile
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public EmployeeRole Role { get; set; }
        public Country Country { get; set; }
    }
}

// Made with Bob
