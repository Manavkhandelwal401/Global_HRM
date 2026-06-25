using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServiceRequestFeature.Domain;

namespace ServiceRequestFeature.Infrastructure.Data;

public class ServiceRequestConfiguration : IEntityTypeConfiguration<ServiceRequest>
{
    public void Configure(EntityTypeBuilder<ServiceRequest> builder)
    {
        builder.ToTable("ServiceRequests");
        
        builder.HasKey(sr => sr.Id);
        
        builder.Property(sr => sr.EmployeeId)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(sr => sr.Title)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.Property(sr => sr.Description)
            .IsRequired()
            .HasMaxLength(5000);
        
        builder.Property(sr => sr.Category)
            .IsRequired();
        
        builder.Property(sr => sr.Priority)
            .IsRequired();
        
        builder.Property(sr => sr.Status)
            .IsRequired();
        
        builder.Property(sr => sr.AssignedToId)
            .HasMaxLength(100);
        
        builder.Property(sr => sr.AssignedToName)
            .HasMaxLength(200);
        
        builder.Property(sr => sr.ResolutionComments)
            .HasMaxLength(5000);
        
        builder.Property(sr => sr.CreatedAt)
            .IsRequired();
        
        builder.Property(sr => sr.UpdatedAt)
            .IsRequired();
        
        builder.HasIndex(sr => sr.EmployeeId);
        builder.HasIndex(sr => sr.Status);
        builder.HasIndex(sr => sr.Category);
        builder.HasIndex(sr => sr.Priority);
        builder.HasIndex(sr => sr.AssignedToId);
    }
}

// Made with Bob