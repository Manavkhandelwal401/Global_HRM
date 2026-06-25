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
    public class LeaveRepository : PostgresRepository<LeaveRequest>, ILeaveRepository
    {
        public LeaveRepository(
            PostgresDbContext context,
            ILogger<LeaveRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<IEnumerable<LeaveRequest>> GetEmployeeLeaveRequestsAsync(string employeeId)
        {
            return await _context.Set<LeaveRequest>()
                .Where(lr => lr.EmployeeId == employeeId)
                .OrderByDescending(lr => lr.StartDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<LeaveRequest>> GetPendingApprovalsAsync(string managerId)
        {
            // Get the role of the logged-in user (approver)
            var approver = await _context.Set<EmployeeFeature.Domain.Employee>()
                .FirstOrDefaultAsync(e => e.Id == managerId);

            if (approver != null && (approver.Role == EmployeeFeature.Domain.Enums.EmployeeRole.HR || approver.Role == EmployeeFeature.Domain.Enums.EmployeeRole.Admin))
            {
                // HR and Admin can see ALL pending leave requests globally
                return await _context.Set<LeaveRequest>()
                    .Where(lr => lr.Status == LeaveRequestStatus.Pending)
                    .OrderBy(lr => lr.StartDate)
                    .ToListAsync();
            }

            // Get all employees who report to this manager
            var employees = await _context.Set<EmployeeFeature.Domain.Employee>()
                .Where(e => e.ManagerId == managerId)
                .Select(e => e.Id)
                .ToListAsync();

            // Get pending leave requests for those employees
            return await _context.Set<LeaveRequest>()
                .Where(lr => employees.Contains(lr.EmployeeId) && lr.Status == LeaveRequestStatus.Pending)
                .OrderBy(lr => lr.StartDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByStatusAsync(string employeeId, LeaveRequestStatus status)
        {
            return await _context.Set<LeaveRequest>()
                .Where(lr => lr.EmployeeId == employeeId && lr.Status == status)
                .OrderByDescending(lr => lr.StartDate)
                .ToListAsync();
        }

        public async Task<LeaveRequest?> GetLeaveRequestByIdAsync(string requestId)
        {
            return await _context.Set<LeaveRequest>()
                .FirstOrDefaultAsync(lr => lr.Id == requestId);
        }
    }
}

// Made with Bob