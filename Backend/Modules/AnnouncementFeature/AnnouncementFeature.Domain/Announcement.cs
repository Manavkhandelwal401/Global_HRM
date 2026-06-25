using HRMS.Core.Postgres.Common;
using AnnouncementFeature.Domain.Enums;

namespace AnnouncementFeature.Domain
{
    public class Announcement : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public AnnouncementCategory Category { get; set; }
        public string Content { get; set; } = string.Empty;
        public AnnouncementPriority Priority { get; set; } = AnnouncementPriority.Medium;
        public VisibilityScope VisibilityScope { get; set; } = VisibilityScope.Global;
        public string? CreatedBy { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? TargetDepartment { get; set; }
        public string? TargetLocation { get; set; }
    }
}

// Made with Bob
