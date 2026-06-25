using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Domain
{
    public interface IAnnouncementRepository
    {
        Task<IEnumerable<Announcement>> GetActiveAnnouncementsAsync();
        Task<Announcement?> GetAnnouncementByIdAsync(string announcementId);
        Task<Announcement> AddAnnouncementAsync(Announcement announcement);
        Task<Announcement> UpdateAnnouncementAsync(string id, Announcement announcement);
    }
}

// Made with Bob