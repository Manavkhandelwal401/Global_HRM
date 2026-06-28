using AnnouncementFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnnouncementFeature.Infrastructure.Data
{
    public class AnnouncementEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.ToTable("Announcements");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.CreatedBy).HasMaxLength(50);
                entity.Property(e => e.TargetDepartment).HasMaxLength(100);
                entity.Property(e => e.TargetLocation).HasMaxLength(100);
                
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Priority);
                entity.HasIndex(e => e.VisibilityScope);
                entity.HasIndex(e => e.ExpiryDate);
            });
        }
    }
}

// Made with Bob
