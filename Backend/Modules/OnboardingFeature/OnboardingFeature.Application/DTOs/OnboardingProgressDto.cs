namespace OnboardingFeature.Application.DTOs;

public class OnboardingProgressDto
{
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public decimal ProgressPercentage { get; set; }
    public DateTime StartDate { get; set; }
}

// Made with Bob
