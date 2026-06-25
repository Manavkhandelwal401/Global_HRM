using HRMS.Core.Postgres.Common;
using RecognitionFeature.Domain.Enums;

namespace RecognitionFeature.Domain
{
    public class RecognitionNomination : BaseEntity
    {
        public string NominatorId { get; set; } = string.Empty;
        public string NomineeId { get; set; } = string.Empty;
        public string CoreValue { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public int Points { get; set; }
        public NominationStatus Status { get; set; } = NominationStatus.Pending;
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedOn { get; set; }
    }
}

// Made with Bob