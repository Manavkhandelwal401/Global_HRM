using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OffboardingFeature.Domain;

namespace OffboardingFeature.Infrastructure.Data;

public class ResignationConfiguration : IEntityTypeConfiguration<Resignation>
{
    public void Configure(EntityTypeBuilder<Resignation> builder)
    {
        builder.ToTable("Resignations");
        
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.EmployeeId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(r => r.SubmissionDate)
            .IsRequired();
        
        builder.Property(r => r.LastWorkingDate)
            .IsRequired();
        
        builder.Property(r => r.Reason)
            .IsRequired()
            .HasMaxLength(2000);
        
        builder.Property(r => r.Status)
            .IsRequired();
        
        builder.Property(r => r.ApprovedBy)
            .HasMaxLength(100);
        
        builder.Property(r => r.ApprovedOn);
        
        builder.HasIndex(r => r.EmployeeId);
        builder.HasIndex(r => r.Status);
    }
}

public class ClearanceItemConfiguration : IEntityTypeConfiguration<ClearanceItem>
{
    public void Configure(EntityTypeBuilder<ClearanceItem> builder)
    {
        builder.ToTable("ClearanceItems");
        
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.EmployeeId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(c => c.Department)
            .IsRequired();
        
        builder.Property(c => c.ItemName)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.Property(c => c.Status)
            .IsRequired();
        
        builder.Property(c => c.ClearedBy)
            .HasMaxLength(100);
        
        builder.Property(c => c.ClearedOn);
        
        builder.HasIndex(c => c.EmployeeId);
        builder.HasIndex(c => c.Status);
        builder.HasIndex(c => c.Department);
    }
}

public class ExitInterviewConfiguration : IEntityTypeConfiguration<ExitInterview>
{
    public void Configure(EntityTypeBuilder<ExitInterview> builder)
    {
        builder.ToTable("ExitInterviews");
        
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.EmployeeId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(e => e.FeedbackJson)
            .IsRequired();
        
        builder.Property(e => e.CreatedAt)
            .IsRequired();
        
        builder.HasIndex(e => e.EmployeeId);
    }
}

// Made with Bob