using AnnouncementFeature.Domain.Enums;

namespace AnnouncementFeature.Application.DTOs
{
    public class AnnouncementDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public AnnouncementCategory Category { get; set; }
        public string Content { get; set; } = string.Empty;
        public AnnouncementPriority Priority { get; set; }
        public VisibilityScope VisibilityScope { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? TargetDepartment { get; set; }
        public string? TargetLocation { get; set; }
        public bool IsAcknowledged { get; set; }
        public int AcknowledgementCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// Made with Bob