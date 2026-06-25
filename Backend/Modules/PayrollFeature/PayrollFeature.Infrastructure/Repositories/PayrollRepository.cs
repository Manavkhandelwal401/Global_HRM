using PayrollFeature.Domain;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace PayrollFeature.Infrastructure.Repositories
{
    public class PayrollRepository : PostgresRepository<PayrollRecord>, IPayrollRepository
    {
        public PayrollRepository(
            PostgresDbContext context,
            ILogger<PayrollRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<PayrollRecord>> GetEmployeePayslipsAsync(string employeeId)
        {
            return await _context.Set<PayrollRecord>()
                .Where(pr => pr.EmployeeId == employeeId)
                .OrderByDescending(pr => pr.PayPeriodEnd)
                .ToListAsync();
        }

        public async Task<PayrollRecord?> GetPayrollByIdAsync(string payslipId)
        {
            return await _context.Set<PayrollRecord>()
                .FirstOrDefaultAsync(pr => pr.Id == payslipId);
        }
    }
}

// Made with Bob