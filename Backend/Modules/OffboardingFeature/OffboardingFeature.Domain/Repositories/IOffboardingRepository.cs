using OffboardingFeature.Domain;

namespace OffboardingFeature.Domain.Repositories;

public interface IOffboardingRepository
{
    // Resignation operations
    Task CreateResignationAsync(Resignation resignation);
    Task<Resignation?> GetResignationByIdAsync(string id);
    Task<Resignation?> GetResignationByEmployeeIdAsync(string employeeId);
    Task<List<Resignation>> GetPendingResignationsAsync();
    Task UpdateResignationAsync(Resignation resignation);
    
    // Clearance operations
    Task CreateClearanceItemsAsync(List<ClearanceItem> clearanceItems);
    Task<ClearanceItem?> GetClearanceItemByIdAsync(string id);
    Task<List<ClearanceItem>> GetClearanceItemsByEmployeeIdAsync(string employeeId);
    Task UpdateClearanceItemAsync(ClearanceItem clearanceItem);
    
    // Exit interview operations
    Task CreateExitInterviewAsync(ExitInterview exitInterview);
    Task<ExitInterview?> GetExitInterviewByEmployeeIdAsync(string employeeId);
}
