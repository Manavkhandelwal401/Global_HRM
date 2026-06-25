using OnboardingFeature.Application.DTOs;

namespace OnboardingFeature.Application.Services;

public interface IOnboardingService
{
    Task<List<OnboardingChecklistDto>> CreateOnboardingChecklistAsync(string employeeId, string role);
    Task<OnboardingChecklistDto?> ToggleOnboardingTaskAsync(string checklistId, bool isCompleted);
    Task<List<OnboardingChecklistDto>> GetNewHireChecklistAsync(string employeeId);
    Task<List<OnboardingProgressDto>> GetOnboardingProgressSummaryAsync();
}

// Made with Bob
