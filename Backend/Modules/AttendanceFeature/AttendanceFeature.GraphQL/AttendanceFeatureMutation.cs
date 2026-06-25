using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using AttendanceFeature.Application.Services;
using AttendanceFeature.Application.DTOs;

namespace AttendanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class AttendanceFeatureMutation
    {
        [GraphQLName("clockIn")]
        public async Task<AttendanceDto?> ClockInAsync(
            [Service] IAttendanceService attendanceService,
            string employeeId)
        {
            var request = new ClockInRequest { EmployeeId = employeeId };
            return await attendanceService.ClockInAsync(request);
        }

        [GraphQLName("clockOut")]
        public async Task<AttendanceDto?> ClockOutAsync(
            [Service] IAttendanceService attendanceService,
            string employeeId)
        {
            var request = new ClockOutRequest { EmployeeId = employeeId };
            return await attendanceService.ClockOutAsync(request);
        }
    }
}
