using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.Application.DTOs
{
    public class JobPostingDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? ExperienceRequired { get; set; }
        public string? SalaryRange { get; set; }
        public JobStatus Status { get; set; }
        public string? Description { get; set; }
        public DateTime? PostedDate { get; set; }
        public int CandidateCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob