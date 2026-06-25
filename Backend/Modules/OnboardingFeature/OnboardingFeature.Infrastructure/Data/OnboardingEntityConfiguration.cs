using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnboardingFeature.Domain;

namespace OnboardingFeature.Infrastructure.Data;

public class OnboardingChecklistConfiguration : IEntityTypeConfiguration<OnboardingChecklist>
{
    public void Configure(EntityTypeBuilder<OnboardingChecklist> builder)
    {
        builder.ToTable("OnboardingChecklists");
        
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.EmployeeId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(c => c.TaskId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(c => c.TaskName)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(c => c.Description)
            .HasMaxLength(1000);
        
        builder.Property(c => c.Status)
            .IsRequired();
        
        builder.Property(c => c.CompletedAt);
        
        builder.Property(c => c.CreatedAt)
            .IsRequired();
        
        builder.HasIndex(c => c.EmployeeId);
        builder.HasIndex(c => c.Status);
    }
}

public class OnboardingTemplateConfiguration : IEntityTypeConfiguration<OnboardingTemplate>
{
    public void Configure(EntityTypeBuilder<OnboardingTemplate> builder)
    {
        builder.ToTable("OnboardingTemplates");
        
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Role)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(t => t.TasksJson)
            .IsRequired();
        
        builder.Property(t => t.CreatedAt)
            .IsRequired();
        
        builder.HasIndex(t => t.Role);
    }
}

// Made with Bob
