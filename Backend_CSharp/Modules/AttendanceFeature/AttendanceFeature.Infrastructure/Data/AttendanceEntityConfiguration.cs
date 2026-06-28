using AttendanceFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AttendanceFeature.Infrastructure.Data
{
    public class AttendanceEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AttendanceRecord>(entity =>
            {
                entity.ToTable("AttendanceRecords");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.ProductiveHours).HasPrecision(5, 2);
                entity.Property(e => e.BreakHours).HasPrecision(5, 2);
                entity.Property(e => e.OvertimeHours).HasPrecision(5, 2);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Date);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => new { e.EmployeeId, e.Date }).IsUnique();
            });
        }
    }
}

// Made with Bob
