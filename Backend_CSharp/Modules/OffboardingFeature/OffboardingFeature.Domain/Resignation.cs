using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;
using OffboardingFeature.Domain.Enums;

namespace OffboardingFeature.Domain;

public class Resignation : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    public DateTime LastWorkingDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public ResignationStatus Status { get; set; } = ResignationStatus.Pending;
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedOn { get; set; }
}

// Made with Bob