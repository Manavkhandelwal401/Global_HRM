using HRMS.Core.Postgres.Common;
using DocumentFeature.Domain.Enums;

namespace DocumentFeature.Domain
{
    public class Document : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public DocumentCategory Category { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Url { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DocumentStatus Status { get; set; } = DocumentStatus.Missing;
        public string? RejectionReason { get; set; }
    }
}

// Made with Bob
