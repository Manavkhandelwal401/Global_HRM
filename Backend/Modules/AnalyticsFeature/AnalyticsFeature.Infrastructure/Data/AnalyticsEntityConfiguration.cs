using AnalyticsFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnalyticsFeature.Infrastructure.Data
{
    public class AnalyticsEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AnalyticsMetric>(entity =>
            {
                entity.ToTable("AnalyticsMetrics");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.MetricName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.MetricType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Value).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.Category).HasMaxLength(100);
                
                entity.HasIndex(e => e.MetricName);
                entity.HasIndex(e => e.RecordedAt);
                entity.HasIndex(e => e.Department);
            });
        }
    }
}

// Made with Bob
