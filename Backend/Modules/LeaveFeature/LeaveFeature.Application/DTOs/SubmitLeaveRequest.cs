using LeaveFeature.Domain.Enums;

namespace LeaveFeature.Application.DTOs
{
    public class SubmitLeaveRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Reason { get; set; }
    }
}

// Made with Bob