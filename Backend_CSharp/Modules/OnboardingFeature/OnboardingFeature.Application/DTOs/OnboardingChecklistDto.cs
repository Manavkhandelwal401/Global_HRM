using OnboardingFeature.Domain.Enums;

namespace OnboardingFeature.Application.DTOs;

public class OnboardingChecklistDto
{
    public string Id { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string TaskId { get; set; } = string.Empty;
    public string TaskName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public OnboardingTaskStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Made with Bob
