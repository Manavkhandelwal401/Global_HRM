using RecruitmentFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace RecruitmentFeature.Infrastructure.Data
{
    public class RecruitmentEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobPosting>(entity =>
            {
                entity.ToTable("JobPostings");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(100);
                entity.Property(e => e.ExperienceRequired).HasMaxLength(50);
                entity.Property(e => e.SalaryRange).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(2000);
                
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Department);
            });

            modelBuilder.Entity<Candidate>(entity =>
            {
                entity.ToTable("Candidates");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.RoleApplied).HasMaxLength(200);
                entity.Property(e => e.Rating).HasPrecision(3, 2);
                entity.Property(e => e.Experience).HasMaxLength(50);
                entity.Property(e => e.NoticePeriod).HasMaxLength(50);
                entity.Property(e => e.Skills).HasMaxLength(500);
                entity.Property(e => e.Email).HasMaxLength(200);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.JobPostingId).HasMaxLength(50);
                
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.JobPostingId);
                entity.HasIndex(e => e.Email);
            });
        }
    }
}

// Made with Bob
