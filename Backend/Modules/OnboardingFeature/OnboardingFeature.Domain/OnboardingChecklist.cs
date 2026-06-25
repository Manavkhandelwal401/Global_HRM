using HRMS.Shared.Domain;
using OnboardingFeature.Domain.Enums;

namespace OnboardingFeature.Domain;

public class OnboardingChecklist : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public string TaskId { get; set; } = string.Empty;
    public string TaskName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public OnboardingTaskStatus Status { get; set; } = OnboardingTaskStatus.Pending;
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Made with Bob
