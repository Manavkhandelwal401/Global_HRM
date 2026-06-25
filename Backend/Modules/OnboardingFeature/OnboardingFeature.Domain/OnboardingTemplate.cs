using HRMS.Shared.Domain;

namespace OnboardingFeature.Domain;

public class OnboardingTemplate : BaseEntity
{
    public string Role { get; set; } = string.Empty;
    public string TasksJson { get; set; } = string.Empty; // JSON array of task definitions
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// Made with Bob
