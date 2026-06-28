using HRMS.Core.Postgres.Common;
using LeaveFeature.Domain.Enums;

namespace LeaveFeature.Domain
{
    public class LeaveRequest : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalDays { get; set; }
        public string? Reason { get; set; }
        public LeaveRequestStatus Status { get; set; } = LeaveRequestStatus.Pending;
        public string? ApprovalComments { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
    }
}

// Made with Bob
