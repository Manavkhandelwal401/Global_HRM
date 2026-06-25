using HRMS.Core.Postgres.Common;
using RecruitmentFeature.Domain.Enums;

namespace RecruitmentFeature.Domain
{
    public class Candidate : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? RoleApplied { get; set; }
        public CandidateStatus Status { get; set; } = CandidateStatus.Applied;
        public decimal Rating { get; set; }
        public string? Experience { get; set; }
        public string? NoticePeriod { get; set; }
        public string? Skills { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? JobPostingId { get; set; }
    }
}

// Made with Bob
