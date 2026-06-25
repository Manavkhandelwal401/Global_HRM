using AttendanceFeature.Domain;
using HRMS.Core.Postgres.Repositories;

namespace AttendanceFeature.Domain
{
    public interface IAttendanceRepository : IPostgresRepository<AttendanceRecord>
    {
        Task<AttendanceRecord?> GetTodayAttendanceAsync(string employeeId, DateTime date);
        Task<IEnumerable<AttendanceRecord>> GetAttendanceHistoryAsync(string employeeId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<AttendanceRecord>> GetTeamAttendanceAsync(IEnumerable<string> employeeIds, DateTime date);
        Task<IEnumerable<AttendanceRecord>> GetTeamAttendanceRangeAsync(IEnumerable<string> employeeIds, DateTime startDate, DateTime endDate);
    }
}

// Made with Bob