using OffboardingFeature.Domain;

namespace OffboardingFeature.Application.Services;

public interface IOffboardingService
{
    Task<Resignation> SubmitResignationAsync(string employeeId, string reason, DateTime lastWorkingDate);
    Task<Resignation?> UpdateResignationStatusAsync(string resignationId, string status, DateTime? lastWorkingDate, string approvedBy);
    Task<Resignation?> GetResignationByEmployeeIdAsync(string employeeId);
    Task<List<Resignation>> GetPendingResignationsAsync();
    
    Task<List<ClearanceItem>> InitializeClearanceItemsAsync(string employeeId);
    Task<ClearanceItem?> ToggleClearanceStatusAsync(string clearanceId, bool isCleared, string clearedBy);
    Task<List<ClearanceItem>> GetClearanceItemsByEmployeeIdAsync(string employeeId);
    
    Task<ExitInterview> SubmitExitFeedbackAsync(string employeeId, string feedbackJson);
    Task<ExitInterview?> GetExitInterviewByEmployeeIdAsync(string employeeId);
}

// Made with Bob