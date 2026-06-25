using HotChocolate;
using HotChocolate.Types;
using HRMS.Shared.Application.GraphQL;
using LeaveFeature.Application.Services;
using LeaveFeature.Application.DTOs;

namespace LeaveFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class LeaveFeatureMutation
    {
        [GraphQLName("submitLeaveRequest")]
        public async Task<LeaveRequestDto?> SubmitLeaveRequestAsync(
            [Service] ILeaveService leaveService,
            SubmitLeaveRequest request)
        {
            return await leaveService.SubmitLeaveRequestAsync(request);
        }

        [GraphQLName("approveLeaveRequest")]
        public async Task<LeaveRequestDto?> ApproveLeaveRequestAsync(
            [Service] ILeaveService leaveService,
            ApproveLeaveRequest request)
        {
            return await leaveService.ApproveLeaveRequestAsync(request);
        }

        [GraphQLName("rejectLeaveRequest")]
        public async Task<LeaveRequestDto?> RejectLeaveRequestAsync(
            [Service] ILeaveService leaveService,
            RejectLeaveRequest request)
        {
            return await leaveService.RejectLeaveRequestAsync(request);
        }

        [GraphQLName("cancelLeaveRequest")]
        public async Task<LeaveRequestDto?> CancelLeaveRequestAsync(
            [Service] ILeaveService leaveService,
            string requestId,
            string employeeId)
        {
            return await leaveService.CancelLeaveRequestAsync(requestId, employeeId);
        }
    }
}
