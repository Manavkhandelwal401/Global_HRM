using AttendanceFeature.Domain;
using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Repositories;
using Microsoft.EntityFrameworkCore;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace AttendanceFeature.Infrastructure.Repositories
{
    public class AttendanceRepository : PostgresRepository<AttendanceRecord>, IAttendanceRepository
    {
        public AttendanceRepository(
            PostgresDbContext context,
            ILogger<AttendanceRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public async Task<AttendanceRecord?> GetTodayAttendanceAsync(string employeeId, DateTime date)
        {
            var dateOnly = date.Date;
            return await _context.Set<AttendanceRecord>()
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date.Date == dateOnly);
        }

        public async Task<IEnumerable<AttendanceRecord>> GetAttendanceHistoryAsync(string employeeId, DateTime startDate, DateTime endDate)
        {
            var startDateOnly = startDate.Date;
            var endDateOnly = endDate.Date;
            
            return await _context.Set<AttendanceRecord>()
                .Where(a => a.EmployeeId == employeeId && 
                           a.Date.Date >= startDateOnly && 
                           a.Date.Date <= endDateOnly)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<AttendanceRecord>> GetTeamAttendanceAsync(IEnumerable<string> employeeIds, DateTime date)
        {
            var dateOnly = date.Date;
            var employeeIdList = employeeIds.ToList();
            
            return await _context.Set<AttendanceRecord>()
                .Where(a => employeeIdList.Contains(a.EmployeeId) && a.Date.Date == dateOnly)
                .OrderBy(a => a.EmployeeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<AttendanceRecord>> GetTeamAttendanceRangeAsync(IEnumerable<string> employeeIds, DateTime startDate, DateTime endDate)
        {
            var startDateOnly = startDate.Date;
            var endDateOnly = endDate.Date;
            var employeeIdList = employeeIds.ToList();
            
            return await _context.Set<AttendanceRecord>()
                .Where(a => employeeIdList.Contains(a.EmployeeId) && 
                           a.Date.Date >= startDateOnly && 
                           a.Date.Date <= endDateOnly)
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.EmployeeId)
                .ToListAsync();
        }
    }
}

// Made with Bob