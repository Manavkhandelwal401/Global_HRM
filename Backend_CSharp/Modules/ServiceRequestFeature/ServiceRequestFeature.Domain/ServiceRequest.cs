using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;
using ServiceRequestFeature.Domain.Enums;

namespace ServiceRequestFeature.Domain;

public class ServiceRequest : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RequestCategory Category { get; set; } = RequestCategory.IT;
    public RequestPriority Priority { get; set; } = RequestPriority.Medium;
    public RequestStatus Status { get; set; } = RequestStatus.Open;
    public string? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public string? ResolutionComments { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// Made with Bob