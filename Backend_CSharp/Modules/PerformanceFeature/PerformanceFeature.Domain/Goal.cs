using HRMS.Core.Postgres.Common;
using PerformanceFeature.Domain.Enums;

namespace PerformanceFeature.Domain
{
    public class Goal : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public decimal TargetValue { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal Weight { get; set; }
        public GoalStatus Status { get; set; } = GoalStatus.NotStarted;
        public decimal ProgressPercentage { get; set; }
        public DateTime? DueDate { get; set; }
    }
}

// Made with Bob
