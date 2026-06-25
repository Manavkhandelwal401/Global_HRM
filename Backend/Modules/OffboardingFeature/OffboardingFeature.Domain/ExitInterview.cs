using HRMS.Shared.Domain;
using HRMS.Core.Postgres.Common;

namespace OffboardingFeature.Domain;

public class ExitInterview : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FeedbackJson { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Made with Bob