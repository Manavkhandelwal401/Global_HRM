using EmployeeFeature.Application.DTOs;
using EmployeeFeature.Domain;
using EmployeeFeature.Domain.Enums;
using HRMS.Shared.Domain.Enum;
using HRMS.Core.Postgres.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EmployeeFeature.Application.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<UserProfile?> GetCurrentUserAsync(string userId);
        Task<LoginResponse> SwitchDemoRoleAsync(string userId, EmployeeRole newRole);
        Task<LoginResponse> SignupAsync(string employeeId, string email, string code, string password);
    }

    public class AuthService : IAuthService
    {
        private readonly PostgresDbContext _dbContext;
        private const string Salt = "GlobalHRMSalt";

        public AuthService(PostgresDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + Salt));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return HashPassword(password) == hashedPassword;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                };
            }

            var employee = await _dbContext.Set<Employee>()
                .FirstOrDefaultAsync(e => e.Email.ToLower() == request.Email.ToLower());

            if (employee == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid credentials"
                };
            }

            if (!employee.IsRegistered)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Employee profile is not registered yet. Please sign up first."
                };
            }

            if (string.IsNullOrEmpty(employee.PasswordHash) || !VerifyPassword(request.Password, employee.PasswordHash))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid credentials"
                };
            }

            return new LoginResponse
            {
                Success = true,
                Message = "Login successful",
                Token = $"demo-token-{employee.Id}", // Kept for Apollo auth header integration
                User = new UserProfile
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Email = employee.Email,
                    Designation = employee.Designation,
                    Department = employee.Department,
                    Role = employee.Role,
                    Country = employee.Country
                }
            };
        }

        public async Task<UserProfile?> GetCurrentUserAsync(string userId)
        {
            var employee = await _dbContext.Set<Employee>().FindAsync(userId);
            if (employee == null) return null;

            return new UserProfile
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Designation = employee.Designation,
                Department = employee.Department,
                Role = employee.Role,
                Country = employee.Country
            };
        }

        public async Task<LoginResponse> SwitchDemoRoleAsync(string userId, EmployeeRole newRole)
        {
            var employee = await _dbContext.Set<Employee>().FindAsync(userId);
            if (employee == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            employee.Role = newRole;
            await _dbContext.SaveChangesAsync();

            return new LoginResponse
            {
                Success = true,
                Message = $"Role switched to {newRole}",
                Token = $"demo-token-{employee.Id}",
                User = new UserProfile
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Email = employee.Email,
                    Designation = employee.Designation,
                    Department = employee.Department,
                    Role = employee.Role,
                    Country = employee.Country
                }
            };
        }

        public async Task<LoginResponse> SignupAsync(string employeeId, string email, string code, string password)
        {
            if (string.IsNullOrWhiteSpace(employeeId) || string.IsNullOrWhiteSpace(email) || 
                string.IsNullOrWhiteSpace(code) || string.IsNullOrWhiteSpace(password))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "All fields are required"
                };
            }

            var employee = await _dbContext.Set<Employee>().FindAsync(employeeId);
            if (employee == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Employee ID not found. Only pre-created company profiles may register."
                };
            }

            if (!employee.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Company email address does not match our records for this Employee ID."
                };
            }

            if (employee.IsRegistered)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "This employee profile has already been registered."
                };
            }

            if (string.IsNullOrEmpty(employee.RegistrationCode) || employee.RegistrationCode != code)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid registration code."
                };
            }

            // Register employee
            employee.PasswordHash = HashPassword(password);
            employee.IsRegistered = true;
            employee.RegistrationCode = null; // Consume code

            await _dbContext.SaveChangesAsync();

            return new LoginResponse
            {
                Success = true,
                Message = "Registration completed successfully. You can now log in."
            };
        }
    }
}
