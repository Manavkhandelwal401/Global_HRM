using EmployeeFeature.Application.DTOs;
using EmployeeFeature.Domain;
using EmployeeFeature.Domain.Enums;
using HRMS.Shared.Domain.Enum;

namespace EmployeeFeature.Application.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<UserProfile?> GetCurrentUserAsync(string userId);
        Task<LoginResponse> SwitchDemoRoleAsync(string userId, EmployeeRole newRole);
    }

    public class AuthService : IAuthService
    {
        // In a real implementation, this would use a repository and proper password hashing
        // For demo purposes, we're using a simplified approach
        
        private readonly Dictionary<string, string> _demoCredentials = new()
        {
            { "admin@workflowglobal.com", "Admin@2024" },
            { "hr@workflowglobal.com", "Hr@2024" },
            { "manager@workflowglobal.com", "Manager@2024" },
            { "john.doe@workflowglobal.com", "Employee@2024" }
        };

        private readonly Dictionary<string, Employee> _demoUsers = new()
        {
            {
                "emp-admin-001",
                new Employee
                {
                    Id = "emp-admin-001",
                    Name = "Admin User",
                    Email = "admin@workflowglobal.com",
                    Designation = "System Administrator",
                    Department = "IT",
                    Role = EmployeeRole.Admin,
                    Country = Country.US,
                    Status = Status.Active
                }
            },
            {
                "emp-hr-001",
                new Employee
                {
                    Id = "emp-hr-001",
                    Name = "HR Specialist",
                    Email = "hr@workflowglobal.com",
                    Designation = "HR Manager",
                    Department = "Human Resources",
                    Role = EmployeeRole.HR,
                    Country = Country.US,
                    Status = Status.Active
                }
            },
            {
                "emp-mgr-001",
                new Employee
                {
                    Id = "emp-mgr-001",
                    Name = "Team Manager",
                    Email = "manager@workflowglobal.com",
                    Designation = "Engineering Manager",
                    Department = "Engineering",
                    Role = EmployeeRole.Manager,
                    Country = Country.US,
                    Status = Status.Active
                }
            },
            {
                "emp-001",
                new Employee
                {
                    Id = "emp-001",
                    Name = "John Doe",
                    Email = "john.doe@workflowglobal.com",
                    Designation = "Senior Software Engineer",
                    Department = "Engineering",
                    Role = EmployeeRole.Employee,
                    Country = Country.US,
                    Status = Status.Active
                }
            }
        };

        public Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Task.FromResult(new LoginResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                });
            }

            if (!_demoCredentials.TryGetValue(request.Email.ToLower(), out var expectedPassword))
            {
                return Task.FromResult(new LoginResponse
                {
                    Success = false,
                    Message = "Invalid credentials"
                });
            }

            if (request.Password != expectedPassword)
            {
                return Task.FromResult(new LoginResponse
                {
                    Success = false,
                    Message = "Invalid credentials"
                });
            }

            var user = _demoUsers.Values.FirstOrDefault(u => u.Email.Equals(request.Email, StringComparison.OrdinalIgnoreCase));
            
            if (user == null)
            {
                return Task.FromResult(new LoginResponse
                {
                    Success = false,
                    Message = "User not found"
                });
            }

            return Task.FromResult(new LoginResponse
            {
                Success = true,
                Message = "Login successful",
                Token = $"demo-token-{user.Id}",
                User = new UserProfile
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Designation = user.Designation,
                    Department = user.Department,
                    Role = user.Role,
                    Country = user.Country
                }
            });
        }

        public Task<UserProfile?> GetCurrentUserAsync(string userId)
        {
            if (_demoUsers.TryGetValue(userId, out var user))
            {
                return Task.FromResult<UserProfile?>(new UserProfile
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Designation = user.Designation,
                    Department = user.Department,
                    Role = user.Role,
                    Country = user.Country
                });
            }

            return Task.FromResult<UserProfile?>(null);
        }

        public Task<LoginResponse> SwitchDemoRoleAsync(string userId, EmployeeRole newRole)
        {
            if (!_demoUsers.TryGetValue(userId, out var user))
            {
                return Task.FromResult(new LoginResponse
                {
                    Success = false,
                    Message = "User not found"
                });
            }

            // Update the role temporarily for demo purposes
            user.Role = newRole;

            return Task.FromResult(new LoginResponse
            {
                Success = true,
                Message = $"Role switched to {newRole}",
                Token = $"demo-token-{user.Id}",
                User = new UserProfile
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Designation = user.Designation,
                    Department = user.Department,
                    Role = user.Role,
                    Country = user.Country
                }
            });
        }
    }
}

// Made with Bob
