using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using LeaveFeature.Application.Services;
using LeaveFeature.Application.DTOs;

namespace LeaveFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class LeaveFeatureQuery
    {
        [GraphQLName("getMyLeaveBalances")]
        public async Task<IEnumerable<LeaveBalanceDto>> GetMyLeaveBalancesAsync(
            [Service] ILeaveService leaveService,
            string employeeId)
        {
            return await leaveService.GetMyLeaveBalancesAsync(employeeId);
        }

        [GraphQLName("getMyLeaveRequests")]
        public async Task<IEnumerable<LeaveRequestDto>> GetMyLeaveRequestsAsync(
            [Service] ILeaveService leaveService,
            string employeeId)
        {
            return await leaveService.GetMyLeaveRequestsAsync(employeeId);
        }

        [GraphQLName("getPendingLeaveApprovals")]
        public async Task<IEnumerable<LeaveRequestDto>> GetPendingLeaveApprovalsAsync(
            [Service] ILeaveService leaveService,
            string managerId)
        {
            return await leaveService.GetPendingApprovalsAsync(managerId);
        }
    }
}
