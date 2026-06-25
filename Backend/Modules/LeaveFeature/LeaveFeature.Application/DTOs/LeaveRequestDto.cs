using LeaveFeature.Domain.Enums;

namespace LeaveFeature.Application.DTOs
{
    public class LeaveRequestDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalDays { get; set; }
        public string? Reason { get; set; }
        public LeaveRequestStatus Status { get; set; }
        public string? ApprovalComments { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ApprovedByName { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob