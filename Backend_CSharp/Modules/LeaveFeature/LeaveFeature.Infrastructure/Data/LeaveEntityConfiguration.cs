using LeaveFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LeaveFeature.Infrastructure.Data
{
    public class LeaveEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaveRequest>(entity =>
            {
                entity.ToTable("LeaveRequests");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TotalDays).HasPrecision(5, 2);
                entity.Property(e => e.Reason).HasMaxLength(500);
                entity.Property(e => e.ApprovalComments).HasMaxLength(500);
                entity.Property(e => e.ApprovedBy).HasMaxLength(50);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.StartDate);
            });

            modelBuilder.Entity<LeaveBalance>(entity =>
            {
                entity.ToTable("LeaveBalances");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TotalAllowed).HasPrecision(5, 2);
                entity.Property(e => e.Used).HasPrecision(5, 2);
                entity.Property(e => e.Pending).HasPrecision(5, 2);
                entity.Property(e => e.Available).HasPrecision(5, 2);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => new { e.EmployeeId, e.LeaveType }).IsUnique();
            });
        }
    }
}

// Made with Bob
