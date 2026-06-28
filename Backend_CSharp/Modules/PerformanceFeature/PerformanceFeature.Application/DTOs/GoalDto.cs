using PerformanceFeature.Domain.Enums;

namespace PerformanceFeature.Application.DTOs
{
    public class GoalDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal TargetValue { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal Weight { get; set; }
        public GoalStatus Status { get; set; }
        public decimal ProgressPercentage { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob