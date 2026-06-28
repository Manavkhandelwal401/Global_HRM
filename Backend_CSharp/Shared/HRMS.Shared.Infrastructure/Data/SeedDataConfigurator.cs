using HRMS.Core.Postgres.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Shared.Infrastructure.Data
{
    public class SeedDataConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            HRMSSeedData.SeedData(modelBuilder);
        }
    }
}
