using TrainingFeature.Domain.Enums;

namespace TrainingFeature.Application.DTOs
{
    public class TrainingModuleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public TrainingCategory Category { get; set; }
        public int Duration { get; set; }
        public bool Mandatory { get; set; }
        public TrainingStatus Status { get; set; }
        public decimal ProgressPercentage { get; set; }
        public string? Description { get; set; }
        public bool CertificateIssued { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob