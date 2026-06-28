namespace PerformanceFeature.Application.DTOs
{
    public class PerformanceReviewDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string ReviewerId { get; set; } = string.Empty;
        public string ReviewerName { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string? Strengths { get; set; }
        public string? Improvements { get; set; }
        public DateTime? ReviewDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob