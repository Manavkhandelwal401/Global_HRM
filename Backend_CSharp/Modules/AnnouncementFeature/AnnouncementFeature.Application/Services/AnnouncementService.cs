using AnnouncementFeature.Application.DTOs;
using AnnouncementFeature.Domain;
using AnnouncementFeature.Domain.Enums;


namespace AnnouncementFeature.Application.Services
{
    public interface IAnnouncementService
    {
        Task<IEnumerable<AnnouncementDto>> GetAnnouncementsAsync();
        Task<AnnouncementDto?> CreateAnnouncementAsync(string title, AnnouncementCategory category, string content, 
            AnnouncementPriority priority, VisibilityScope scope, string createdBy, DateTime? expiryDate = null);
        Task<AnnouncementDto?> AcknowledgeAnnouncementAsync(string announcementId, string employeeId);
    }

    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public AnnouncementService(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        public async Task<IEnumerable<AnnouncementDto>> GetAnnouncementsAsync()
        {
            var announcements = await _announcementRepository.GetActiveAnnouncementsAsync();
            return announcements.Select(MapToDto);
        }

        public async Task<AnnouncementDto?> CreateAnnouncementAsync(
            string title, 
            AnnouncementCategory category, 
            string content, 
            AnnouncementPriority priority, 
            VisibilityScope scope, 
            string createdBy,
            DateTime? expiryDate = null)
        {
            var announcement = new Announcement
            {
                Id = Guid.NewGuid().ToString(),
                Title = title,
                Category = category,
                Content = content,
                Priority = priority,
                VisibilityScope = scope,
                CreatedBy = createdBy,
                ExpiryDate = expiryDate
            };

            var savedAnnouncement = await _announcementRepository.AddAnnouncementAsync(announcement);
            return MapToDto(savedAnnouncement);
        }

        public async Task<AnnouncementDto?> AcknowledgeAnnouncementAsync(string announcementId, string employeeId)
        {
            var announcement = await _announcementRepository.GetAnnouncementByIdAsync(announcementId);
            if (announcement == null)
            {
                throw new InvalidOperationException("Announcement not found");
            }

            // In a real implementation, this would track acknowledgements in a separate table
            // For now, we'll just return the announcement
            var dto = MapToDto(announcement);
            dto.IsAcknowledged = true;
            dto.AcknowledgementCount++;
            
            return dto;
        }

        private AnnouncementDto MapToDto(Announcement announcement)
        {
            return new AnnouncementDto
            {
                Id = announcement.Id,
                Title = announcement.Title,
                Category = announcement.Category,
                Content = announcement.Content,
                Priority = announcement.Priority,
                VisibilityScope = announcement.VisibilityScope,
                CreatedBy = announcement.CreatedBy,
                CreatedByName = "HR Admin", // Would be populated from Employee service in real implementation
                ExpiryDate = announcement.ExpiryDate,
                TargetDepartment = announcement.TargetDepartment,
                TargetLocation = announcement.TargetLocation,
                IsAcknowledged = false,
                AcknowledgementCount = 0,
                CreatedAt = announcement.CreatedOn ?? DateTime.UtcNow
            };
        }
    }
}

// Made with Bob