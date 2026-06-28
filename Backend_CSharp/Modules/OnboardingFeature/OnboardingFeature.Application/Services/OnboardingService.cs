using OnboardingFeature.Application.DTOs;
using OnboardingFeature.Domain;
using OnboardingFeature.Domain.Enums;
using OnboardingFeature.Infrastructure.Repositories;
using System.Text.Json;

namespace OnboardingFeature.Application.Services;

public class OnboardingService : IOnboardingService
{
    private readonly IOnboardingRepository _repository;

    public OnboardingService(IOnboardingRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<OnboardingChecklistDto>> CreateOnboardingChecklistAsync(string employeeId, string role)
    {
        // Get template tasks for the role
        var tasks = GetDefaultTasksForRole(role);
        
        var checklists = new List<OnboardingChecklist>();
        
        foreach (var task in tasks)
        {
            var checklist = new OnboardingChecklist
            {
                Id = Guid.NewGuid().ToString(),
                EmployeeId = employeeId,
                TaskId = Guid.NewGuid().ToString(),
                TaskName = task.Name,
                Description = task.Description,
                Status = OnboardingTaskStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            
            checklists.Add(checklist);
        }
        
        await _repository.CreateChecklistsAsync(checklists);
        
        return checklists.Select(MapToDto).ToList();
    }

    public async Task<OnboardingChecklistDto?> ToggleOnboardingTaskAsync(string checklistId, bool isCompleted)
    {
        var checklist = await _repository.GetChecklistByIdAsync(checklistId);
        
        if (checklist == null)
            return null;
        
        checklist.Status = isCompleted ? OnboardingTaskStatus.Completed : OnboardingTaskStatus.Pending;
        checklist.CompletedAt = isCompleted ? DateTime.UtcNow : null;
        
        await _repository.UpdateChecklistAsync(checklist);
        
        return MapToDto(checklist);
    }

    public async Task<List<OnboardingChecklistDto>> GetNewHireChecklistAsync(string employeeId)
    {
        var checklists = await _repository.GetChecklistsByEmployeeIdAsync(employeeId);
        return checklists.Select(MapToDto).ToList();
    }

    public async Task<List<OnboardingProgressDto>> GetOnboardingProgressSummaryAsync()
    {
        var allChecklists = await _repository.GetAllChecklistsAsync();
        
        var grouped = allChecklists.GroupBy(c => c.EmployeeId);
        
        var progressList = new List<OnboardingProgressDto>();
        
        foreach (var group in grouped)
        {
            var employeeId = group.Key;
            var tasks = group.ToList();
            var completedTasks = tasks.Count(t => t.Status == OnboardingTaskStatus.Completed);
            var totalTasks = tasks.Count;
            
            progressList.Add(new OnboardingProgressDto
            {
                EmployeeId = employeeId,
                EmployeeName = $"Employee {employeeId.Substring(0, Math.Min(8, employeeId.Length))}", // Simulated
                Department = "Engineering", // Simulated
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                ProgressPercentage = totalTasks > 0 ? (decimal)completedTasks / totalTasks * 100 : 0,
                StartDate = tasks.Min(t => t.CreatedAt)
            });
        }
        
        return progressList;
    }

    private OnboardingChecklistDto MapToDto(OnboardingChecklist checklist)
    {
        return new OnboardingChecklistDto
        {
            Id = checklist.Id,
            EmployeeId = checklist.EmployeeId,
            TaskId = checklist.TaskId,
            TaskName = checklist.TaskName,
            Description = checklist.Description,
            Status = checklist.Status,
            CompletedAt = checklist.CompletedAt,
            CreatedAt = checklist.CreatedAt
        };
    }

    private List<(string Name, string Description)> GetDefaultTasksForRole(string role)
    {
        // Default onboarding tasks based on role
        var commonTasks = new List<(string Name, string Description)>
        {
            ("Submit ID Documents", "Upload government-issued ID and proof of address"),
            ("Complete IT Setup", "Set up workstation, email, and required software"),
            ("Watch Compliance Video", "Complete mandatory compliance and security training"),
            ("Meet Your Manager", "Schedule and complete initial 1:1 with direct manager"),
            ("Complete HR Paperwork", "Fill out tax forms, benefits enrollment, and emergency contacts"),
            ("Review Company Handbook", "Read and acknowledge company policies and procedures")
        };

        // Role-specific tasks
        if (role.Contains("Engineer", StringComparison.OrdinalIgnoreCase) || 
            role.Contains("Developer", StringComparison.OrdinalIgnoreCase))
        {
            commonTasks.AddRange(new[]
            {
                ("Setup Development Environment", "Install IDEs, SDKs, and access code repositories"),
                ("Complete Security Training", "Finish secure coding and data protection training")
            });
        }
        else if (role.Contains("Manager", StringComparison.OrdinalIgnoreCase))
        {
            commonTasks.AddRange(new[]
            {
                ("Leadership Training", "Complete management fundamentals course"),
                ("Meet Your Team", "Schedule introductory meetings with all direct reports")
            });
        }

        return commonTasks;
    }
}

// Made with Bob
