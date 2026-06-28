using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssetFeature.Domain;

namespace AssetFeature.Infrastructure.Data;

public class AssetEntityConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.ToTable("Assets");
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.SerialNumber)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(a => a.AssetName)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(a => a.Category)
            .IsRequired()
            .HasConversion<string>();
        
        builder.Property(a => a.Condition)
            .IsRequired()
            .HasConversion<string>();
        
        builder.Property(a => a.Status)
            .IsRequired()
            .HasConversion<string>();
        
        builder.HasIndex(a => a.SerialNumber).IsUnique();
    }
}

public class AssetAllocationEntityConfiguration : IEntityTypeConfiguration<AssetAllocation>
{
    public void Configure(EntityTypeBuilder<AssetAllocation> builder)
    {
        builder.ToTable("AssetAllocations");
        builder.HasKey(a => a.Id);
        
        builder.Property(a => a.AssetId)
            .IsRequired();
        
        builder.Property(a => a.EmployeeId)
            .IsRequired();
        
        builder.Property(a => a.AllocatedOn)
            .IsRequired();
        
        builder.Property(a => a.ConditionOnReturn)
            .HasConversion<string>();
        
        builder.HasOne(a => a.Asset)
            .WithMany()
            .HasForeignKey(a => a.AssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

// Made with Bob