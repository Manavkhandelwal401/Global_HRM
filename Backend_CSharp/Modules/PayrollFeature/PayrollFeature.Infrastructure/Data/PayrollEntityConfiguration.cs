using PayrollFeature.Domain;
using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace PayrollFeature.Infrastructure.Data
{
    public class PayrollEntityConfiguration : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PayrollRecord>(entity =>
            {
                entity.ToTable("PayrollRecords");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.BasicPay).HasPrecision(18, 2);
                entity.Property(e => e.HRA).HasPrecision(18, 2);
                entity.Property(e => e.Allowances).HasPrecision(18, 2);
                entity.Property(e => e.GrossPay).HasPrecision(18, 2);
                entity.Property(e => e.PF).HasPrecision(18, 2);
                entity.Property(e => e.IncomeTax).HasPrecision(18, 2);
                entity.Property(e => e.ESI).HasPrecision(18, 2);
                entity.Property(e => e.Deductions).HasPrecision(18, 2);
                entity.Property(e => e.NetPay).HasPrecision(18, 2);
                
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.PayPeriodStart);
                entity.HasIndex(e => e.Status);
            });
        }
    }
}

// Made with Bob
