using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Infrastructure.Repositories
{
    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly PostgresDbContext _dbContext;

        public AnnouncementRepository(PostgresDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Announcement>> GetActiveAnnouncementsAsync()
        {
            var now = DateTime.UtcNow;
            return await _dbContext.Set<Announcement>()
                .Where(a => !a.ExpiryDate.HasValue || a.ExpiryDate.Value > now)
                .OrderByDescending(a => a.Priority)
                .ThenByDescending(a => a.CreatedOn)
                .ToListAsync();
        }

        public async Task<Announcement?> GetAnnouncementByIdAsync(string announcementId)
        {
            return await _dbContext.Set<Announcement>()
                .FirstOrDefaultAsync(a => a.Id == announcementId);
        }

        public async Task<Announcement> AddAnnouncementAsync(Announcement announcement)
        {
            await _dbContext.Set<Announcement>().AddAsync(announcement);
            await _dbContext.SaveChangesAsync();
            return announcement;
        }

        public async Task<Announcement> UpdateAnnouncementAsync(string id, Announcement announcement)
        {
            _dbContext.Set<Announcement>().Update(announcement);
            await _dbContext.SaveChangesAsync();
            return announcement;
        }
    }
}

// Made with Bob