using HRMS.Core.Postgres.Common;
using LeaveFeature.Domain.Enums;

namespace LeaveFeature.Domain
{
    public class LeaveBalance : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public decimal TotalAllowed { get; set; }
        public decimal Used { get; set; }
        public decimal Pending { get; set; }
        public decimal Available { get; set; }
    }
}

// Made with Bob
