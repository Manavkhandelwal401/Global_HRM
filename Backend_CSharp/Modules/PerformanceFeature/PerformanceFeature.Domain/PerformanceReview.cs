using HRMS.Core.Postgres.Common;

namespace PerformanceFeature.Domain
{
    public class PerformanceReview : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string ReviewerId { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string? Strengths { get; set; }
        public string? Improvements { get; set; }
        public DateTime? ReviewDate { get; set; }
    }
}

// Made with Bob
