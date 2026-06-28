using HRMS.Core.Postgres.Common;
using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.Domain
{
    public class JobPosting : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Location { get; set; }
        public string? ExperienceRequired { get; set; }
        public string? SalaryRange { get; set; }
        public JobStatus Status { get; set; } = JobStatus.Open;
        public string? Description { get; set; }
        public DateTime? PostedDate { get; set; }
    }
}

// Made with Bob
