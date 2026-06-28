using ExpenseFeature.Domain.Enums;

namespace ExpenseFeature.Application.DTOs
{
    public class ReimbursementDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public ReimbursementCategory Category { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public DateTime Date { get; set; }
        public ReimbursementStatus Status { get; set; }
        public string? Comments { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ApprovedByName { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob