using EmployeeFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeFeature.Infrastructure.Data
{
    public class EmployeeEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employees");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Designation).HasMaxLength(100);
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.PasswordHash).HasMaxLength(500);
                entity.Property(e => e.RegistrationCode).HasMaxLength(100);
                entity.Property(e => e.IsRegistered).HasDefaultValue(false);
                
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.ManagerId);
                entity.HasIndex(e => e.Department);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Role);
            });
        }
    }
}

// Made with Bob
