using RecognitionFeature.Domain.Enums;

namespace RecognitionFeature.Application.DTOs
{
    public class RecognitionNominationDto
    {
        public string Id { get; set; } = string.Empty;
        public string NominatorId { get; set; } = string.Empty;
        public string NominatorName { get; set; } = string.Empty;
        public string NomineeId { get; set; } = string.Empty;
        public string NomineeName { get; set; } = string.Empty;
        public string CoreValue { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public int Points { get; set; }
        public NominationStatus Status { get; set; }
        public string? ApprovedBy { get; set; }
        public string? ApprovedByName { get; set; }
        public DateTime? ApprovedOn { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class NominatePeerRequest
    {
        public string NominatorId { get; set; } = string.Empty;
        public string NomineeId { get; set; } = string.Empty;
        public string CoreValue { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public int Points { get; set; }
    }
}

// Made with Bob