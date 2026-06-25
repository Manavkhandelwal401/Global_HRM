using DocumentFeature.Domain.Enums;

namespace DocumentFeature.Application.DTOs
{
    public class DocumentDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public DocumentCategory Category { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Url { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DocumentStatus Status { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

// Made with Bob