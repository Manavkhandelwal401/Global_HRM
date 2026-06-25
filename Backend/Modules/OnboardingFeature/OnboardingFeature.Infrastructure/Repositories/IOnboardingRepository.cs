using OnboardingFeature.Domain;

namespace OnboardingFeature.Infrastructure.Repositories;

public interface IOnboardingRepository
{
    Task CreateChecklistsAsync(List<OnboardingChecklist> checklists);
    Task<OnboardingChecklist?> GetChecklistByIdAsync(string id);
    Task<List<OnboardingChecklist>> GetChecklistsByEmployeeIdAsync(string employeeId);
    Task<List<OnboardingChecklist>> GetAllChecklistsAsync();
    Task UpdateChecklistAsync(OnboardingChecklist checklist);
}

// Made with Bob
