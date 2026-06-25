using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Enum;
using EmployeeFeature.Domain.Enums;

namespace EmployeeFeature.Domain
{
    public class Employee : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? ManagerId { get; set; }
        public EmployeeRole Role { get; set; } = EmployeeRole.Employee;
        public DateTime? JoiningDate { get; set; }
        public Country Country { get; set; } = Country.US;
        public Status Status { get; set; } = Status.Active;
        public string? PasswordHash { get; set; }
    }
}

// Made with Bob
