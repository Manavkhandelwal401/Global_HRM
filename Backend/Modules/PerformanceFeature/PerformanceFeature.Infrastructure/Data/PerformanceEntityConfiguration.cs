using PerformanceFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PerformanceFeature.Infrastructure.Data
{
    public class PerformanceEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Goal>(entity =>
            {
                entity.ToTable("Goals");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.TargetValue).HasPrecision(18, 2);
                entity.Property(e => e.CurrentValue).HasPrecision(18, 2);
                entity.Property(e => e.Weight).HasPrecision(5, 2);
                entity.Property(e => e.ProgressPercentage).HasPrecision(5, 2);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Status);
            });

            modelBuilder.Entity<PerformanceReview>(entity =>
            {
                entity.ToTable("PerformanceReviews");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ReviewerId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Period).HasMaxLength(50);
                entity.Property(e => e.Rating).HasPrecision(3, 2);
                entity.Property(e => e.Strengths).HasMaxLength(1000);
                entity.Property(e => e.Improvements).HasMaxLength(1000);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.ReviewerId);
            });
        }
    }
}

// Made with Bob
