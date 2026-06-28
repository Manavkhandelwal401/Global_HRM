using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.Application.DTOs
{
    public class CandidateDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? RoleApplied { get; set; }
        public CandidateStatus Status { get; set; }
        public decimal Rating { get; set; }
        public string? Experience { get; set; }
        public string? NoticePeriod { get; set; }
        public string? Skills { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? JobPostingId { get; set; }
        public string? JobTitle { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? InterviewerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob