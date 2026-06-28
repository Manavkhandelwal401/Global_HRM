using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;
using OffboardingFeature.Domain.Enums;

namespace OffboardingFeature.Domain;

public class ClearanceItem : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public ClearanceDepartment Department { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public ClearanceStatus Status { get; set; } = ClearanceStatus.Pending;
    public string? ClearedBy { get; set; }
    public DateTime? ClearedOn { get; set; }
}

// Made with Bob