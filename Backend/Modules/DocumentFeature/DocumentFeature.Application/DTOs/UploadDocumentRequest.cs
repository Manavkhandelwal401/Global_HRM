using DocumentFeature.Domain.Enums;

namespace DocumentFeature.Application.DTOs
{
    public class UploadDocumentRequest
    {
        public string EmployeeId { get; set; } = string.Empty;
        public DocumentCategory Category { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
    }
}

// Made with Bob