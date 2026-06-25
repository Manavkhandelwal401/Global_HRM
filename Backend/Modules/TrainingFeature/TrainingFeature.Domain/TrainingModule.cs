using HRMS.Core.Postgres.Common;
using TrainingFeature.Domain.Enums;

namespace TrainingFeature.Domain
{
    public class TrainingModule : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public TrainingCategory Category { get; set; }
        public int Duration { get; set; }
        public bool Mandatory { get; set; }
        public TrainingStatus Status { get; set; } = TrainingStatus.NotStarted;
        public decimal ProgressPercentage { get; set; }
        public string? Description { get; set; }
    }
}

// Made with Bob
