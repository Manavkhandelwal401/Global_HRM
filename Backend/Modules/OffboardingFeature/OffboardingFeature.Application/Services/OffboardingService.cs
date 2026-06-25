using OffboardingFeature.Domain;
using OffboardingFeature.Domain.Enums;
using OffboardingFeature.Domain.Repositories;

namespace OffboardingFeature.Application.Services;

public class OffboardingService : IOffboardingService
{
    private readonly IOffboardingRepository _repository;

    public OffboardingService(IOffboardingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Resignation> SubmitResignationAsync(string employeeId, string reason, DateTime lastWorkingDate)
    {
        var resignation = new Resignation
        {
            Id = Guid.NewGuid().ToString(),
            EmployeeId = employeeId,
            SubmissionDate = DateTime.UtcNow,
            LastWorkingDate = lastWorkingDate,
            Reason = reason,
            Status = ResignationStatus.Pending
        };

        await _repository.CreateResignationAsync(resignation);
        
        // Auto-initialize clearance items when resignation is submitted
        await InitializeClearanceItemsAsync(employeeId);
        
        return resignation;
    }

    public async Task<Resignation?> UpdateResignationStatusAsync(string resignationId, string status, DateTime? lastWorkingDate, string approvedBy)
    {
        var resignation = await _repository.GetResignationByIdAsync(resignationId);
        
        if (resignation == null)
            return null;

        resignation.Status = Enum.Parse<ResignationStatus>(status);
        resignation.ApprovedBy = approvedBy;
        resignation.ApprovedOn = DateTime.UtcNow;
        
        if (lastWorkingDate.HasValue)
        {
            resignation.LastWorkingDate = lastWorkingDate.Value;
        }

        await _repository.UpdateResignationAsync(resignation);
        
        return resignation;
    }

    public async Task<Resignation?> GetResignationByEmployeeIdAsync(string employeeId)
    {
        return await _repository.GetResignationByEmployeeIdAsync(employeeId);
    }

    public async Task<List<Resignation>> GetPendingResignationsAsync()
    {
        return await _repository.GetPendingResignationsAsync();
    }

    public async Task<List<ClearanceItem>> InitializeClearanceItemsAsync(string employeeId)
    {
        // Check if clearance items already exist
        var existing = await _repository.GetClearanceItemsByEmployeeIdAsync(employeeId);
        if (existing.Any())
            return existing;

        var clearanceItems = new List<ClearanceItem>
        {
            new ClearanceItem
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                Department = ClearanceDepartment.IT,
                ItemName = "Return laptop, access cards, and other IT equipment",
                Status = ClearanceStatus.Pending
            },
            new ClearanceItem
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                Department = ClearanceDepartment.Finance,
                ItemName = "Clear pending dues and expense reimbursements",
                Status = ClearanceStatus.Pending
            },
            new ClearanceItem
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                Department = ClearanceDepartment.HR,
                ItemName = "Submit exit documents and complete final paperwork",
                Status = ClearanceStatus.Pending
            },
            new ClearanceItem
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                Department = ClearanceDepartment.Admin,
                ItemName = "Return office keys and access badges",
                Status = ClearanceStatus.Pending
            }
        };

        await _repository.CreateClearanceItemsAsync(clearanceItems);
        
        return clearanceItems;
    }

    public async Task<ClearanceItem?> ToggleClearanceStatusAsync(string clearanceId, bool isCleared, string clearedBy)
    {
        var clearanceItem = await _repository.GetClearanceItemByIdAsync(clearanceId);
        
        if (clearanceItem == null)
            return null;

        clearanceItem.Status = isCleared ? ClearanceStatus.Cleared : ClearanceStatus.Pending;
        clearanceItem.ClearedBy = isCleared ? clearedBy : null;
        clearanceItem.ClearedOn = isCleared ? DateTime.UtcNow : null;

        await _repository.UpdateClearanceItemAsync(clearanceItem);
        
        return clearanceItem;
    }

    public async Task<List<ClearanceItem>> GetClearanceItemsByEmployeeIdAsync(string employeeId)
    {
        return await _repository.GetClearanceItemsByEmployeeIdAsync(employeeId);
    }

    public async Task<ExitInterview> SubmitExitFeedbackAsync(string employeeId, string feedbackJson)
    {
        var exitInterview = new ExitInterview
        {
            Id = Guid.NewGuid().ToString(),
            EmployeeId = employeeId,
            FeedbackJson = feedbackJson,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.CreateExitInterviewAsync(exitInterview);
        
        return exitInterview;
    }

    public async Task<ExitInterview?> GetExitInterviewByEmployeeIdAsync(string employeeId)
    {
        return await _repository.GetExitInterviewByEmployeeIdAsync(employeeId);
    }
}

// Made with Bob