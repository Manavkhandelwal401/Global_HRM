using RecognitionFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RecognitionFeature.Infrastructure.Data
{
    public class RecognitionEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RecognitionNomination>(entity =>
            {
                entity.ToTable("RecognitionNominations");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.NominatorId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NomineeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CoreValue).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Reason).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Points).IsRequired();
                entity.Property(e => e.ApprovedBy).HasMaxLength(50);
                
                entity.HasIndex(e => e.NomineeId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.ApprovedOn);
            });
        }
    }
}

// Made with Bob