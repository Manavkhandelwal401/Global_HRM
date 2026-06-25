using CopilotFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CopilotFeature.Infrastructure.Data
{
    public class CopilotEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CopilotInteraction>(entity =>
            {
                entity.ToTable("CopilotInteractions");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Query).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Response).IsRequired().HasMaxLength(4000);
                entity.Property(e => e.Context).HasMaxLength(1000);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.InteractionTime);
            });
        }
    }
}

// Made with Bob
