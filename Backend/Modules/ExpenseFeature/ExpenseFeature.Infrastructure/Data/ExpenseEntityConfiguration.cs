using ExpenseFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExpenseFeature.Infrastructure.Data
{
    public class ExpenseEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reimbursement>(entity =>
            {
                entity.ToTable("Reimbursements");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Comments).HasMaxLength(500);
                entity.Property(e => e.ApprovedBy).HasMaxLength(50);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Date);
            });
        }
    }
}

// Made with Bob
