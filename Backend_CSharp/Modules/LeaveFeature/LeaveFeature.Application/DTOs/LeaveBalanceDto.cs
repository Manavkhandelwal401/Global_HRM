using LeaveFeature.Domain.Enums;

namespace LeaveFeature.Application.DTOs
{
    public class LeaveBalanceDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public decimal TotalAllowed { get; set; }
        public decimal Used { get; set; }
        public decimal Pending { get; set; }
        public decimal Available { get; set; }
    }
}

// Made with Bob