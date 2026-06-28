using LeaveFeature.Domain;
using HRMS.Core.Postgres.Data;
using LeaveFeature.Domain.Enums;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace LeaveFeature.Infrastructure.Repositories
{
    public class LeaveBalanceRepository : PostgresRepository<LeaveBalance>, ILeaveBalanceRepository
    {
        public LeaveBalanceRepository(
            PostgresDbContext context,
            ILogger<LeaveBalanceRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<LeaveBalance>> GetEmployeeLeaveBalancesAsync(string employeeId)
        {
            return await _context.Set<LeaveBalance>()
                .Where(lb => lb.EmployeeId == employeeId)
                .OrderBy(lb => lb.LeaveType)
                .ToListAsync();
        }

        public async Task<LeaveBalance?> GetLeaveBalanceAsync(string employeeId, LeaveType leaveType)
        {
            return await _context.Set<LeaveBalance>()
                .FirstOrDefaultAsync(lb => lb.EmployeeId == employeeId && lb.LeaveType == leaveType);
        }
    }
}

// Made with Bob