using HRMS.Core.Postgres.Common;
using ExpenseFeature.Domain.Enums;

namespace ExpenseFeature.Domain
{
    public class Reimbursement : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public ReimbursementCategory Category { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public DateTime Date { get; set; }
        public ReimbursementStatus Status { get; set; } = ReimbursementStatus.Pending;
        public string? Comments { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
    }
}

// Made with Bob
