using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using AttendanceFeature.Application.Services;
using AttendanceFeature.Application.DTOs;
using AttendanceFeature.Domain.Enums;

namespace AttendanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AttendanceFeatureQuery
    {
        [GraphQLName("getTodayAttendance")]
        public async Task<AttendanceDto?> GetTodayAttendanceAsync(
            [Service] IAttendanceService attendanceService,
            string employeeId)
        {
            return await attendanceService.GetTodayAttendanceAsync(employeeId);
        }

        [GraphQLName("getMyAttendance")]
        public async Task<IEnumerable<AttendanceDto>> GetMyAttendanceAsync(
            [Service] IAttendanceService attendanceService,
            string employeeId,
            DateTime startDate,
            DateTime endDate)
        {
            return await attendanceService.GetMyAttendanceHistoryAsync(employeeId, startDate, endDate);
        }

        [GraphQLName("getTeamAttendance")]
        public async Task<IEnumerable<AttendanceDto>> GetTeamAttendanceAsync(
            [Service] IAttendanceService attendanceService,
            string managerId,
            DateTime date,
            AttendanceStatus? statusFilter = null)
        {
            return await attendanceService.GetTeamAttendanceAsync(managerId, date, statusFilter);
        }
    }
}
