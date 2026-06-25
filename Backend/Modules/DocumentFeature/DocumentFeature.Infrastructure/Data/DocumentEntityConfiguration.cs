using DocumentFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DocumentFeature.Infrastructure.Data
{
    public class DocumentEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Document>(entity =>
            {
                entity.ToTable("Documents");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Url).HasMaxLength(500);
                entity.Property(e => e.RejectionReason).HasMaxLength(500);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Status);
            });
        }
    }
}

// Made with Bob
